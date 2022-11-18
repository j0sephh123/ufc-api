import { Injectable } from '@nestjs/common';
import { SherdogService } from './sherdog.service';
import { UfcService } from './ufc.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly ufc: UfcService,
    private readonly sherdog: SherdogService,
  ) {}

  rankings = (): Promise<string> => this.ufc.rankings();

  fighter = (sherdogUrl: string) => this.sherdog.fighter(sherdogUrl);

  events = () => this.sherdog.events();

  event = (url: string) => this.sherdog.event(url);
}
