import { Module } from '@nestjs/common';
import { OcrModule } from './modules/ocr/ocr.module';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    OcrModule,
  ],
})
export class AppModule {}
