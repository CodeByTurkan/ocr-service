import { Injectable } from '@nestjs/common';
import * as vision from '@google-cloud/vision';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OcrService {
  private client: vision.ImageAnnotatorClient;

  constructor(private configService: ConfigService) {
    const credentialsPath = this.configService.get<string>(
      'app.vision.credentialsPath',
    );
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: credentialsPath,
    });
  }

  // Accept file path
  async detectText(imagePath: string): Promise<string> {
    const [result] = await this.client.textDetection(imagePath);
    const detections = result.textAnnotations;
    return detections?.[0]?.description ?? 'No text detected';
  }

  // Accept in-memory buffer
  async detectTextBuffer(buffer: Buffer): Promise<string> {
    const [result] = await this.client.textDetection({
      image: { content: buffer },
    });
    const detections = result.textAnnotations;
    return detections?.[0]?.description ?? 'No text detected';
  }
}
