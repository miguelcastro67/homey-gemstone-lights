# Gemstone Lights for Homey --- User Guide

> **Early draft.** Screens, Flow cards and setup instructions will be
> expanded as the app is implemented.

## What the app is for

The Homey integration is intended to use your **existing Gemstone
configuration**, not replace the Gemstone app.

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

## Devices

A **Device** is a physical Gemstone Hub2 controller. Each Hub2 manages
the lights physically connected to it. In Homey, each Hub2 is
represented as its own light device.

## Device Groups

A **Device Group** combines controllers into a logical group, for
example:

``` text
Whole House
├── House Front
└── House Side
```

Groups are defined in Gemstone and should be reused by Homey.

## Zones

A **Zone** is a named physical portion of the lights connected to one
Device.

``` text
DEVICE: House Front
└── ZONES
    ├── House Front
    └── Right Side
```

Zones answer **WHERE?** They are configured in Gemstone; Homey is not
intended to be a Zone editor.

## Patterns

A **Pattern** is a reusable lighting show. Patterns are independent of
Zones and answer **WHAT?**

``` text
PATTERN
├── Animation
├── Colors[]
├── Brightness
├── Speed
├── Direction
└── optional animation-specific parameters
```

Examples from the test installation include `Pumpkin Patch`,
`Aston Martin`, and `Cursed Cauldron`.

## Animations

An **Animation** is the Gemstone-defined motion/effect engine selected
by a Pattern. Users do not create or modify animation styles.

Observed examples include:

``` text
motionless
chase
marquee
multipulse
pyramid_chase
```

Some animations expose parameters whose values are stored in the
Pattern. `Cursed Cauldron`, for example, uses `pyramid_chase` with
Pyramid Length and Color Length values.

## Colors

Colors are values used by Patterns and Designs. A Pattern can contain a
palette of colors; a Design can also assign a static color to selected
lights. Homey has also successfully issued a direct solid-color command
to a Hub2.

## Designs

A **Design** combines physical areas with lighting content. It answers
**WHERE + WHAT?**

``` text
DESIGN
├── ZONE PATTERNS
│   ├── Zone A → Pattern A
│   └── Zone B → Pattern B
└── STATIC COLORS
    ├── selected lights → Color A
    └── selected lights → Color B
```

So the simplest mental model is:

``` text
Zone    = WHERE
Pattern = WHAT
Design  = WHERE + WHAT
```

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

The goal is to expose friendly Gemstone names, not technical IDs.

## Local control + cloud metadata

The app is designed **local-first**:

``` text
Gemstone Cloud
      │ metadata/catalog
      ▼
    Homey
      │ local control where possible
      ▼
     Hub2
```

Cloud metadata provides Devices, Device Groups, Zones, Pattern folders,
Patterns and Designs. Runtime light control should use the local Hub2
API wherever practical.

## Current development status

``` text
✓ Two independent Hub2 controllers
✓ Local power and brightness
✓ Gemstone account authentication
✓ Devices and Device Groups
✓ Zones
✓ Designs
✓ Pattern folders and Patterns
✓ Animation information
✓ Pattern/static colors
✓ Direct color control
```

The next stage is converting these verified capabilities into the
finished Homey UI and Flow cards.
