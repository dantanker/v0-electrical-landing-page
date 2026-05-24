import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, "..")
const dest = join(rootDir, "public", "og", "voltguard-og.png")

const candidates = [
  join(rootDir, "assets", "voltguard-og-source.png"),
  process.argv[2],
].filter(Boolean)

const source = candidates.find((path) => existsSync(path))

if (!source) {
  console.error("Source image not found. Pass a path or place assets/voltguard-og-source.png")
  process.exit(1)
}

mkdirSync(dirname(dest), { recursive: true })

const { width, height } = await sharp(source).metadata()
await sharp(source)
  .resize(1200, 630, { fit: "cover", position: "top" })
  .png()
  .toFile(dest)

console.log(`Updated ${dest} from ${source} (${width}x${height} -> 1200x630)`)
