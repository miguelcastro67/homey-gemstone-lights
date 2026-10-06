import { HubSettings } from '../models/GemstoneModels';

export interface GemstoneDiscoveredDevice {
  id: string;
  name: string;
  host: string;
  settings: HubSettings;
}

export interface IGemstoneDiscoveryProvider {
  validateHost(host: string): Promise<GemstoneDiscoveredDevice>;
}