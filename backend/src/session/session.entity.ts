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

type UploadState = 'fresh' | 'video' | 'done';

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

  @Column({ nullable: true, type: 'bigint' })
  videoSize: number | null;

  @Column({ nullable: true, type: 'bigint' })
  durationMs: number | null;

  @Column({ type: String, nullable: false, default: 'fresh' })
  uploadState: UploadState;

  @ManyToOne(() => Users, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;

  @Column({ type: 'json', nullable: true })
  poseData: PoseFrameDto[];
}
