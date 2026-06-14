import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Controller('api/v1/settings')
export class SettingsController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get('database-path')
  getDatabasePath() {
    return { path: this.dbService.getCurrentPath() };
  }

  @Post('database-path')
  updateDatabasePath(@Body('path') newPath: string) {
    if (!newPath) {
      return { success: false, error: 'Path is required' };
    }
    try {
      this.dbService.initializeConnection(newPath);
      return { success: true, path: this.dbService.getCurrentPath() };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @Get('explorer')
  exploreDirectory(@Query('path') targetPath?: string) {
    const startPath = targetPath || os.homedir();
    try {
      const resolvedPath = path.resolve(startPath);
      const items = fs.readdirSync(resolvedPath, { withFileTypes: true });
      
      const directories = items
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .sort();
        
      const files = items
        .filter(item => item.isFile() && (item.name.endsWith('.db') || item.name === 'engram.db'))
        .map(item => item.name)
        .sort();

      return {
        currentPath: resolvedPath,
        parentPath: path.dirname(resolvedPath),
        directories,
        files
      };
    } catch (e) {
      return { error: e.message, currentPath: startPath, directories: [], files: [] };
    }
  }
}
