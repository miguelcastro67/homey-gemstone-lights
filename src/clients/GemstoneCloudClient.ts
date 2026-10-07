'use strict';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { IGemstoneCloudClient } from '../abstractions/IGemstoneCloudClient';

import {
  GemstoneApiResponse,
  GemstoneCloudDesign,
  GemstoneCloudDevice,
  GemstoneCloudPattern,
  GemstoneCloudZone,
  GemstoneDeviceGroup,
  GemstoneDeviceGroupReference,
  GemstoneHomegroup,
  GemstonePatternFolder,
} from '../models/GemstoneCloudModels';

export class GemstoneCloudClient implements IGemstoneCloudClient {

  private static readonly USER_POOL_ID = 'us-west-2_rr5lY7Etr';

  private static readonly CLIENT_ID = '2647t144niotrl53vvru0ivno7';

  private static readonly API_BASE_URL = 'https://mytpybpq12.execute-api.us-west-2.amazonaws.com/prod';

  private accessToken?: string;

  /**
   * Authenticate against the Gemstone Lights Cognito user pool.
   */
  public async authenticate(username: string, password: string): Promise<void> {

    const userPool = new CognitoUserPool({
      UserPoolId: GemstoneCloudClient.USER_POOL_ID,
      ClientId: GemstoneCloudClient.CLIENT_ID,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const session = await new Promise<CognitoUserSession>(
      (resolve, reject) => {
        cognitoUser.authenticateUser(
          authenticationDetails,
          {
            onSuccess: (result) => {
              resolve(result);
            },

            onFailure: (error) => {
              reject(error);
            },
          },
        );
      },
    );

    this.accessToken = session
      .getAccessToken()
      .getJwtToken();
  }

  private async request<T>(path: string): Promise<T> {

    if (!this.accessToken) {
      throw new Error('Gemstone cloud client is not authenticated.');
    }

    const response = await fetch(`${GemstoneCloudClient.API_BASE_URL}${path}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      const body = await response.text();

      throw new Error(`Gemstone cloud request failed: ${response.status} ${response.statusText} ${body}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Retrieve the Homegroups available to the authenticated account.
   */
  public async getHomegroups(): Promise<GemstoneHomegroup[]> {

    const response = await this.request<GemstoneApiResponse<GemstoneHomegroup[]>>('/homegroup/list');

    return response.data;
  }

  /**
   * Retrieve Gemstone Hub2 devices belonging to a Homegroup.
   */
  public async getDevices(
    homegroupId: string,
  ): Promise<GemstoneCloudDevice[]> {

    const response = await this.request<GemstoneApiResponse<GemstoneCloudDevice[]>>(`/homegroup/devices?homegroupId=${encodeURIComponent(homegroupId)}`);

    return response.data;
  }

  /**
   * Retrieve the Zones configured for a specific Hub2 device.
   */
  public async getZones(deviceId: string): Promise<GemstoneCloudZone[]> {
    const response = await this.request<GemstoneApiResponse<GemstoneCloudZone[]>>(`/deviceControl/zone/list?deviceId=${encodeURIComponent(deviceId)}`);

    return response.data;
  }

  /**
   * Retrieve the saved Designs configured for a specific Hub2 device.
   */
  public async getDesigns(deviceId: string): Promise<GemstoneCloudDesign[]> {
    const response = await this.request<GemstoneApiResponse<GemstoneCloudDesign[]>>(`/deviceControl/architectural/list?deviceId=${encodeURIComponent(deviceId)}`);

    return response.data;
  }

  /**
   * Retrieve Pattern folders available to the account.
   */
  public async getPatternFolders(): Promise<GemstonePatternFolder[]> {
      const response = await this.request<GemstoneApiResponse<GemstonePatternFolder[]>>('/folders/list');

    return response.data;
  }

  /**
   * Retrieve Patterns contained in a specific Pattern folder.
   */
  public async getPatterns(folderId: string): Promise<GemstoneCloudPattern[]> {
    const response = await this.request<
      GemstoneApiResponse<GemstoneCloudPattern[]>>(`/folders/pattern/list?folderId=${encodeURIComponent(folderId)}`);

    return response.data;
  }

  public async playRawColor(deviceOrGroupId: string, color: number): Promise<unknown> {

    if (!this.accessToken) {
      throw new Error('Gemstone cloud client is not authenticated.');
    }

    const response = await fetch(
      `${GemstoneCloudClient.API_BASE_URL}/deviceControl/play/colordeviceOrGroupId=${encodeURIComponent(deviceOrGroupId)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color }),
      },
    );

    if (!response.ok) {
      const body = await response.text();

      throw new Error(`Gemstone cloud color request failed: ${response.status} ${response.statusText} ${body}`);
    }

    return response.json() as Promise<unknown>;
  }

  /**
   * Diagnostic only.
   *
   * Retrieve the raw Gemstone homegroup list so we can inspect
   * the actual API response before defining models for it.
   */
  public async getRawHomegroups(): Promise<unknown> {
    return this.request<unknown>('/homegroup/list');
  }

   /**
   * Diagnostic only.
   *
   * Retrieve the raw device list for a Gemstone homegroup so we can
   * inspect the actual API response before defining the device model.
   */
  public async getRawHomegroupDevices(homegroupId: string): Promise<unknown> {

    return this.request<unknown>(`/homegroup/devices?homegroupId=${encodeURIComponent(homegroupId)}`);
  }

  /**
   * Diagnostic only.
   *
   * Retrieve the raw zone definitions for a Gemstone device.
   */
  public async getRawZones(deviceId: string): Promise<unknown> {

    return this.request<unknown>(`/deviceControl/zone/list?deviceId=${encodeURIComponent(deviceId)}`);
  }

  /**
   * Diagnostic only.
   *
   * Retrieve the raw architectural Designs for a Gemstone device.
   */
  public async getRawDesigns(deviceId: string): Promise<unknown> {

    return this.request<unknown>(`/deviceControl/architectural/list?deviceId=${encodeURIComponent(deviceId)}`);
  }

  /**
   * Diagnostic only.
   *
   * Retrieve the raw Pattern folder list.
   */
  public async getRawPatternFolders(): Promise<unknown> {
    return this.request<unknown>('/folders/list');
  }

  /**
   * Diagnostic only.
   *
   * Retrieve the raw Patterns contained in a Gemstone folder.
   */
  public async getRawPatterns(folderId: string): Promise<unknown> {
    return this.request<unknown>(`/folders/pattern/list?folderId=${encodeURIComponent(folderId)}`);
  }

  /**
   * Diagnostic only.
   *
   * Retrieve the raw Gemstone animation list.
   */
  public async getRawAnimations(): Promise<unknown> {
    return this.request<unknown>('/animations/list');
  }

}
