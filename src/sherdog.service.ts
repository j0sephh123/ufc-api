import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { readFileSync, writeFileSync } from 'fs';

const sherdogBaseUrl = 'https://www.sherdog.com/';
const sherdogEventsUrl = `${sherdogBaseUrl}organizations/Ultimate-Fighting-Championship-UFC-2`;
const sherdogDbPath = 'db/sherdog.json';

@Injectable()
export class SherdogService {
  constructor(private readonly httpService: HttpService) {}

  async events(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(sherdogEventsUrl),
    );

    const sherdogConfig = JSON.parse(readFileSync(sherdogDbPath, 'utf8'));
    sherdogConfig.lastFetched.events = new Date();
    writeFileSync(sherdogDbPath, JSON.stringify(sherdogConfig), 'utf8');

    return data;
  }

  async upcomingEvent(eventPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}${eventPageUrl}`),
    );

    const sherdogConfig = JSON.parse(readFileSync(sherdogDbPath, 'utf8'));
    sherdogConfig.lastFetched.event = new Date();
    writeFileSync(sherdogDbPath, JSON.stringify(sherdogConfig), 'utf8');

    return data;
  }

  async fighter(fighterPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}fighter/${fighterPageUrl}`),
    );

    const sherdogConfig = JSON.parse(readFileSync(sherdogDbPath, 'utf8'));
    sherdogConfig.lastFetched.fighter = new Date();
    writeFileSync(sherdogDbPath, JSON.stringify(sherdogConfig), 'utf8');

    return data;
  }
}
