import { registerAs } from '@nestjs/config';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export default registerAs('app', () => ({
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'mydb',
  },
  port: parseInt(process.env.PORT || '3000'),
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  vision: {
    credentialsPath:
      process.env.GOOGLE_APPLICATION_CREDENTIALS || 'vision-key.json',
  },
}));
