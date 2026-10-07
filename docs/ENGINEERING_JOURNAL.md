# Gemstone Lights Homey App --- Engineering Journal

## Through 2026-10-06

## Session progress

Expanded the project from raw cloud API archaeology into typed production cloud models/client methods and the first working catalog/cache layer.

### Local playback discovery/fix

Captured direct solid-color local state as:

``` json
{
  "onState": true,
  "color": 255
}
```

This resolved the earlier unknown. `CurrentlyPlaying.pattern` is now optional, `color` is optional, and `refreshState()` only reads Pattern brightness when Pattern data exists. This fixed the prior solid-color `state.pattern.brightness` exception.

One later 10-second poll returned a local HTTP `500 Internal Server Error`; the polling loop caught it and later cycles recovered. This supports the planned transient-failure policy but does not replace explicit timeout/failure-threshold work.

### Typed production cloud client/models

Validated and implemented typed methods for Homegroups, Devices, Zones, Designs, Pattern Folders and Patterns. Verified list endpoints use a `data` envelope and production methods unwrap it.

Live payload findings included:

- Device LAN address is `device.hub.localIp`.
- Folder `hidden` may be omitted.
- Pattern records contain outer cloud metadata plus `patternData`.
- Designs may contain Zone/Pattern assignments, static colors, or both.

Removed the idea of a standalone `getDeviceGroups()` cloud call because no dedicated endpoint had actually been observed. Device Group relationships come from Homegroup/Device data.

### TestHarness cleanup

Converted `TestHarness.ts` into a read-only diagnostic harness with compact summaries, typed methods, disabled write experiments, and no temporary early `return`.

### Catalog/cache foundation

Added:

``` text
src/models/GemstoneCatalogModels.ts
src/managers/GemstoneCatalogManager.ts
```

`GemstoneCatalogManager.load()` traverses Homegroups → Devices → Zones/Designs plus Pattern Folders → Patterns, then caches the completed catalog. Cached accessors were added for Devices/Zones/Designs and Folders/Patterns.

First complete traversal succeeded:

``` text
homegroups: 1
devices: 2
zones: 2
designs: 4
folders: 31
patterns: 9052
```

This is the first verified full-account catalog snapshot. The 9,052 Pattern count strongly supports Folder-oriented Flow selection/caching rather than repeated live API calls or a naive permanent flat list.

## Checkpoint

``` text
Local Hub2 API                    ✓
Power / brightness                ✓
Independent Hub2s                 ✓
Direct-color local state shape    ✓
Solid-color polling crash fixed   ✓
Cloud authentication              ✓
Typed Homegroups                  ✓
Typed Devices                     ✓
Typed Zones                       ✓
Typed Designs                     ✓
Typed Pattern folders             ✓
Typed Patterns                    ✓
Cloud models tightened            ✓
Read-only TestHarness             ✓
Catalog model                     ✓
Catalog manager / cache           ✓
Full 9,052-Pattern traversal      ✓
Cached Device/Zone/Design access  ✓
Cached Folder/Pattern access      ✓
Device Group normalization        NEXT
```

## Next session

Normalize Device Groups inside `GemstoneCatalogManager` from Homegroup/Device relationship data. Target: **Whole House** containing House Front and House Side, without inventing a separate cloud endpoint. After that: catalog refresh/invalidation behavior, lookup/index decisions, then FlowManager/dynamic Flow argument work.
