const fs = require("fs")
const path = require("path")

const src = path.join(
  process.env.USERPROFILE,
  ".cursor",
  "projects",
  "c-Users-peter-Desktop-Git-Hub-Repo-s-v0-electrical-landing-page-main",
  "assets"
)
const dst = path.join(__dirname, "public", "services")

fs.mkdirSync(dst, { recursive: true })

const files = fs.readdirSync(src)
console.log("Assets:", files)

const map = [
  ["voltguard-smart-thermostat", "smart-home-automation.png"],
  ["voltguard-tesla-charger", "ev-charger-installation.png"],
  ["93ee8fea", "home-backup-generator.png"],
]

for (const file of files) {
  for (const [key, outName] of map) {
    if (file.includes(key)) {
      fs.copyFileSync(path.join(src, file), path.join(dst, outName))
      console.log("Copied:", outName)
    }
  }
}

console.log("Done:", fs.readdirSync(dst))
