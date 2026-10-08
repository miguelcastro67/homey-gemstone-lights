'use strict';

import { GemstoneCatalogManager } from '../managers/GemstoneCatalogManager';

export class TestHarness {
  public static async run(
    catalogManager: GemstoneCatalogManager,
  ): Promise<void> {
    console.log('---- Gemstone Catalog Test ----');

    try {
      const catalog = catalogManager.getCatalog();

      if (!catalog) {
        throw new Error(
          'Gemstone catalog is not loaded',
        );
      }

      const totalZones = catalog.devices.reduce(
        (total, device) => total + device.zones.length,
        0,
      );

      const totalDesigns = catalog.devices.reduce(
        (total, device) => total + device.designs.length,
        0,
      );

      const totalPatterns = catalog.folders.reduce(
        (total, folder) => total + folder.patterns.length,
        0,
      );

      console.log('Gemstone catalog summary:', {
        homegroups: catalog.homegroups.length,
        devices: catalog.devices.length,
        deviceGroups: catalog.deviceGroups.length,
        zones: totalZones,
        designs: totalDesigns,
        folders: catalog.folders.length,
        patterns: totalPatterns,
      });

      console.log(
        'Gemstone devices:',
        catalog.devices.map(item => ({
          id: item.device.id,
          name: item.device.name,
          localIp: item.device.hub.localIp,
          zones: item.zones.length,
          designs: item.designs.length,
        })),
      );

      console.log(
        'Gemstone Device Groups:',
        catalog.deviceGroups.map(item => ({
          id: item.id,
          name: item.name,
          deviceIds: item.deviceIds,
        })),
      );

      console.log(
        'Gemstone Pattern folders:',
        catalog.folders.map(item => ({
          id: item.folder.folderId,
          name: item.folder.name,
          patterns: item.patterns.length,
        })),
      );

      console.log('---- Gemstone Catalog Test Complete ----');
    } catch (error) {
      console.error(
        'Gemstone catalog test FAILED:',
        error,
      );

      throw error;
    }
  }
}