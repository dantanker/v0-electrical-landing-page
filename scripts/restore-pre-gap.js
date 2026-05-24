const fs = require("fs");
const path = require("path");

const transcriptPath =
  "C:/Users/peter/.cursor/projects/c-Users-peter-Desktop-Git-Hub-Repo-s-v0-electrical-landing-page-main/agent-transcripts/098ca72d-1054-4175-b230-4f9081d94a32/098ca72d-1054-4175-b230-4f9081d94a32.jsonl";

const repoRoot =
  "C:/Users/peter/Desktop/Git Hub Repo's/v0-electrical-landing-page-main";

const STOP_AT_USER_QUERY =
  "now for each gap on each page make it shorter";

const lines = fs.readFileSync(transcriptPath, "utf8").split("\n").filter(Boolean);

function normalizePath(filePath) {
  const n = filePath.replace(/\\/g, "/");
  const idx = n.toLowerCase().indexOf("/v0-electrical-landing-page-main/");
  if (idx === -1) return null;
  return n.slice(idx + "/v0-electrical-landing-page-main/".length);
}

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, "\n");
}

function applyReplace(content, old_string, new_string) {
  const normalizedContent = normalizeNewlines(content);
  const normalizedOld = normalizeNewlines(old_string);
  const normalizedNew = normalizeNewlines(new_string);

  if (normalizedContent.includes(normalizedOld)) {
    return normalizedContent.replace(normalizedOld, normalizedNew);
  }

  return null;
}

function applyOps(fileOps, baseContent) {
  let content = baseContent;
  for (const op of fileOps) {
    if (op.type === "Write") {
      content = normalizeNewlines(op.contents);
    } else if (op.type === "StrReplace") {
      if (content === null) {
        throw new Error("StrReplace before any Write/base content");
      }
      const next = applyReplace(content, op.old_string, op.new_string);
      if (next === null) {
        console.warn(`WARN ${op.path}: old_string not found`);
      } else {
        content = next;
      }
    }
  }
  return content;
}

const opsByFile = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }

  if (obj.role === "user") {
    const text = obj.message?.content?.find((c) => c.type === "text")?.text || "";
    if (text.includes(STOP_AT_USER_QUERY)) {
      console.log(`Stopping at transcript line ${i + 1} (gap prompt)`);
      break;
    }
  }

  if (obj.role !== "assistant") continue;

  for (const item of obj.message?.content || []) {
    if (item.type !== "tool_use") continue;
    if (item.name !== "Write" && item.name !== "StrReplace") continue;

    const fp = item.input?.path;
    if (!fp) continue;

    const rel = normalizePath(fp);
    if (!rel) continue;

    if (!opsByFile[rel]) opsByFile[rel] = [];
    opsByFile[rel].push({
      type: item.name,
      lineNum: i + 1,
      old_string: item.input.old_string,
      new_string: item.input.new_string,
      contents: item.input.contents,
    });
  }
}

const outDir = path.join(repoRoot, "_pre_gap_restore");
fs.mkdirSync(outDir, { recursive: true });

const summary = [];
const diffs = [];

for (const rel of Object.keys(opsByFile).sort()) {
  const fileOps = opsByFile[rel];
  const repoPath = path.join(repoRoot, rel);
  const gitPath = path.join(repoRoot, ".git", "HEAD");

  let base = null;
  if (fs.existsSync(repoPath)) {
    try {
      const { execSync } = require("child_process");
      base = execSync(`git show HEAD:"${rel.replace(/\\/g, "/")}"`, {
        cwd: repoRoot,
        encoding: "utf8",
      });
    } catch {
      base = null;
    }
  }

  try {
    const restored = applyOps(fileOps, base);
    if (restored === null) {
      summary.push(`${rel}: SKIP (no base, only StrReplace)`);
      continue;
    }

    const outPath = path.join(outDir, rel.replace(/\//g, "__"));
    fs.writeFileSync(outPath, restored, "utf8");

    let current = null;
    if (fs.existsSync(repoPath)) {
      current = fs.readFileSync(repoPath, "utf8");
    }

    const match = current === restored;
    summary.push(`${rel}: ${fileOps.length} ops — ${match ? "MATCHES current" : "DIFFERS from current"}`);

    if (!match && current !== null) {
      diffs.push(rel);
    } else if (!match && current === null) {
      diffs.push(`${rel} (missing in repo)`);
    }
  } catch (e) {
    summary.push(`${rel}: ERROR — ${e.message}`);
  }
}

fs.writeFileSync(path.join(outDir, "_summary.txt"), summary.join("\n"), "utf8");
console.log(summary.join("\n"));
console.log("\nFiles differing from current:", diffs.length ? diffs.join(", ") : "none");
