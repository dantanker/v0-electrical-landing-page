import sharp from "sharp"
import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const partnersDir = join(__dirname, "..", "public", "partners")

const WHITE_THRESHOLD = 248

function isNearWhite(r, g, b) {
  return r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD
}

function removeEdgeWhiteBackground(data, width, height) {
  const visited = new Uint8Array(width * height)
  const queue = []

  const pushIfWhite = (x, y) => {
    const idx = y * width + x
    if (visited[idx]) return
    const i = idx * 4
    if (!isNearWhite(data[i], data[i + 1], data[i + 2])) return
    visited[idx] = 1
    queue.push(idx)
  }

  for (let x = 0; x < width; x++) {
    pushIfWhite(x, 0)
    pushIfWhite(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    pushIfWhite(0, y)
    pushIfWhite(width - 1, y)
  }

  while (queue.length > 0) {
    const idx = queue.pop()
    const x = idx % width
    const y = (idx - x) / width
    const i = idx * 4
    data[i + 3] = 0

    if (x > 0) pushIfWhite(x - 1, y)
    if (x < width - 1) pushIfWhite(x + 1, y)
    if (y > 0) pushIfWhite(x, y - 1)
    if (y < height - 1) pushIfWhite(x, y + 1)
  }
}

function convertToWhiteSilhouette(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
  }
}

const files = readdirSync(partnersDir).filter((name) => name.endsWith(".png"))

for (const file of files) {
  const inputPath = join(partnersDir, file)
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  removeEdgeWhiteBackground(data, info.width, info.height)
  convertToWhiteSilhouette(data)

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim({ threshold: 1 })
    .png()
    .toFile(inputPath)

  console.log(`Processed ${file}`)
}
