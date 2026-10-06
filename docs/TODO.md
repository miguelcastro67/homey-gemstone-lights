# Gemstone Lights Homey App --- TODO

**Updated:** 2026-10-06

## Product Direction

The Homey app will **not** create or edit Gemstone Zones, Designs,
Patterns, or Animations. Those remain owned and configured by the
Gemstone app.

Homey should, however, retrieve and model as much of that configuration
as practical so it can be exposed through **Flow arguments, tokens/tags,
conditions, and automation actions**.

Primary goals:

-   Make existing Gemstone metadata useful inside Homey Flows.
-   Expose useful current/catalog information as Homey tags/tokens where
    appropriate.
-   Allow Flows to apply a Pattern or Color to a Device, Zone/Design
    target where supported, or Device Group.
-   Allow Flows to play existing Designs.
-   Keep all user-facing choices based on friendly Gemstone names rather
    than UUIDs.

------------------------------------------------------------------------

## Completed / Major Milestones

### Local Hub2 Foundation

-   [x] Identify and verify Hub2 local HTTP API.
-   [x] Read Hub settings.
-   [x] Read current Pattern/playback state.
-   [x] Implement local power control.
-   [x] Implement local brightness control.
-   [x] Preserve the running Pattern while adjusting brightness.
-   [x] Pair Hub2 through a custom manual-IP Homey pairing view.
-   [x] Validate a Hub2 during pairing through the local API.
-   [x] Add Homey `onoff` capability.
-   [x] Add Homey `dim` capability.
-   [x] Add 10-second external-state polling.
-   [x] Pair and independently control both House Front and House Side.
-   [x] Establish that ICMP ping is not a valid Hub2 health check.
-   [x] Confirm Allow Local Commands OFF → ON can restore a stalled Hub2
    local HTTP service.

### Gemstone Cloud / Account Discovery

-   [x] Identify Gemstone AWS Cognito configuration.
-   [x] Install and prove `amazon-cognito-identity-js` authentication on
    Homey Pro.
-   [x] Confirm Cognito login uses the Gemstone account email.
-   [x] Retrieve Homegroups.
-   [x] Retrieve cloud Devices.
-   [x] Map stable Gemstone cloud device IDs to Hub2 local IP addresses.
-   [x] Confirm Device Groups are real API objects.
-   [x] Confirm `Whole House` contains House Front and House Side.
-   [x] Retrieve Zones for a Device.
-   [x] Retrieve Designs for a Device.
-   [x] Confirm Design `zonePatterns[]` maps Zone IDs to Patterns.
-   [x] Confirm Designs can contain `staticColors[]`.
-   [x] Retrieve Pattern folders.
-   [x] Retrieve full Patterns from a Pattern folder.
-   [x] Confirm Patterns contain animation, colors, brightness, speed
    and direction.
-   [x] Confirm some Patterns contain animation-specific extra
    parameters.

### Animations / Colors

-   [x] Establish that Animations are Gemstone-defined and not
    user-created.
-   [x] Establish that Patterns select/reference an Animation.
-   [x] Observe multiple real Animation values in live Gemstone data.
-   [x] Confirm Colors are represented as numeric RGBW values in Pattern
    palettes.
-   [x] Confirm Designs can assign static Colors to selected lights.
-   [x] Verify direct cloud color playback end-to-end on a physical
    Hub2.
-   [x] Confirm direct color API returned success and physically changed
    the lights.
-   [x] Determine that no separate saved Color catalog has yet been
    established.
-   [x] Record `/animations/list` probe result without assuming the
    endpoint exists.

### Documentation

-   [x] Update `PROJECT_NOTES.md` through the 2026-10-06 checkpoint.
-   [x] Update `ARCHITECTURE.md`.
-   [x] Update `ENGINEERING_JOURNAL.md`.
-   [x] Create initial `USER_DOCS.md`.
-   [x] Document Device / Device Group / Zone / Pattern / Animation /
    Color / Design relationships.

------------------------------------------------------------------------

## Next Development Phase

### Production Cloud Models

-   [ ] Expand `GemstoneCloudModels.ts` from the real API payloads.
-   [ ] Add `GemstoneHomegroup`.
-   [ ] Complete `GemstoneCloudDevice`.
-   [ ] Add `GemstoneDeviceGroup`.
-   [ ] Complete `GemstoneCloudZone`.
-   [ ] Add `GemstonePatternFolder`.
-   [ ] Complete `GemstoneCloudPattern`.
-   [ ] Add `GemstonePatternData`.
-   [ ] Complete `GemstoneCloudDesign`.
-   [ ] Add `GemstoneZonePattern`.
-   [ ] Add `GemstoneStaticColor`.
-   [ ] Add animation extra-parameter models.
-   [ ] Add common paginated Gemstone API response models.

