'use strict';

import Homey from 'homey';
import { GemstoneCatalogManager } from './GemstoneCatalogManager';

export class FlowManager {

  private readonly homey: Homey.App;

  private readonly catalogManager: GemstoneCatalogManager;

  public constructor(homey: Homey.App, catalogManager: GemstoneCatalogManager) {
    this.homey = homey;
    this.catalogManager = catalogManager;
  }

  public initialize(): void {
    this.homey.log('Initializing Gemstone FlowManager');

    if (!this.catalogManager.isLoaded()) {
      this.homey.log('Gemstone catalog is not loaded; Flow catalog data is not yet available');
      return;
    }

    this.homey.log('Gemstone FlowManager initialized');
  }
}
