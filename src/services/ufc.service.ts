import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

const rankingsUrl = 'https://www.ufc.com/rankings';

@Injectable()
export class UfcService {
  constructor(private readonly httpService: HttpService) {}

  async rankings(): Promise<string> {
    const { data } = await firstValueFrom(this.httpService.get(rankingsUrl));

    return data;
  }
}
