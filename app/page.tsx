"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Users, CheckSquare, MessageCircle, Calendar, ArrowRight } from "lucide-react"

// Mock component implementations for shadcn/ui components to make the code runnable in a single file
const Button = ({ children, className, ...props }) => (
  <button className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div className={`rounded-3xl border border-gray-200/50 backdrop-blur-md p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-0 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-0 pt-2 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-xl font-bold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
);

const quotes = [
  {
    text: "Arise, awake and stop not till the goal is reached.",
    author: "Swami Vivekananda",
  },
  {
    text: "You have to grow from the inside out. None can teach you, none can make you spiritual. There is no other teacher but your own soul.",
    author: "Swami Vivekananda",
  },
  {
    text: "Give me blood, and I shall give you freedom!",
    author: "Netaji Subhas Chandra Bose",
  },
  {
    text: "One individual may die for an idea, but that idea will, after his death, incarnate itself in a thousand lives.",
    author: "Netaji Subhas Chandra Bose",
  },
  {
    text: "Faith is the bird that feels the light when the dawn is still dark.",
    author: "Rabindranath Tagore",
  },
]

export default function HomePage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
        setIsVisible(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bonheur+Royale&family=Eagle+Lake&family=Mr+Dafoe&family=Outfit:wght@100..900&family=Poiret+One&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" />

      {/* Hero Section with Video and Text Overlay */}
      <div className="relative w-full h-[73vh] overflow-hidden rounded-b-[2rem] shadow-xl">
        <video
          src="/landingvideo.mp4"
          onLoadedData={handleVideoLoad}
          autoPlay
          loop
          muted
          className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <h1 
            className={`font-['Eagle_Lake'] text-7xl font-bold text-foreground leading-none transition-all duration-1000 ease-out ${videoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            DharmaSync
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cultivate mindfulness, build community, and enhance productivity through conscious living and meaningful
            connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="premium-button bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <a href="/onboarding" className="flex items-center justify-center">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="glass-button bg-transparent">
              <a href="/community">Explore Community</a>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-border/50 glass-effect hover-lift">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 glass-button">
                <CheckSquare className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Mindful Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Track your daily mindfulness practices and productive activities with intention.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-effect hover-lift">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4 glass-button">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Local Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Connect with neighbors to offer and request help, building real-world relationships.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-effect hover-lift">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 glass-button">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">AI Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Receive personalized mindfulness guidance through our intelligent chatbot companion.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-effect hover-lift">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 glass-button">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Sacred Adventures</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Discover holy places and spiritual destinations across India with guided navigation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Daily Quote Section */}
        <Card className="max-w-2xl mx-auto glass-effect border-border/30 hover-lift bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Daily Reflection</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <blockquote className="text-lg italic text-muted-foreground mb-4">
                "{quotes[currentQuoteIndex].text}"
              </blockquote>
              <cite className="text-sm text-muted-foreground">— {quotes[currentQuoteIndex].author}</cite>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
