import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    maxItems: 2,
    description: 'Attach 1 or 2 files',
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  files: any[];
}
