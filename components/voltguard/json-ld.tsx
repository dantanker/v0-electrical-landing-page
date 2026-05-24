import { buildStructuredDataGraph } from "@/lib/structured-data"

export function JsonLd() {
  const data = buildStructuredDataGraph()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
