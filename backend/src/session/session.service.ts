import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './session.entity';
import { UploadPoseDataDto } from './dto/add-session-data.dto';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class SessionService {
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

    if (session.uploadState !== 'video')
      throw new NotFoundException('Session already uploaded');

    session.poseData = data.poseData;
    session.uploadState = 'done';

    try {
      await promisify(exec)(
        `ffmpeg -i ${session.videoFileName} -c copy ${session.videoFileName}_fixed.webm`,
      );

      // Then get duration from fixed file
      const { stdout } = await promisify(exec)(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${session.videoFileName}_fixed.webm`,
      );

      // Replace original with fixed file
      await promisify(exec)(
        `mv ${session.videoFileName}_fixed.webm ${session.videoFileName}`,
      );

      const duration = parseFloat(stdout.trim());

      session.durationMs = duration * 1000; // Convert to milliseconds
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

    return this.sessionRepository.save(session);
  }
  private readonly logger = new Logger(SessionService.name);

  async findOne(id: number, sub: number) {
    const session = await this.sessionRepository.findOne({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.user.id !== sub) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

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
