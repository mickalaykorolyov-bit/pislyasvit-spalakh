# ПІСЛЯСВІТ 0.8.4n — видимі рухомі уламки корабля

Base: `Spalakh_Prototype_084m.json`. New: `Spalakh_Prototype_084n.json`.

## Fixed
- Before the main sensor was lit, both sensor-powered moving bridges were invisible: artwork visibility was tied to `deck.active`. They are now visually present at their original base positions with subdued colors even when unpowered. Once the main sensor activates, the same bridges physically move along their unchanged paths, and the artwork follows.
- Repainted fallback for dynamic Canvas/PIXI texture failures: a permanent PIXI.Graphics renderer draws the broken wood hulls, metal braces, copper rivets, watercolor-style grain and algae washes. If Canvas sprites initialize correctly, their high-resolution watercolor is drawn on top.
- Static upper platforms retain their original coral-and-algae textures.
- No collision, object positions, sensor activation conditions, death effects, or second scene modified.
- No website or deployment changes.

## Verification
- Valid GDevelop JSON and syntactically valid first-scene JS.
- Existing instances and assets unchanged.
- Verified with a renderer stub that two bridges render while `active=false` and after `active=true`, including when Canvas textures are unavailable.
- Full GDevelop Preview appearance still requires interactive QA.

## GDevelop Preview
https://editor.gdevelop.io/?project=https%3A%2F%2Fraw.githubusercontent.com%2Fmickalaykorolyov-bit%2Fpislyasvit-spalakh%2F9035ac3170b115459081cdbdc2302f580e728dc8%2FSpalakh_Prototype_084n.json
