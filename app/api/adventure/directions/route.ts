import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_ROUTES_API_KEY = "AIzaSyDZ4Ex3c76rsq88tFa_VhQ_RX8c1DJnP_8"

export async function POST(request: NextRequest) {
  try {
    const { origin, destination } = await request.json()

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_ROUTES_API_KEY}`,
    )

    const data = await response.json()

    if (data.status === "OK" && data.routes.length > 0) {
      const route = data.routes[0]
      const leg = route.legs[0]

      return NextResponse.json({
        distance: leg.distance.text,
        duration: leg.duration.text,
        steps: leg.steps.map((step: any) => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ""),
          distance: step.distance.text,
          duration: step.duration.text,
        })),
      })
    } else {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Directions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
