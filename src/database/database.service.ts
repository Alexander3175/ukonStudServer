import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  async checkConnection() {
    try {
      await this.dataSource.initialize();
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Database connection failed:', error.message);
    }
  }
}
