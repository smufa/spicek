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
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  videoFileName: string;

  @ManyToOne(() => Users, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: string;
}
