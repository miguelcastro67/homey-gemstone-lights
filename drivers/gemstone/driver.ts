'use strict';

import Homey from 'homey';

import { GemstoneDiscoveryProvider } from '../../src/discovery/GemstoneDiscoveryProvider';

module.exports = class GemstoneDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit(): Promise<void> {
    this.log('Gemstone Hub2 driver initialized');
  }

  /**
   * onPair is called when a pairing session is started.
   */
  async onPair(session: Homey.Driver.PairSession): Promise<void> {

    session.setHandler('validate_host', async (data) => {
      const host = String(data.host ?? '').trim();

      if (!host) {
        throw new Error('Please enter the IP address of your Gemstone Hub2.');
      }

      this.log(`Validating Gemstone Hub2 at ${host}`);

      const discovery = new GemstoneDiscoveryProvider();
      const discovered = await discovery.validateHost(host);

      this.log(
        `Found Gemstone Hub2 "${discovered.name}" at ${discovered.host}`,
      );

      return {
        name: discovered.name,
        data: {
          id: discovered.id,
        },
        settings: {
          host: discovered.host,
        },
      };
    });
  }

};
