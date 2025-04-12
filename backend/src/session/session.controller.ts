import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUAT } from 'src/common/auth-types';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Sessions')
@Controller('sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private readonly svc: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session for a user' })
  create(@Body() dto: CreateSessionDto, @Request() req: RequestWithUAT) {
    return this.svc.createSession(dto, req.user.sub);
  }

  @ApiOperation({ summary: 'Returns all user sesssion' })
  @Get()
  findAll(@Request() req: RequestWithUAT) {
    return this.svc.retrieveSessionsForUser(req.user.sub);
  }

  @ApiOperation({ summary: 'Update a session by id' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
    @Request() req: RequestWithUAT,
  ) {
    return this.svc.updateSession(+id, dto, req.user.sub);
  }

  @ApiOperation({ summary: 'Delete a session by id' })
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: RequestWithUAT) {
    return this.svc.deleteSession(+id, req.user.sub);
  }
}
