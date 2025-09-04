"use client"

import { useEffect, useRef, useState } from "react"

interface Post {
  id: string
  type: "offering" | "requesting"
  title: string
  description: string
  category: string
  author: string
  location: string
  distance: number
  timeAgo: string
  responses: number
  coordinates: { lat: number; lng: number }
}

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
  posts?: Post[]
  selectedPost?: Post | null
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMap({ apiKey, posts, selectedPost }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !apiKey) return

    const initMap = () => {
      try {
        if (!mapRef.current || !window.google) return

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 13,
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

        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer()
        directionsRenderer.setMap(map)

        posts?.forEach((post) => {
          const marker = new window.google.maps.Marker({
            position: post.coordinates,
            map: map,
            title: post.title,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: post.type === "offering" ? "#d7c49e" : "#d9a26b",
              fillOpacity: 0.9,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            },
          })

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 280px; font-family: 'Batangas', system-ui, sans-serif;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2d2d2d;">${post.title}</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #666;">${post.description}</p>
                <button style="width: 100%; background: #d7c49e; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
                  Connect
                </button>
              </div>
            `,
          })

          marker.addListener("click", () => {
            if ((map as any).openInfoWindow) {
              (map as any).openInfoWindow.close()
            }
            infoWindow.open(map, marker)
            ;(map as any).openInfoWindow = infoWindow
          })
        })

        if (selectedPost && userLocation) {
          const request = {
            origin: userLocation,
            destination: selectedPost.coordinates,
            travelMode: "DRIVING",
          }
          directionsService.route(request, (result, status) => {
            if (status == "OK") {
              directionsRenderer.setDirections(result)
            }
          })
        }
      } catch (err) {
        console.error("Error initializing map:", err)
      }
    }

    if (typeof window.google === "undefined") {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing&callback=initMap`
      script.async = true
      script.defer = true
      ;(window as any).initMap = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [apiKey, posts, selectedPost, userLocation])

  

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px" }}
    />
  )
}