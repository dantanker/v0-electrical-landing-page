const fs = require("fs");
const path =
  "C:/Users/peter/.cursor/projects/c-Users-peter-Desktop-Git-Hub-Repo-s-v0-electrical-landing-page-main/agent-transcripts/6dbb3e65-e75e-43ee-977c-1e34dbd0bd0a/6dbb3e65-e75e-43ee-977c-1e34dbd0bd0a.jsonl";

const targets = [
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
];

const files = {};
const ops = {};
const lines = fs.readFileSync(path, "utf8").split("\n");
let lineNum = 0;

for (const line of lines) {
  lineNum++;
  if (!line.trim()) continue;
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  const content = obj.message?.content;
  if (!Array.isArray(content)) continue;
  for (const item of content) {
    if (item.type !== "tool_use") continue;
    const name = item.name;
    const input = item.input || {};
    if (!input.path) continue;
    const p = input.path.replace(/\\/g, "/");
    const rel = targets.find((t) => p.endsWith(t));
    if (!rel) continue;
    if (name === "Write") {
      files[rel] = input.contents;
      if (!ops[rel]) ops[rel] = [];
      ops[rel].push({ line: lineNum, op: "Write", len: (input.contents || "").length });
    } else if (name === "StrReplace") {
      if (files[rel] === undefined) files[rel] = null;
      const current = files[rel];
      if (current !== null && current !== undefined) {
        const oldStr = input.old_string;
        const newStr = input.new_string;
        if (current.includes(oldStr)) {
          files[rel] = current.replace(oldStr, newStr);
        } else {
          console.error(`WARN ${rel} L${lineNum}: old_string not found in current content`);
        }
      }
      if (!ops[rel]) ops[rel] = [];
      ops[rel].push({
        line: lineNum,
        op: "StrReplace",
        oldLen: (input.old_string || "").length,
        newLen: (input.new_string || "").length,
      });
    }
  }
}

const outDir = "C:/Users/peter/Desktop/Git Hub Repo's/v0-electrical-landing-page-main/_transcript-restore";
fs.mkdirSync(outDir, { recursive: true });

console.log("=== OPS SUMMARY ===");
for (const t of targets) {
  const hasContent = files[t] !== undefined && files[t] !== null;
  console.log(
    `${t}: ${ops[t] ? ops[t].length + " ops" : "NOT FOUND"}, final=${hasContent ? files[t].length + " chars" : "MISSING"}`
  );
  if (ops[t]) {
    for (const o of ops[t]) {
      console.log(`  L${o.line} ${o.op}${o.len ? " len=" + o.len : ""}${o.oldLen ? " oldLen=" + o.oldLen : ""}`);
    }
  }
  if (hasContent) {
    const outPath = `${outDir}/${t.replace(/\//g, "__")}`;
    fs.writeFileSync(outPath, files[t], "utf8");
  }
}

console.log("\n=== IMAGES ===");
const allContent = Object.values(files).filter(Boolean).join("\n");
const imageMatches = [...allContent.matchAll(/\/services\/[^"'\s)]+|public\/services\/[^"'\s)]+/g)];
const uniqueImages = [...new Set(imageMatches.map((m) => m[0]))];
console.log(uniqueImages.join("\n") || "(none in restored files)");
