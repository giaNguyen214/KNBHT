import os
import json

# Thư mục chứa assets
base_dir = os.path.join(os.path.dirname(__file__), "..", "public", "assets")
base_dir = os.path.abspath(base_dir)  # chuẩn hóa đường dẫn

def walk(dir_path):
    result = {}
    for entry in os.scandir(dir_path):
        if entry.is_dir():
            result[entry.name] = walk(entry.path)
        elif entry.is_file() and entry.name.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
            result.setdefault("_files", []).append(entry.name)
    return result

index = walk(base_dir)

out_path = os.path.join(os.path.dirname(__file__), "data", "assetsIndex.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print(f"✅ Generated {out_path}")
