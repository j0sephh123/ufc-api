import { Controller, Get, Param } from '@nestjs/common';
import { YoutubeService } from 'src/services/youtube.service';

@Controller('api/v1/youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get(':youtubeId')
  async getYoutubeVideo(@Param('youtubeId') youtubeId: string) {
    return this.youtubeService.getYoutubeVideo(youtubeId);
  }
}
