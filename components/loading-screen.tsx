"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 4500 // 4.5 seconds
    const interval = 50 // Update progress every 50ms
    const totalSteps = totalDuration / interval
    let currentStep = 0

    const progressTimer = setInterval(() => {
      currentStep++
      const newProgress = (currentStep / totalSteps) * 100
      setProgress(newProgress)
    }, interval)

    const completionTimer = setTimeout(() => {
      clearInterval(progressTimer)
      onComplete()
    }, totalDuration)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(completionTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-card to-background flex items-center justify-center z-100">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="DharmaSync Logo"
          width={300} 
          height={300}
          className="mx-auto mb-8 animate-fade-in"
        />
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-200 to-yellow-600 transition-all ease-out duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}