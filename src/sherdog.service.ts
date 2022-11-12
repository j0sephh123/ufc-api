import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const sherdogBaseUrl = 'https://www.sherdog.com/';
const sherdogEventsUrl = `${sherdogBaseUrl}organizations/Ultimate-Fighting-Championship-UFC-2`;

@Injectable()
export class SherdogService {
  constructor(private readonly httpService: HttpService) {}

  async fetchSherdogEventsPage(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(sherdogEventsUrl),
    );

    return data;
  }

  async fetchSherdogUpcomingEventPage(eventPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}${eventPageUrl}`),
    );

    return data;
  }
}
