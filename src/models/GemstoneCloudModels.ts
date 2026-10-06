'use strict';

/**
 * A Gemstone device returned by the cloud/account API.
 *
 * We intentionally keep this minimal until we inspect the
 * actual response from the user's account.
 */
export interface GemstoneCloudDevice {
  id: string;
  name?: string;
  localIp?: string;
}

/**
 * A Gemstone zone belonging to a specific controller.
 *
 * The exact zone payload will be expanded after we retrieve
 * and inspect the raw response from the Gemstone API.
 */
export interface GemstoneCloudZone {
  id: string;
  name: string;

  [key: string]: unknown;
}

/**
 * A saved Gemstone architectural Design.
 *
 * Designs associate zones with Patterns.
 * We will expand this once we inspect My Design 1.
 */
export interface GemstoneCloudDesign {
  id: string;
  name: string;

  [key: string]: unknown;
}

/**
 * A Pattern available through the Gemstone account/catalog.
 */
export interface GemstoneCloudPattern {
  id: string;
  name: string;

  [key: string]: unknown;
}
