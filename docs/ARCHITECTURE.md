# Gemstone Lights Homey App --- Architecture

**Updated:** 2026-10-14

## Principles

-   **Local-first runtime control.**
-   **Cloud for account/catalog metadata.**
-   Gemstone remains the editor for Zones, Patterns, Designs and
    physical setup.
-   Keep local protocol models separate from cloud/catalog models.
-   Prefer stable Gemstone IDs over IP identity where practical.
-   Do not use ICMP ping as Hub2 health.
-   Cache cloud metadata; Flow argument resolution should not repeatedly
    traverse the cloud.
-   Do not invent endpoints or semantics that have not been observed.
-   Preserve Folder → Pattern relationships while recognizing that the
    Pattern-list endpoint currently returns a global Pattern set.

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
          ├────────► FlowManager
          │
Homey Drivers / Devices
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
├── discovery/
├── managers/
│   ├── GemstoneCatalogManager.ts
│   └── FlowManager.ts
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

## Local layer

Verified endpoints:

``` text
GET  /device-state/hub-settings
GET  /device-state/currently-playing
POST /device-control/play
```

`GemstoneClient` owns LAN communication.

### Playback state

Local `currentlyPlaying` supports at least two observed forms:

``` text
Pattern:
{
  onState,
  pattern: { ... }
}

Direct color:
{
  onState,
  color
}
```

`CurrentlyPlaying.pattern` and `color` are therefore optional
alternatives.

Pattern objects observed locally contain fields such as:

``` text
name
animation
id
referencePatternId? 
backgroundColor
brightness
speed
direction
colors[]
extraParameters
version
```

### Power and brightness

Local power and brightness writes are verified. Brightness preserves the
running Pattern by reading current playback and posting the Pattern back
with a modified brightness value.

### Health / availability

The Homey device polling layer tracks consecutive failures, marks a Hub2
unavailable after repeated failures, and restores availability after
successful communication resumes.

House Front has demonstrated that the Hub2's local HTTP service can fail
independently of cloud/mobile control. Toggling Gemstone **Allow Local
Commands OFF → ON** can restore the local HTTP service. Homey can then
recover without an app restart.

Current poll interval: **60 seconds** during stability testing.

`GemstoneClient` contains `fetchWithTimeout()` with a 5-second timeout,
but active requests currently use bare `fetch()` while Hub behavior is
being observed. Re-enable/finalize timeout behavior after the stability
investigation.

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

Verified list responses use a `data` envelope.

No dedicated Device Group endpoint has been proven. Groups are derived
from Homegroup and Device relationship data.

## Catalog/cache layer

``` text
GemstoneCatalog
├── homegroups[]
├── devices[]
│   ├── device
│   ├── zones[]
│   └── designs[]
├── deviceGroups[]
└── folders[]
    ├── folder
    └── patterns[]
```

`GemstoneCatalogManager.load()` / `refresh()` are the cloud-loading
boundaries. A new catalog is assigned only after the build completes;
refresh preserves the previous catalog on failure.

Current verified snapshot:

``` text
homegroups:   1
devices:      2
deviceGroups: 1
zones:        2
designs:      4
folders:      31
patterns:     295
```

### Device Groups

`GemstoneCatalogDeviceGroup` is normalized from:

-   Homegroup `deviceGroupIds[]`
-   Device `deviceGroups[groupId]`
-   matching Device IDs

Verified result:

``` text
Whole House
├── House Front
└── House Side
```

Cross-check warnings detect group IDs present on only one side of the
Homegroup/Device relationship.

### Pattern loading

Important observed behavior:

``` text
/folders/list
    → 31 folders

/folders/pattern/list?folderId=<valid folder>
    → same 295 global Pattern records for every tested folderId
```

Therefore the catalog makes one Pattern request and groups the result
locally:

``` text
295 global Pattern records
        │
        └── group by pattern.folderId
                │
                └── 31 catalog folders
```

Do not restore the old per-folder request loop; it produced 31 copies of
the same global result.

The API still receives one valid `folderId` because omission of the
parameter has not been proven safe.

## Cloud Pattern vs local Pattern

A cloud Pattern record can contain:

``` text
GemstoneCloudPattern
├── id
├── folderId
├── referencePatternId?
├── referenceFolderId?
├── patternData
└── userModifiedPatternData?
```

For downloaded **Halloween Classic**, `patternData` and
`userModifiedPatternData` differ. The Hub2's actual playback state
matched `userModifiedPatternData` (`glitter`, values 0/60), not the
original `patternData` (`wave`, values 20/70).

However, the Hub2 local object is not necessarily a byte-for-byte copy
of `userModifiedPatternData`: it contains local fields such as
`direction` and `referencePatternId`, while extra-parameter descriptive
names are omitted.

Permanent Pattern playback should therefore use an explicit
cloud-to-local conversion rather than POSTing the entire cloud wrapper
or blindly spreading `userModifiedPatternData`.

## Flow architecture

`FlowManager` exists and is initialized after the catalog is loaded.

Rules:

-   FlowManager consumes `GemstoneCatalogManager`.
-   FlowManager does not directly traverse cloud endpoints.
-   User-facing choices should use friendly Gemstone names while storing
    stable IDs.
-   Duplicate folder names are real; do not assume folder names are
    globally unique.
-   Built-in Homey capability Flow cards should be reused where they
    already cover functionality such as ordinary on/off.

Planned Gemstone-specific actions include Pattern, Design, Zone and
Device Group operations once their write semantics are proven.

## Security

Never commit passwords or tokens. Temporary hardcoded credentials are
development-only and are removed before source control.

Production work remains:

-   account/login UX
-   secure credential persistence
-   Cognito session/token refresh
-   consistent cloud error handling

## Known unknowns / open work

-   Exact Zone `lights` encoding.
-   Complete authoritative Animation vocabulary and parameter schemas.
-   Local Pattern playback write conversion and verification.
-   Local Design/Zone playback payloads.
-   Device Group playback semantics.
-   Exact catalog refresh trigger/UX.
-   Stable cloud-ID vs current IP-based Homey identity.
-   Final local timeout policy.
-   Earlier delayed/error timestamp discrepancy.
