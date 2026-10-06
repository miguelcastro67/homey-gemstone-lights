import {
  CurrentlyPlaying,
  HubSettings,
} from '../models/GemstoneModels';

export interface IGemstoneClient {
  getHubSettings(): Promise<HubSettings>;
  getCurrentlyPlaying(): Promise<CurrentlyPlaying>;
  setPower(on: boolean): Promise<void>;
  setBrightness(brightness: number): Promise<void>;
}
