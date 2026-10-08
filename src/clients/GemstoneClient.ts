import {
  CurrentlyPlaying,
  GemstoneShadow,
  HubSettings,
} from '../models/GemstoneModels';

import { IGemstoneClient } from '../abstractions/IGemstoneClient';

const REQUEST_TIMEOUT_MS = 5000;

export class GemstoneClient implements IGemstoneClient {

  private readonly baseUrl: string;

  constructor(host: string) {
    this.baseUrl = `http://${host}`;
  }

  private async fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(
        url,
        {
          ...options,
          signal: controller.signal,
        },
      );
    }
    catch (error) {
      if (controller.signal.aborted) {
        throw new Error(
          `Gemstone request timed out after ${REQUEST_TIMEOUT_MS} ms`,
        );
      }

      throw error;
    } 
    finally {
      clearTimeout(timeout);
    }
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
    const response = await this.fetchWithTimeout(`${this.baseUrl}${path}`);

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
    const response = await this.fetchWithTimeout(`${this.baseUrl}/device-control/play`,
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
    const response = await this.fetchWithTimeout(
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