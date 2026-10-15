# Gemstone Lights Homey App --- Engineering Journal

## Through 2026-10-14

## Catalog and Device Group progress

The catalog layer now normalizes Device Groups from Homegroup/Device
relationship data. **Whole House** is verified as containing both House
Front and House Side. Cross-validation warns if a group is referenced
only by a Homegroup or only by a Device.

`GemstoneCatalogManager.refresh()` was added with defensive behavior:
the previous catalog remains available if rebuilding fails. The app owns
the cloud client, catalog manager and `FlowManager`; the test harness
consumes the catalog rather than performing its own redundant cloud
traversal.

`FlowManager` now exists and initializes after the catalog is loaded. No
Gemstone-specific Flow cards have been implemented yet.

## Local Hub2 resilience investigation

The local device polling logic was hardened to track consecutive
failures, mark a Hub2 unavailable after repeated failures, and restore
availability automatically after successful communication resumes.

House Front repeatedly demonstrated a Hub-side/local-service failure
mode:

-   Gemstone mobile/cloud control could remain functional.
-   Browser access to the Hub2 local HTTP endpoint could return
    connection refused.
-   Turning **Allow Local Commands** OFF and back ON in the Gemstone app
    restored the local HTTP service.
-   The already-running Homey app subsequently recovered and marked the
    device available again without an app restart.

This strongly separates the observed failure from a Homey-only polling
problem.

Polling was reduced from 10 seconds to 60 seconds as a stability
experiment. The failure still occurred after an extended run, so request
frequency alone did not eliminate it.

A 5-second `fetchWithTimeout()` helper exists in `GemstoneClient`, but
active local requests are temporarily using bare `fetch()` while the Hub
behavior is isolated. Final timeout/error handling remains open.

## Pattern catalog investigation

The catalog previously reported thousands of Patterns:

``` text
9052
then
9145
```

Investigation showed those were duplicates.

The endpoint:

``` text
GET /folders/pattern/list?folderId=...
```

returned **295 records** for both the `Halloween` and
`Downloaded Patterns` folder IDs. The returned Pattern IDs were
identical.

Further analysis showed the 295 records contain 31 distinct `folderId`
values, matching the 31 folders from `/folders/list`. Pattern
distribution by `folderId` produced real per-folder counts, including:

``` text
Downloaded Patterns: 76
```

The catalog implementation was corrected to:

1.  retrieve folders once;
2.  call `getPatterns()` once with one valid folder ID;
3.  receive 295 global Pattern records;
4.  filter/group those records locally by each Pattern's `folderId`.

Verified corrected catalog:

``` text
homegroups:   1
devices:      2
deviceGroups: 1
zones:        2
designs:      4
folders:      31
patterns:     295
```

This eliminated 30 redundant Pattern requests and the 31× duplicate
storage.

The `folderId` query parameter is still sent because its optionality has
not been proven.

## Halloween Classic discovery

The Gemstone UI presents `Halloween Classic` under **My Downloads**. The
API catalog contains it under **Downloaded Patterns**, folder ID:

``` text
b55cb0ac-49d4-418c-8f56-742f41677b7d
```

`Halloween Classic` was found in the global 295-Pattern response after
correcting an earlier diagnostic mistake: Pattern names are nested under
`patternData.name`, not on the outer wrapper.

Its cloud record contains both original and user-modified Pattern
representations.

Original `patternData` includes:

``` text
animation: wave
brightness: 127
speed: 128
direction: 0
extra parameters: Length=20, Tail Brightness=70
```

`userModifiedPatternData` includes:

``` text
animation: glitter
brightness: 127
speed: 128
extra parameters: Reverse Fade=0, Active Light %=60
```

## Local playback capture

A temporary read-only `RAW CURRENTLY PLAYING` logger was added to
`device.ts`.

First, a known working Pattern (`Pumpkin Patch 2`) confirmed the Hub2
local Pattern object shape.

Then House Front was changed to **Halloween Classic** using the official
Gemstone app. The next Homey poll captured:

``` text
name: Halloween Classic
animation: glitter
id: 71b8eb9a-4a1b-4575-89b6-f206954755cb
referencePatternId: 21cf401d-338b-423f-800c-8cae87e7bd46
backgroundColor: 0
brightness: 127
speed: 128
direction: 0
colors: [13657986, 7744592, 283903, 655879, 1084925]
extraParameters values: 0, 60
version: 0
```

This proves that, for this downloaded Pattern, Gemstone plays the
**user-modified representation**, not the original `patternData`.

The Hub2 representation is not identical to the cloud object: it
includes `direction` and `referencePatternId`, and its `extraParameters`
contain values without the cloud-side descriptive names.

The temporary raw logger was removed after capture.

## End-of-session checkpoint

``` text
Local Hub2 reads/writes                    ✓
Power / brightness                         ✓
Two independent Hub2 devices               ✓
Availability failure threshold/recovery     ✓
Cloud authentication                       ✓
Typed cloud models/client                   ✓
Catalog manager/cache                       ✓
Normalized Whole House Device Group         ✓
Catalog refresh behavior                    ✓
FlowManager skeleton initialized            ✓
Pattern endpoint global-result behavior     ✓
31 folders / 295 real Patterns              ✓
Downloaded Patterns = 76                    ✓
Halloween Classic found                     ✓
Cloud userModifiedPatternData behavior       ✓
Local Halloween Classic shape captured       ✓
Homey-originated Pattern playback            NEXT
```

## Next session

1.  Review the overnight stability run before restarting or changing
    anything.
2.  Add the smallest temporary `playPattern()` method/path.
3.  Build a Hub2-compatible local Pattern from cached Halloween Classic
    data.
4.  Deliberately target **House Front only**.
5.  Verify the physical lights switch to Halloween Classic.
6.  Convert the proven test into permanent Pattern-play architecture.
7.  Begin Gemstone-specific Flow actions only after the write path is
    proven.
