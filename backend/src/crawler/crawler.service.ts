import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { Cache } from 'cache-manager';
import { CrawlerException, RedisResponseError } from '../commons/exception/exception';

@Injectable()
export class CrawlerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async findOne(url: string) {
    try {
      const contents = await this.getHtml(url);
      return contents;
    } catch {
      throw new CrawlerException();
    }
  }

  async findOneUsingCache(url: string) {
    try {
      const cachedContent = await this.cacheManager.get<string>(url);

      if (cachedContent) {
        return cachedContent;
      }
    } catch (error) {
      throw new RedisResponseError();
    }

    const contents = await this.getHtml(url);

    await this.cacheManager.set(url, contents, 6000);
    return contents;
  }

  async getHtml(url: string) {
    const chromiumPath = this.configService.get<string>('CHROMIUM_PATH');
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromiumPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
    const bjUrl = 'https://www.acmicpc.net/problem/' + url
    await page.goto(bjUrl);
    let contents = await page.content();
    await browser.close();

    const $ = cheerio.load(contents);
    $('.header, #aswift_1_host, .adsbygoogle, .nav, .footer, .footer-v3').remove();
    contents = $.html();


    return contents;
  }
}
