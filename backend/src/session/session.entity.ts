import { Users } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  videoFileName: string;

  @Column({ nullable: true })
  durationMs: number;

  @ManyToOne(() => Users, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: string;
}
