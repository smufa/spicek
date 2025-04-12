import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { UsersModule } from './users/users.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [EnvModule, AuthModule, UsersModule, DatabaseModule, SessionModule],
  controllers: [],
  providers: [],
})
// Transcription
export class AppModule {}
