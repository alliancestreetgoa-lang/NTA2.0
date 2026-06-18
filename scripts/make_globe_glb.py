#!/usr/bin/env python3
"""Generate a textured Earth globe as a binary glTF (.glb), openable in Blender.

Builds a UV sphere, computes normals + equirectangular UVs, and embeds the Earth
day map (baseColor) and night-lights map (emissive) directly in the GLB buffer.
Pure numpy + stdlib — no 3D libraries required.
"""
import json
import struct
import numpy as np

SEGS = 128   # longitude divisions
RINGS = 128  # latitude divisions
RADIUS = 1.0
OUT = "/Users/shuakinsv/ntagroup/public/models/globe.glb"
DAY = "/tmp/earth_day.jpg"
NIGHT = "/tmp/earth_night.png"

# ---- Build UV sphere -------------------------------------------------------
positions, normals, uvs = [], [], []
for y in range(RINGS + 1):
    v = y / RINGS
    lat = v * np.pi                      # 0 (north pole) .. pi (south pole)
    sin_lat, cos_lat = np.sin(lat), np.cos(lat)
    for x in range(SEGS + 1):
        u = x / SEGS
        lon = u * 2.0 * np.pi
        px = -sin_lat * np.cos(lon)
        py = cos_lat
        pz = sin_lat * np.sin(lon)
        positions.append((px * RADIUS, py * RADIUS, pz * RADIUS))
        normals.append((px, py, pz))
        uvs.append((u, v))

indices = []
row = SEGS + 1
for y in range(RINGS):
    for x in range(SEGS):
        a = y * row + x
        b = a + 1
        c = a + row
        d = c + 1
        indices += [a, c, b, b, c, d]

positions = np.array(positions, dtype=np.float32)
normals = np.array(normals, dtype=np.float32)
uvs = np.array(uvs, dtype=np.float32)
indices = np.array(indices, dtype=np.uint32)

pos_bytes = positions.tobytes()
nrm_bytes = normals.tobytes()
uv_bytes = uvs.tobytes()
idx_bytes = indices.tobytes()
with open(DAY, "rb") as f:
    day_bytes = f.read()
with open(NIGHT, "rb") as f:
    night_bytes = f.read()


def pad4(b, fill=b"\x00"):
    return b + fill * ((4 - len(b) % 4) % 4)


# ---- Assemble binary buffer + bufferViews ---------------------------------
buf = bytearray()
views = []


def add_view(data, target=None):
    global buf
    data = pad4(data)
    offset = len(buf)
    view = {"buffer": 0, "byteOffset": offset, "byteLength": len(data)}
    if target is not None:
        view["target"] = target
    views.append(view)
    buf += data
    return len(views) - 1


v_pos = add_view(pos_bytes, 34962)
v_nrm = add_view(nrm_bytes, 34962)
v_uv = add_view(uv_bytes, 34962)
v_idx = add_view(idx_bytes, 34963)
v_day = add_view(day_bytes)
v_night = add_view(night_bytes)

count = len(positions)
accessors = [
    {"bufferView": v_pos, "componentType": 5126, "count": count, "type": "VEC3",
     "min": positions.min(axis=0).tolist(), "max": positions.max(axis=0).tolist()},
    {"bufferView": v_nrm, "componentType": 5126, "count": count, "type": "VEC3"},
    {"bufferView": v_uv, "componentType": 5126, "count": count, "type": "VEC2"},
    {"bufferView": v_idx, "componentType": 5125, "count": len(indices), "type": "SCALAR"},
]

gltf = {
    "asset": {"version": "2.0", "generator": "NTA Group globe exporter"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "Earth"}],
    "meshes": [{
        "name": "EarthSphere",
        "primitives": [{
            "attributes": {"POSITION": v_pos, "NORMAL": v_nrm, "TEXCOORD_0": v_uv},
            "indices": v_idx,
            "material": 0,
        }],
    }],
    "materials": [{
        "name": "Earth",
        "pbrMetallicRoughness": {
            "baseColorTexture": {"index": 0},
            "metallicFactor": 0.0,
            "roughnessFactor": 1.0,
        },
        "emissiveTexture": {"index": 1},
        "emissiveFactor": [1.0, 1.0, 1.0],
    }],
    "textures": [
        {"source": 0, "sampler": 0},
        {"source": 1, "sampler": 0},
    ],
    "images": [
        {"bufferView": v_day, "mimeType": "image/jpeg", "name": "earth_day"},
        {"bufferView": v_night, "mimeType": "image/png", "name": "earth_night"},
    ],
    "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}],
    "accessors": accessors,
    "bufferViews": views,
    "buffers": [{"byteLength": len(buf)}],
}

# ---- Pack GLB --------------------------------------------------------------
json_bytes = pad4(json.dumps(gltf, separators=(",", ":")).encode("utf-8"), b"\x20")
bin_bytes = pad4(bytes(buf))

glb = bytearray()
total = 12 + 8 + len(json_bytes) + 8 + len(bin_bytes)
glb += struct.pack("<III", 0x46546C67, 2, total)          # header
glb += struct.pack("<II", len(json_bytes), 0x4E4F534A)    # JSON chunk header
glb += json_bytes
glb += struct.pack("<II", len(bin_bytes), 0x004E4942)     # BIN chunk header
glb += bin_bytes

import os
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "wb") as f:
    f.write(glb)

print(f"Wrote {OUT}")
print(f"  vertices: {count}, triangles: {len(indices)//3}")
print(f"  size: {len(glb)/1024:.0f} KB")
