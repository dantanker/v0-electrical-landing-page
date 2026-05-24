import type { MetadataRoute } from "next"
import { SITE_HEADLINE } from "@/lib/constants"
import { SITE_NAME } from "@/lib/site-metadata"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "VoltGuard",
    description: SITE_HEADLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#f97316",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
