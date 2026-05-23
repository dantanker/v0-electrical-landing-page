import json
import os
from collections import defaultdict

transcript = r"C:\Users\peter\.cursor\projects\c-Users-peter-Desktop-Git-Hub-Repo-s-v0-electrical-landing-page-main\agent-transcripts\6dbb3e65-e75e-43ee-977c-1e34dbd0bd0a\6dbb3e65-e75e-43ee-977c-1e34dbd0bd0a.jsonl"
out_dir = r"C:\Users\peter\Desktop\Git Hub Repo's\v0-electrical-landing-page-main\_transcript_restore"

target_files = [
    "lib/constants.ts",
    "components/Navigation.tsx",
    "components/ScrollObserver.tsx",
    "components/voltguard/quote-cta-button.tsx",
    "components/voltguard/quote-section.tsx",
    "components/voltguard/services-arc-gallery.tsx",
    "components/voltguard/header.tsx",
    "components/voltguard/hero-section.tsx",
    "components/voltguard/footer.tsx",
    "components/voltguard/services-grid.tsx",
    "components/voltguard/social-proof.tsx",
    "components/voltguard/lead-capture-form.tsx",
    "app/page.tsx",
    "app/layout.tsx",
    "app/globals.css",
    "components/voltguard/pricing-section.tsx",
]


def norm_path(p):
    p = p.replace("\\", "/")
    marker = "v0-electrical-landing-page-main/"
    idx = p.lower().find(marker)
    if idx >= 0:
        p = p[idx + len(marker) :]
    return p.lower()


file_contents = {}
operations = defaultdict(list)
warnings = []

with open(transcript, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, 1):
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        msg = obj.get("message", {})
        content = msg.get("content", [])
        if not isinstance(content, list):
            continue
        for item in content:
            if not isinstance(item, dict) or item.get("type") != "tool_use":
                continue
            name = item.get("name")
            inp = item.get("input", {})
            path = inp.get("path", "")
            np = norm_path(path)
            if name == "Write" and "contents" in inp:
                operations[np].append((line_num, "Write"))
                file_contents[np] = inp["contents"]
            elif name == "StrReplace" and "old_string" in inp and "new_string" in inp:
                operations[np].append((line_num, "StrReplace"))
                if np not in file_contents:
                    warnings.append(f"line {line_num}: StrReplace on {np} without prior Write")
                    continue
                old = inp["old_string"]
                new = inp["new_string"]
                count = -1 if inp.get("replace_all") else 1
                if old not in file_contents[np]:
                    warnings.append(f"line {line_num}: old_string not found in {np}")
                    continue
                file_contents[np] = file_contents[np].replace(old, new, count)

os.makedirs(out_dir, exist_ok=True)

print("=== WARNINGS ===")
for w in warnings:
    print(w)

print("\n=== SUMMARY ===")
for tf in target_files:
    np = tf.lower()
    ops = operations.get(np, [])
    has = np in file_contents
    size = len(file_contents[np]) if has else 0
    print(f"{tf}: ops={len(ops)} content={has} bytes={size}")

print("\n=== ALL TRACKED FILES ===")
for k in sorted(file_contents.keys()):
    print(k, len(file_contents[k]))

for tf in target_files:
    np = tf.lower()
    if np in file_contents:
        out_path = os.path.join(out_dir, tf.replace("/", os.sep))
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(file_contents[np])
        print(f"WROTE {out_path}")
