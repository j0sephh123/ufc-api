import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetcherService {
  constructor(private readonly httpService: HttpService) {}

  async fetch(url: string) {
    const { data } = await firstValueFrom(this.httpService.get(url));

    return data;
  }
}
