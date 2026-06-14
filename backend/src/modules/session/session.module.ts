import { Module } from '@nestjs/common';
import { SessionController } from './infra/session.controller';
import { SessionService } from './application/session.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
