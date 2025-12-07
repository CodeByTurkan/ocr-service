import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PersonalDetailsService } from './personalDetails.service';
import { UserDto } from './dto/user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/file-uploadDto';

@ApiTags('Registration')
@Controller('registration')
export class PersonalDetailsController {
  constructor(
    private readonly personalDetailsService: PersonalDetailsService,
    // private yeni controller xaricinde gorulmesin.
  ) {}

  @Post('enter-personal-details')
  @ApiOperation({
    summary: 'Step 1 - Submit personal details + file + consent ',
    description:
      'Stores the user’s personal information + validates files + consent in Redis, and returns registration token before OCR and face recognition steps.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Personal details form',
    type: UploadFilesDto,
  })
  //body esasen post, put, patch ucun lazim olur ve file upload oalnda consumes ile brilikde ikiside alazimdir,schema gonsterir.
  @ApiCreatedResponse({
    // this is for 201 specially so we dont write it again.
    description:
      'Personal details successfully saved + file uploaded successfully',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @UseInterceptors(FilesInterceptor('files', 2))
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @HttpCode(201)
  async validateStepOne(@Body() personalDto: UserDto, ) {
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
