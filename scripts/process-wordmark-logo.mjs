import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, "..")
const defaultSource = path.join(
  rootDir,
  "assets",
  "voltguard-wordmark-source.png"
)
const source = process.argv[2] ?? defaultSource
const dest = path.join(rootDir, "public", "voltguard-logo-wordmark.png")

if (!fs.existsSync(source)) {
  console.error("Source image not found:", source)
  process.exit(1)
}

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  const isDarkBackground =
    max < 95 ||
    (r + g + b < 140 && max - min < 35 && max < 110)

  if (isDarkBackground) {
    data[i + 3] = 0
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 10 })
  .png()
  .toFile(dest)

console.log(`Saved transparent logo to ${dest}`)
