'use strict';

import { IGemstoneCloudClient } from '../abstractions/IGemstoneCloudClient';
import {
  GemstoneCatalog,
  GemstoneCatalogDevice,
  GemstoneCatalogDeviceGroup,
  GemstoneCatalogFolder,
} from '../models/GemstoneCatalogModels';
import {
  GemstoneCloudDesign,
  GemstoneCloudPattern,
  GemstoneCloudZone,
} from '../models/GemstoneCloudModels';

export class GemstoneCatalogManager {

  private readonly cloudClient: IGemstoneCloudClient;

  private catalog: GemstoneCatalog | null = null;

  public constructor(
    cloudClient: IGemstoneCloudClient,
  ) {
    this.cloudClient = cloudClient;
  }

  public getDeviceGroups(): GemstoneCatalogDeviceGroup[] {
    return this.catalog?.deviceGroups ?? [];
  }

  public getDeviceGroup(groupId: string): GemstoneCatalogDeviceGroup | undefined {
    return this.catalog?.deviceGroups.find(
      group => group.id === groupId,
    );
  }

  public getDeviceGroupByName(name: string): GemstoneCatalogDeviceGroup | undefined {
    return this.catalog?.deviceGroups.find(
      group => group.name === name,
    );
  }

  public getCatalog(): GemstoneCatalog | null {
    return this.catalog;
  }

  public isLoaded(): boolean {
    return this.catalog !== null;
  }

  public async refresh(): Promise<GemstoneCatalog> {
    console.log('Refreshing Gemstone catalog...');

    const previousCatalog = this.catalog;

    try {
      return await this.buildCatalog();
    } catch (error) {
      this.catalog = previousCatalog;

      console.error(
        'Gemstone catalog refresh failed; '
        + 'keeping previous catalog',
        error,
      );

      throw error;
    }
  }

  public getFolders(): GemstoneCatalogFolder[] {
    return this.catalog?.folders ?? [];
  }

  public getFolder(
    folderId: string,
  ): GemstoneCatalogFolder | undefined {
    return this.catalog?.folders.find(
      item => item.folder.folderId === folderId,
    );
  }

  public getPatterns(
    folderId: string,
  ): GemstoneCloudPattern[] {
    return this.getFolder(folderId)?.patterns ?? [];
  }

  public getPattern(
    folderId: string,
    patternId: string,
  ): GemstoneCloudPattern | undefined {
    return this.getFolder(folderId)?.patterns.find(
      pattern => pattern.id === patternId,
    );
  }

  public getDevices(): GemstoneCatalogDevice[] {
    return this.catalog?.devices ?? [];
  }

  public getDevice(deviceId: string): GemstoneCatalogDevice | undefined {
    return this.catalog?.devices.find(
      item => item.device.id === deviceId,
    );
  }

  public getDeviceByName(name: string): GemstoneCatalogDevice | undefined {
    return this.catalog?.devices.find(
      item => item.device.name === name,
    );
  }

  public getZones(deviceId: string): GemstoneCloudZone[] {
    return this.getDevice(deviceId)?.zones ?? [];
  }

  public getZone(deviceId: string, zoneId: string): GemstoneCloudZone | undefined {
    return this.getDevice(deviceId)?.zones.find(
      zone => zone.id === zoneId,
    );
  }

  public getZoneByName(deviceId: string, name: string): GemstoneCloudZone | undefined {
    return this.getZones(deviceId).find(
      zone => zone.name === name,
    );
  }

  public getDesigns(deviceId: string): GemstoneCloudDesign[] {
    return this.getDevice(deviceId)?.designs ?? [];
  }

  public getDesign(deviceId: string, designId: string): GemstoneCloudDesign | undefined {
    return this.getDevice(deviceId)?.designs.find(
      design => design.id === designId,
    );
  }

  public getDesignByName(deviceId: string, name: string): GemstoneCloudDesign | undefined {
    return this.getDesigns(deviceId).find(
      design => design.name === name,
    );
  }

  public async load(): Promise<GemstoneCatalog> {
    console.log('Loading Gemstone catalog...');

    return this.buildCatalog();
  }

  private async buildCatalog(): Promise<GemstoneCatalog> {

    const homegroups = await this.cloudClient.getHomegroups();

    console.log(`Loaded ${homegroups.length} homegroup(s)`);

    const catalogDevices: GemstoneCatalogDevice[] = [];

    const deviceGroups = new Map<string,
    {
      id: string;
      name: string;
      deviceIds: string[];
    }>();

    for (const homegroup of homegroups) {
      console.log(`Loading homegroup: ${homegroup.name}`);
      
      const devices = await this.cloudClient.getDevices(
        homegroup.id,
      );

      for (const device of devices) {
        console.log(`Loading device: ${device.name}`);

        const zones = await this.cloudClient.getZones(
          device.id,
        );

        const designs = await this.cloudClient.getDesigns(
          device.id,
        );

        catalogDevices.push({
          device,
          zones,
          designs,
        });

        for (const [groupId, groupReference] of Object.entries(device.deviceGroups)) {
          let group = deviceGroups.get(groupId);

          if (!group) {
            group = {
              id: groupId,
              name: groupReference.name,
              deviceIds: [],
            };

            deviceGroups.set(groupId, group);
          }

          if (!group.deviceIds.includes(device.id)) {
            group.deviceIds.push(device.id);
          }
        }
      }
    }

    const expectedDeviceGroupIds = new Set(homegroups.flatMap(homegroup => homegroup.deviceGroupIds));

    for (const groupId of expectedDeviceGroupIds) {
      if (!deviceGroups.has(groupId)) {
        console.warn(
          `Device Group ${groupId} is referenced by a Homegroup `
          + 'but was not found on any Device',
        );
      }
    }

    for (const groupId of deviceGroups.keys()) {
      if (!expectedDeviceGroupIds.has(groupId)) {
        console.warn(
          `Device Group ${groupId} was found on a Device `
          + 'but was not referenced by any Homegroup',
        );
      }
    }

    const folders = await this.cloudClient.getPatternFolders();

    console.log(`Loaded ${folders.length} pattern folder(s)`);
    
    const catalogFolders: GemstoneCatalogFolder[] = [];

    for (const folder of folders) {
      console.log(`Loading pattern folder: ${folder.name}`);

      const patterns = await this.cloudClient.getPatterns(
        folder.folderId,
      );

      catalogFolders.push({
        folder,
        patterns,
      });
    }

    const newCatalog: GemstoneCatalog = {
      homegroups,
      devices: catalogDevices,
      deviceGroups: Array.from(deviceGroups.values()),
      folders: catalogFolders,
    };

    this.catalog = newCatalog;

    console.log('Gemstone catalog built successfully');

    return newCatalog;
  }
}
