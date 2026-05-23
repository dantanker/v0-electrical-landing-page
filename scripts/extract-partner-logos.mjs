import sharp from "sharp"
import { mkdirSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const source = join(
  process.env.APPDATA,
  "Cursor",
  "User",
  "workspaceStorage",
  "dfee93f2c8aa805ecaf7401657718a60",
  "images",
  "Blogs-Banner-824c5c44-d8ea-4934-b174-324bb8955a9f.png"
)

const outDir = join(root, "public", "partners")
mkdirSync(outDir, { recursive: true })

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

const meta = await sharp(source).metadata()
const w = meta.width
const h = meta.height

const padX = Math.round(w * 0.02)
const padY = Math.round(h * 0.03)
const topH = Math.round(h * 0.38)
const bottomY = Math.round(h * 0.62)
const bottomH = h - bottomY - padY
const colW = Math.round(w / 4)

const crops = [
  ["schneider", 0, padY, colW, topH],
  ["polycab", colW, padY, colW, topH],
  ["siemens", colW * 2, padY, colW, topH],
  ["legrand", colW * 3, padY, colW, topH],
  ["abb", 0, bottomY, colW, bottomH],
  ["wipro", colW, bottomY, colW, bottomH],
  ["honeywell", colW * 2, bottomY, colW, bottomH],
  ["philips", colW * 3, bottomY, colW, bottomH],
]

for (const [name, left, top, width, height] of crops) {
  const cropped = await sharp(source)
    .extract({
      left: left + padX,
      top,
      width: width - padX * 2,
      height,
    })
    .png()
    .toBuffer()

  const { data, info } = await sharp(cropped)
    .trim({ threshold: 12 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  removeEdgeWhiteBackground(data, info.width, info.height)

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 1 })
    .png()
    .toFile(join(outDir, `${name}.png`))

  console.log(`Wrote ${name}.png`)
}

console.log(`Source: ${w}x${h}`)