# Gemstone Lights Homey App --- TODO

**Updated:** 2026-10-06 (end-of-session)

## Product Direction

The Homey app will **not** create or edit Gemstone Zones, Designs, Patterns, or Animations. Those remain owned and configured by the Gemstone app. Homey retrieves/models them for Flow arguments, tokens/tags, conditions, and automation actions.

## Completed / Major Milestones

### Local Hub2 Foundation

- [x] Verify Hub2 local HTTP API, settings and current playback.
- [x] Implement local power and brightness control.
- [x] Preserve running Pattern while adjusting brightness.
- [x] Manual-IP pairing and local validation.
- [x] Add `onoff` and `dim` capabilities.
- [x] Add 10-second external-state polling.
- [x] Pair/control House Front and House Side independently.
- [x] Establish ICMP ping is not a valid health check.
- [x] Capture direct solid-color state `{ onState, color }` with no Pattern.
- [x] Make local Pattern optional and fix solid-color brightness crash.
- [x] Confirm polling loop survives an isolated local HTTP 500.

### Gemstone Cloud / Account Discovery

- [x] Cognito authentication on Homey Pro.
- [x] Confirm login uses account email.
- [x] Retrieve Homegroups and cloud Devices.
- [x] Map cloud IDs to `device.hub.localIp`.
- [x] Confirm Whole House relationship contains both controllers.
- [x] Establish no dedicated Device Group endpoint was actually verified.
- [x] Retrieve Zones, Designs, Pattern Folders and Patterns.
- [x] Verify Design Zone/Pattern and static-color structures.
- [x] Verify Pattern animation/colors/brightness/speed/direction/extra parameters where applicable.
- [x] Verify list-response `data` envelopes.

### Production Cloud Models

- [x] Expand `GemstoneCloudModels.ts` from live payloads.
- [x] Homegroup model.
- [x] Cloud Device + nested Hub/Network metadata.
- [x] Device Group reference model.
- [x] Zone model.
- [x] Pattern Folder model; `hidden` optional based on live evidence.
- [x] Pattern outer record and Pattern data models.
- [x] Design / ZonePattern / StaticColor models.
- [x] Animation extra-parameter models.
- [x] Common API response envelope model.

### Production Cloud Client

- [x] Update `IGemstoneCloudClient`.
- [x] Typed `getHomegroups()`.
- [x] Typed `getDevices(homegroupId)`.
- [x] Typed `getZones(deviceId)`.
- [x] Typed `getDesigns(deviceId)`.
- [x] Typed `getPatternFolders()`.
- [x] Typed `getPatterns(folderId)`.
- [x] Unwrap verified `data` envelopes.
- [x] Remove unsupported/invented `getDeviceGroups()` method.
- [x] Clean TestHarness to typed read-only diagnostics.
- [ ] Decide whether legacy raw diagnostic methods should remain or be removed later.
- [ ] Decide direct cloud color playback vs preferred local equivalent.
- [ ] Add consistent cloud error handling.
- [ ] Implement Cognito token/session lifecycle and refresh.

### Catalog / Cache

- [x] Add `GemstoneCatalogModels.ts`.
- [x] Add `GemstoneCatalogManager.ts`.
- [x] Implement full `load()` traversal and cache.
- [x] Add `getCatalog()` / `isLoaded()`.
- [x] Add cached Device/Zone/Design accessors.
- [x] Add cached Folder/Pattern accessors.
- [x] Verify complete live catalog load.
- [x] Verify snapshot: 1 Homegroup, 2 Devices, 2 Zones, 4 Designs, 31 Folders, 9,052 Patterns.
- [x] Keep initial traversal sequential for predictable diagnostics.
- [ ] **NEXT: Add normalized `GemstoneCatalogDeviceGroup` model.**
- [ ] **NEXT: Build Device Groups from Homegroup `deviceGroupIds` + Device `deviceGroups`.**
- [ ] **NEXT: Verify normalized Whole House contains House Front and House Side.**
- [ ] Add Device Group cache accessors.
- [ ] Define catalog refresh/invalidation behavior.
- [ ] Decide behavior when cloud metadata is temporarily unavailable.
- [ ] Determine whether/where lookup Maps or global-ID indexes are justified.
- [ ] Consider parallelizing independent catalog requests after correctness is established.
- [ ] Reconcile IP changes against stable cloud IDs.

