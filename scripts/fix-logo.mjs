import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

const workDir = "C:/Users/peter/Desktop/logo-fix-tmp"
const require = createRequire(path.join(workDir, "package.json"))
const sharp = require(path.join(workDir, "node_modules", "sharp"))

const source = path.join(workDir, "voltguard-logo-white-no-tagline.png")
const outName = "voltguard-logo-transparent.png"

// Write next to this script in repo public folder using relative resolution
const publicDir = path.resolve("public")
fs.mkdirSync(publicDir, { recursive: true })

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

const threshold = 40
for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (r <= threshold && g <= threshold && b <= threshold) {
    data[i + 3] = 0
  }
}

const outputBuffer = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer()

const dest = path.join(publicDir, outName)
fs.writeFileSync(dest, outputBuffer)
console.log("Wrote", dest, outputBuffer.length)
