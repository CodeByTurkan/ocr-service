import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { OcrService } from './ocr.service';

@ApiTags('OCR')
@Controller('ocr')
export class OcrController {
  constructor(private ocrService: OcrService) {}

  @Post('upload-multiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          maxItems: 2, // Swagger UI shows max 2 files
        },
      },
      required: ['files'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 2, { storage: memoryStorage() }), // limit 2 files
  )
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return { text: 'No files uploaded' };
    }
    if (files.length > 2) {
      return { text: 'Maximum 2 files allowed' };
    }

    const results: { filename: string; text: string }[] = [];
    for (const file of files) {
      const text = await this.ocrService.detectTextBuffer(file.buffer);
      results.push({ filename: file.originalname, text });
    }

    return { results };
  }
}
