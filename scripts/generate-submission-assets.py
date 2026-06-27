"""Generate public submission image and silent demo rough cut."""

from __future__ import annotations

import subprocess
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "assets"
PNG = ASSETS / "proofledger_dashboard_desktop.png"
ARCH = ASSETS / "proofledger_architecture_diagram.png"
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


def draw_box(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], title_text: str, body_text: str, accent: str) -> None:
    draw.rectangle(xy, fill="#ffffff", outline="#d9e2ec", width=2)
    x1, y1, x2, y2 = xy
    draw.rectangle((x1, y1, x1 + 8, y2), fill=accent)
    draw.text((x1 + 24, y1 + 20), title_text, fill="#17202a", font=font(24))
    draw.text((x1 + 24, y1 + 58), body_text, fill="#5b6b7f", font=font(16))


def draw_arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int]) -> None:
    draw.line((start, end), fill="#64748b", width=4)
    x, y = end
    draw.polygon([(x, y), (x - 14, y - 8), (x - 14, y + 8)], fill="#64748b")


def draw_architecture(path: Path) -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (1400, 900), "#f8fafc")
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 1400, 130), fill="#17202a")
    draw.text((54, 34), "ProofLedger AI architecture", fill="#ffffff", font=font(42))
    draw.text((56, 88), "Vercel front end, Next.js API routes, and Amazon DynamoDB receipt memory.", fill="#cbd5e1", font=font(18))

    draw_box(draw, (70, 210, 390, 340), "Reviewer", "Views HOLD, BLOCK, and\nHUMAN_REVIEW_ONLY queues.", "#2563eb")
    draw_box(draw, (540, 170, 880, 300), "Vercel / Next.js UI", "Dashboard, subject timeline,\nand static review pages.", "#111827")
    draw_box(draw, (540, 410, 880, 540), "Next.js API routes", "Health, seed-demo, status\nqueries, and subject lookup.", "#0f766e")
    draw_box(draw, (1040, 300, 1320, 450), "Amazon DynamoDB", "ProofLedgerEvents table.\nPK, SK, GSI1, GSI2,\nreceiptHash, decision.", "#b45309")

    draw_box(draw, (70, 560, 390, 700), "AI-agent recommendation", "Prepared decision packet:\nsubject, evidence, request,\nfindings, proposed action.", "#7c3aed")
    draw_box(draw, (540, 640, 880, 780), "ProofLedger validator", "Returns HOLD, BLOCK, or\nHUMAN_REVIEW_ONLY.\nNo business action runs.", "#be123c")
    draw_box(draw, (1040, 610, 1320, 760), "External systems", "Refunds, claims, account\nupdates, and production\nactions remain disabled.", "#64748b")

    draw_arrow(draw, (390, 275), (540, 235))
    draw_arrow(draw, (710, 300), (710, 410))
    draw_arrow(draw, (880, 475), (1040, 375))
    draw_arrow(draw, (390, 630), (540, 710))
    draw_arrow(draw, (710, 640), (710, 540))
    draw.line(((880, 710), (1040, 685)), fill="#be123c", width=4)
    draw.line(((1040, 670), (880, 725)), fill="#be123c", width=4)

    draw.text((70, 825), "Claim boundary: ProofLedger stores evidence receipts and opens human review only. It does not execute refunds, claims, records, or production actions.", fill="#475569", font=font(18))
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
    draw_architecture(ARCH)
    draw_video()
    print(PNG)
    print(ARCH)
    print(MP4)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
