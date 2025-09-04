"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, CheckCircle, Heart, Users, MessageCircle, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const onboardingSteps = [
  {
    title: "Welcome to DharmaSync",
    description: "Your journey to mindful productivity and meaningful community connections begins here.",
    icon: Heart,
    content: (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Heart className="h-10 w-10 text-primary" />
        </div>
        <p className="text-muted-foreground leading-relaxed">
          DharmaSync combines ancient wisdom with modern technology to help you live more mindfully, connect with your
          community, and achieve your goals with intention.
        </p>
      </div>
    ),
  },
  {
    title: "Let's Get to Know You",
    description: "Tell us your name so we can personalize your DharmaSync experience.",
    icon: User,
    content: (userName: string, setUserName: (name: string) => void) => (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="h-10 w-10 text-secondary" />
        </div>
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-base font-medium">
              What should we call you?
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-center text-lg h-12 glass-effect border-primary/30 focus:border-primary"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This helps us create a more personal and welcoming experience for you.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Mindful Task Management",
    description: "Transform your to-do list into a practice of conscious productivity.",
    icon: CheckCircle,
    content: (
      <div className="space-y-4">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg hover-lift">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm">Morning meditation (10 minutes)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg hover-lift">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm">Complete project proposal</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg hover-lift">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm">Evening gratitude practice</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Track both mindfulness practices and productive work with equal importance.
        </p>
      </div>
    ),
  },
  {
    title: "Community Connection",
    description: "Build meaningful relationships by offering and requesting help in your local area.",
    icon: Users,
    content: (
      <div className="space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
          <Users className="h-8 w-8 text-secondary" />
        </div>
        <div className="space-y-3">
          <Card className="p-3 border-border/50 hover-lift">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Anna nearby</p>
                <p className="text-xs text-muted-foreground">Offering: Fresh vegetables from garden</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 border-border/50 hover-lift">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium text-secondary-foreground">
                M
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mike nearby</p>
                <p className="text-xs text-muted-foreground">Requesting: Help moving furniture</p>
              </div>
            </div>
          </Card>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          See local offers and requests on an interactive map.
        </p>
      </div>
    ),
  },
  {
    title: "AI Mindfulness Guide",
    description: "Receive personalized guidance from our intelligent companion.",
    icon: MessageCircle,
    content: (
      <div className="space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-3">
          <div className="bg-card p-4 rounded-lg border-l-4 border-primary hover-lift">
            <p className="text-sm text-muted-foreground mb-2">AI Guide</p>
            <p className="text-sm">
              "I notice you've been feeling stressed lately. Would you like to try a 5-minute breathing exercise?"
            </p>
          </div>
          <div className="bg-secondary/5 p-4 rounded-lg border-l-4 border-secondary ml-8 hover-lift">
            <p className="text-sm text-muted-foreground mb-2">You</p>
            <p className="text-sm">"Yes, that would be helpful."</p>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <div className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary">Basic Model (Free)</div>
          <div className="px-3 py-1 bg-accent/10 rounded-full text-xs text-accent">Advanced Model (Premium)</div>
        </div>
      </div>
    ),
  },
  {
    title: "Ready to Begin",
    description: "Your mindful journey starts now. Let's create your first day of intentional living.",
    icon: Calendar,
    content: (userName: string) => (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="h-10 w-10 text-accent" />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">You're all set, {userName || "friend"}!</h3>
          <p className="text-muted-foreground leading-relaxed">
            Take a moment to breathe deeply and set an intention for your DharmaSync journey. Remember, every small step
            toward mindfulness creates ripples of positive change.
          </p>
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <Button className="w-full premium-button">
              <Link href="/dashboard">Enter Dashboard</Link>
            </Button>
            <Button variant="outline" className="w-full glass-button bg-transparent">
              <Link href="/tasks">Start with Tasks</Link>
            </Button>
          </div>
        </div>
      </div>
    ),
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const nextStep = () => {
    if (currentStep === 1 && userName.trim()) {
      localStorage.setItem("dharmaSync_userName", userName.trim())
    }

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (userName.trim()) {
      localStorage.setItem("dharmaSync_userName", userName.trim())
    }
    router.push("/dashboard")
  }

  const currentStepData = onboardingSteps[currentStep]
  const canProceed = currentStep !== 1 || userName.trim().length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content Card */}
        <Card className="border-border/50 shadow-lg glass-effect">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-foreground">{currentStepData.title}</CardTitle>
            <CardDescription className="text-base">{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="mb-8">
              {typeof currentStepData.content === "function"
                ? currentStepData.content(userName, setUserName)
                : currentStepData.content}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 glass-button bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < onboardingSteps.length - 1 ? (
                <Button onClick={nextStep} disabled={!canProceed} className="flex items-center gap-2 premium-button">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="flex items-center gap-2 premium-button">
                  Complete
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground glass-button">
            <Link href="/dashboard">Skip onboarding</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
