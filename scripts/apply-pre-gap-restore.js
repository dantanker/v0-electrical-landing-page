const fs = require("fs");
const path = require("path");

const repoRoot =
  "C:/Users/peter/Desktop/Git Hub Repo's/v0-electrical-landing-page-main";
const restoreDir = path.join(repoRoot, "_pre_gap_restore");

const map = {
  "app__layout.tsx": "app/layout.tsx",
  "app__page.tsx": "app/page.tsx",
  "components__SpotlightButton.tsx": "components/SpotlightButton.tsx",
  "components__voltguard__features-matrix.tsx":
    "components/voltguard/features-matrix.tsx",
  "components__voltguard__footer.tsx": "components/voltguard/footer.tsx",
  "components__voltguard__header.tsx": "components/voltguard/header.tsx",
  "components__voltguard__hero-section.tsx":
    "components/voltguard/hero-section.tsx",
  "components__voltguard__lead-capture-form.tsx":
    "components/voltguard/lead-capture-form.tsx",
  "components__voltguard__partner-marquee.tsx":
    "components/voltguard/partner-marquee.tsx",
  "components__voltguard__quote-cta-button.tsx":
    "components/voltguard/quote-cta-button.tsx",
  "components__voltguard__service-area-cards.tsx":
    "components/voltguard/service-area-cards.tsx",
  "components__voltguard__service-area-section.tsx":
    "components/voltguard/service-area-section.tsx",
  "components__voltguard__services-grid.tsx":
    "components/voltguard/services-grid.tsx",
  "components__voltguard__shield-map.tsx":
    "components/voltguard/shield-map.tsx",
  "components__voltguard__social-proof.tsx":
    "components/voltguard/social-proof.tsx",
  "components__voltguard__why-us-accordion.tsx":
    "components/voltguard/why-us-accordion.tsx",
  "lib__constants.ts": "lib/constants.ts",
};

for (const [fileName, relPath] of Object.entries(map)) {
  const src = path.join(restoreDir, fileName);
  const dest = path.join(repoRoot, relPath);
  if (!fs.existsSync(src)) {
    console.log(`SKIP missing restore file: ${fileName}`);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, fs.readFileSync(src, "utf8"), "utf8");
  console.log(`Restored ${relPath}`);
}
