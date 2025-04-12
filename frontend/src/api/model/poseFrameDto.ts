/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Hackathon DH API
 * WIP
 * OpenAPI spec version: 1.0
 */
import type { NormalizedLandmarkDto } from './normalizedLandmarkDto';

export interface PoseFrameDto {
  /** Timestamp of the pose data in milliseconds */
  timestamp: number;
  /** Array of normalized landmarks (33 landmarks for full body pose) */
  landmarks: NormalizedLandmarkDto[];
}
