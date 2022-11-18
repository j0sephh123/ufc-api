import { Controller, Get, Param } from '@nestjs/common';
import { ParserService } from 'src/services/parser.service';
import { SherdogService } from 'src/services/sherdog.service';

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

    return {
      ...response,
      fighter: {
        ...response.fighter,
        sherdogUrl,
      },
    };
  }
}
