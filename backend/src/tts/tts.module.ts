import { Module } from '@nestjs/common';
import { TtsService } from './tts.service';

@Module({
  controllers: [],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}
