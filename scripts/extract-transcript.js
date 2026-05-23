const fs = require("fs");

const transcriptPath =
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

function matchTarget(filePath) {
  const n = filePath.replace(/\\/g, "/");
  for (const t of targets) {
    if (n.endsWith(t)) return t;
  }
  return null;
}

function applyOps(fileOps) {
  let content = null;
  for (const op of fileOps) {
    if (op.type === "Write") {
      content = op.contents;
    } else if (op.type === "StrReplace") {
      if (content === null) {
        throw new Error("StrReplace before Write without base content");
      }
      if (!content.includes(op.old_string)) {
        console.error("WARNING: old_string not found in content for", op.path);
        console.error("old_string preview:", op.old_string.slice(0, 100));
      } else {
        content = content.replace(op.old_string, op.new_string);
      }
    }
  }
  return content;
}

const lines = fs.readFileSync(transcriptPath, "utf8").split("\n").filter(Boolean);
const ops = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  try {
    const obj = JSON.parse(line);
    if (obj.role !== "assistant") continue;
    const content = obj.message?.content || [];
    for (const item of content) {
      if (item.type !== "tool_use") continue;
      if (item.name !== "Write" && item.name !== "StrReplace") continue;
      const input = item.input || {};
      const fp = input.path;
      if (!fp) continue;
      const t = matchTarget(fp);
      if (!t) continue;
      if (!ops[t]) ops[t] = [];
      ops[t].push({
        type: item.name,
        lineNum: i + 1,
        old_string: input.old_string,
        new_string: input.new_string,
        contents: input.contents,
      });
    }
  } catch (e) {
    // skip
  }
}

const outDir = "C:/Users/peter/Desktop/Git Hub Repo's/v0-electrical-landing-page-main/scripts/extracted-from-transcript";
fs.mkdirSync(outDir, { recursive: true });

const summary = [];

for (const t of targets) {
  const fileOps = ops[t] || [];
  summary.push(`${t}: ${fileOps.length} ops`);
  if (fileOps.length === 0) {
    summary.push("  MISSING - no ops found");
    continue;
  }

  try {
    const final = applyOps(fileOps);
    if (final === null) {
      summary.push("  ERROR - could not reconstruct");
      continue;
    }
    const outPath = `${outDir}/${t.replace(/\//g, "__")}`;
    fs.writeFileSync(outPath, final, "utf8");
    summary.push(`  OK - ${final.split("\n").length} lines written`);
  } catch (e) {
    summary.push(`  ERROR - ${e.message}`);
  }
}

// Also search for public/services references
const servicesImages = new Set();
for (const line of lines) {
  const matches = line.match(/public\/services\/[^"\\]+/g);
  if (matches) matches.forEach((m) => servicesImages.add(m));
  const matches2 = line.match(/\/services\/[a-z0-9-]+\.(png|jpg|webp)/gi);
  if (matches2) matches2.forEach((m) => servicesImages.add(m));
}

fs.writeFileSync(`${outDir}/_summary.txt`, summary.join("\n") + "\n\nImages:\n" + [...servicesImages].join("\n"), "utf8");
console.log(summary.join("\n"));
console.log("\nImages:", [...servicesImages].join(", "));
