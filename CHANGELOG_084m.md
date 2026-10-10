# ПІСЛЯСВІТ 0.8.4m — Death Flare / Moving Shipwrecks

GDevelop source: `Spalakh_Prototype_084m.json`. Based on 0.8.4l.

## 1. Death / extinguishing effect
- Existing reset/checkpoint/death rules remain intact.
- Last pre-respawn position is captured for visual FX only.
- Golden-yellow procedural PIXI star flare becomes orange then red over 0.55s.
- Red ring expands and releases 52 red pixel shards.
- Shards are injected into the already-approved v084e red comet particle system, so gravity, bounces, resting and gradual disappearance reuse the same implementation.
- Moving deck surfaces are also valid particle landing surfaces.

## 2. Platforms
- Restore ALL four fixed raised platform decorations from original approved v084k wrappers: coral, algae, and harbor rubble.
- Shipwreck treatment applies ONLY to the two sensor-activated moving decks near the crab.
- Shipwrecks are watercolor-like, high-resolution programmatic canvas images: separate broken timbers, wet pigment blotches, oxidized metal plates, copper rivets and seaweed stains.
- Generated once and moved with the same existing colliders, no new textures or resized collision geometry.

## Safety / scope
- No browser/index.html modifications and no workflow or web deployment.
- No new scenes. No changes to the second room.
- All scene instances, object definitions, assets and collision dimensions identical to 0.8.4l.
- Valid JSON and JS syntax; visual and gameplay QA in GDevelop Preview is still needed.

Direct GDevelop editor:
https://editor.gdevelop.io/?project=https%3A%2F%2Fraw.githubusercontent.com%2Fmickalaykorolyov-bit%2Fpislyasvit-spalakh%2F7e9c898e41ec702e2e696caa29371d09adea9edf%2FSpalakh_Prototype_084m.json
