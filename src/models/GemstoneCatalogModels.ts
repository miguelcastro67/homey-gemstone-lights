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

export interface GemstoneCatalog {
  homegroups: GemstoneHomegroup[];
  devices: GemstoneCatalogDevice[];
  folders: GemstoneCatalogFolder[];
}
