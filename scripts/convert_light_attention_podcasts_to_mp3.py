from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
PODCAST_DIR = REPO_ROOT / "light-of-attention" / "podcasts"
TWOVOICE_SITE_PACKAGES = REPO_ROOT.parent / "TwoVoiceReader" / ".venv" / "Lib" / "site-packages"
REPORT_PATH = PODCAST_DIR / "MP3_CONVERSION_REPORT.json"


if TWOVOICE_SITE_PACKAGES.exists():
    sys.path.insert(0, str(TWOVOICE_SITE_PACKAGES))

import soundfile as sf  # noqa: E402


def convert_episode(wav_path: Path) -> dict[str, object]:
    mp3_path = wav_path.with_suffix(".mp3")
    audio, sample_rate = sf.read(str(wav_path), dtype="float32")
    sf.write(
        str(mp3_path),
        audio,
        sample_rate,
        format="MP3",
        subtype="MPEG_LAYER_III",
        bitrate_mode="CONSTANT",
        compression_level=0.60,
    )
    return {
        "episode": wav_path.stem,
        "wav_bytes": wav_path.stat().st_size,
        "mp3_bytes": mp3_path.stat().st_size,
        "saved_bytes": wav_path.stat().st_size - mp3_path.stat().st_size,
        "mp3": mp3_path.name,
    }


def main() -> int:
    wav_paths = sorted(PODCAST_DIR.glob("episode-*.wav"))
    if not wav_paths:
        raise SystemExit(f"No episode WAV files found in {PODCAST_DIR}")

    proof_artifact = PODCAST_DIR / "_conversion_test_episode-001.mp3"
    if proof_artifact.exists():
        proof_artifact.unlink()

    converted = [convert_episode(path) for path in wav_paths]
    report = {
        "source_directory": str(PODCAST_DIR),
        "episode_count": len(converted),
        "total_wav_bytes": sum(item["wav_bytes"] for item in converted),
        "total_mp3_bytes": sum(item["mp3_bytes"] for item in converted),
        "total_saved_bytes": sum(item["saved_bytes"] for item in converted),
        "episodes": converted,
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Converted {len(converted)} podcast WAV files to MP3.")
    print(f"WAV total: {report['total_wav_bytes']:,} bytes")
    print(f"MP3 total: {report['total_mp3_bytes']:,} bytes")
    print(f"Saved: {report['total_saved_bytes']:,} bytes before WAV cleanup")
    print(f"Report: {REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
