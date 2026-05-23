const fs = require("fs")
const path = require("path")

const wrong = path.join(__dirname, "public", "services")
const right = path.join(__dirname, "..", "public", "services")

fs.mkdirSync(right, { recursive: true })

if (fs.existsSync(wrong)) {
  for (const file of fs.readdirSync(wrong)) {
    fs.renameSync(path.join(wrong, file), path.join(right, file))
    console.log("Moved:", file)
  }
  fs.rmSync(path.join(__dirname, "public"), { recursive: true, force: true })
}

console.log("Public services:", fs.readdirSync(right))
