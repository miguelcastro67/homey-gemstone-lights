'use strict';

import Homey from 'homey';

import { GemstoneClient } from '../../src/clients/GemstoneClient';

module.exports = class GemstoneDevice extends Homey.Device {

  private client!: GemstoneClient;
  private pollInterval?: NodeJS.Timeout;

  private consecutivePollFailures = 0;

  private static readonly MAX_POLL_FAILURES = 3;

  /**
   * onInit is called when the device is initialized.
   */
  async onInit(): Promise<void> {
    const host = this.getSetting('host');

    if (!host) {
      throw new Error('Gemstone Hub2 IP address is not configured.');
    }

    this.log(`Initializing Gemstone Hub2 at ${host}`);

    this.client = new GemstoneClient(host);

    this.registerCapabilityListener('onoff',
      async (value: boolean) => {
        this.log(`Setting power to ${value}`);

        await this.client.setPower(value);

        this.log(`Power set to ${value}`);
      },
    );

    this.registerCapabilityListener('dim',
      async (value: number) => {
        const brightness = Math.round(value * 255);

        this.log(
          `Setting brightness to ${brightness} (${Math.round(value * 100)}%)`,
        );

        await this.client.setBrightness(brightness);

        this.log(`Brightness set to ${brightness}`);
      },
    );

    try {
      await this.refreshState();

      this.consecutivePollFailures = 0;

      if (!this.getAvailable()) {
        await this.setAvailable();

        this.log(
          'Gemstone Hub2 connection restored during initialization',
        );
      }
    } catch (error) {
      this.error(
        'Initial Gemstone Hub2 state refresh failed:',
        error,
      );

      this.consecutivePollFailures = GemstoneDevice.MAX_POLL_FAILURES;

      if (this.getAvailable()) {
        await this.setUnavailable(
          'Gemstone Hub2 is not responding',
        );

        this.log(
          'Gemstone Hub2 marked unavailable during initialization',
        );
      }
    }

    this.log(`Gemstone Hub2 at ${host} initialized`);

    this.pollInterval = this.homey.setInterval(async () => {
      try {
        await this.refreshState();

        this.consecutivePollFailures = 0;

        if (!this.getAvailable()) {
          await this.setAvailable();

          this.log(
            'Gemstone Hub2 connection restored',
          );
        }
      }
      catch (error) {
        this.consecutivePollFailures = Math.min(
          this.consecutivePollFailures + 1,
          GemstoneDevice.MAX_POLL_FAILURES,
        );

        if (this.consecutivePollFailures >= GemstoneDevice.MAX_POLL_FAILURES) {
          if (this.getAvailable()) {
            this.error(
              `Failed to refresh Gemstone Hub2 state `
              + `(${this.consecutivePollFailures}/`
              + `${GemstoneDevice.MAX_POLL_FAILURES}):`,
              error,
            );

            await this.setUnavailable(
              'Gemstone Hub2 is not responding',
            );

            this.log(
              'Gemstone Hub2 marked unavailable',
            );
          }
           else {
            this.log('Gemstone Hub2 is not responding; retrying');
          }
        } else {
          this.error(
            `Failed to refresh Gemstone Hub2 state `
            + `(${this.consecutivePollFailures}/`
            + `${GemstoneDevice.MAX_POLL_FAILURES}):`,
            error,
          );
        }
      }
    }, 60_000);
  }

  /**
   * Reads the current Hub2 state and updates Homey capabilities.
   */
  private async refreshState(): Promise<void> {
    const state = await this.client.getCurrentlyPlaying();

    //this.log('RAW CURRENTLY PLAYING:', JSON.stringify(state, null, 2));

    await this.setCapabilityValue(
      'onoff',
      state.onState,
    );

    if (state.pattern) {
      await this.setCapabilityValue(
        'dim',
        state.pattern.brightness / 255,
      );
    }
  }

  async onDeleted(): Promise<void> {
    if (this.pollInterval) {
      this.homey.clearInterval(this.pollInterval);
    }

    this.log('Gemstone Hub2 device deleted');
  }

};
