import { Controller, Post, Body } from '@nestjs/common';
import { ExecuteService } from './execute.service';

@Controller('execute')
export class ExecuteController {
  constructor(private readonly executeService: ExecuteService) {}

  @Post()
  async executeCode(
    @Body('language') language: string,
    @Body('sourceCode') sourceCode: string,
    @Body('stdinInput') stdinInput: string,
  ) {
    const result = await this.executeService.executeCode(language, sourceCode, stdinInput);
    return { output: result };
  }
}
