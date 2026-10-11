#!/usr/bin/env python3
"""Validate untouched v0.9.39 handoff without third-party dependencies."""
from pathlib import Path
import json, hashlib, subprocess, shutil, sys

BASE=Path(__file__).resolve().parent
PROJECT=BASE/"spalakh3d/Spalakh_NeonObservatory_ONLY_v0939_RealLight_RoundAura_SlowSpiders.json"
JS=BASE/"spalakh3d/patches/Observatory_v0939_full.js"
MANIFEST=BASE/"ASSET_MANIFEST_V0939.json"

def err(message):
    print("ERROR:",message,file=sys.stderr)
    sys.exit(1)

p=json.loads(PROJECT.read_text(encoding="utf-8"))
scene=next((l for l in p["layouts"] if l.get("name")=="Observatory3D_FalseLight"),None)
if scene is None: err("Native Observatory3D_FalseLight scene not found")
events=[e for e in scene["events"] if e.get("type")=="BuiltinCommonInstructions::JsCode"]
if len(events)!=1:err(f"Expected exactly one main JsCode event, found {len(events)}")
inline="\n".join(events[0]["inlineCode"]).rstrip("\n")
standalone=JS.read_text(encoding="utf-8").rstrip("\n")
if inline!=standalone:err("JS mirror differs from GDevelop JSON inlineCode")
if "v0.9.39" not in p["properties"]["name"]:err("Unexpected source version")
manifest=json.loads(MANIFEST.read_text(encoding="utf-8"))
assets=manifest["assets"]
if len(assets)!=105 or len(p["resources"]["resources"])!=105:
    err("Unexpected number of source asset registrations")
if set(a["resource_name"] for a in assets)!=set(r["name"] for r in p["resources"]["resources"]):
    err("Resource names do not match native GDevelop project")
for a in assets:
    path=BASE/a["path"]
    if not path.exists():err(f"Missing original asset: {a['path']}")
    if len(path.read_bytes())!=a["size_bytes"]:err(f"Asset size mismatch: {a['path']}")
    ext=path.suffix.lower()
    h=path.open("rb").read(12)
    if ext==".glb" and h[:4]!=b"glTF":err(f"Invalid GLB header: {path}")
    if ext==".png" and h[:8]!=b"\x89PNG\r\n\x1a\n":err(f"Invalid PNG header: {path}")
    if ext==".webp" and not (h[:4]==b"RIFF" and h[8:12]==b"WEBP"):err(f"Invalid WEBP header: {path}")
if shutil.which("node"):
    temp=BASE/".validate_inline_v0939.js"
    try:
        temp.write_text(inline,encoding="utf-8")
        result=subprocess.run(["node","--check",str(temp)],capture_output=True,text=True)
        if result.returncode:err("JS syntax error:\n"+result.stderr)
    finally:temp.unlink(missing_ok=True)
else:print("Note: node unavailable; native JS syntax not independently checked")
print("OK: v0.9.39 native JSON, JS mirror and",len(assets),"physical files; scene objects:",len(scene["objects"]),", instances:",len(scene["instances"]))
