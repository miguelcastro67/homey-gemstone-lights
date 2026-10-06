'use strict';

import Homey from 'homey';

import { GemstoneClient } from '../../src/clients/GemstoneClient';

module.exports = class GemstoneDevice extends Homey.Device {

  private client!: GemstoneClient;
  private pollInterval?: NodeJS.Timeout;

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

    await this.refreshState();

    this.log(`Gemstone Hub2 at ${host} initialized`);

    this.pollInterval = this.homey.setInterval(async () => {
        try {
          await this.refreshState();
        } catch (error) {
          this.error('Failed to refresh Gemstone Hub2 state:', error);
        }
      }, 10_000,
    );
  }

  /**
   * Reads the current Hub2 state and updates Homey capabilities.
   */
  private async refreshState(): Promise<void> {
    const state = await this.client.getCurrentlyPlaying();

    await this.setCapabilityValue(
      'onoff',
      state.onState,
    );

    await this.setCapabilityValue(
      'dim',
      state.pattern.brightness / 255,
    );
  }

  async onDeleted(): Promise<void> {
    if (this.pollInterval) {
      this.homey.clearInterval(this.pollInterval);
    }

    this.log('Gemstone Hub2 device deleted');
  }

};
