# Gemstone Lights Homey App --- Project Notes

**App ID:** `com.miguelcastro67.gemstonelights`\
**Checkpoint:** 2026-10-14 (end-of-session)

## Goal

Build a native Homey Pro integration for Gemstone Lights Hub2. Use the
Hub2 LAN API for normal runtime control where practical and Gemstone
Cloud for account/catalog metadata. Gemstone remains the editor for
physical setup, Zones, Patterns and Designs; Homey consumes those
objects for automation.

## Test installation

  Name          Local IP          Cloud ID         Pixels
  ------------- ----------------- ---------------- -----------------
  House Front   `192.168.1.233`   `h2-1094-t5k4`   `[160,100,0,0]`
  House Side    `192.168.1.118`   `h2-1075-2q9f`   `[89,0,0,0]`

Device Group **Whole House**: `g_c6c5c651-b9e1-49c3-ab7c-d416c795e318`,
containing both controllers.

## Local Hub2 API --- verified

-   `GET /device-state/hub-settings`
-   `GET /device-state/currently-playing`
-   `POST /device-control/play`
-   Power and brightness writes work locally.
-   Brightness preserves the currently running Pattern.
-   Direct solid-color playback is represented as `{ onState, color }`
    with no Pattern.
-   Pattern playback is represented under `currentlyPlaying.pattern`.
-   `CurrentlyPlaying.pattern` and `color` are therefore optional
    alternatives.
-   `refreshState()` updates Homey `dim` only when Pattern data is
    present.
-   Both Hub2 controllers operate independently.

### Local availability / polling behavior

The app now tracks repeated polling failures, can mark a Hub2
unavailable, and automatically restores availability after communication
resumes. House Front has intermittently refused TCP/HTTP connections
even while the Gemstone mobile/cloud path remained usable. Turning
**Allow Local Commands** OFF and back ON in the Gemstone app restored
the Hub2 local HTTP service without restarting the Homey app.

ICMP ping is not a valid Hub2 health check.

The polling interval is currently **60 seconds** for stability
observation. `GemstoneClient` contains a `fetchWithTimeout()` helper,
but the active local calls are presently using bare `fetch()` while the
Hub2 behavior is being isolated. Timeout/error hardening remains open.

An overnight stability run is starting from this checkpoint.

## Cloud authentication

AWS Cognito SRP authentication works using `amazon-cognito-identity-js`.
The login username is the Gemstone account email.

Temporary development credentials must never be committed. At this
checkpoint the temporary hardcoded credentials are being removed before
the overnight run/source-control work. Production credential entry,
secure persistence and Cognito session refresh remain to be implemented.

## Typed cloud client

Production methods currently include:

-   `getHomegroups()`
-   `getDevices(homegroupId)`
-   `getZones(deviceId)`
-   `getDesigns(deviceId)`
-   `getPatternFolders()`
-   `getPatterns(folderId)`

Verified list responses use an outer `{ data: ... }` envelope.

No dedicated Device Group endpoint has been established. Device Groups
are normalized from Homegroup `deviceGroupIds` and each Device's
`deviceGroups` map.

## Catalog / cache

`GemstoneCatalogManager` owns the cloud catalog. The app owns the cloud
client, catalog manager and `FlowManager`.

The catalog currently contains:

``` text
homegroups:   1
devices:      2
deviceGroups: 1
zones:        2
designs:      4
folders:      31
patterns:     295
```

### Important Pattern endpoint discovery

Earlier catalog loads reported 9,052 and later 9,145 Pattern entries.
Those counts were duplicates, not distinct Patterns.

`GET /folders/pattern/list?folderId=...` was experimentally shown to
return the **same global set of 295 Pattern records regardless of the
valid folder ID supplied**. Each Pattern's own `folderId` identifies its
actual folder.

The catalog now:

1.  Retrieves the 31 Pattern folders.
2.  Calls `getPatterns()` only once using one valid folder ID.
3.  Receives 295 Patterns.
4.  Distributes those Patterns locally by `pattern.folderId`.

This reduced the Pattern retrieval from 31 redundant requests to 1 and
corrected the catalog from 9,145 stored Pattern references to 295 real
records.

The `folderId` query parameter is still supplied because it has not been
proven optional.

### Downloaded Patterns / Halloween Classic

The API folder named **Downloaded Patterns** has folder ID:

`b55cb0ac-49d4-418c-8f56-742f41677b7d`

It currently contains **76 Patterns**. The Gemstone UI's **My
Downloads** presentation appears to correspond to this content, but that
UI/API naming relationship has not been directly proven.

`Halloween Classic` is one of the 76 downloaded Patterns.

Its cloud record contains both `patternData` and
`userModifiedPatternData`. The two differ materially:

-   `patternData.animation = "wave"`
-   `userModifiedPatternData.animation = "glitter"`

A read-only capture of the actual Hub2 `currentlyPlaying.pattern` while
Halloween Classic was selected in the Gemstone app showed:

-   name: `Halloween Classic`
-   animation: `glitter`
-   brightness: `127`
-   speed: `128`
-   direction: `0`
-   colors: `[13657986, 7744592, 283903, 655879, 1084925]`
-   extra parameter values: `0` and `60`
-   ID: `71b8eb9a-4a1b-4575-89b6-f206954755cb`
-   referencePatternId: `21cf401d-338b-423f-800c-8cae87e7bd46`

This proves Gemstone uses the downloaded Pattern's
**`userModifiedPatternData`** for this playback case, with a local Hub2
representation that also includes fields such as `direction` and
`referencePatternId` and strips descriptive names from
`extraParameters`.

The temporary `RAW CURRENTLY PLAYING` logger used for this discovery has
been removed.

## FlowManager

`src/managers/FlowManager.ts` exists and is initialized after the
catalog loads. It currently has no Flow cards.

`FlowManager` must consume the cached `GemstoneCatalogManager`; it
should not make direct cloud catalog calls.

The built-in Homey `onoff` capability already supplies normal power Flow
actions, so a redundant custom on/off card is unnecessary.

## Immediate next step

After reviewing the overnight stability run:

1.  Add the smallest temporary local `playPattern()` path.
2.  Construct a Hub2-compatible Pattern payload from the cached
    Halloween Classic record.
3.  Deliberately test against **House Front only**.
4.  Prove Homey can switch House Front to Halloween Classic.
5.  Remove/convert temporary test code into the permanent Pattern-play
    architecture.
6.  Only then build Pattern Flow cards around the proven mechanism.
