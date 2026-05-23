import sharp from "sharp"
import { mkdirSync, readdirSync, unlinkSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const partnersDir = join(root, "public", "partners")
const assetsDir = join(
  "C:",
  "Users",
  "peter",
  ".cursor",
  "projects",
  "c-Users-peter-Desktop-Git-Hub-Repo-s-v0-electrical-landing-page-main",
  "assets"
)

const LOGO_GREY = { r: 196, g: 203, b: 212 }

const SOURCES = [
  {
    id: "voltrex",
    file: "c__Users_peter_AppData_Roaming_Cursor_User_workspaceStorage_dfee93f2c8aa805ecaf7401657718a60_images_logo2-voltrex-ffd40db9-8672-49fe-a0bd-0111502c6f57.png",
  },
  {
    id: "electra-power",
    file: "c__Users_peter_AppData_Roaming_Cursor_User_workspaceStorage_dfee93f2c8aa805ecaf7401657718a60_images_logo2-electra-power-3e593ed6-823a-47b1-83cf-788ae34508c2.png",
  },
  {
    id: "brightline",
    file: "c__Users_peter_AppData_Roaming_Cursor_User_workspaceStorage_dfee93f2c8aa805ecaf7401657718a60_images_logo2-brightline-b8b720a2-dafa-449e-96e0-ed77129bdead.png",
  },
  {
    id: "helix-energy",
    file: "c__Users_peter_AppData_Roaming_Cursor_User_workspaceStorage_dfee93f2c8aa805ecaf7401657718a60_images_logo2-helix-energy-b9b607ec-8104-4b4b-a30b-d59ca89d939a.png",
  },
  {
    id: "coronex",
    file: "c__Users_peter_AppData_Roaming_Cursor_User_workspaceStorage_dfee93f2c8aa805ecaf7401657718a60_images_logo2-coronex-efdea327-0fe4-4ea8-942a-66b492cea434.png",
  },
  {
    id: "siemens",
    file: "c__Users_peter_AppData_Roaming_Cursor_User_workspaceStorage_dfee93f2c8aa805ecaf7401657718a60_images_siemens-300x300-e5244f02-615e-4e27-809f-d9c9aec15ebe.png",
  },
]

function pixelStats(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return { max, chroma: max - min }
}

function isEdgeBackground(r, g, b) {
  const { max, chroma } = pixelStats(r, g, b)
  return max <= 30 && chroma <= 12
}

function isPureBlack(r, g, b) {
  const { max, chroma } = pixelStats(r, g, b)
  return max <= 18 && chroma <= 10
}

function isLogoPixel(r, g, b) {
  const { max, chroma } = pixelStats(r, g, b)
  return max > 30 || chroma > 12
}

function removeEdgeBackground(data, width, height) {
  const visited = new Uint8Array(width * height)
  const queue = []

  const pushIfBackground = (x, y) => {
    const idx = y * width + x
    if (visited[idx]) return
    const i = idx * 4
    if (!isEdgeBackground(data[i], data[i + 1], data[i + 2])) return
    visited[idx] = 1
    queue.push(idx)
  }

  for (let x = 0; x < width; x++) {
    pushIfBackground(x, 0)
    pushIfBackground(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    pushIfBackground(0, y)
    pushIfBackground(width - 1, y)
  }

  while (queue.length > 0) {
    const idx = queue.pop()
    const x = idx % width
    const y = (idx - x) / width
    const i = idx * 4
    data[i + 3] = 0

    if (x > 0) pushIfBackground(x - 1, y)
    if (x < width - 1) pushIfBackground(x + 1, y)
    if (y > 0) pushIfBackground(x, y - 1)
    if (y < height - 1) pushIfBackground(x, y + 1)
  }
}

function removeEnclosedBlackHoles(data, width, height) {
  const visited = new Uint8Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (visited[start]) continue

      const i = start * 4
      if (data[i + 3] === 0) continue
      if (!isPureBlack(data[i], data[i + 1], data[i + 2])) continue

      const region = []
      const queue = [start]
      visited[start] = 1
      let touchesLogo = false

      while (queue.length > 0) {
        const idx = queue.pop()
        region.push(idx)
        const px = idx % width
        const py = (idx - px) / width

        const neighbors = [
          [px - 1, py],
          [px + 1, py],
          [px, py - 1],
          [px, py + 1],
        ]

        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const nIdx = ny * width + nx
          const ni = nIdx * 4

          if (data[ni + 3] > 0 && isLogoPixel(data[ni], data[ni + 1], data[ni + 2])) {
            touchesLogo = true
          }

          if (visited[nIdx]) continue
          if (data[ni + 3] === 0) continue
          if (!isPureBlack(data[ni], data[ni + 1], data[ni + 2])) continue

          visited[nIdx] = 1
          queue.push(nIdx)
        }
      }

      if (!touchesLogo) {
        for (const idx of region) {
          data[idx * 4 + 3] = 0
        }
      }
    }
  }
}

function convertToGreySilhouette(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    data[i] = LOGO_GREY.r
    data[i + 1] = LOGO_GREY.g
    data[i + 2] = LOGO_GREY.b
  }
}

function cleanAlpha(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) {
      data[i + 3] = 0
    }
  }
}

function despeckle(data, width, height) {
  const alphas = new Uint8Array(width * height)
  for (let p = 0; p < alphas.length; p++) {
    alphas[p] = data[p * 4 + 3]
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x
      if (alphas[p] === 0) continue

      let strongNeighbors = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          if (alphas[ny * width + nx] > 180) strongNeighbors++
        }
      }

      if (strongNeighbors <= 1 && alphas[p] < 220) {
        data[p * 4 + 3] = 0
      }
    }
  }
}

async function processLogo(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  removeEdgeBackground(data, info.width, info.height)
  removeEnclosedBlackHoles(data, info.width, info.height)
  cleanAlpha(data)
  despeckle(data, info.width, info.height)
  convertToGreySilhouette(data)
  cleanAlpha(data)

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 16 })
    .png()
    .toBuffer()
}

mkdirSync(partnersDir, { recursive: true })

const newIds = new Set(SOURCES.map(({ id }) => id))

for (const { id, file } of SOURCES) {
  const inputBuffer = readFileSync(join(assetsDir, file))
  const output = await processLogo(inputBuffer)
  await sharp(output).toFile(join(partnersDir, `${id}.png`))
  console.log(`Wrote ${id}.png`)
}

for (const existing of readdirSync(partnersDir)) {
  if (!existing.endsWith(".png")) continue
  const logoId = existing.replace(/\.png$/, "")
  if (!newIds.has(logoId)) {
    unlinkSync(join(partnersDir, existing))
    console.log(`Removed ${existing}`)
  }
}
