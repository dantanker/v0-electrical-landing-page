import sharp from "sharp"
import { readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const partnersDir = join(__dirname, "..", "public", "partners")
const LOGO_GREY = { r: 196, g: 203, b: 212 }

const files = readdirSync(partnersDir).filter((name) => name.endsWith(".png"))

for (const file of files) {
  const inputPath = join(partnersDir, file)
  const inputBuffer = readFileSync(inputPath)
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    data[i] = LOGO_GREY.r
    data[i + 1] = LOGO_GREY.g
    data[i + 2] = LOGO_GREY.b
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(inputPath)

  console.log(`Recolored ${file}`)
}
