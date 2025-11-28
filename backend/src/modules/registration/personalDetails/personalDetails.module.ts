import { Module } from '@nestjs/common';
import { PersonalDetailsController } from './personalDetails.controller';
import { PersonalDetailsService } from './personalDetails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [PersonalDetailsService],
  controllers: [PersonalDetailsController],
})
export class PersonalDetailsModule {}
