'use strict';

import { IGemstoneCloudClient } from '../abstractions/IGemstoneCloudClient';
import {
  GemstoneCatalog,
  GemstoneCatalogDevice,
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

  public getCatalog(): GemstoneCatalog | null {
    return this.catalog;
  }

  public isLoaded(): boolean {
    return this.catalog !== null;
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

  public getDevice(
    deviceId: string,
  ): GemstoneCatalogDevice | undefined {
    return this.catalog?.devices.find(
      item => item.device.id === deviceId,
    );
  }

  public getZones(
    deviceId: string,
  ): GemstoneCloudZone[] {
    return this.getDevice(deviceId)?.zones ?? [];
  }

  public getZone(
    deviceId: string,
    zoneId: string,
  ): GemstoneCloudZone | undefined {
    return this.getDevice(deviceId)?.zones.find(
      zone => zone.id === zoneId,
    );
  }

  public getDesigns(
    deviceId: string,
  ): GemstoneCloudDesign[] {
    return this.getDevice(deviceId)?.designs ?? [];
  }

  public getDesign(
    deviceId: string,
    designId: string,
  ): GemstoneCloudDesign | undefined {
    return this.getDevice(deviceId)?.designs.find(
      design => design.id === designId,
    );
  }

  public async load(): Promise<GemstoneCatalog> {

    console.log('Loading Gemstone catalog...');

    const homegroups = await this.cloudClient.getHomegroups();

    console.log(`Loaded ${homegroups.length} homegroup(s)`);

    const catalogDevices: GemstoneCatalogDevice[] = [];

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

    this.catalog = {
      homegroups,
      devices: catalogDevices,
      folders: catalogFolders,
    };

    console.log('Gemstone catalog loaded successfully');

    return this.catalog;
  }

}
