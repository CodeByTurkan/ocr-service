import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class PersonalDetailsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async personalDetails(personalData: UserDto): Promise<UserEntity> {
    const newUser = this.userRepo.create(personalData);
    // yeni user repoda yaradiriq yansiki orda entitiy var ve yaradilan valdiaiton kecen olmalidir.
    // create -> entitiy -> dto validated ->csuccesful creation
    return await this.userRepo.save(newUser);
    // sonrada o yeni user hemen creationa save olunur
  }
}

// create() ilə qurulan entity-ni götürür
// Əgər artıq belə user yoxdursa → DB-yə INSERT edir
// Əgər varsa (has ID) → UPDATE edir
