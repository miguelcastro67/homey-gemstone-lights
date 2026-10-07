# Gemstone Lights Homey App --- Architecture

**Updated:** 2026-10-06 (end-of-session)

## Principles

- **Local-first runtime control.**
- **Cloud for metadata/catalog** not available locally.
- Do not duplicate Gemstone configuration in Homey.
- Keep local protocol models separate from cloud/catalog models.
- Prefer stable Gemstone IDs over IP identity when practical.
- Do not use ICMP ping as Hub2 health.
- Cache cloud metadata so Flow argument lookup does not require repeated cloud traversal.
- Preserve Gemstone's Folder → Pattern hierarchy; the live catalog currently contains 9,052 Patterns.
- Do not invent cloud endpoints. Device Groups are normalized from relationships actually returned by Homegroups/Devices.

## High-level design

``` text
Gemstone Cloud
  Cognito + typed catalog endpoints
          │
          ▼
GemstoneCloudClient
          │
          ▼
GemstoneCatalogManager
  typed catalog + cache
          │
          ├────────► future FlowManager
          │
Drivers / Devices
          │
GemstoneClient
          │ local HTTP/LAN
          ▼
        Hub2
```

## Source layout

``` text
src/
├── abstractions/
│   ├── IGemstoneClient.ts
│   ├── IGemstoneCloudClient.ts
│   └── IGemstoneDiscoveryProvider.ts
├── clients/
│   ├── GemstoneClient.ts
│   └── GemstoneCloudClient.ts
├── discovery/GemstoneDiscoveryProvider.ts
├── managers/GemstoneCatalogManager.ts
├── models/
│   ├── GemstoneModels.ts
│   ├── GemstoneCloudModels.ts
│   └── GemstoneCatalogModels.ts
└── utils/TestHarness.ts

src/managers/FlowManager.ts       # planned
```

## Local layer

Verified endpoints: `GET /device-state/hub-settings`, `GET /device-state/currently-playing`, `POST /device-control/play`.

Direct solid-color state is `{ onState: true, color: 255 }` with no Pattern. Therefore local `CurrentlyPlaying.pattern` and `color` are optional alternatives. `refreshState()` derives `dim` only when Pattern data exists.

A transient local HTTP 500 during polling was caught without terminating the loop; later polls recovered. Explicit request timeouts, failure thresholds, availability transitions, and log-noise policy remain production work.

## Cloud layer

Typed production methods:

``` text
getHomegroups()
getDevices(homegroupId)
getZones(deviceId)
getDesigns(deviceId)
getPatternFolders()
getPatterns(folderId)
```

Verified list responses use an outer `data` envelope; production methods unwrap it.

Device Groups do not currently have a proven dedicated endpoint. Group identity/membership is available through Homegroup `deviceGroupIds` and Device `deviceGroups` and will be normalized in the catalog layer.

## Cloud models

- Device LAN address is `device.hub.localIp`.
- Folder `hidden` is optional because live records omit it.
- Pattern cloud metadata and `patternData` are distinct.
- Designs can independently contain `zonePatterns[]`, `staticColors[]`, or both.
- Animation-specific extra parameters remain extensible.

## Catalog/cache layer

``` text
GemstoneCatalog
├── homegroups[]
├── devices[]
│   ├── device
│   ├── zones[]
│   └── designs[]
└── folders[]
    ├── folder
    └── patterns[]
```

`GemstoneCatalogManager.load()` is the cloud-loading boundary. It currently loads sequentially for predictable diagnostics, then stores the completed catalog.

Current cache API covers catalog state, Devices, Zones, Designs, Folders and Patterns. Cached accessors do not make network requests.

Verified full-load snapshot:

``` text
homegroups: 1
devices: 2
zones: 2
designs: 4
folders: 31
patterns: 9052
```

Pattern access is intentionally folder-oriented. A global Pattern index should be added only if a concrete runtime/Flow requirement justifies it.

### Next catalog addition: Device Groups

Normalize a `GemstoneCatalogDeviceGroup` from Homegroup `deviceGroupIds[]`, Device `deviceGroups[groupId].name`, and matching Device IDs. Expected verified result: **Whole House → House Front + House Side**. No separate cloud request should be introduced unless a real endpoint is later established.

## State synchronization

Current poll interval: 10 seconds. Production behavior should tolerate isolated transient failures, use explicit request timeouts, avoid noisy single-failure logs, mark unavailable only after an appropriate threshold, and auto-recover.

## Planned Flow architecture

`FlowManager` should consume `GemstoneCatalogManager`, not call cloud endpoints directly. With 9,052 live Patterns, Pattern selection should preserve Folder context or use an efficient searchable/indexed strategy rather than a flat permanent list.

## Security

Never commit passwords/tokens. Temporary diagnostic credentials must be removed. Proper Homey credential/session storage and Cognito refresh behavior remain to be designed.

## Known unknowns

- Zone `lights` encoding
- `folderId` vs `referenceFolderId`
- complete authoritative animation schema/parameters
- which Pattern/Design operations can be issued locally
- Device Group playback/control semantics
- catalog refresh/invalidation behavior
- behavior when cloud metadata is unavailable
- cloud token lifecycle
- stable cloud-ID vs current IP-based Homey identity
