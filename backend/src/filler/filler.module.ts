import { Module } from '@nestjs/common';
import { FillerService } from './filler.service';

@Module({
  providers: [FillerService],
  exports: [FillerService],
})
export class FillerModule {}
