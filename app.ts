'use strict';

import Homey from 'homey';
import { GemstoneCloudClient } from './src/clients/GemstoneCloudClient';
import { GemstoneCatalogManager } from './src/managers/GemstoneCatalogManager';
import { FlowManager } from './src/managers/FlowManager';
import { TestHarness } from './src/utils/TestHarness';

module.exports = class GemstoneLightsApp extends Homey.App {

  private cloudClient!: GemstoneCloudClient;

  private catalogManager!: GemstoneCatalogManager;

  private flowManager!: FlowManager;

  /**
   * onInit is called when the app is initialized.
   */
  async onInit(): Promise<void> {
    this.log('Gemstone Lights app has been initialized');

    let username = process.env.GEMSTONE_USERNAME;
    let password = process.env.GEMSTONE_PASSWORD;


    if (!username || !password) {
      this.log(
        'Gemstone cloud initialization skipped: credentials not provided.',
      );

      return;
    }

    this.cloudClient = new GemstoneCloudClient();

    this.log('Authenticating with Gemstone Cloud...');

    await this.cloudClient.authenticate(
      username,
      password,
    );

    this.log('Gemstone Cloud authentication successful');

    this.catalogManager = new GemstoneCatalogManager(
      this.cloudClient,
    );

    await this.catalogManager.load();

    this.flowManager = new FlowManager(
      this,
      this.catalogManager,
    );

    this.flowManager.initialize();

    await TestHarness.run(
      this.catalogManager,
    );
  }

};
