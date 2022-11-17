import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { FsService } from './fs.service';

const key = `&key=${process.env.YT_API_KEY}`;
const videoPart = 'snippet';
const baseURL = 'https://www.googleapis.com/youtube/v3/';

export type VideoModel = {
  id: string;
  ytId: string;
  title: string;
  thumbnail: string;
  ytChannelId: string;
  publishedAt: string;
};

export type ChannelInput = {
  ytId: string;
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type VideoRawResponse = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
    channelTitle: string;
    tags: string[];

    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    };
    defaultAudioLanguage: string;
  };
};

export type Video = {
  id?: number;
  ytId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  channel: number;
  channelId: number;
};

interface YoutubeVideoType {
  ytId: string;
  title: string;
  thumbnail: string;
  ytChannelId: string;
  publishedAt: string;
}

class YoutubeVideo implements YoutubeVideoType {
  ytId: string;
  title: string;
  thumbnail: string;
  ytChannelId: string;
  publishedAt: string;

  constructor(
    id: string,
    title: string,
    thumbnail: string,
    publishedAt: string,
    channelId: string,
  ) {
    this.ytId = id;
    this.title = title;
    this.thumbnail = thumbnail;
    this.publishedAt = publishedAt;
    this.ytChannelId = channelId;
  }
}

// const youtubeApi = axios.create({

// });

@Injectable()
export class YoutubeService {
  key = process.env.YT_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    private readonly fsService: FsService,
  ) {}

  async getYoutubeVideo(id: string) {
    const url = `${baseURL}videos?id=${id}&key=${this.key}&part=${videoPart}`;
    const result = await firstValueFrom(this.httpService.get(url));
    const rawVideo: VideoRawResponse = result.data.items[0];

    return new YoutubeVideo(
      id,
      rawVideo.snippet.title,
      rawVideo.snippet.thumbnails.high.url,
      rawVideo.snippet.publishedAt,
      rawVideo.snippet.channelId,
    );
  }
}
