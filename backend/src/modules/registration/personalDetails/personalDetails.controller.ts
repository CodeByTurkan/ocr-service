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
  @ApiCreatedResponse({
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
  async validateStepOne(@Body() personalDto: UserDto ) {
    return this.personalDetailsService.personalDetails(personalDto);
  }
}
