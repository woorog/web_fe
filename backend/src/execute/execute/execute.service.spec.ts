import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ExecutionService {
  private readonly pistonApiUrl: string;

  constructor(private configService: ConfigService) {
    this.pistonApiUrl = 'https://emkc.org/api/v2/piston/execute';
  }

  async executeCode(language: string, version: string, sourceCode: string, stdinInput: string) {
    try {
      const response = await axios.post(this.pistonApiUrl, {
        language,
        version,
        files: [
          {
            content: sourceCode,
          },
        ],
        stdin: stdinInput,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to execute code: ${error.message}`);
    }
  }
}
