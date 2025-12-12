import {
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  extractExtension,
  formatAllowedTypes,
  formatMaxSize,
  MAX_FILE_SIZE_BYTES,
} from '../../../../shared/upload-files.constant';
import { FILENAME_ALLOWED_REGEX } from '../../../../shared/regexes/commonRegexes.regex';

const MAX_FILE_UPLOADS = 2;


class NewType {}

@Injectable()
export class UploadValidationPipe implements PipeTransform {
  private readonly requiredFilePipe = new ParseFilePipeBuilder().build({
    fileIsRequired: true,
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  });

  async transform(
    fileOrFiles: Express.Multer.File | Express.Multer.File[],
  ): Promise<Express.Multer.File | NewType> {
    // Support both single and multiple file uploads to keep backward compatibility
    if (Array.isArray(fileOrFiles)) {
      const files = fileOrFiles;

      if (!files || files.length === 0) {
        throw new BadRequestException({
          message:
            'No files were provided. Please attach at least one file and try again.',
        });
      }

      if (files.length > MAX_FILE_UPLOADS) {
        throw new BadRequestException({
          message: `You can upload up to ${MAX_FILE_UPLOADS} files at once.`,
        });
      }

      // Validate each file using the same rules as for single upload
      files.forEach((f) => this.validateSingleFileSync(f));
      return files;
    }

    // Single file flow (legacy)
    const file = fileOrFiles;
    await this.requiredFilePipe.transform(file);
    this.validateSingleFileSync(file);
    return file;
  }

  private validateSingleFileSync(file: Express.Multer.File): void {
    if (!file || typeof file.size !== 'number' || file.size === 0) {
      throw new BadRequestException({
        message:
          'The selected file is empty. Please choose another file and try again.',
      });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new PayloadTooLargeException({
        message: `This file is too large. The maximum size allowed is ${formatMaxSize(MAX_FILE_SIZE_BYTES)}`,
      });
    }

    const originalname: string = file.originalname || '';
    const baseName = originalname.replace(/^.*[\\/]/, '');
    if (!FILENAME_ALLOWED_REGEX.test(baseName)) {
      throw new BadRequestException({
        message:
          'The file name contains invalid characters. Please rename the file and try again.',
      });
    }

    const mimeOk = file.mimetype
      ? ALLOWED_MIME_TYPES.has(file.mimetype)
      : false;
    const ext = extractExtension(baseName);
    const extOk = ext ? ALLOWED_EXTENSIONS.has(ext) : false;
    if (!mimeOk || !extOk) {
      throw new UnsupportedMediaTypeException({
        message: `This file type isn’t supported. Please upload a ${formatAllowedTypes()} file.`,
      });
    }
  }
}
