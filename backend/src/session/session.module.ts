import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostureModule } from 'src/posture/posture.module';
import { TtsModule } from 'src/tts/tts.module';
import { Users } from 'src/users/users.entity';
import { SessionController } from './session.controller';
import { Session } from './session.entity';
import { SessionService } from './session.service';
import { FillerModule } from 'src/filler/filler.module';

@Module({
  imports: [
    TtsModule,
    PostureModule,
    FillerModule,
    TypeOrmModule.forFeature([Users, Session]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
