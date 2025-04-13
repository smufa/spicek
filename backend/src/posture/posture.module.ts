import { Module } from '@nestjs/common';
import { PostureService } from './posture.service';

@Module({
  providers: [PostureService],
  exports: [PostureService],
})
export class PostureModule {}
