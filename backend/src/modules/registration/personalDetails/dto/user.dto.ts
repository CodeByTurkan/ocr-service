import {
  Equals,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  DATE_OF_BIRTH_REGEX,
  LATIN_NAME_REGEX,
  UIN_REGEX,
} from '../../../../shared/regexes/commonRegexes.regex';

export class UserDto {
  @ApiProperty({
    type: String,
    description: 'User first name',
    required: true,
    example: 'Emilia',
  })
  @IsString()
  @IsNotEmpty() //he create two dtos, user adn persoanl details, in one he added, in anopther he didint.
  @MaxLength(50)
  @Matches(LATIN_NAME_REGEX, {
    message:
      'firstName contains invalid characters. Allowed characters: Latin letters, space, hyphen, apostrophe.',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'User last name',
    required: true,
    example: 'Kazimova',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message: 'lastName exceeds 50 characters.',
  })
  @Matches(LATIN_NAME_REGEX, {
    message:
      'lastName contains invalid characters. Allowed characters: Latin letters, space, hyphen, apostrophe.',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'Date of birth',
    required: true,
    example: '21.11.1991',
  })
  @IsNotEmpty()
  @IsDateString() //isstring yazib amma
  @Matches(DATE_OF_BIRTH_REGEX, {
    message: 'dateOfBirth must match the DD.MM.YYYY format.',
  })
  dateOfBirth: string;

  @ApiProperty({
    type: String,
    description: 'Citizenship',
    required: true,
    example: 'Azerbaijan',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(LATIN_NAME_REGEX, {
    message:
      'citizenship contains invalid characters. Allowed characters: Latin letters, space, hyphen, apostrophe.',
  })
  citizenship: string;

  @ApiProperty({
    type: String,
    description: 'Unique Identification Number',
    required: true,
    example: '12345678910',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(UIN_REGEX, {
    message: 'uin must be exactly 11 digits.',
  })
  uin: string;

  @ApiProperty({
    type: Boolean,
    description: 'Consent checkbox',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @Equals(true)
  consent: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    isArray: true,
    description: 'Attach 1 or 2 files',
  })
  files: any[];
}
