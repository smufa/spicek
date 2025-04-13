import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env/env';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios from 'axios';
import { FillerDto } from './filler.dto';

@Injectable()
export class FillerService {
  private readonly logger = new Logger(FillerService.name);

  constructor(private configService: ConfigService<Env>) {}

  async uploadWavFile(filePath: string): Promise<FillerDto> {
    const API_URL = this.configService.get('API_FILLER') + '/upload/';

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    this.logger.log(`Uploading file to filler API: ${filePath}`);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: filePath,
      contentType: 'audio/wav',
    });

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      this.logger.log('File uploaded successfully');
      return JSON.parse(response.data as string) as FillerDto;
    } catch (error) {
      this.logger.error(
        `Failed to upload file. Status code: ${error.response?.status}`,
      );
      this.logger.error(error.response?.data || error.message);
      throw new Error('File upload to filler API failed.');
    }
  }
}
