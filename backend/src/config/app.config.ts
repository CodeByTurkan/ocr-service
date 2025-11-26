import { registerAs } from '@nestjs/config';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
}

export default registerAs('app', () => ({
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'mydb',
    ssl: process.env.POSTGRES_SSLMODE === 'require',
  },
  port: parseInt(process.env.PORT || '3000'),
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  mail: {
    awsSenderEmail: process.env.SES_SENDER_EMAIL || 'sender@gmail.com',
    awsRecieverEmail: process.env.SES_RECIEVER_EMAIL || 'reciever@gmail.com',
  },
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
  },
  vision: {
    credentialsPath:
      process.env.GOOGLE_APPLICATION_CREDENTIALS || 'vision-key.json',
  },
}));
