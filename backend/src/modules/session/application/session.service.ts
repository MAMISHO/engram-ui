import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { SessionModel } from '../infra/session.model';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getSessions(page: number = 1, limit: number = 20, project?: string) {
    try {
      const offset = (page - 1) * limit;
      const where: any = {};
      if (project) {
        where.project = project;
      }
      const { rows, count } = await SessionModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['startedAt', 'DESC']],
      });

      return {
        data: rows.map(r => ({
          id: r.id,
          project: r.project,
          directory: r.directory,
          startedAt: r.startedAt,
          endedAt: r.endedAt,
          summary: r.summary,
          title: r.project,
          content: r.summary || 'No summary available',
          createdAt: r.startedAt
        })),
        total: count,
        page,
        limit
      };
    } catch (e) {
      this.logger.error('Failed to get sessions via Sequelize', e);
      return { data: [], total: 0, page, limit, error: e.message };
    }
  }

  async searchSessions(query: string) {
    const sequelize = this.dbService.getSequelize();
    try {
      const [results] = await sequelize.query(
        `SELECT o.id, o.title, o.content, o.type, o.project, o.created_at as createdAt
         FROM observations o
         JOIN observations_fts fts ON o.id = fts.rowid
         WHERE observations_fts MATCH ?
         LIMIT 50`,
        {
          replacements: [query]
        }
      );
      return results;
    } catch (e) {
      this.logger.error('FTS5 search failed via Sequelize query', e);
      return [];
    }
  }

  async getProjects() {
    try {
      const sequelize = this.dbService.getSequelize();
      const [projects] = await sequelize.query(`
        SELECT project, directory, COUNT(*) as sessionCount, MAX(started_at) as lastActive
        FROM sessions
        GROUP BY project, directory
        ORDER BY lastActive DESC
      `);
      return projects.map((p: any) => ({
        ...p,
        workspacePath: p.directory,
        createdAt: p.lastActive
      }));
    } catch (e) {
      this.logger.error('Failed to group projects via Sequelize query', e);
      return [];
    }
  }

  async getProjectDetails(project: string) {
    const sequelize = this.dbService.getSequelize();
    try {
      const [[sessionCount]] = await sequelize.query(
        `SELECT COUNT(*) as count FROM sessions WHERE project = ?`,
        { replacements: [project] }
      ) as any[];

      const [[observationCount]] = await sequelize.query(
        `SELECT COUNT(*) as count FROM observations WHERE project = ? AND deleted_at IS NULL`,
        { replacements: [project] }
      ) as any[];

      const [typeDistribution] = await sequelize.query(
        `SELECT type as name, COUNT(*) as value
         FROM observations
         WHERE project = ? AND deleted_at IS NULL
         GROUP BY type
         ORDER BY value DESC`,
        { replacements: [project] }
      ) as any[];

      const [observations] = await sequelize.query(
        `SELECT id, title, content, type, scope, created_at as createdAt
         FROM observations
         WHERE project = ? AND deleted_at IS NULL
         ORDER BY created_at DESC
         LIMIT 100`,
        { replacements: [project] }
      ) as any[];

      return {
        sessionCount: sessionCount?.count || 0,
        observationCount: observationCount?.count || 0,
        typeDistribution,
        observations
      };
    } catch (e) {
      this.logger.error(`Failed to get project details for ${project}`, e);
      return {
        sessionCount: 0,
        observationCount: 0,
        typeDistribution: [],
        observations: [],
        error: e.message
      };
    }
  }
}
