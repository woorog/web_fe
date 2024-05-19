import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExecuteService {
  private readonly pistonApiUrl: string;
  private readonly logger = new Logger(ExecuteService.name);

  constructor() {
    this.pistonApiUrl = 'https://emkc.org/api/v2/piston/execute';
  }

  async executeCode(language: string, sourceCode: string, stdinInput: string) {
    const versionMap = {
      python: '3.10.0',
      javaScript: '18.15.0',
    };

    try {
      const version = versionMap[language];
      const payload = {
        language,
        version,
        files: [
          {
            content: sourceCode,
          },
        ],
        stdin: stdinInput,
      };
      this.logger.log(payload);
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

      return response.data.run.output;
    } catch (error) {
      this.logger.error(`Failed to execute code: ${error.message}`, error.stack);
      throw new Error(`Failed to execute code: ${error.message}`);
    }
  }
}
