import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from '../application/telemetry.service';

@Controller('api/v1/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get('stats')
  getStats() {
    return this.telemetryService.getStats();
  }
}
