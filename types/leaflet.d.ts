declare namespace L {
  interface Map {
    remove(): void
    invalidateSize(): void
    zoomIn(): void
    zoomOut(): void
    fitBounds(bounds: LatLngBounds, options?: { padding?: [number, number] }): void
  }

  interface LatLngBounds {}

  interface Marker {
    addTo(map: Map): Marker
  }

  interface Circle {
    addTo(map: Map): Circle
    getBounds(): LatLngBounds
  }

  interface TileLayer {
    addTo(map: Map): TileLayer
  }

  interface DivIcon {}

  function map(element: HTMLElement, options?: Record<string, unknown>): Map
  function tileLayer(url: string, options?: Record<string, unknown>): TileLayer
  function marker(latlng: [number, number], options?: Record<string, unknown>): Marker
  function circle(latlng: [number, number], options?: Record<string, unknown>): Circle
  function divIcon(options?: Record<string, unknown>): DivIcon
}

interface Window {
  L?: typeof L
}
