import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CodeExecuteService } from './execute.service';

@Controller('execute')
export class CodeExecuteController {
  constructor(private readonly codeExecuteService: CodeExecuteService) {}

  @Post()
  async execute(
    @Body()
    executeDto: {
      language: string;
      sourceCode: string;
      stdinInput?: string;
    },
  ) {
    try {
      const result = await this.codeExecuteService.executeCode(
        executeDto.language,
        executeDto.sourceCode,
        executeDto.stdinInput || '',
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
