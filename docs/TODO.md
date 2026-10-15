# Gemstone Lights Homey App --- TODO

**Updated:** 2026-10-14 (end-of-session)

## Product direction

Gemstone remains the editor for Zones, Designs, Patterns and physical
setup. Homey retrieves/models those objects for automation, Flow
arguments, tags/tokens and actions.

## Completed / major milestones

### Local Hub2

-   [x] Verify Hub2 local HTTP API.
-   [x] Read Hub settings and current playback.
-   [x] Implement local power and brightness.
-   [x] Preserve running Pattern while adjusting brightness.
-   [x] Manual-IP pairing and local validation.
-   [x] Add `onoff` and `dim`.
-   [x] Pair/control House Front and House Side independently.
-   [x] Establish ICMP ping is not a valid health check.
-   [x] Model direct-color playback with optional Pattern.
-   [x] Prevent solid-color brightness polling crash.
-   [x] Track repeated polling failures.
-   [x] Mark unavailable after repeated failures.
-   [x] Automatically restore availability after successful
    communication.
-   [x] Prove Allow Local Commands OFF → ON can restore a failed Hub2
    local HTTP service without restarting Homey.
-   [x] Reduce polling to 60 seconds for stability testing.
-   [x] Capture local Pattern object shape.
-   [x] Capture local Halloween Classic playback representation.
-   [ ] Review current overnight stability run.
-   [ ] Finalize `fetchWithTimeout()` usage and local error policy.
-   [ ] Investigate delayed/error timestamp discrepancy.

### Cloud / catalog

-   [x] Cognito authentication.
-   [x] Typed Homegroups, Devices, Zones, Designs, Pattern Folders and
    Patterns.
-   [x] Verify `data` response envelope.
-   [x] Normalize Device Groups from Homegroup/Device relationships.
-   [x] Verify Whole House contains both controllers.
-   [x] Add Device Group cache accessors.
-   [x] Add catalog refresh with previous-catalog preservation on
    failure.
-   [x] App owns cloud client/catalog manager.
-   [x] TestHarness uses cached catalog instead of duplicate cloud
    traversal.
-   [x] Determine `/folders/pattern/list?folderId=...` returns the same
    global 295 records for tested folder IDs.
-   [x] Correct catalog Pattern loading from 31 redundant calls to 1
    call.
-   [x] Group the 295 returned Patterns locally by `pattern.folderId`.
-   [x] Verify corrected catalog: 31 folders / 295 Patterns.
-   [x] Verify Downloaded Patterns contains 76 Patterns.
-   [x] Find Halloween Classic in the cloud catalog.
-   [x] Verify Halloween Classic uses `userModifiedPatternData` when
    played through Gemstone.
-   [ ] Determine whether `folderId` query parameter can safely be
    omitted; do not assume.
-   [ ] Define exact user-facing catalog refresh trigger.
-   [ ] Add consistent cloud error handling.
-   [ ] Implement Cognito token/session lifecycle and refresh.

### FlowManager

-   [x] Create `FlowManager`.
-   [x] Initialize it after catalog load.
-   [x] Ensure it consumes `GemstoneCatalogManager`.
-   [ ] Implement first Gemstone-specific Flow cards after Pattern write
    is proven.
-   [ ] Use built-in Homey on/off cards instead of redundant custom
    power cards.
-   [ ] Dynamic Pattern/Folder selection.
-   [ ] Device Group actions where supported.
-   [ ] Zone/Design actions where supported.
-   [ ] Current playback tags/tokens where useful.

## NEXT --- Pattern playback write

-   [ ] Add a temporary/local `playPattern()` path to `GemstoneClient`.
-   [ ] Define an explicit cloud-Pattern → local-Hub2 Pattern
    conversion.
-   [ ] Prefer `userModifiedPatternData` where applicable based on
    observed Gemstone behavior.
-   [ ] Supply required local fields such as `direction` /
    `referencePatternId` appropriately.
-   [ ] Normalize `extraParameters` to the Hub2 value-only form where
    required.
-   [ ] Test **Halloween Classic on House Front only**.
-   [ ] Verify physical playback and subsequent `currentlyPlaying`.
-   [ ] Remove temporary test scaffolding.
-   [ ] Promote proven logic into production Pattern playback
    architecture.

## Authentication / security

-   [x] Remove temporary credentials before the overnight/source-control
    checkpoint.
-   [ ] Build Homey account/login setup UX.
-   [ ] Securely persist credentials/session data.
-   [ ] Ensure passwords/tokens can never be committed.

## Device identity / pairing

-   [ ] Decide whether Homey `data.id` should migrate from IP to stable
    Gemstone cloud ID.
-   [ ] Preserve LAN IP as connection metadata/settings.
-   [ ] Consider cloud-assisted pairing.
-   [ ] Preserve manual-IP pairing as fallback.
-   [ ] Consider automatic LAN discovery later.

## Open protocol/domain questions

-   [ ] Exact Zone `lights` encoding.
-   [ ] Full `folderId` / `referenceFolderId` / `referencePatternId`
    semantics.
-   [ ] Complete Animation vocabulary and parameter schemas.
-   [ ] Local Design/Zone playback payloads.
-   [ ] Device Group playback/control semantics.
-   [ ] Whether runtime overrides alter saved objects or current
    playback only.
-   [ ] Saved palette/favorite-color concept, if any.

## Release/documentation

-   [ ] Expand User Guide as real Flow cards/UI are implemented.
-   [ ] Add account/pairing instructions.
-   [ ] Add screenshots when UI stabilizes.
-   [ ] Add Flow-card reference/troubleshooting.
-   [ ] Resolve publish-level driver image validation requirements.
-   [ ] Update Homey CLI later, outside active debugging.
-   [ ] Final README/App Store/certification work.
