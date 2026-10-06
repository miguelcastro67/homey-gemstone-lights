import {
  GemstoneDiscoveredDevice,
  IGemstoneDiscoveryProvider,
} from '../abstractions/IGemstoneDiscoveryProvider';

import { GemstoneClient } from '../clients/GemstoneClient';

export class GemstoneDiscoveryProvider
implements IGemstoneDiscoveryProvider {

  public async validateHost(
    host: string,
  ): Promise<GemstoneDiscoveredDevice> {

    const client = new GemstoneClient(host);

    const settings = await client.getHubSettings();

    return {
      id: host,
      name: settings.bluetoothName,
      host,
      settings,
    };
  }

}