import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as os from 'os';
import { SessionModel } from '../modules/session/infra/session.model';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private sequelize: Sequelize;
  private readonly logger = new Logger(DatabaseService.name);
  private currentDbPath: string;

  onModuleInit() {
    const defaultPath = process.env.ENGRAM_DB_PATH || path.join(os.homedir(), '.engram', 'engram.db');
    this.initializeConnection(defaultPath);
  }

  initializeConnection(dbPath: string) {
    if (this.sequelize) {
      this.logger.log('Closing existing database connection...');
      this.sequelize.close();
    }

    this.currentDbPath = dbPath;
    this.logger.log(`Connecting to SQLite via Sequelize at ${dbPath}`);

    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: (sql) => this.logger.debug(sql),
      models: [SessionModel],
      dialectOptions: {
        mode: 1 // Read-Only mode
      }
    });

    // Test connection
    this.sequelize.authenticate()
      .then(() => this.logger.log('Connection has been established successfully.'))
      .catch(err => this.logger.error('Unable to connect to the database:', err));
  }

  onModuleDestroy() {
    if (this.sequelize) {
      this.sequelize.close();
      this.logger.log('Database connection closed.');
    }
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  getCurrentPath(): string {
    return this.currentDbPath;
  }
}
