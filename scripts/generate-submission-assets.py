"""Generate public submission image and silent demo rough cut."""

from __future__ import annotations

import subprocess
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "assets"
PNG = ASSETS / "proofledger_dashboard_desktop.png"
MP4 = ASSETS / "proofledger_demo_rough_cut.mp4"


def font(size: int):
    for name in ("arial.ttf", "Arial.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            pass
    return ImageFont.load_default()


def draw_dashboard(path: Path) -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (1200, 760), "#f8fafc")
    draw = ImageDraw.Draw(img)
    title = font(44)
    h = font(25)
    body = font(17)
    small = font(14)

    draw.rectangle((0, 0, 1200, 140), fill="#eef3f8")
    draw.text((42, 34), "ProofLedger AI", fill="#17202a", font=title)
    draw.text((42, 94), "Evidence memory for AI-agent decisions using Vercel and DynamoDB.", fill="#5b6b7f", font=body)

    cards = [
        ("HOLD", "1", "Delivery proof is missing.", "#b66a00"),
        ("BLOCK", "2", "Policy or action boundary was violated.", "#bd2b2b"),
        ("HUMAN_REVIEW_ONLY", "1", "Ready for a person. No action executed.", "#168a46"),
    ]
    x = 42
    for label, count, note, color in cards:
        draw.rectangle((x, 185, x + 340, 345), fill="#ffffff", outline="#d9e2ec", width=2)
        draw.rectangle((x, 185, x + 8, 345), fill=color)
        draw.text((x + 24, 210), label, fill="#17202a", font=h)
        draw.text((x + 24, 252), count, fill=color, font=font(36))
        draw.text((x + 24, 305), note, fill="#5b6b7f", font=small)
        x += 380

    rows = [
        ("HOLD", "refund_case_1001", "Missing delivery evidence", "open_human_review", "none", "#b66a00"),
        ("BLOCK", "refund_case_1002", "High-value refund auto-action attempt", "issue_refund", "none", "#bd2b2b"),
        ("HUMAN_REVIEW_ONLY", "refund_case_1003", "Complete packet, human review only", "open_human_review", "open_human_review", "#168a46"),
        ("BLOCK", "claim_case_1004", "Receipt reused for wrong subject", "open_human_review", "none", "#bd2b2b"),
    ]
    y = 395
    draw.rectangle((42, y, 1158, y + 44), fill="#ffffff", outline="#d9e2ec")
    headers = ["Status", "Subject", "Scenario", "Requested", "Allowed"]
    xs = [62, 230, 440, 795, 985]
    for hx, header in zip(xs, headers):
        draw.text((hx, y + 14), header, fill="#5b6b7f", font=small)
    y += 44
    for status, subject, scenario, requested, allowed, color in rows:
        draw.rectangle((42, y, 1158, y + 62), fill="#ffffff", outline="#d9e2ec")
        draw.text((62, y + 20), status, fill=color, font=small)
        draw.text((230, y + 13), subject, fill="#17202a", font=small)
        draw.text((440, y + 13), scenario, fill="#17202a", font=small)
        draw.text((795, y + 13), requested, fill="#17202a", font=small)
        draw.text((985, y + 13), allowed, fill="#17202a", font=small)
        y += 62
    draw.text((42, 720), "External action: disabled. Strongest allowed action: open human review.", fill="#5b6b7f", font=body)
    img.save(path)


def draw_slide(path: Path, title_text: str, body_text: str) -> None:
    img = Image.new("RGB", (1280, 720), "#f8fafc")
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 1280, 110), fill="#17202a")
    draw.text((60, 34), "ProofLedger AI", fill="#ffffff", font=font(30))
    draw.text((80, 230), title_text, fill="#17202a", font=font(54))
    draw.text((82, 330), body_text, fill="#5b6b7f", font=font(28))
    draw.text((82, 620), "HOLD | BLOCK | HUMAN_REVIEW_ONLY", fill="#5b6b7f", font=font(26))
    img.save(path)


def draw_video() -> None:
    slides = [
        ("Evidence memory", "AI recommendations are stored as receipts before action."),
        ("AWS DynamoDB", "Receipts keep subject ID, evidence status, findings, and hash."),
        ("Vercel dashboard", "Reviewers see HOLD, BLOCK, and HUMAN_REVIEW_ONLY queues."),
        ("HOLD", "Missing delivery evidence keeps the case from review."),
        ("BLOCK", "A high-value refund auto-action attempt is stopped."),
        ("HUMAN_REVIEW_ONLY", "Complete packets can go to a person, not to auto-action."),
        ("Boundary", "No refunds, claims, records, or production actions are executed."),
    ]
    frames = []
    list_file = ASSETS / "proofledger_video_frames.txt"
    try:
        for idx, (title_text, body_text) in enumerate(slides):
            frame = ASSETS / f"proofledger_video_{idx:02d}.png"
            draw_slide(frame, title_text, body_text)
            frames.append(frame)
        list_file.write_text(
            "".join(f"file '{frame.as_posix()}'\nduration 8\n" for frame in frames) + f"file '{frames[-1].as_posix()}'\n",
            encoding="utf-8",
        )
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run(
            [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file), "-pix_fmt", "yuv420p", str(MP4)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    finally:
        for frame in frames:
            frame.unlink(missing_ok=True)
        list_file.unlink(missing_ok=True)


def main() -> int:
    draw_dashboard(PNG)
    draw_video()
    print(PNG)
    print(MP4)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
