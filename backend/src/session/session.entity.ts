import { Users } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PoseFrameDto } from './dto/add-session-data.dto';
import { Transcript } from 'src/tts/tts.dto';
import { BadPostureEvent } from 'src/posture/posture.dto';
import { FillerDto } from 'src/filler/filler.dto';

type UploadState = 'fresh' | 'video' | 'done';
type TTSState = 'un-processed' | 'processing' | 'done' | 'error';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: String })
  videoFileName: string | null;

  @Column({ nullable: true, type: String })
  wavFileName: string | null;

  @Column({ nullable: true, type: 'bigint' })
  videoSize: number | null;

  @Column({ nullable: true, type: 'bigint' })
  durationMs: number | null;

  @Column({ type: String, nullable: false, default: 'fresh' })
  uploadState: UploadState;

  @Column({ type: String, nullable: false, default: 'un-processed' })
  ttsState: TTSState;

  @ManyToOne(() => Users, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;

  @Column({ type: 'jsonb', nullable: true })
  poseData: PoseFrameDto[];

  @Column({ nullable: true, type: 'jsonb' })
  ttsData: Transcript;

  @Column({ nullable: true, type: 'jsonb', default: [] })
  postureData: BadPostureEvent[] = []; // Array of bad posture events

  @Column({ nullable: true, type: 'jsonb' })
  fillerDto: FillerDto;
}