### Production Cloud Client

-   [ ] Replace raw diagnostic methods with typed production methods.
-   [ ] Update `IGemstoneCloudClient`.
-   [ ] Implement typed `getHomegroups()`.
-   [ ] Implement typed Device retrieval.
-   [ ] Implement Device Group retrieval/modeling.
-   [ ] Implement typed `getZones(deviceId)`.
-   [ ] Implement typed `getDesigns(deviceId)`.
-   [ ] Implement typed `getPatternFolders()`.
-   [ ] Implement typed `getPatterns(folderId)`.
-   [ ] Decide whether direct cloud color playback belongs in the
    production client or whether a local equivalent should be preferred.
-   [ ] Add consistent cloud error handling.
-   [ ] Implement Cognito token/session lifecycle and refresh behavior.

### Metadata, Tags and Flow Tokens

-   [ ] Design a Homey tag/token strategy for Gemstone metadata
    retrieved from the account.
-   [ ] Expose useful Device information as tags/tokens.
-   [ ] Expose useful Device Group information as tags/tokens.
-   [ ] Expose Zone names/IDs and useful Zone metadata as tags/tokens
    where practical.
-   [ ] Expose Pattern names/IDs and useful Pattern properties as
    tags/tokens.
-   [ ] Expose Design names/IDs and useful Design composition
    information as tags/tokens.
-   [ ] Expose current Pattern/playback information as tags/tokens.
-   [ ] Determine whether current Design can be reliably identified and
    exposed.
-   [ ] Determine which Pattern properties are useful in Flows:
    animation, colors, brightness, speed, direction, extra parameters.
-   [ ] Avoid flooding Homey with unnecessary permanent tags; determine
    whether dynamic Flow tokens are preferable for large catalogs.
-   [ ] Keep all IDs available internally while presenting friendly
    Gemstone names to users.

### Authentication / Security

-   [ ] Remove all temporary hardcoded Gemstone credentials.
-   [ ] Design the Homey account/login settings experience.
-   [ ] Implement secure credential/session storage.
-   [ ] Ensure passwords and tokens can never be committed to source
    control.
-   [ ] Confirm Git repository setup before committing diagnostic code.

### Local Client / Robustness

-   [ ] Investigate why the TestHarness local `getCurrentlyPlaying()`
    call waited after direct cloud color playback while the same URL
    remained reachable in a browser.
-   [ ] Add explicit local request timeout / `AbortController` handling.
-   [ ] Track consecutive polling failures.
-   [ ] Avoid noisy logs for isolated transient failures.
-   [ ] Mark a device unavailable only after an appropriate failure
    threshold.
-   [ ] Automatically restore availability after successful
    communication.
-   [ ] Investigate local Pattern selection/playback payloads.
-   [ ] Investigate local Design/Zone playback payloads.
-   [ ] Investigate direct local color playback if useful.
-   [ ] Determine what local `currentlyPlaying` reports while
    direct-color playback is actually active.

### Device Identity / Pairing

-   [ ] Decide whether Homey `data.id` should migrate from IP address to
    stable Gemstone cloud device ID.
-   [ ] Preserve LAN IP as connection metadata/settings.
-   [ ] Consider cloud-assisted pairing after account authentication.
-   [ ] Preserve manual-IP pairing as a fallback if useful.
-   [ ] Consider automatic LAN discovery later.

### Catalog / Cache

-   [ ] Design a local cache for Homegroups, Devices, Groups, Zones,
    folders, Patterns and Designs.
-   [ ] Define catalog refresh/invalidation behavior.
-   [ ] Decide how Homey behaves when cloud metadata is temporarily
    unavailable.
-   [ ] Determine how IP-address changes are reconciled against stable
    cloud IDs.

------------------------------------------------------------------------

## FlowManager / Potential Flow Cards

The exact card set can change as the control APIs are completed, but it
is **not premature** to maintain a candidate list. It gives the
implementation a target and helps determine what metadata/tokens must be
available.

### THEN --- Action Cards

#### Device / Device Group

