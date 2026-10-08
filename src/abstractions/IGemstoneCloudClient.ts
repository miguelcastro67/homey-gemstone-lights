'use strict';

import {
  GemstoneCloudDesign,
  GemstoneCloudDevice,
  GemstoneCloudPattern,
  GemstoneCloudZone,
  GemstoneHomegroup,
  GemstonePatternFolder,
} from '../models/GemstoneCloudModels';

export interface IGemstoneCloudClient {
  /**
   * Authenticate with the Gemstone cloud using the user's
   * Gemstone account credentials.
   */
  authenticate(
    username: string,
    password: string,
  ): Promise<void>;

  probeEndpoint(path: string): Promise<unknown>;
  
  /**
   * Retrieve the Homegroups available to the authenticated account.
   */
  getHomegroups(): Promise<GemstoneHomegroup[]>;

  /**
   * Retrieve Gemstone Hub2 devices.
   */
  getDevices(homegroupId: string): Promise<GemstoneCloudDevice[]>;

  /**
   * Retrieve the Zones configured for a specific Hub2 device.
   */
  getZones(
    deviceId: string,
  ): Promise<GemstoneCloudZone[]>;

  /**
   * Retrieve the saved Designs configured for a specific Hub2 device.
   */
  getDesigns(
    deviceId: string,
  ): Promise<GemstoneCloudDesign[]>;

  /**
   * Retrieve Pattern folders available to the account.
   */
  getPatternFolders(): Promise<GemstonePatternFolder[]>;

  /**
   * Retrieve Patterns contained in a specific Pattern folder.
   */
  getPatterns(
    folderId: string,
  ): Promise<GemstoneCloudPattern[]>;
}