### Authentication / Security

- [ ] Remove all temporary hardcoded Gemstone credentials.
- [ ] Design Homey account/login settings experience.
- [ ] Implement secure credential/session storage.
- [ ] Ensure passwords/tokens can never be committed.

### Local Client / Robustness

- [x] Determine local direct-color `currentlyPlaying` representation.
- [x] Fix solid-color `pattern.brightness` crash.
- [x] Verify isolated local HTTP 500 does not terminate polling.
- [ ] Add explicit local request timeout / `AbortController` handling.
- [ ] Track consecutive polling failures.
- [ ] Avoid noisy logs for isolated transient failures.
- [ ] Mark unavailable only after an appropriate failure threshold.
- [ ] Automatically restore availability after successful communication.
- [ ] Investigate local Pattern selection/playback payloads.
- [ ] Investigate local Design/Zone playback payloads.
- [ ] Investigate direct local color playback if useful.

### Device Identity / Pairing

- [ ] Decide whether Homey `data.id` should migrate from IP to stable Gemstone cloud ID.
- [ ] Preserve LAN IP as connection metadata/settings.
- [ ] Consider cloud-assisted pairing after account authentication.
- [ ] Preserve manual-IP pairing as fallback.
- [ ] Consider automatic LAN discovery later.

## FlowManager / Potential Flow Cards

- [ ] Build `FlowManager` against `GemstoneCatalogManager`, not direct cloud calls.
- [ ] Populate Device Group choices from normalized catalog groups.
- [ ] Populate Zone choices based on selected Device.
- [ ] Populate Pattern Folder choices from cached catalog.
- [ ] Populate Pattern choices from selected Folder rather than a flat 9,052-item permanent list.
- [ ] Populate Design choices based on selected Device.
- [ ] Ensure users never enter Gemstone UUIDs manually.
- [ ] Device power/brightness/color/Pattern actions.
- [ ] Device Group power/brightness/color/Pattern actions where supported.
- [ ] Zone → Pattern / Color actions where supported.
- [ ] Play saved Design.
- [ ] Runtime speed/direction/brightness actions where supported.
- [ ] WHEN/AND cards for power, brightness, Pattern, Design, speed, direction, availability as detectable.

## Metadata, Tags and Flow Tokens

- [ ] Design tag/token strategy.
- [ ] Expose useful Device, Group, Zone, Pattern and Design metadata.
- [ ] Expose current Pattern/playback information.
- [ ] Avoid flooding Homey with permanent tags for the 9,052-Pattern catalog.

## Open Protocol / Domain Questions

- [ ] Exact Zone `lights` encoding.
- [ ] `folderId` vs `referenceFolderId` relationship.
- [ ] Whether Pattern folders nest.
- [ ] Whether Patterns can exist outside folders.
- [ ] Complete authoritative Animation vocabulary and parameter schemas.
- [ ] Saved palette/favorite-color concept, if any.
- [ ] Device Group playback/control semantics.
- [ ] Which Pattern/Design operations can be local-only.
- [ ] Whether runtime overrides modify saved Designs or only current playback.

## User Documentation / Release Work

- [ ] Expand `USER_DOCS.md` as actual Homey UI/Flow cards are implemented.
- [ ] Add pairing/account setup instructions.
- [ ] Add screenshots when UI stabilizes.
- [ ] Add final Flow-card reference and troubleshooting.
- [ ] Add README/App Store documentation and certification assets.
