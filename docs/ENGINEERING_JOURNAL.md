# Gemstone Lights Homey App --- Engineering Journal

## Through 2026-10-06

## Foundation

Established a native Homey Pro app for two Gemstone Hub2 controllers.
Verified local Hub2 settings/current-playback reads and local
power/brightness writes. Added manual-IP pairing, `onoff`, `dim`, and
10-second polling. Verified independent control of House Front and House
Side.

Hub2 ICMP ping is unreliable. Local HTTP/API success, not ping, must
determine connectivity. House Front once lost local HTTP while
cloud/mobile control remained functional; toggling Allow Local Commands
restored it.

## Cloud authentication

Installed `amazon-cognito-identity-js` and successfully authenticated to
Gemstone Cognito via SRP. Confirmed login username is the account email,
not the six-digit Gemstone number. PowerShell environment variables do
not propagate into `homey app run --remote`; temporary hardcoding was
used only for diagnostics.

## Homegroup / Devices / Group

Retrieved `Miguel’s Homegroup` and both devices:

``` text
h2-1094-t5k4 → House Front → 192.168.1.233
h2-1075-2q9f → House Side  → 192.168.1.118
```

Confirmed **Whole House** is a real API Device Group containing both.

## Zones

Retrieved House Front Zones: - House Front:
`12af45b9-e6b1-4947-aaf9-f7db770bb331` - Right Side:
`95f7c9b9-52e0-4610-8ec0-245b61356b6e`

Zone `lights` encoding remains unresolved.

## Designs

Retrieved `My Design 1`, `test`, and `test 1`. Proved Designs can
contain both `zonePatterns[]` and `staticColors[]`. `My Design 1` links
Right Side to `Aston Martin`. `test 1` links House Front to
`Cursed Cauldron` and also contains static colors.

`Cursed Cauldron` demonstrated animation-specific parameters for
`pyramid_chase`.

## Pattern folders / Patterns

`/folders/list` returned Pattern folders with `folderId`,
`referenceFolderId`, Gemstone-managed flag and presentation metadata.
Exact ID relationship remains unproven.

`/folders/pattern/list?folderId=...` returned full Pattern records. Live
examples included `Dark lab`, `Blue land`, `Fire and Ice`.

## Animations

User clarified the Gemstone domain rule: Animations are a single
Gemstone-defined, non-user-editable list. Patterns select an animation;
users do not create animation styles. Live data has shown `motionless`,
`multipulse`, `pyramid_chase`, `chase`, `marquee`.

A diagnostic `/animations/list` probe returned 403/API-Gateway
authorization-format error. This does not establish that such a route
exists.

## Colors

Colors are numeric RGBW values used in Pattern palettes, Design static
colors, and direct playback. No separate saved color catalog is
established.

Cloud direct-color playback on House Front returned `200 Successful`, a
transaction ID, and physically changed the lights: end-to-end control
confirmed.

A subsequent TestHarness local `getCurrentlyPlaying()` appeared to wait.
The same local endpoint later responded normally in a browser. Because
the lights had already been restored to Pumpkin Patch before the browser
request, the test does not establish how direct color appears in
`currentlyPlaying`. Investigate the Node/local fetch wait separately.

## Checkpoint

``` text
Local Hub2 API       ✓
Power / brightness   ✓
Independent Hub2s    ✓
Cloud authentication ✓
Homegroups           ✓
Devices              ✓
Device Groups        ✓
Zones                ✓
Designs              ✓
Pattern folders      ✓
Patterns             ✓
Animation concept    ✓
Color representation ✓
Cloud direct color   ✓
```

Next phase: stop raw API archaeology and convert the verified structures
into typed production models/client methods, caching, FlowManager, and
user-facing Homey behavior.
