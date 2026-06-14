import { Controller, Get, Query } from '@nestjs/common';
import { SessionService } from '../application/session.service';

@Controller('api/v1/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getSessions(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('project') project?: string,
  ) {
    return this.sessionService.getSessions(Number(page) || 1, Number(limit) || 20, project);
  }

  @Get('search')
  searchSessions(@Query('q') q: string) {
    if (!q) return [];
    return this.sessionService.searchSessions(q);
  }

  @Get('project-details')
  getProjectDetails(@Query('project') project: string) {
    return this.sessionService.getProjectDetails(project);
  }

  @Get('projects')
  getProjects() {
    return this.sessionService.getProjects();
  }
}
