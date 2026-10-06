# Gemstone Lights Homey App --- Project Notes

**App ID:** `com.miguelcastro67.gemstonelights`\
**Checkpoint:** 2026-10-06

## Goal

Build a native Homey Pro integration for Gemstone Lights Hub2. Use the
Hub2 LAN API for normal runtime control where possible and the Gemstone
cloud API for account/catalog metadata. Gemstone remains the editor for
physical setup, Zones, Patterns and Designs; Homey consumes those
objects for automation.

## Test installation

  Name          Local IP          Cloud ID         Pixels
  ------------- ----------------- ---------------- -----------------
  House Front   `192.168.1.233`   `h2-1094-t5k4`   `[160,100,0,0]`
  House Side    `192.168.1.118`   `h2-1075-2q9f`   `[89,0,0,0]`

Both: Hub `1.1.5`, Driver/SPI `1.2.1`, Wi-Fi `3.3.9`, Allow Local
Commands enabled.

Device Group **Whole House**: `g_c6c5c651-b9e1-49c3-ab7c-d416c795e318`,
containing both controllers.

## Local API --- verified

-   `GET /device-state/hub-settings`
-   `GET /device-state/currently-playing`
-   `POST /device-control/play`
-   Responses use `state.desired` / `state.reported`.
-   Hub settings: `state.reported.hubSettings`
-   Playback: `state.reported.currentlyPlaying`
-   Power and brightness writes work locally.
-   Brightness changes preserve the running Pattern.
-   Both Hub2 controllers operate independently.
-   10-second Homey polling works.

Hub2 ICMP ping is unreliable and must not be used as a health check.
House Front once lost its local HTTP service while cloud/mobile control
remained available; toggling **Allow Local Commands OFF → ON** restored
it. A transient Node `UND_ERR_HEADERS_TIMEOUT` has also occurred.

## Current project structure

``` text
src/
├── abstractions/
├── clients/
├── discovery/
├── models/
└── utils/

drivers/gemstone/
├── driver.compose.json
├── driver.ts
├── device.ts
└── pair/manual_ip.html
```

Potential later: `src/managers/FlowManager.ts`.

Current Homey capabilities: `onoff`, `dim`. Pairing uses custom
`manual_ip`, validates via the local API, and names the device from
`bluetoothName`.

## Cloud authentication --- verified

AWS Cognito SRP works using `amazon-cognito-identity-js`.

``` text
Region: us-west-2
User Pool: us-west-2_rr5lY7Etr
Client ID: 2647t144niotrl53vvru0ivno7
API Base: https://mytpybpq12.execute-api.us-west-2.amazonaws.com/prod
```

Cognito username is the Gemstone account **email**, not the six-digit
number. PowerShell environment variables do not propagate through
`homey app run --remote`; temporary hardcoded credentials were used only
for diagnostics and must be removed before source control/release.

## Cloud catalog --- verified

``` text
Homegroups      ✓
Devices         ✓
Device Groups   ✓
Zones           ✓
Designs         ✓
Pattern folders ✓
Patterns        ✓
```

Homegroup: `Miguel’s Homegroup`, ID
`3c67456e-6b2d-43ad-a51c-be8d8fe60f6f`.

### Zones

Endpoint: `/deviceControl/zone/list?deviceId=<deviceId>`

House Front: - **House Front** ---
`12af45b9-e6b1-4947-aaf9-f7db770bb331`, lights `[0,0,154]` - **Right
Side** --- `95f7c9b9-52e0-4610-8ec0-245b61356b6e`, lights `[0,0,8]`

Exact `lights` semantics remain unknown.

### Designs

Endpoint: `/deviceControl/architectural/list?deviceId=<deviceId>`

Observed: - `My Design 1`: Right Side → `Aston Martin` - `test`: static
colors - `test 1`: House Front → `Cursed Cauldron`, plus static colors

Model:

``` text
Design
├── deviceId / brightness
├── zonePatterns[]
│   ├── zoneId
│   └── pattern
└── staticColors[]
    ├── color
    └── lights[]
```

### Pattern folders

Endpoint: `/folders/list`. Records include `folderId`,
`referenceFolderId`, `name`, `gemstoneManaged`, `hidden`,
icon/background metadata. Do **not** yet assume `referenceFolderId`
means parent folder.

### Patterns

Endpoint: `/folders/pattern/list?folderId=<folderId>`

``` text
Pattern record
├── folderId / referenceFolderId / referencePatternId
├── favorite / hidden
└── patternData
    ├── name / id / referencePatternId
    ├── brightness
    ├── colors[]
    ├── speed
    ├── animation
    ├── direction
    └── extraParameters?
```

Actual data included `Dark lab`, `Blue land`, `Fire and Ice`.

## Animations

Animations are Gemstone-defined, fixed, non-user-editable engines
selected by Patterns. Live data has shown `motionless`, `multipulse`,
`pyramid_chase`, `chase`, `marquee`. Some animations have
Pattern-specific parameter values; `Cursed Cauldron`/`pyramid_chase`
showed Pyramid Length and Color Length.

A probe to `/animations/list` returned 403/API-Gateway
authorization-format error. This does **not** prove such a catalog route
exists.

## Colors

Colors are numeric RGBW values used by `Pattern.colors[]`,
`Design.staticColors[].color`, and direct color playback. No saved color
catalog has been established.

Cloud direct-color playback was verified end-to-end: API returned
`200 Successful` with a transaction ID and House Front physically
changed color.

Afterward a TestHarness local `getCurrentlyPlaying()` waited
indefinitely, but the same local URL later responded immediately in a
browser. The lights had already been restored to Pumpkin Patch before
the browser request, so no conclusion can be drawn about direct-color
representation in `currentlyPlaying`.

## Conceptual model

``` text
GEMSTONE ACCOUNT
├── HOMEGROUP
├── DEVICE GROUPS
│   └── Whole House → House Front + House Side
├── DEVICES
│   └── Device → ZONES
├── PATTERN LIBRARY
│   └── FOLDERS → PATTERNS
│       ├── Gemstone-defined ANIMATION
│       ├── COLORS[]
│       ├── SPEED / DIRECTION / BRIGHTNESS
│       └── EXTRA PARAMETERS?
└── DESIGNS
    ├── ZONE → PATTERN
    └── STATIC COLOR → LIGHT SELECTION
```

## Next session

1.  Convert raw diagnostics into typed production cloud models/methods.
2.  Expand `GemstoneCloudModels.ts`.
3.  Update `IGemstoneCloudClient`.
4.  Remove temporary hardcoded credentials.
5.  Investigate the TestHarness/local-fetch wait and add explicit
    request timeouts.
6.  Decide stable cloud-ID vs IP identity strategy.
7.  Begin FlowManager and Pattern/Design/Zone Flow-card design.
