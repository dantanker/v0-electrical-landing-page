import { spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, "..")
const outputPath = join(rootDir, "public", "og", "voltguard-og.png")
const port = Number(process.env.OG_CAPTURE_PORT ?? 3456)
const baseUrl = `http://127.0.0.1:${port}`

function waitForServer(url, timeoutMs = 120_000) {
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url)
        if (res.ok) {
          resolve(undefined)
          return
        }
      } catch {
        // Server not ready yet
      }

      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`))
        return
      }

      setTimeout(tick, 500)
    }

    tick()
  })
}

function startServer() {
  const child = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    cwd: rootDir,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, PORT: String(port) },
  })

  return child
}

async function capture() {
  await mkdir(dirname(outputPath), { recursive: true })

  let server = null
  let startedServer = false

  try {
    await fetch(baseUrl)
  } catch {
    console.log(`Starting production server on ${baseUrl}...`)
    server = startServer()
    startedServer = true
    await waitForServer(baseUrl)
  }

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  })

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 })
    await page.waitForTimeout(1500)

    await page.screenshot({
      path: outputPath,
      type: "png",
      clip: { x: 40, y: 0, width: 1200, height: 630 },
    })

    console.log(`Saved OG image to ${outputPath}`)
  } finally {
    await browser.close()
    if (startedServer && server) {
      server.kill("SIGTERM")
    }
  }
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
