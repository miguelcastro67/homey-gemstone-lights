'use strict';

/**
 * Standard Gemstone cloud API response containing returned data.
 */
export interface GemstoneApiResponse<T> {
  data: T;

  [key: string]: unknown;
}

/**
 * A Gemstone Homegroup.
 */
export interface GemstoneHomegroup {
  id: string;
  name: string;
  role: string;
  type: string | null;
  homegroupUserIds: string[];
  deviceIds: string[];
  deviceGroupIds: string[];
  scannedDeviceIds: Record<string, string>;
  createdAt: number;
  lastUpdatedAt: number;
  [key: string]: unknown;
}

export interface GemstoneDeviceGroupReference {
  name: string;

  [key: string]: unknown;
}

export interface GemstoneCloudDeviceNetwork {
  preferred: string;
  interface: string;
}

export interface GemstoneCloudDeviceHub {
  tcpEnabled: boolean;
  rgbwSequence: string;
  outputNames: string[];
  reversePixels: boolean[];
  pixelOutputNames: string[];
  network: GemstoneCloudDeviceNetwork;
  localIp: string;
  timeZone: string;
  dstActive: string;
  location: {
    name: string;
    long: number;
    lat: number;
  };
  pixelCount: number[];
  dstMode: string;
  bluetoothName: string;
  [key: string]: unknown;
}

/**
 * A physical Gemstone controller returned by the cloud/account API.
 *
 * A cloud Device represents a Hub2 controller. The stable cloud ID
 * should eventually become the preferred Homey device identity, while
 * the local IP remains connection metadata.
 */
export interface GemstoneCloudDevice {
  id: string;
  name: string;
  hub: GemstoneCloudDeviceHub;
  deviceGroups: Record<string, GemstoneDeviceGroupReference>;
  [key: string]: unknown;
}

/**
 * A Gemstone Device Group.
 *
 * Device Groups are account-level groupings of physical controllers.
 * Example: "Whole House" contains House Front and House Side.
 */
export interface GemstoneDeviceGroup {
  id: string;
  name: string;
  deviceIds: string[];

  [key: string]: unknown;
}

/**
 * A Gemstone Zone belonging to a specific controller.
 *
 * The exact meaning of the lights array is not yet known, so it is
 * intentionally modeled without assigning semantics to its values.
 */
export interface GemstoneCloudZone {
  id: string;
  deviceId: string;
  name: string;
  icon: string;
  lights: number[];
  confirmed: boolean;
  txId: string;
  createdAt: number;
  lastUpdatedAt: number;
  [key: string]: unknown;
}

/**
 * A folder in the Gemstone Pattern catalog.
 *
 * Both folderId and referenceFolderId have been observed. Their exact
 * relationship has not yet been established.
 */
export interface GemstonePatternFolder {
  folderId: string;
  referenceFolderId: string;
  name: string;
  icon: string;
  ownerId: string;
  gemstoneManaged: boolean;
  hidden?: boolean;
  backgroundColor?: number;
  createdAt: number;
  lastUpdatedAt: number;
  [key: string]: unknown;
}

/**
 * Animation-specific Pattern parameter.
 *
 * Different Gemstone animations may expose different parameters.
 * Until their complete schema is known, preserve the returned values
 * without imposing an artificial type structure.
 */
export interface GemstoneAnimationExtraParameter {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface GemstoneAnimationExtraParameters {
  [key: string]: GemstoneAnimationExtraParameter | unknown;
}

/**
 * The actual lighting-show definition contained by a Pattern record.
 */
export interface GemstonePatternData {
  id: string;
  name: string;
  animation: string;
  colors: number[];
  referencePatternId?: string;
  backgroundColor?: number;
  brightness?: number;
  speed?: number;
  direction?: number;
  extraParameters?: GemstoneAnimationExtraParameters;
  version?: number;

  [key: string]: unknown;
}

/**
 * A Pattern record returned from a Gemstone Pattern folder.
 */
export interface GemstoneCloudPattern {
  id: string;
  folderId: string;
  patternData: GemstonePatternData;
  referenceFolderId?: string;
  referencePatternId?: string;
  isFavorite: boolean;
  hidden: boolean;
  ownerId: string;
  createdAt: number;
  lastUpdatedAt: number;

  [key: string]: unknown;
}

/**
 * Associates a Zone with a Pattern inside a saved Design.
 */
export interface GemstoneZonePattern {
  zoneId: string;
  pattern: GemstonePatternData;
  [key: string]: unknown;
}

/**
 * Assigns a static RGBW color to a selection of lights inside a Design.
 *
 * The lights array is preserved as returned by Gemstone because its
 * exact encoding has not yet been established.
 */
export interface GemstoneStaticColor {
  color: number;
  lights: number[];
  [key: string]: unknown;
}

/**
 * A saved Gemstone architectural Design.
 *
 * Designs may combine Zone -> Pattern assignments and direct static
 * colors assigned to selected lights.
 */
export interface GemstoneCloudDesign {
  id: string;
  deviceId: string;
  name: string;
  brightness: number;
  isFavorite: boolean;
  createdAt: number;
  lastUpdatedAt: number;

  zonePatterns?: GemstoneZonePattern[];
  staticColors?: GemstoneStaticColor[];

  [key: string]: unknown;
}

/**
 * Common shape for Gemstone API responses that return paginated data.
 *
 * Pagination fields remain optional until all endpoint variants have
 * been observed and confirmed.
 */
export interface GemstonePaginatedResponse<T> {
  items: T[];

  nextToken?: string;
  page?: number;
  pageSize?: number;
  total?: number;

  [key: string]: unknown;
}
