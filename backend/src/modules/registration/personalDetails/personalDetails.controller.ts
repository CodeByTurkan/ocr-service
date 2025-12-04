import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PersonalDetailsService } from './personalDetails.service';
import { UserDto } from './dto/user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Registration')
@Controller('registration')
export class PersonalDetailsController {
  constructor(
    private readonly personalDetailsService: PersonalDetailsService,
    // private yeni controller xaricinde gorulmesin.
  ) {}

  @Post('enter-personal-details')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 2))
  @ApiBody({
    description: 'Personal details form',
    type: UserDto,
  })
  @ApiOperation({
    summary: 'Submit personal details',
    description:
      'Stores the user’s personal information before OCR and face recognition steps.',
  })
  @ApiResponse({
    status: 201,
    description: 'Personal details successfully saved',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async savePersonalDetails(
    @Body() personalDto: UserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    //bodyden request gonderilir
    return this.personalDetailsService.personalDetails(personalDto); //controller requesti serviceden cekir, butun is servicede gorulur.
    // yeni controller eslinde requesti service gonderir ve serviceden qebul edir, butun process servicede gedir. Controller requesti qəbul edir → Body-dən datanı alır → servisin business logic-ə göndərir → nəticəni qaytarır.
  }
}

// yeni frontned sorgunu gonderir, o ilk validate olunur dtoda , sonra gelir controllere hardaki service gonderilerme bas verir, service dto ile logic yazir ve sonra yeniden controllere geri qayiridr.
// request - dto -> controller - > service -> contorller -> responde
// Frontend
//    ↓
// HTTP POST request
//    ↓
// DTO → validate (class-validator)
//    ↓
// Controller (request-i qəbul edir)
//    ↓
// Service (business logic, save, process)
//    ↓
// Controller (service-dən cavabı alır)
//    ↓
// Response frontend-ə göndərilir
