# v0.9.38 — True lights / alpha occlusion / black spider feet
Base: v0.9.37 branch `spalakh-25d-black-spider-v0937`. Native GDevelop project ONLY. No separate browser-game build.

## 1. Lens alignment and real illumination
- Lens finder reattempts sampling until GLB lens mesh is available; no wrong .636/.598/.718 fallback amplification.
- Volumetric shaft's Y is the measured lens Y, not a hard clamp to -190..-120.
- Shader begins nearly at the lens (head=.73 + .27 smoothstep over first 4%).
- Each of three beams now owns an actual `THREE.SpotLight`, with individual intensity factors 0.80 / 0.55 / 0.90, pointed at the intended platform impact.
- Real SpotLights illuminate lit GLB / Standard materials, but **do not create rendered fog shafts**. Those remain a transparent water-scattering mesh.
- Surface light contact: world-space X/Y radial transparent shader disk (not a rectangular gradient), sitting at floor Z +3.2. It supplements light on any unlit/Basic stone surfaces; native PointLight3D remains active near contact.
- No impact over a gap: spot/disk hidden. Native `ObsSpotlightFootprint` remains a fallback if custom Three.js scene is unavailable.
- No shadow casting on SpotLights, so reflections/shadows are not full ray-traced physics.

## 2. Square mask around Spalakh
- Every visible sprite face is configured transparent, `depthWrite=false`, `depthTest=true`, with minimal alphaTest=.035 and `renderOrder=51`.
- Same correction for `SpalakhAura` (alphaTest .025, renderOrder 49).
- Flames stay at their old order 40–43; platforms can still occlude all effects based on their actual depth. Gameplay sprite frames and dimensions unchanged.

## 3. Spiders floating or sinking through the floor
- After the articulated GLB is actually loaded and its eight leg pivots are present, align the new model's lowest world-space Z bound to physical main-floor top Z+5.
- Adjust the model visual transform only, once per GLB root instance. Existing patrol path and independent leg animation untouched.

## Scope and verification
Project JSON, resources, object definitions, instances, game/scene variables and all non-JavaScript events unchanged compared to v0.9.37. Only main visual JavaScript event and project metadata edited.
Static JSON and JavaScript syntax verified. Real GDevelop Preview **not** executed; test beam aim in all three optical modes, bright circular patches on lit GLBs and sprite tail occlusion at both camera zooms.
