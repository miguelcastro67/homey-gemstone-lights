'use strict';

import Homey from 'homey';

import { TestHarness } from './src/utils/TestHarness';

module.exports = class GemstoneLightsApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit(): Promise<void> {
    this.log('Gemstone Lights app has been initialized');

    const username = process.env.GEMSTONE_USERNAME;
    const password = process.env.GEMSTONE_PASSWORD;

    if (!username || !password) {
      this.log(
        'Gemstone cloud test skipped: credentials not provided.',
      );

      return;
    }

    await TestHarness.run(
      username,
      password,
    );
  }

};
