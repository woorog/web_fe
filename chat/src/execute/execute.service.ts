import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import axios from 'axios';

@Injectable()
export class CodeExecuteService {
  private versionMap = {
    python: '3.10.0',
    javascript: '18.15.0',
    c: '10.2.0',
  };

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async executeCode(
    language: string,
    sourceCode: string,
    stdinInput: string | undefined = '',
  ) {
    const url = 'https://emkc.org/api/v2/piston/execute';
    const version = this.versionMap[language];
    try {
      const response = await axios.post(url, {
        language: language,
        version: version,
        files: [
          {
            content: sourceCode,
          },
        ],
        stdin: stdinInput,
      });
      const execId = this.generateExecId();
      await this.redis.set(execId, JSON.stringify(response.data), 'EX', 3600);
      console.log(execId, response.data);
      // console.log("message data", message)
      return { execId, ...response.data };
    } catch (error) {
      console.error('Error executing code:', error);
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Unknown error from execution API',
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Failed to execute code due to network or configuration error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getStoredResult(execId: string) {
    const result = await this.redis.get(execId);
    if (!result) {
      throw new HttpException(
        'Execution result not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return JSON.parse(result);
  }

  private generateExecId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
