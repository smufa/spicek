import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exec } from 'child_process';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { UploadPoseDataDto } from './dto/add-session-data.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './session.entity';
import { TtsService } from 'src/tts/tts.service';
import { PostureService } from 'src/posture/posture.service';
import { FillerService } from 'src/filler/filler.service';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    private ttsService: TtsService,

    private postureService: PostureService,

    private fillerService: FillerService,
  ) {}

  async ttsBg(session: Session) {
    try {
      const transcript = await this.ttsService.getTokensForSession(session);

      session.ttsData = transcript;
      session.ttsState = 'done';

      await this.sessionRepository.save(session);

      this.logger.log(`TTS test completed for session ${session.id}.`);
    } catch (error) {
      this.logger.error(
        `Error during TTS processing for session ${session.id}: ${error.message}`,
      );
      session.ttsState = 'error';
      await this.sessionRepository.save(session);
    }
  }

  async tts(sessionId: number, log: boolean = true) {
    this.logger.log(`Starting TTS test for session ${sessionId}...`);

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');

    session.ttsState = 'processing';

    await this.sessionRepository.save(session);

    if (!session) throw new NotFoundException('Session not found');

    const transcript = await this.ttsService.getTokensForSession(session);

    session.ttsData = transcript;
    session.ttsState = 'done';

    await this.sessionRepository.save(session);

    if (log) {
      this.logger.log(
        `TTS test completed for session ${sessionId}. JSON: ${JSON.stringify(transcript)}`,
      );
    }
  }

  async fillerBackground(session: Session) {
    try {
      if (!session.wavFileName)
        throw new NotFoundException('Assertion: Session has no wav file name');

      const filler = await this.fillerService.uploadWavFile(
        session.wavFileName,
      );

      session.fillerDto = filler;

      await this.sessionRepository.save(session);

      this.logger.log(
        `Filler test completed for session ${session.id}. JSON: ${JSON.stringify(filler)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error during filler processing for session ${session.id}: ${error.message}`,
      );
    }
  }

  async devFiller(sessionId: number) {
    this.logger.log(`Starting filler test for session ${sessionId}...`);

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');

    if (!session.wavFileName) {
      throw new NotFoundException('Session has no wav file name');
    }

    const filler = await this.fillerService.uploadWavFile(session.wavFileName);

    session.fillerDto = filler;

    await this.sessionRepository.save(session);

    this.logger.log(
      `Filler test completed for session ${sessionId}. JSON: ${JSON.stringify(filler)}`,
    );
  }

  async addSessionData(
    id: number,
    data: UploadPoseDataDto,
    sub: number,
  ): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!session) throw new NotFoundException('Session not found');

    if (session.user.id !== sub)
      throw new NotFoundException('User not authorized');

    if (session.uploadState !== 'video' || session.videoFileName === null)
      throw new NotFoundException('Assertion: Session in wrong state');

    session.poseData = data.poseData;
    session.uploadState = 'done';

    try {
      await promisify(exec)(
        `ffmpeg -i ${session.videoFileName} -c copy ${session.videoFileName}_fixed.webm`,
      );

      const wavFileName = session.videoFileName.replace('.webm', '.wav');

      // Extract WAV audio from the video
      await promisify(exec)(
        `ffmpeg -i ${session.videoFileName}_fixed.webm -vn -acodec pcm_s16le ${wavFileName}`,
      );

      const { stdout } = await promisify(exec)(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${session.videoFileName}_fixed.webm`,
      );

      // Replace original with fixed file
      await promisify(exec)(
        `mv ${session.videoFileName}_fixed.webm ${session.videoFileName}`,
      );

      const duration = parseFloat(stdout.trim());

      session.durationMs = duration * 1000; // Convert to ms
      session.wavFileName = wavFileName;
      session.ttsState = 'processing';

      // Run this in the background
      void this.ttsBg(session);
      void this.fillerBackground(session);

      session.postureData = this.postureService.analyzeBadPostureEvents(
        session.poseData,
      );
    } catch (error) {
      // delete the video file
      try {
        await promisify(exec)(`rm ${session.videoFileName}`);
      } catch (err) {
        this.logger.error('Error deleting video file', err);
      }

      // delete the filename from the session
      session.videoFileName = null;
      session.videoSize = null;
      session.durationMs = null;
      session.uploadState = 'fresh';

      await this.sessionRepository.save(session);

      this.logger.error('Error getting video duration', error);
      throw new Error('Error getting video duration');
    }

    this.logger.log(
      `Session ${session.id} data uploaded for user ${sub}. Video duration: ${session.durationMs}ms`,
    );

    return this.sessionRepository.save(session);
  }

  async findOne(id: number, sub: number) {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['user'], // <-- load the related user
    });

    if (!session) throw new NotFoundException('Session not found');

    if (session.user.id !== sub)
      throw new NotFoundException('Session not found');

    return session;
  }

  createSession(dto: CreateSessionDto, sub: number) {
    return this.sessionRepository.save({
      ...dto,
      user: { id: sub },
    });
  }

  retrieveSessionsForUser(sub: number) {
    return this.sessionRepository.find({
      where: {
        user: { id: sub },
      },
    });
  }

  async updateSession(id: number, dto: UpdateSessionDto, sub: number) {
    const session = await this.sessionRepository.findOne({
      where: { id, user: { id: sub } },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.sessionRepository.update({ id, user: { id: sub } }, { ...dto });
  }

  async deleteSession(id: number, sub: number) {
    const session = await this.sessionRepository.findOne({
      where: { id, user: { id: sub } },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.sessionRepository.delete({ id, user: { id: sub } });
  }

  async addVideoFileName(
    sessionId: number,
    videoSize: number,
    filename: string,
    sub: number,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, user: { id: sub } },
    });

    if (!session) throw new NotFoundException('Session not found');

    if (session.uploadState !== 'fresh') {
      throw new NotFoundException('Session already uploaded');
    }

    if (session.userId !== sub)
      throw new NotFoundException('User not authorized');

    session.videoFileName = filename;
    session.videoSize = videoSize;
    session.uploadState = 'video';

    return this.sessionRepository.save(session);
  }
}
