'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Users, MessageCircle, Plus, Calendar, Heart, MapPin, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [intention, setIntention] = useState(
    "I will approach each task with presence and compassion, taking breaks to breathe mindfully."
  );
  const [newIntention, setNewIntention] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  const handleSaveIntention = () => {
    if (newIntention.trim()) {
      setIntention(newIntention.trim());
    }
    setIsDialogOpen(false);
  };

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {greeting}, {session?.user?.name || "friend"}
          </h1>
          <p className="text-muted-foreground">Take a moment to breathe and set your intention for today.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Focus */}
            <Card className="border-border/50 hover-lift">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Today's Mindful Focus
                  </CardTitle>
                  <CardDescription>Your intention for today</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="premium-button bg-transparent" onClick={() => setNewIntention(intention)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Set Intention
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Set Your Intention</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="intention" className="text-right">
                          Intention
                        </Label>
                        <Input
                          id="intention"
                          value={newIntention}
                          onChange={(e) => setNewIntention(e.target.value)}
                          className="col-span-3"
                          placeholder="What is your focus for today?"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" onClick={handleSaveIntention}>Save Intention</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">Today's Intention</p>
                  <p className="text-foreground">
                    "{intention}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Task Overview */}
            <Card className="border-border/50 hover-lift">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    Today's Tasks
                  </CardTitle>
                  <CardDescription>Mindful productivity in action</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="premium-button bg-transparent">
                  <Link href="/tasks">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30 hover-lift">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Morning meditation</span>
                    <Badge variant="secondary" className="text-xs">
                      Mindfulness
                    </Badge>
                  </div>
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30 hover-lift">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm">Complete project proposal</span>
                    <Badge variant="outline" className="text-xs">
                      Work
                    </Badge>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/30 hover-lift">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm">Evening gratitude practice</span>
                    <Badge variant="secondary" className="text-xs">
                      Mindfulness
                    </Badge>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Community Activity */}
            <Card className="border-border/50 hover-lift">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Community Activity
                  </CardTitle>
                  <CardDescription>Recent connections in your area</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="premium-button bg-transparent">
                  <Link href="/community">View Community</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/30 hover-lift">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Sarah</span>
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">0.3 miles away</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Offering: Fresh herbs from my garden</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/30 hover-lift">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium text-secondary-foreground">
                    M
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Mike</span>
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">0.7 miles away</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Requesting: Help with moving boxes</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    2h ago
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50 hover-lift">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start premium-button bg-transparent" variant="outline">
                  <Link href="/tasks">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start premium-button bg-transparent" variant="outline">
                  <Link href="/community">
                    <Users className="h-4 w-4 mr-2" />
                    Post to Community
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start premium-button bg-transparent" variant="outline">
                  <Link href="/chatbot">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with AI Guide
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start premium-button bg-transparent" variant="outline">
                  <Link href="/calendar">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mindfulness Progress */}
            <Card className="border-border/50 hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Mindfulness Tasks</span>
                    <span className="text-muted-foreground">12/15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Community Interactions</span>
                    <span className="text-muted-foreground">5/7</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Reflections</span>
                    <span className="text-muted-foreground">6/7</span>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
