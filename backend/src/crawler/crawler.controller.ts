import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller()
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('/crawler')
  async crawling(@Query('url') url: string) {
    const content = await this.crawlerService.findOne(url);
    return content;
  }
}
