# Gemstone Lights Homey App --- Architecture

**Updated:** 2026-10-06

## Principles

-   **Local-first runtime control.**
-   **Cloud for metadata/catalog** not available locally.
-   Do not duplicate Gemstone configuration in Homey.
-   Keep local protocol models separate from cloud/catalog models.
-   Prefer stable Gemstone IDs over IP identity when practical.
-   Do not use ICMP ping as Hub2 health.
-   Cache cloud metadata eventually so local control can remain useful
    through cloud interruptions.

## High-level design

``` text
Gemstone Cloud
  Cognito + Homegroups / Devices / Groups /
  Zones / Folders / Patterns / Designs
                  │
                  ▼
┌─────────────────────────────────────┐
│ Homey Gemstone App                  │
│ GemstoneCloudClient                 │
│ typed catalog models + future cache │
│ Drivers / future FlowManager        │
│ GemstoneClient                      │
└─────────────────┬───────────────────┘
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
├── models/
│   ├── GemstoneModels.ts
│   └── GemstoneCloudModels.ts
├── utils/
└── managers/FlowManager.ts       # planned

drivers/gemstone/
├── driver.compose.json
├── driver.ts
├── device.ts
└── pair/manual_ip.html
```

## Local layer

Verified endpoints: - `GET /device-state/hub-settings` -
`GET /device-state/currently-playing` - `POST /device-control/play`

`GemstoneClient` owns LAN communication, power/brightness/playback, and
future local Pattern/Design operations. Add explicit timeouts and
resilient failure handling.

## Cloud layer

`GemstoneCloudClient` owns Cognito authentication and catalog requests.
Verified domains: Homegroups, Devices, Device Groups, Zones, Designs,
Pattern folders and Patterns.

## Domain model

### Device

Physical Hub2. Cloud ID maps to local IP and should eventually be the
preferred stable identity.

### Device Group

Cloud grouping of controllers, e.g. **Whole House**.

### Zone

Device-specific physical subdivision defined in Gemstone. Contains
stable UUID and `lights` data whose exact encoding is still unknown.

### Pattern Folder

Catalog container. Has both `folderId` and `referenceFolderId`;
relationship is not yet established.

### Pattern

Reusable lighting show:

``` text
Pattern
├── animation
├── colors[]
├── brightness
├── speed
├── direction
└── extraParameters?
```

### Animation

Gemstone-defined, non-user-editable engine selected by a Pattern. Some
support parameter values stored in the Pattern.

### Color

Numeric RGBW value, not currently known to be a catalog object.

### Design

Device-specific composition:

``` text
Design
├── zonePatterns[] → zoneId + pattern
└── staticColors[] → color + lights[]
```

## Homey device layer

Currently one Homey `light` device per Hub2 with `onoff` and `dim`.
Pairing is manual-IP plus local validation. Future cloud-assisted
pairing can map stable cloud IDs to current LAN addresses.

## State synchronization

Current poll interval: 10 seconds. Production behavior should tolerate
transient failures, suppress noisy single-failure logs, mark unavailable
only after repeated failures, and auto-recover.

## Planned Flow architecture

Use `src/managers/FlowManager.ts`, following the Modern Forms project
pattern.

Likely actions: - Set Pattern - Set Design - Set Zone → Pattern -
Set/adjust brightness - Set speed - Set direction - Power on/off -
Device Group / Whole House actions

Desired experience:

``` text
Set [House Front] → Zone [Right Side] → Pattern [Christmas]
```

## Security

Never commit passwords/tokens. Temporary diagnostic credentials must be
removed. Proper Homey credential/session storage and Cognito refresh
behavior remain to be designed.

## Known unknowns

-   Zone `lights` encoding
-   `folderId` vs `referenceFolderId`
-   complete authoritative animation schema/parameters
-   which Pattern/Design operations can be issued locally
-   Device Group control semantics
-   cloud token lifecycle
-   direct-color representation in local playback state
-   cause of TestHarness local-fetch wait after cloud color command