-   [ ] Turn Device on.
-   [ ] Turn Device off.
-   [ ] Set Device brightness.
-   [ ] Adjust Device brightness by percentage.
-   [ ] Set Device to a solid Color.
-   [ ] Set Device to an existing Pattern.
-   [ ] Play an existing Design on its Device.
-   [ ] Set Device Group to a solid Color.
-   [ ] Set Device Group to an existing Pattern.
-   [ ] Turn Device Group on/off.
-   [ ] Set Device Group brightness, if supported cleanly by Gemstone.

#### Zone / Design

-   [ ] Set a Zone to an existing Pattern.
-   [ ] Set a Zone to a solid Color, if the API/control model supports
    it.
-   [ ] Apply/change a Pattern assignment used by a Design, if Gemstone
    supports runtime Design composition without modifying the saved
    Design.
-   [ ] Apply/change a Color assignment used by a Design, if Gemstone
    supports runtime Design composition without modifying the saved
    Design.
-   [ ] Play an existing saved Design.
-   [ ] Set Design/global brightness where supported.

#### Pattern Runtime Controls

-   [ ] Set playback speed.
-   [ ] Increase/decrease playback speed.
-   [ ] Set direction.
-   [ ] Set brightness while preserving the current Pattern.
-   [ ] Consider animation-specific runtime parameters only if the
    protocol safely supports them.

### WHEN --- Trigger Cards

-   [ ] Device turned on.
-   [ ] Device turned off.
-   [ ] Brightness changed.
-   [ ] Current Pattern changed.
-   [ ] Current Design changed, if reliably detectable.
-   [ ] Playback speed changed, if reliably detectable.
-   [ ] Playback direction changed, if reliably detectable.
-   [ ] Device becomes unavailable.
-   [ ] Device becomes available again.

### AND --- Condition Cards

-   [ ] Device is on/off.
-   [ ] Brightness equals / less than / greater than value.
-   [ ] Current Pattern is selected Pattern.
-   [ ] Current Design is selected Design, if reliably detectable.
-   [ ] Current animation equals selected animation.
-   [ ] Playback speed equals / less than / greater than value.
-   [ ] Direction equals selected direction.
-   [ ] Device is available/unavailable.

### Flow Card UX / Dynamic Arguments

-   [ ] Populate Device Group choices from retrieved Gemstone Device
    Groups.
-   [ ] Populate Zone choices based on the selected Device.
-   [ ] Populate Pattern choices from retrieved Pattern folders/catalog.
-   [ ] Populate Design choices based on the selected Device.
-   [ ] Decide whether Pattern folders should appear as an intermediate
    selector or be flattened/searchable.
-   [ ] Support Homey variable tags in numeric/text inputs where useful,
    following the Modern Forms app approach.
-   [ ] Return useful result tokens from action cards where Homey
    supports them.
-   [ ] Ensure Flow cards never require the user to enter Gemstone UUIDs
    manually.

------------------------------------------------------------------------

## Open Protocol / Domain Questions

-   [ ] Determine the exact meaning/encoding of Zone `lights`.
-   [ ] Determine the relationship between `folderId` and
    `referenceFolderId`.
-   [ ] Determine whether Pattern folders actually nest.
-   [ ] Determine whether Patterns can exist outside folders.
-   [ ] Determine the complete authoritative Animation vocabulary.
-   [ ] Determine schemas/ranges for animation-specific extra
    parameters.
-   [ ] Determine whether Gemstone has any saved palette/favorite-color
    concept beyond raw RGBW values.
-   [ ] Determine Device Group playback/control API semantics.
-   [ ] Determine which Pattern/Design operations can be performed
    entirely through the local Hub2 API.
-   [ ] Determine whether a runtime Pattern/Color override of part of a
    Design changes the saved Design or only the current playback state.
    **The Homey app should avoid modifying saved Gemstone Designs unless
    explicitly designed to do so.**

------------------------------------------------------------------------

## User Documentation / Release Work

-   [ ] Expand `USER_DOCS.md` as actual Homey UI and Flow cards are
    implemented.
-   [ ] Explain that Zones, Patterns and Designs are created/maintained
    in Gemstone, not Homey.
-   [ ] Document how Gemstone metadata is exposed to Homey Flows/tags.
-   [ ] Document Device vs Zone vs Pattern vs Design vs Device Group
    targeting.
-   [ ] Add pairing/account setup instructions.
-   [ ] Add screenshots when UI stabilizes.
-   [ ] Add final Flow-card reference.
-   [ ] Add troubleshooting section.
-   [ ] Add README/App Store documentation.
-   [ ] Prepare App Store assets and certification material when
    implementation is feature-complete.
