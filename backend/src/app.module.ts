import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { SessionModule } from './modules/session/session.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    DatabaseModule,
    SessionModule,
    TelemetryModule,
    SettingsModule,
  ],
})
export class AppModule {}
