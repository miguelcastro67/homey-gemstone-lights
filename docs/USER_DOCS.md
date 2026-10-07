# Gemstone Lights for Homey --- User Guide

> **Early draft.** Screens, Flow cards and setup instructions will be expanded as the app is implemented.

## What the app is for

The Homey integration is intended to use your **existing Gemstone configuration**, not replace the Gemstone app.

``` text
GEMSTONE APP                         HOMEY
────────────                         ─────
Configure Hub2 controllers           Automate lights
Define Zones                         Use existing Zones
Create/edit Patterns                 Play existing Patterns
Create/edit Designs                  Play existing Designs
Advanced physical setup              Schedules / logic / Flows
```

## The Gemstone hierarchy

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

A Device is a physical Hub2. A Device Group combines controllers, for example **Whole House → House Front + House Side**. Homey is being built to reuse these Gemstone relationships rather than require duplicate group setup.

## Zones, Patterns and Designs

- **Zone = WHERE** — a named physical portion of one Device.
- **Pattern = WHAT** — animation, colors, brightness, speed, direction and optional parameters.
- **Design = WHERE + WHAT** — Zone/Pattern assignments and/or static-color assignments.

The current development account contains **31 Pattern folders and 9,052 Patterns**, so Homey will need folder-aware or efficient searchable Pattern choices rather than an unwieldy permanent flat list.

## How Homey is intended to use this

Future Flow actions should read naturally, for example:

``` text
Set House Front
    Zone: Right Side
    Pattern: Christmas
```

or:

``` text
Play Design "My Design 1"
on House Front
```

and potentially:

``` text
Play Pattern "Pumpkin Patch"
on Whole House
```

The goal is friendly Gemstone names, not technical IDs.

## Local control + cloud metadata

The app is designed **local-first**. Gemstone Cloud supplies account/catalog metadata; Homey caches that metadata and uses the local Hub2 API for runtime control wherever practical.

## Current development status

``` text
✓ Two independent Hub2 controllers
✓ Local power and brightness
✓ Direct solid-color state understood
✓ Gemstone account authentication
✓ Typed cloud Devices / Zones / Designs
✓ Pattern folders and Patterns
✓ Typed production cloud client/models
✓ Catalog/cache foundation
✓ Full catalog load: 31 folders / 9,052 Patterns
→ Device Group normalization next
```

The next development stage is finishing catalog relationships, beginning with **Whole House**, then using the cached catalog to drive Homey Flow arguments and actions.
