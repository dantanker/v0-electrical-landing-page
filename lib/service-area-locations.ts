export type ServiceAreaLocation = {
  name: string
  lat: number
  lng: number
}

/** Chicago-area service zone center (map + pin) */
export const SERVICE_AREA_CENTER = { lat: 42.0664, lng: -87.9373 }

export const SERVICE_ZONE_RADIUS_MILES = 40
export const SERVICE_ZONE_RADIUS_METERS = SERVICE_ZONE_RADIUS_MILES * 1609.344

export const SERVICE_AREA_LOCATIONS: ServiceAreaLocation[] = [
  { name: "Arlington Heights", lat: 42.0884, lng: -87.9806 },
  { name: "Schaumburg", lat: 42.0334, lng: -88.0834 },
  { name: "Palatine", lat: 42.1103, lng: -88.0342 },
  { name: "Hoffman Estates", lat: 42.0428, lng: -88.0798 },
]
