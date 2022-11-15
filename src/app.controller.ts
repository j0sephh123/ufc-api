import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';

@Controller('test')
export class AppController {
  @Get('/')
  async testss() {
    const date = new Date();
    console.log(date);

    const sherdogConfig = JSON.parse(readFileSync('db/sherdog.json', 'utf8'));

    return 'hello from /test endpoint' + sherdogConfig;
  }
}
