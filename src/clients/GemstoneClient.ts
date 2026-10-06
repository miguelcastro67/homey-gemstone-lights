import {
  CurrentlyPlaying,
  GemstoneShadow,
  HubSettings,
} from '../models/GemstoneModels';

import { IGemstoneClient } from '../abstractions/IGemstoneClient';

export class GemstoneClient implements IGemstoneClient {

  private readonly baseUrl: string;

  constructor(host: string) {
    this.baseUrl = `http://${host}`;
  }

  public async getHubSettings(): Promise<HubSettings> {
    const reported = await this.getReportedState<{
        hubSettings: HubSettings;
    }>('/device-state/hub-settings');

    return reported.hubSettings;
  }

  public async getCurrentlyPlaying(): Promise<CurrentlyPlaying> {
    const reported = await this.getReportedState<{
      currentlyPlaying: CurrentlyPlaying;
    }>('/device-state/currently-playing');

    return reported.currentlyPlaying;
  }

  private async getReportedState<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(
        `Gemstone request failed: ${response.status} ${response.statusText}`,
      );
    }

    const shadow = await response.json() as GemstoneShadow<T>;

    if (!shadow.state?.reported) {
      throw new Error(
        `Gemstone response did not contain state.reported for ${path}`,
      );
    }

    return shadow.state.reported;
  }

  public async setPower(on: boolean): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/device-control/play`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: {
            desired: {
              currentlyPlaying: {
                onState: on,
              },
              origin: 'control4',
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gemstone request failed: ${response.status} ${response.statusText}`,
      );
    }
  }

  public async setBrightness(brightness: number): Promise<void> {
    const value = Math.max(0, Math.min(255, Math.round(brightness)));
    const current = await this.getCurrentlyPlaying();
    const response = await fetch(
      `${this.baseUrl}/device-control/play`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: {
            desired: {
              currentlyPlaying: {
                onState: current.onState,
                pattern: {
                  ...current.pattern,
                  brightness: value,
                },
              },
              origin: 'control4',
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Gemstone request failed: ${response.status} ${response.statusText}`,
      );
    }
  }

}