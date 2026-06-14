import { Module } from '@nestjs/common';
import { TelemetryController } from './infra/telemetry.controller';
import { TelemetryService } from './application/telemetry.service';

@Module({
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
