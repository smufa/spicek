import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUAT, UserRequest } from 'src/common/auth-types';
import {
  SesssionVideoDataDto,
  UploadPoseDataDto,
} from './dto/add-session-data.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './session.entity';
import { SessionService } from './session.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

@ApiTags('Sessions')
@Controller('sessions')
@ApiBearerAuth('JWT-auth')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(
    private readonly svc: SessionService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session for a user' })
  @UseGuards(AuthGuard)
  create(
    @Body() dto: CreateSessionDto,
    @Request() req: RequestWithUAT,
  ): Promise<Session> {
    return this.svc.createSession(dto, req.user.sub);
  }

  @ApiOperation({ summary: 'Returns all user sesssion' })
  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req: RequestWithUAT): Promise<Session[]> {
    return this.svc.retrieveSessionsForUser(req.user.sub);
  }

  @ApiOperation({ summary: 'Update a session by id' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
    @Request() req: RequestWithUAT,
  ) {
    return this.svc.updateSession(+id, dto, req.user.sub);
  }

  @ApiOperation({ summary: 'Delete a session by id' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: RequestWithUAT) {
    return this.svc.deleteSession(+id, req.user.sub);
  }

  @ApiOperation({ summary: 'Get a session by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUAT) {
    const a = +id;
    this.logger.debug('id', a);
    return this.svc.findOne(a, req.user.sub);
  }

  @Post(':id/upload/video')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload a WebM video file with array data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'WebM video file upload with array data',
    type: SesssionVideoDataDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The video has been successfully uploaded',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input (e.g., non-WebM file)',
  })
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const user: UserRequest = (req as unknown as RequestWithUAT).user;
          const userDir = join(process.cwd(), 'uploads', user.sub.toString());

          if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
          }

          cb(null, userDir);
        },
        filename: (req, file, cb) => {
          const user: UserRequest = (req as unknown as RequestWithUAT).user;
          const id = parseInt(req.params.id as unknown as string);

          const userDir = join(process.cwd(), 'uploads', user.sub.toString());
          const filename = `${id}.webm`;
          const fullPath = join(userDir, filename);

          if (fs.existsSync(fullPath)) {
            return cb(new BadRequestException('File already exists'), '');
          }

          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Only accept webm files
        if (file.mimetype !== 'video/webm') {
          return cb(
            new BadRequestException('Only .webm files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadVideo(
    @Param('id') id: string,
    @UploadedFile() video: Express.Multer.File,
    @Request() req: RequestWithUAT,
  ) {
    const uploadDir = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await this.svc.addVideoFileName(+id, video.size, video.path, req.user.sub);

    return 'ok';
  }

  @Post(':id/tts-test')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'DEV: TTS test' })
  devTtsTest(@Param('id') id: string) {
    void this.svc.tts(+id);
  }

  @Post(':id/filler-test')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'DEV: Filler test' })
  devFillerTest(@Param('id') id: string) {
    void this.svc.devFiller(+id);
  }

  @Post(':id/upload')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload data at the end of a session' })
  @ApiResponse({
    status: 201,
    description: 'The data was successfully uploaded',
  })
  uploadData(
    @Param('id') id: string,
    @Body() data: UploadPoseDataDto,
    @Request() req: RequestWithUAT,
  ): Promise<Session> {
    return this.svc.addSessionData(+id, data, req.user.sub);
  }

  @Get(':id/video')
  async getSessionVideo(
    @Param('id') sessionId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: +sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (!fs.existsSync(session?.videoFileName || '')) {
      throw new NotFoundException('Video not found');
    }

    const file = fs.createReadStream(session.videoFileName || '');

    response.set({
      'Content-Type': 'video/webm',
      'Content-Disposition': `inline; filename="$video.webm"`,
    });

    return new StreamableFile(file);
  }
}
