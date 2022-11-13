import { Controller, Get, Param } from '@nestjs/common';
import { ParserService } from 'src/parser.service';
import { SherdogService } from 'src/sherdog.service';

@Controller('api/v1/fighters')
export class FightersController {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
  ) {}

  @Get(':sherdogUrl')
  async single(@Param('sherdogUrl') sherdogUrl: string) {
    const fightersHtml = await this.sherdogService.fighter(sherdogUrl);

    const response = this.parserService.sherdogFighter(fightersHtml);
    response.fighter.sherdogUrl = sherdogUrl;

    return response;
  }
}
