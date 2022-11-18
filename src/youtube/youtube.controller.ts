import { Controller, Get, Param } from '@nestjs/common';
import { YoutubeService } from 'src/services/youtube.service';
import { generateEndpoint } from 'src/utils/routing';

@Controller(generateEndpoint('youtube'))
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get(':youtubeId')
  async getYoutubeVideo(@Param('youtubeId') youtubeId: string) {
    return this.youtubeService.getYoutubeVideo(youtubeId);
  }
}
