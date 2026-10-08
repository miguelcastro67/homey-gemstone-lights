'use strict';

import {
  GemstoneCloudDesign,
  GemstoneCloudDevice,
  GemstoneCloudPattern,
  GemstoneCloudZone,
  GemstoneHomegroup,
  GemstonePatternFolder,
} from './GemstoneCloudModels';

export interface GemstoneCatalogDevice {
  device: GemstoneCloudDevice;
  zones: GemstoneCloudZone[];
  designs: GemstoneCloudDesign[];
}

export interface GemstoneCatalogFolder {
  folder: GemstonePatternFolder;
  patterns: GemstoneCloudPattern[];
}

export interface GemstoneCatalogDeviceGroup {
  id: string;
  name: string;
  deviceIds: string[];
}

export interface GemstoneCatalog {
  homegroups: GemstoneHomegroup[];
  devices: GemstoneCatalogDevice[];
  deviceGroups: GemstoneCatalogDeviceGroup[];
  folders: GemstoneCatalogFolder[];
}
