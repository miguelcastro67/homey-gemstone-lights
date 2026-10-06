'use strict';

import {
  GemstoneCloudDesign,
  GemstoneCloudDevice,
  GemstoneCloudPattern,
  GemstoneCloudZone,
} from '../models/GemstoneCloudModels';

export interface IGemstoneCloudClient {
  authenticate(
    username: string,
    password: string,
  ): Promise<void>;

  getDevices(): Promise<GemstoneCloudDevice[]>;

  getZones(
    deviceId: string,
  ): Promise<GemstoneCloudZone[]>;

  getDesigns(
    deviceId: string,
  ): Promise<GemstoneCloudDesign[]>;

  getPatterns(): Promise<GemstoneCloudPattern[]>;
}
