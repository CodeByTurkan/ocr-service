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
  @ApiProperty({ example: 'Nigar' })
  @IsString()
  @IsNotEmpty() //he create two dtos, user adn persoanl details, in one he added, in anopther he didint.
  @MaxLength(50)
  @Matches(LATIN_NAME_REGEX, {
    message:
      'firstName contains invalid characters. Allowed characters: Latin letters, space, hyphen, apostrophe.',
  })
  firstName: string;

  @ApiProperty({ example: 'Ramazova' })
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
    example: '01.01.2003',
  })
  @IsNotEmpty()
  @IsDateString() //isstring yazib amma
  @Matches(DATE_OF_BIRTH_REGEX, {
    message: 'dateOfBirth must match the DD.MM.YYYY format.',
  })
  dateOfBirth: number;

  @ApiProperty({ example: 'Azerbaijan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(LATIN_NAME_REGEX, {
    message:
      'citizenship contains invalid characters. Allowed characters: Latin letters, space, hyphen, apostrophe.',
  })
  citizenship: string;

  @ApiProperty({
    example: '12345678901',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(UIN_REGEX, {
    message: 'uin must be exactly 11 digits.',
  })
  uin: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @Equals(true)
  consent: boolean;
}
