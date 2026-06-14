import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getStats() {
    const sequelize = this.dbService.getSequelize();
    try {
      const [[totalSessions]] = await sequelize.query(`SELECT COUNT(*) as count FROM sessions`) as any[];
      
      const [topTags] = await sequelize.query(`
        SELECT type as name, COUNT(*) as value
        FROM observations
        GROUP BY type
        ORDER BY value DESC
        LIMIT 5
      `) as any[];

      const [activityData] = await sequelize.query(`
        SELECT date(started_at) as name, COUNT(*) as value
        FROM sessions
        GROUP BY date(started_at)
        ORDER BY date(started_at) ASC
      `) as any[];

      return {
        totalSessions: totalSessions?.count || 0,
        topTags,
        activity: activityData
      };
    } catch (e) {
      this.logger.error('Failed to get telemetry stats via Sequelize query', e);
      return { totalSessions: 0, topTags: [], activity: [], error: e.message };
    }
  }
}
