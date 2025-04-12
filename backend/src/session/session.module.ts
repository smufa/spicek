import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Session } from './session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Session])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
