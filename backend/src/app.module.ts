import { Module } from '@nestjs/common';
import { OcrModule } from './modules/registration/ocr/ocr.module';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { PersonalDetailsModule } from './modules/registration/personalDetails/personalDetails.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    OcrModule,
    DatabaseModule,
    PersonalDetailsModule,
  ],
})
export class AppModule {}
