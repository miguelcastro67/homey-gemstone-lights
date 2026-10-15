# Gemstone Lights for Homey --- User Guide

> **Early development draft.** Setup screens and Flow-card instructions
> will be expanded as the app is implemented.

## Purpose

The Homey integration uses your **existing Gemstone configuration**
rather than replacing the Gemstone app.

``` text
GEMSTONE APP                         HOMEY
────────────                         ─────
Configure Hub2 controllers           Automate lights
Define Zones                         Use existing Zones
Create/edit Patterns                 Play existing Patterns
Create/edit Designs                  Play existing Designs
Advanced physical setup              Schedules / logic / Flows
```

## Gemstone hierarchy

``` text
GEMSTONE ACCOUNT
│
├── DEVICE GROUP
│   └── Whole House
│       ├── DEVICE: House Front
│       └── DEVICE: House Side
│
├── DEVICE
│   └── ZONES
│       ├── House Front
│       └── Right Side
│
├── PATTERN LIBRARY
│   └── FOLDERS
│       └── PATTERNS
│           ├── Animation
│           ├── Colors
│           ├── Speed
│           ├── Direction
│           ├── Brightness
│           └── optional animation parameters
│
└── DESIGNS
    ├── Zone → Pattern
    └── Selected lights → Static Color
```

## Devices and Device Groups

A **Device** is a physical Gemstone Hub2 controller.

A **Device Group** combines controllers. The development installation
has:

``` text
Whole House
├── House Front
└── House Side
```

Homey reuses Gemstone's existing group relationship instead of requiring
the same grouping to be recreated manually.

## Zones, Patterns and Designs

-   **Zone = WHERE** --- a named physical section of one Device.
-   **Pattern = WHAT** --- animation, colors, brightness, speed,
    direction and optional effect parameters.
-   **Design = WHERE + WHAT** --- Zone/Pattern assignments and/or
    static-color assignments.

Gemstone remains the place where these objects are created and edited.

## Pattern library

The current development account contains:

``` text
31 Pattern folders
295 total Pattern records
```

An earlier development count in the thousands was discovered to be
duplicate API data and has been corrected.

The Gemstone Pattern endpoint currently returns the same global 295
Pattern records even when queried with different valid folder IDs. Homey
therefore downloads that set once and organizes the Patterns into their
proper folders using each Pattern's own folder ID.

One folder is named **Downloaded Patterns** and currently contains 76
Patterns, including **Halloween Classic**.

Duplicate folder names exist, so Homey cannot safely identify folders by
name alone.

## Local-first operation

The integration is designed to use the Hub2 LAN API for normal runtime
control wherever practical.

Verified local functionality currently includes:

``` text
✓ Power
✓ Brightness
✓ Current playback reads
✓ External state polling
✓ Device unavailable/recovery handling
```

Gemstone Cloud supplies account and catalog metadata.

## Reliability behavior

If a Hub2 stops responding locally, Homey can mark the device
unavailable after repeated failures. When local communication returns,
Homey automatically restores the device to available.

During development, a Hub2 local HTTP service has occasionally stopped
responding while the Gemstone mobile/cloud path continued to work.
Turning **Allow Local Commands** off and back on in the Gemstone app
restored the local service.

## Pattern playback development

Homey can already read the full local Pattern currently playing on a
Hub2.

Development has verified the downloaded Pattern **Halloween Classic**
and confirmed that Gemstone plays its user-modified version (`glitter`)
rather than its original catalog version (`wave`).

The next development step is to make Homey itself send that Pattern to
House Front. Pattern Flow cards will be built only after that local
write path is proven.

## Intended Flow experience

The goal is friendly Gemstone names rather than UUIDs. Future actions
are intended to read naturally, for example:

``` text
Play Pattern "Halloween Classic"
on House Front
```

or:

``` text
Play Design "My Design 1"
on House Front
```

and, where supported:

``` text
Play Pattern "Halloween Classic"
on Whole House
```

The standard Homey on/off capability already supplies ordinary power
Flow actions; the app will avoid adding redundant custom cards where
Homey's built-in cards are sufficient.

## Current development status

``` text
✓ Two independent Hub2 controllers
✓ Local power and brightness
✓ Direct-color playback state understood
✓ Availability failure/recovery behavior
✓ Gemstone account authentication
✓ Typed cloud models/client
✓ Device Group normalization
✓ Whole House group verified
✓ Catalog/cache + refresh foundation
✓ FlowManager skeleton
✓ 31 folders / 295 real Patterns
✓ Downloaded Patterns / Halloween Classic located
✓ Halloween Classic local playback representation understood
→ Homey-originated Pattern playback next
```
