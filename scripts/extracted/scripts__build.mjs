import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const npm = process.platform === "win32" ? "npm.cmd" : "npm"

const result = spawnSync(npm, ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
})

process.exit(result.status ?? 1)
