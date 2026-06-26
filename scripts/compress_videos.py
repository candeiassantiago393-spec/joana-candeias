import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

VIDEOS = [
    ROOT / "assets/gallery/retiros/retiro-01.mp4",
    ROOT / "assets/gallery/retiros/retiro-02.mp4",
    ROOT / "assets/gallery/joana/joana-01.mp4",
    ROOT / "assets/videos/massagens-relaxamento.mp4",
]


def compress_video(source: Path) -> None:
    temp = source.with_suffix(".tmp.mp4")
    before_mb = source.stat().st_size / (1024 * 1024)

    command = [
        FFMPEG,
        "-y",
        "-i",
        str(source),
        "-vf",
        "scale='min(1280,iw)':-2",
        "-c:v",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "medium",
        "-movflags",
        "+faststart",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-ac",
        "2",
        str(temp),
    ]

    print(f"Compressing {source.relative_to(ROOT)} ({before_mb:.1f} MB)...")
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    after_mb = temp.stat().st_size / (1024 * 1024)
    temp.replace(source)
    saved = before_mb - after_mb
    print(f"  -> {after_mb:.1f} MB (saved {saved:.1f} MB)")


def main() -> int:
    missing = [path for path in VIDEOS if not path.exists()]
    if missing:
        for path in missing:
            print(f"Missing: {path}", file=sys.stderr)
        return 1

    for video in VIDEOS:
        compress_video(video)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
