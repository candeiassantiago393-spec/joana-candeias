import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image

SRC = Path(r"c:\Users\z005027j\Desktop\fotos")
DEST = Path(r"c:\Users\z005027j\Desktop\tt\joana-candeias\assets\gallery")
IMG_EXT = {".jpg", ".jpeg", ".jfif", ".png", ".webp", ".gif"}
VID_EXT = {".mp4", ".mov", ".webm"}


def file_hash(path: Path) -> str:
    digest = hashlib.md5()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def process_album(folder_name: str, prefix: str, alt_base: str) -> list[dict]:
    src_dir = SRC / folder_name
    dest_name = "retiros" if folder_name == "retiro" else "joana"
    dest_dir = DEST / dest_name
    dest_dir.mkdir(parents=True, exist_ok=True)

    items: list[dict] = []
    seen_hashes: set[str] = set()
    img_idx = 0
    vid_idx = 0

    files = sorted(src_dir.iterdir(), key=lambda path: path.name.lower())
    for source in files:
        if not source.is_file():
            continue

        ext = source.suffix.lower()
        if ext in VID_EXT:
            digest = file_hash(source)
            if digest in seen_hashes:
                print(f"SKIP duplicate: {source.name}")
                continue
            seen_hashes.add(digest)
            vid_idx += 1
            target = dest_dir / f"{prefix}-{vid_idx:02d}.mp4"
            shutil.copy2(source, target)
            items.append(
                {
                    "type": "video",
                    "src": f"assets/gallery/{dest_name}/{target.name}",
                    "alt": f"{alt_base} — vídeo {vid_idx}",
                }
            )
            print(f"VIDEO {target.name} <- {source.name}")
            continue

        if ext not in IMG_EXT:
            continue

        img_idx += 1
        target = dest_dir / f"{prefix}-{img_idx:02d}.jpg"
        image = Image.open(source)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        image.save(target, "JPEG", quality=85, optimize=True)
        items.append(
            {
                "type": "image",
                "src": f"assets/gallery/{dest_name}/{target.name}",
                "alt": f"{alt_base} — foto {img_idx}",
            }
        )
        print(f"IMAGE {target.name} <- {source.name}")

    return items


def main() -> None:
    albums = {
        "retiro": process_album("retiro", "retiro", "Retiro"),
        "joana": process_album("joana", "joana", "Joana Candeias"),
    }

    output = Path(__file__).resolve().parent / "albums_data.json"
    output.write_text(json.dumps(albums, ensure_ascii=False, indent=2), encoding="utf-8")

    for name, items in albums.items():
        videos = sum(1 for item in items if item["type"] == "video")
        print(f"{name}: {len(items)} items ({videos} videos)")


if __name__ == "__main__":
    main()
