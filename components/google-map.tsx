"use client"

import { useEffect, useRef, useState } from "react"

interface HolyPlace {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  significance: string
  bestTime: string
  image: string
}

interface GoogleMapProps {
  apiKey: string
  places?: HolyPlace[]
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMap({ apiKey, places }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [map, setMap] = useState<any>(null)
  const [infoWindow, setInfoWindow] = useState<any>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
        }
      )
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !apiKey) return

    const initMap = () => {
      try {
        if (!mapRef.current || !window.google) return

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 },
          zoom: 5,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f3e7" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#d7c49e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#e3d9c7" }],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        setMap(mapInstance)

        const infoWindowInstance = new window.google.maps.InfoWindow()
        setInfoWindow(infoWindowInstance)

        places?.forEach((place) => {
          const marker = new window.google.maps.Marker({
            position: place.coordinates,
            map: mapInstance,
            title: place.name,
          })

          marker.addListener("click", () => {
            if (infoWindowInstance) {
              infoWindowInstance.close()
              infoWindowInstance.setContent(`
                <div style="padding: 12px; max-width: 280px; font-family: 'Batangas', system-ui, sans-serif;">
                  <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2d2d2d;">${place.name}</h3>
                  <p style="margin: 8px 0; font-size: 14px; color: #666;">${place.description}</p>
                  <button id="connect-button-${place.id}" style="width: 100%; background: #d7c49e; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
                    Connect
                  </button>
                  <div id="distance-${place.id}" style="margin-top: 8px; font-size: 14px; color: #333;"></div>
                </div>
              `)
              infoWindowInstance.open(mapInstance, marker)

              const connectButton = document.getElementById(`connect-button-${place.id}`)
              if (connectButton) {
                connectButton.addEventListener("click", () => {
                  handleConnect(place)
                })
              }
            }
          })
        })
      } catch (err) {
        console.error("Error initializing map:", err)
      }
    }

    if (typeof window.google === "undefined") {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry&callback=initMap`
      script.async = true
      script.defer = true
      ;(window as any).initMap = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [apiKey, places])

  const handleConnect = (place: HolyPlace) => {
    if (userLocation) {
      const origin = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
      const destination = new window.google.maps.LatLng(place.coordinates.lat, place.coordinates.lng);
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
      const distanceInKm = (distance / 1000).toFixed(2);
      const distanceDiv = document.getElementById(`distance-${place.id}`)
      if (distanceDiv) {
        distanceDiv.innerHTML = `Distance: ${distanceInKm} km`
      }
    } else {
      const distanceDiv = document.getElementById(`distance-${place.id}`)
      if (distanceDiv) {
        distanceDiv.innerHTML = `Please enable location services to calculate the distance.`
      }
    }
  }

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px" }}
    />
  )
}