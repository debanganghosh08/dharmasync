import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Code, Target, Lightbulb, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 glass-effect">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">About DharmaSync</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where ancient wisdom meets modern technology for mindful living
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Main Story */}
          <Card className="border-border/50 hover-lift glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="h-6 w-6 text-accent" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to DharmaSync, a project born from the "Code Veda Hackathon" and the guiding principle of
                "Digital Dharma." We believe that technology should serve a higher purpose: to enrich our lives, not
                overwhelm them.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey began with a shared frustration over the modern epidemic of digital overload and
                distraction, which often leaves us feeling scattered and disconnected from ourselves and our
                communities.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-primary mb-1">Our Mission</p>
                <p className="text-foreground">
                  To create technology that promotes mindfulness, community connection, and intentional living in our
                  digital age.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="border-border/50 hover-lift glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-secondary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We envision a world where technology serves as a bridge to deeper self-awareness and stronger community
                bonds, rather than a source of distraction and isolation.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/30">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Mindful Productivity</p>
                    <p className="text-xs text-muted-foreground">Balance work and wellness with intention</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/30">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Community Connection</p>
                    <p className="text-xs text-muted-foreground">Foster meaningful local relationships</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/30">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Spiritual Growth</p>
                    <p className="text-xs text-muted-foreground">Integrate ancient wisdom with modern life</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border/50 hover-lift glass-effect text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Code Veda Origins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Born from the Code Veda Hackathon, where developers unite ancient wisdom with cutting-edge technology.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover-lift glass-effect text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-lg">Community First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Building stronger local communities through technology that encourages real-world connections.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover-lift glass-effect text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-lg">Digital Dharma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Applying dharmic principles to create technology that serves humanity's highest good.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 hover-lift glass-effect">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Mindful Community</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to transform your relationship with technology and connect with like-minded individuals in your
              area? Start your journey with DharmaSync today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="premium-button">
                <Link href="/onboarding">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="glass-button bg-transparent">
                <Link href="/community">Explore Community</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary hover-lift">
                <h3 className="font-semibold text-primary mb-2">Mindfulness</h3>
                <p className="text-sm text-muted-foreground">
                  Every feature is designed to promote present-moment awareness and intentional action.
                </p>
              </div>
              <div className="bg-secondary/5 p-6 rounded-lg border-l-4 border-secondary hover-lift">
                <h3 className="font-semibold text-secondary mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Technology should bring people together, not drive them apart.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-accent/5 p-6 rounded-lg border-l-4 border-accent hover-lift">
                <h3 className="font-semibold text-accent mb-2">Balance</h3>
                <p className="text-sm text-muted-foreground">
                  Harmonizing productivity with well-being, work with rest, digital with physical.
                </p>
              </div>
              <div className="bg-muted/5 p-6 rounded-lg border-l-4 border-muted hover-lift">
                <h3 className="font-semibold text-muted-foreground mb-2">Authenticity</h3>
                <p className="text-sm text-muted-foreground">
                  Genuine connections and honest self-reflection in a world of digital facades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
