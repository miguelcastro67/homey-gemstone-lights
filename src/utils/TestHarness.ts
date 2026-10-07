'use strict';

import { GemstoneCloudClient } from '../clients/GemstoneCloudClient';
import { GemstoneCatalogManager } from '../managers/GemstoneCatalogManager';

export class TestHarness {

  public static async run(
    username: string,
    password: string,
  ): Promise<void> {

    console.log('---- Gemstone Cloud API Test ----');

    const client = new GemstoneCloudClient();

    try {
      console.log('Authenticating...');

      await client.authenticate(
        username,
        password,
      );

      console.log('Authentication SUCCESSFUL');

      // ------------------------------------------------------------
      // Homegroups
      // ------------------------------------------------------------

      console.log('Retrieving homegroups...');

      const homegroups = await client.getHomegroups();

      console.log(
        'Gemstone homegroups:',
        homegroups.map(homegroup => ({
          id: homegroup.id,
          name: homegroup.name,
          devices: homegroup.deviceIds.length,
          deviceGroups: homegroup.deviceGroupIds.length,
        })),
      );

      // ------------------------------------------------------------
      // Devices
      // ------------------------------------------------------------

      const homegroupId = '3c67456e-6b2d-43ad-a51c-be8d8fe60f6f';

      console.log('Retrieving homegroup devices...');

      const devices = await client.getDevices(homegroupId);

      console.log(
        'Gemstone devices:',
        devices.map(device => ({
          id: device.id,
          name: device.name,
          localIp: device.hub.localIp,
        })),
      );

      // ------------------------------------------------------------
      // Zones
      // ------------------------------------------------------------

      const houseFrontDeviceId = 'h2-1094-t5k4';

      console.log('Retrieving House Front zones...');

      const zones = await client.getZones(houseFrontDeviceId);

      console.log(
        'House Front zones:',
        zones.map(zone => ({
          id: zone.id,
          name: zone.name,
          lights: zone.lights,
        })),
      );

      // ------------------------------------------------------------
      // Designs
      // ------------------------------------------------------------

      console.log('Retrieving House Front designs...');

      const designs = await client.getDesigns(houseFrontDeviceId);

      console.log(
        'House Front designs:',
        designs.map(design => ({
          id: design.id,
          name: design.name,
          brightness: design.brightness,
          zonePatterns: design.zonePatterns?.length ?? 0,
          staticColors: design.staticColors?.length ?? 0,
        })),
      );

      // ------------------------------------------------------------
      // Pattern folders
      // ------------------------------------------------------------

      console.log('Retrieving Pattern folders...');

      const folders = await client.getPatternFolders();

      console.log(
        'Gemstone Pattern folders:',
        folders.map(folder => ({
          id: folder.folderId,
          name: folder.name,
          gemstoneManaged: folder.gemstoneManaged,
          hidden: folder.hidden ?? '(not provided)',
        })),
      );

      // ------------------------------------------------------------
      // Patterns
      // ------------------------------------------------------------

      const halloweenFolderId =
        '1feb0411-18f9-49cc-99ae-5889d1753c69';

      console.log('Retrieving Halloween Patterns...');

      const patterns = await client.getPatterns(
        halloweenFolderId,
      );

      console.log(
        `Halloween Patterns: ${patterns.length} patterns`,
      );

      console.log('---- Gemstone Cloud API Test Complete ----');
      
      console.log('---- Gemstone Catalog Test ----');

      const catalogManager = new GemstoneCatalogManager(client);

      const catalog = await catalogManager.load();

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
        zones: totalZones,
        designs: totalDesigns,
        folders: catalog.folders.length,
        patterns: totalPatterns,
      });

      console.log('---- Gemstone Catalog Test Complete ----');

      /*
       * ------------------------------------------------------------
       * WRITE / EXPERIMENTAL TESTS
       * ------------------------------------------------------------
       *
       * Keep write operations disabled during normal development
       * runs. These calls can physically change the lights.
       *
       * Direct Color example:
       *
       * const colorResult = await client.playRawColor(
       *   houseFrontDeviceId,
       *   255,
       * );
       *
       * console.log(
       *   'Color playback result:',
       *   JSON.stringify(colorResult, null, 2),
       * );
       *
       * Animation endpoint probe:
       *
       * const animations = await client.getRawAnimations();
       *
       * console.log(
       *   'Gemstone Animations:',
       *   JSON.stringify(animations, null, 2),
       * );
       */

    } catch (error) {
      console.error(
        'Gemstone cloud test FAILED:',
        error,
      );

      throw error;
    }
  }
}
