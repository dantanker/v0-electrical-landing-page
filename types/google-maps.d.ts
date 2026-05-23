declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions)
  }

  class Marker {
    constructor(opts?: MarkerOptions)
  }

  interface MapOptions {
    center?: LatLngLiteral
    zoom?: number
    styles?: MapTypeStyle[]
    disableDefaultUI?: boolean
    zoomControl?: boolean
    gestureHandling?: string
    clickableIcons?: boolean
  }

  interface MarkerOptions {
    position?: LatLngLiteral
    map?: Map
    title?: string
    icon?: Symbol | Icon | string
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface MapTypeStyle {
    featureType?: string
    elementType?: string
    stylers?: Record<string, string | number>[]
  }

  interface Symbol {
    path?: SymbolPath | string
    scale?: number
    fillColor?: string
    fillOpacity?: number
    strokeColor?: string
    strokeWeight?: number
  }

  enum SymbolPath {
    CIRCLE = 0,
  }
}

interface Window {
  google?: typeof google
}

declare const google: {
  maps: typeof google.maps
}
