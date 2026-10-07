export interface GemstoneLocation {
  name: string;
  lat: number;
  long: number;
}

export interface GemstoneNetwork {
  interface: string;
  preferred: string;
}

export interface HubSettings {
  pixelCount: number[];
  reversePixels: boolean[];
  pixelOutputNames: string[];
  localIp: string;
  rgbwSequence: string;
  timeZone: string;
  dstActive: string;
  dstMode: string;
  bluetoothName: string;
  tcpEnabled: boolean;
  location: GemstoneLocation;
  firmware: string;
  firmwareSpi: string;
  firmwareWifi: string;
  network: GemstoneNetwork;
}

export interface GemstonePattern {
  name: string;
  animation: string;
  id: string;
  referencePatternId?: string;
  backgroundColor: number;
  brightness: number;
  speed: number;
  direction: number;
  colors: number[];
}

export interface CurrentlyPlaying {
  onState: boolean;
  pattern?: GemstonePattern;
  color?: number;
}

export interface GemstoneShadow<T> {
  state: {
    desired?: unknown;
    reported: T;
  };
  origin?: string;
  env?: string;
}
