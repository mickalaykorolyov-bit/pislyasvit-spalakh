# ПІСЛЯСВІТ — 0.8.4k Visual Polish

Baseline: Spalakh_Prototype_084j.json
Output: Spalakh_Prototype_084k.json
Scene updated: UnderwaterHarbor only.

## Visual art
- All eight physics platforms, instances, coordinates and asset resources are unchanged.
- Four existing decorative asset classes (DecorPierLarge, DecorPierRuins, DecorStoneA, DecorStoneB) are displayed using aspect-correct source-texture left/right endcaps and a tiled middle, instead of stretched sprites. Fallback leaves old art visible if Pixi resource cropping is unsupported.
- Parallax grade: #061724, 18% opacity behind gameplay layers.
- Existing fog opacity changed from 14/255 to 31/255.
- A soft camera-following background-only vignette adds edge drama.

## Removed first-room experiments
- Sweeping harbor spotlight graphics removed.
- Spotlight exposure forced to zero; no hidden spotlight enemy detection remains.
- Second relay at (1980,507) activation/rendering removed.
- The primary sensor now independently controls the gate, moving bridge, checkpoint and level completion.
- HUD and hints no longer direct players to the discarded relay/spotlights.

## Preservation and verification
- 0.8.4j remains unchanged.
- All scene instances, coordinates, dimensions and resources unchanged.
- Entire Depth_07_Blockout second scene unchanged.
- Updated first-room JS passed syntax validation; project JSON parsed successfully.
- Runtime gameplay/visual QA in a GDevelop preview is still required; this is a source project update, not a published browser build.
