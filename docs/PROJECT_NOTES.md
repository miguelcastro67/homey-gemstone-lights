# Gemstone Lights Homey App --- Project Notes

**App ID:** `com.miguelcastro67.gemstonelights`  
**Checkpoint:** 2026-10-06 (end-of-session)

## Goal

Build a native Homey Pro integration for Gemstone Lights Hub2. Use the Hub2 LAN API for normal runtime control where possible and the Gemstone cloud API for account/catalog metadata. Gemstone remains the editor for physical setup, Zones, Patterns and Designs; Homey consumes those objects for automation.

## Test installation

| Name | Local IP | Cloud ID | Pixels |
|---|---|---|---|
| House Front | `192.168.1.233` | `h2-1094-t5k4` | `[160,100,0,0]` |
| House Side | `192.168.1.118` | `h2-1075-2q9f` | `[89,0,0,0]` |

Both: Hub `1.1.5`, Driver/SPI `1.2.1`, Wi-Fi `3.3.9`, Allow Local Commands enabled.

Device Group **Whole House**: `g_c6c5c651-b9e1-49c3-ab7c-d416c795e318`, containing both controllers.

## Local API --- verified

- `GET /device-state/hub-settings`
- `GET /device-state/currently-playing`
- `POST /device-control/play`
- Power and brightness writes work locally; brightness preserves the running Pattern.
- Both Hub2 controllers operate independently with 10-second Homey polling.
- Direct solid-color playback is represented locally as `{ onState: true, color: <number> }` with no `pattern`.
- Pattern/off state can retain a Pattern object while `onState` is false.
- `CurrentlyPlaying.pattern` and `color` are therefore optional alternatives.
- `refreshState()` updates `dim` only when a Pattern is present, fixing the solid-color `pattern.brightness` crash.
- A single transient local HTTP `500 Internal Server Error` was observed during polling; the loop caught it and later cycles recovered.

Hub2 ICMP ping is unreliable and must not be used as a health check. Explicit request timeout/AbortController work remains open.

## Current project structure

``` text
src/
├── abstractions/
├── clients/
├── discovery/
├── managers/
│   └── GemstoneCatalogManager.ts
├── models/
│   ├── GemstoneModels.ts
│   ├── GemstoneCloudModels.ts
│   └── GemstoneCatalogModels.ts
└── utils/
    └── TestHarness.ts

drivers/gemstone/
├── driver.compose.json
├── driver.ts
├── device.ts
└── pair/manual_ip.html
```

Planned later: `src/managers/FlowManager.ts`.

## Cloud authentication --- verified

AWS Cognito SRP works using `amazon-cognito-identity-js`. Cognito username is the Gemstone account email. PowerShell environment variables do not propagate through `homey app run --remote`; temporary hardcoded credentials are development scaffolding only and must be removed before source control/release.

## Typed production cloud client --- verified

`IGemstoneCloudClient` and `GemstoneCloudClient` now expose typed production methods:

- `getHomegroups()`
- `getDevices(homegroupId)`
- `getZones(deviceId)`
- `getDesigns(deviceId)`
- `getPatternFolders()`
- `getPatterns(folderId)`

Verified list endpoints return an outer response envelope containing `data`; typed methods unwrap `response.data`.

No dedicated Device Group endpoint was established. Group relationships are exposed through Homegroup `deviceGroupIds` and Device `deviceGroups` maps and will be normalized by the catalog layer.

## Cloud models --- verified/tightened

- Device local IP is `device.hub.localIp`.
- Zone records include ID/device/name/icon/lights/confirmation/transaction/timestamps.
- Pattern Folder `hidden` is optional because some live records omit it.
- Pattern records contain outer cloud metadata plus `patternData`.
- Designs may contain `zonePatterns[]`, `staticColors[]`, or both.
- Design `zonePatterns[].pattern` reuses the Pattern-data shape.

## Cloud catalog/cache foundation

Added `GemstoneCatalogModels.ts` and `GemstoneCatalogManager.ts`.

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

`GemstoneCatalogManager.load()` performs a full cloud traversal and caches the result. Loading is intentionally sequential while the undocumented API is stabilized.

Cached accessors exist for catalog state, Devices, Zones, Designs, Folders, and Patterns. Only `load()` talks to Gemstone Cloud.

First complete catalog traversal succeeded:

``` text
homegroups: 1
devices: 2
zones: 2
designs: 4
folders: 31
patterns: 9052
```

The 9,052-Pattern result reinforces preserving Gemstone's Folder → Pattern hierarchy for Flow UI instead of treating the primary UX as one giant flat list.

## TestHarness

`TestHarness.ts` is now a read-only diagnostic harness with compact typed summaries, disabled write experiments, and a full catalog test.

## Next session

1. Normalize Device Groups from `homegroup.deviceGroupIds` plus each Device's `deviceGroups` map.
2. Add catalog Device Group model/accessors and verify **Whole House** contains both controllers.
3. Define catalog refresh/invalidation and cloud-unavailable behavior.
4. Consider indexes/global-ID lookups only where runtime/Flow behavior requires them.
5. Begin `FlowManager` and dynamic Folder/Pattern, Device/Zone/Design argument design after the catalog contract stabilizes.
6. Remove temporary hardcoded credentials and implement Homey-safe credential/session storage.
7. Add explicit local request timeouts and resilient polling thresholds.
