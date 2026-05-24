import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, "..")
const sourceSvg = join(rootDir, "public", "icon.svg")
const iconsDir = join(rootDir, "public", "icons")

const sizes = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
]

async function generateIcons() {
  await mkdir(iconsDir, { recursive: true })

  for (const { name, size } of sizes) {
    await sharp(sourceSvg)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, name))
    console.log(`Created ${name}`)
  }
}

generateIcons().catch((error) => {
  console.error(error)
  process.exit(1)
})
