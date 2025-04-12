import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private roomRepository: Repository<Session>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  createSession(dto: CreateSessionDto, sub: number) {
    return this.roomRepository.save({
      ...dto,
      user: { id: sub },
    });
  }
  retrieveSessionsForUser(sub: number) {
    return this.roomRepository.find({
      where: {
        user: { id: sub },
      },
    });
  }
  async updateSession(id: number, dto: UpdateSessionDto, sub: number) {
    const session = await this.roomRepository.findOne({
      where: { id, user: { id: sub } },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.roomRepository.update({ id, user: { id: sub } }, { ...dto });
  }

  async deleteSession(id: number, sub: number) {
    const session = await this.roomRepository.findOne({
      where: { id, user: { id: sub } },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.roomRepository.delete({ id, user: { id: sub } });
  }
}
