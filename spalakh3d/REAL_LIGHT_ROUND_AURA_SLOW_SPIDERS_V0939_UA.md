# v0.9.39 — Real Light Only / Round Aura / Slow Black Spiders

Base: GDevelop 5 project v0.9.38, branch `spalakh-25d-real-light-depth-v0938`.
New branch: `spalakh-25d-clean-sprite-physical-light-v0939`.
Scene: `Observatory3D_FalseLight`. No standalone web game.

## 1. No simulated blue projector beams
- The three procedural translucent beam meshes are explicitly invisible (`mesh.visible=false`), their shader alpha is 0, and all three legacy `ObsLightCone` objects are hidden, including fallback.
- Retained real `THREE.SpotLight` for each spotlight, aimed at platform impacts with light factors 0.80, 0.55 and 0.90.
- Retained native `ObsSpotlightImpactLight` PointLight3D and the world-space soft circular impact discs.
- Note that ordinary real 3D light is **not volumetrically visible in empty water/air**; it illuminates lit GLB materials. Circular shader disks allow a visible highlight where surfaces use unlit `MeshBasicMaterial` (an artistic approximation, not ray-traced optics).
- No change to `s.modes`, refractor logic, stealth safe zones, or light bridge.

## 2. Square / matte around the player
- After v0.9.38's `depthWrite=false` change, the square remained in actual user video.
- v0.9.39 therefore hides the OLD oversized double-sided cube-based `SpalakhAura` (350x250), which is a potential independent rectangle source that earlier patches did not remove.
- A new generated 128x128 RGBA radial CanvasTexture on `THREE.Sprite` replaces it, with 100% transparent edges, `depthWrite=false`, and a restrained glow around the hero.
- Original animation sprites and speed-responsive flame trail are preserved.
- This is a code-grounded fix of a likely culprit; actual Preview is necessary to determine whether any other rectangle remains.

## 3. Slower spider leg gait
- `baseHz` changed from `1.15 + 0.13*spiderIndex + 0.36*travel` to `0.60 + 0.045*spiderIndex + 0.14*travel`.
- All eight independent leg phases, leg lift and joint groups remain, and the three black spiders retain their individual phase offsets.
- No edits to their patrol routes, visible GLB, visual foot anchoring, collision, or detection.

## Integrity and test plan
- Source GDevelop JSON, JS syntax, objects, instances, resources and all non-JS events checked.
- Test in GDevelop Preview: run/stand/jump/fall near left panel, close & wide camera; verify no rectangular matte behind the sprite and nice circular glow; test all A/B/C beam modes and confirm only pool highlights are visible; observe the 3 spider leg motions for 10 seconds.
- Actual GDevelop Preview has NOT been executed from this session.
