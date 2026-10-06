'use strict';

import { GemstoneClient } from '../clients/GemstoneClient';
import { GemstoneCloudClient } from '../clients/GemstoneCloudClient';

export class TestHarness {

  public static async run(username: string, password: string): Promise<void> {

    console.log('---- Gemstone Cloud API Test ----');

    const client = new GemstoneCloudClient();

    try {
      console.log('Authenticating...');

      await client.authenticate(
        username,
        password,
      );

      console.log('Authentication SUCCESSFUL');

      console.log('Retrieving homegroups...');

      const homegroups = await client.getRawHomegroups();

      console.log(
        'Gemstone homegroups:',
        JSON.stringify(homegroups, null, 2),
      );

      const homegroupId = '3c67456e-6b2d-43ad-a51c-be8d8fe60f6f';

      console.log('Retrieving homegroup devices...');

      const devices = await client.getRawHomegroupDevices(homegroupId);

      console.log('Gemstone devices:', JSON.stringify(devices, null, 2));

      const houseFrontDeviceId = 'h2-1094-t5k4';

      console.log('Retrieving House Front zones...');

      const zones = await client.getRawZones(houseFrontDeviceId);

      console.log('House Front zones:', JSON.stringify(zones, null, 2));

      console.log('Retrieving House Front designs...');

      const designs = await client.getRawDesigns(houseFrontDeviceId);

      console.log('House Front designs:', JSON.stringify(designs, null, 2));

      console.log('Retrieving Pattern folders...');

      const folders = await client.getRawPatternFolders();

      console.log('Gemstone Pattern folders:', JSON.stringify(folders, null, 2));

      const halloweenFolderId = '1feb0411-18f9-49cc-99ae-5889d1753c69';

      console.log('Retrieving Halloween Patterns...');

      const patterns = await client.getRawPatterns(halloweenFolderId);

      console.log('Halloween Patterns:', JSON.stringify(patterns, null, 2));

      //console.log('Retrieving Animations...');

      //const animations = await client.getRawAnimations();

      //console.log('Gemstone Animations:', JSON.stringify(animations, null, 2));

      console.log('Testing direct Color playback...');

      const colorResult = await client.playRawColor(houseFrontDeviceId, 255);

      console.log('Color playback result:', JSON.stringify(colorResult, null, 2));

      console.log('Reading local currently-playing after direct Color playback...');

      const localClient = new GemstoneClient('192.168.1.233');

      const currentlyPlaying = await localClient.getCurrentlyPlaying();

      console.log('Currently playing after Color:', JSON.stringify(currentlyPlaying, null, 2));

    } catch (error) {
      console.error(
        'Gemstone cloud test FAILED:',
        error,
      );

      throw error;
    }
  }
}