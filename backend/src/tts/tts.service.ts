import { Injectable, Logger } from '@nestjs/common';
import { Session } from 'src/session/session.entity';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env/env';

import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { Transcript } from './tts.dto';

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  constructor(private configService: ConfigService<Env>) {}

  async getTokensForSession(session: Session) {
    if (!session.wavFileName) {
      throw new Error('Assertion: Session has no wav file name');
    }

    const API_BASE = 'https://api.soniox.com';
    const FILE_TO_TRANSCRIBE = session.wavFileName;

    const API_KEY = this.configService.get('API_KEY_SONIOX');

    if (!fs.existsSync(FILE_TO_TRANSCRIBE)) {
      throw new Error(`File not found: ${FILE_TO_TRANSCRIBE}`);
    }

    this.logger.log('Uploading file to Soniox...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(FILE_TO_TRANSCRIBE));

    const uploadResponse = await axios.post(`${API_BASE}/v1/files`, formData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const file = uploadResponse.data;

    // 2. Start transcription
    this.logger.log('Starting transcription...');
    const transcriptionResponse = await axios.post(
      `${API_BASE}/v1/transcriptions`,
      {
        file_id: file.id,
        model: 'stt-async-preview',
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const transcription = transcriptionResponse.data;
    const transcriptionId = transcription.id;
    this.logger.log('Transcription ID:', transcriptionId);

    // 3. Poll until transcription completes
    while (true) {
      const pollResponse = await axios.get(
        `${API_BASE}/v1/transcriptions/${transcriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );

      const currentStatus = pollResponse.data.status;

      if (currentStatus === 'error') {
        throw new Error(
          `Transcription error: ${pollResponse.data.error_message || 'Unknown error'}`,
        );
      } else if (currentStatus === 'completed') {
        this.logger.log('Transcription completed successfully');
        break;
      }

      // Wait 1 second before polling again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 4. Fetch transcript
    const transcriptResponse = await axios.get(
      `${API_BASE}/v1/transcriptions/${transcriptionId}/transcript`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const data = transcriptResponse.data as Transcript;

    this.logger.log('Transcript data length:', data.text.length);

    return data;
  }
}
