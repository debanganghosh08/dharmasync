import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_GEOCODING_API_KEY = "AIzaSyDZ4Ex3c76rsq88tFa_VhQ_RX8c1DJnP_8"

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_GEOCODING_API_KEY}`,
    )

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return NextResponse.json({
        lat: location.lat,
        lng: location.lng,
        formatted_address: data.results[0].formatted_address,
      })
    } else {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
