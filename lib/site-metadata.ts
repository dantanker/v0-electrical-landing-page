import type { Metadata } from "next"
import { PHONE_NUMBER, SITE_HEADLINE } from "./constants"

export const SITE_NAME = "VoltGuard Electrical"
export const DEFAULT_SITE_URL = "https://voltguard.com"

export const SITE_DESCRIPTION = `Licensed electrician in Chicago's NW suburbs. 24/7 emergency service, panel upgrades, EV chargers & smart home wiring. Free quotes — call ${PHONE_NUMBER}.`

export const OG_TITLE = `${SITE_NAME} | ${SITE_HEADLINE}`
export const OG_DESCRIPTION =
  "Licensed Chicagoland electrician. 24/7 emergency service, panel upgrades, EV chargers & more. Free quotes."

export const OG_IMAGE_ALT = `${SITE_NAME} — ${SITE_HEADLINE} — Chicagoland electrician`

export const KEYWORDS = [
  "emergency electrician",
  "Chicago electrician",
  "Arlington Heights electrician",
  "Schaumburg electrician",
  "24/7 electrical service",
  "panel upgrade",
  "EV charger installation",
  "Mt Prospect electrician",
] as const

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!url) return DEFAULT_SITE_URL
  return url.replace(/\/$/, "")
}

export function getOgImagePath(): string {
  return process.env.NEXT_PUBLIC_OG_IMAGE_PATH?.trim() || "/og/voltguard-og.png"
}

export function buildSiteMetadata(): Metadata {
  const ogImagePath = getOgImagePath()

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${SITE_NAME} | ${SITE_HEADLINE} | Chicago NW Suburbs`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Home Services",
    keywords: [...KEYWORDS],
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: "/",
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      images: [
        {
          url: ogImagePath,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/icons/apple-touch-icon.png",
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.webmanifest",
  }
}

export const siteMetadata = buildSiteMetadata()
