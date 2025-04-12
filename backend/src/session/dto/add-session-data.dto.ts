import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class SesssionVideoDataDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'WebM video file',
  })
  video: any;
}

export class NormalizedLandmarkDto {
  x: number;

  y: number;

  z: number;

  visibility?: number;
}

/**
 * Represents a frame of pose data from MediaPipe
 */
export class PoseFrameDto {
  @ApiProperty({
    description: 'Timestamp of the pose data in milliseconds',
    example: 1617293247123,
    type: Number,
  })
  @IsNumber()
  timestamp: number;

  @ApiProperty({
    description:
      'Array of normalized landmarks (33 landmarks for full body pose)',
    type: [NormalizedLandmarkDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => NormalizedLandmarkDto)
  landmarks: NormalizedLandmarkDto[];
}

export class UploadPoseDataDto {
  @ApiProperty({
    type: () => [PoseFrameDto],
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PoseFrameDto)
  poseData: PoseFrameDto[];
}
