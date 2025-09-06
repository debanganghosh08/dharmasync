  'use client'

  import { useState, useEffect } from 'react'
  import { useSession } from 'next-auth/react'
  import { useRouter } from 'next/navigation'
  import { Navigation } from "@/components/navigation"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Textarea } from "@/components/ui/textarea"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { GoogleMap } from "@/components/google-map"
  import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

  import {
    MapPin,
    Plus,
    Search,
    Heart,
    Clock,
    User,
    MessageCircle,
    Map,
    List,
    Gift,
    HelpCircle,
    Loader2,
  } from "lucide-react"

  interface CommunityPost {
    id: string
    type: "offering" | "requesting"
    title: string
    description: string
    author: string
    location: string
    distance: number
    timeAgo: string
    responses: number
    coordinates: { lat: number; lng: number }
  }

  const samplePosts: CommunityPost[] = [
    {
      id: "1",
      type: "offering",
      title: "Fresh vegetables from my garden",
      description: "I have an abundance of tomatoes, cucumbers, and herbs. Happy to share with neighbors!",
      author: "Sarah M.",
      location: "Maple Street",
      distance: 0.3,
      timeAgo: "2 hours ago",
      responses: 3,
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    {
      id: "2",
      type: "requesting",
      title: "Help moving furniture this weekend",
      description: "Moving to a new apartment and could use some help with heavy furniture. Pizza and drinks provided!",
      author: "Mike R.",
      location: "Oak Avenue",
      distance: 0.7,
      timeAgo: "4 hours ago",
      responses: 1,
      coordinates: { lat: 37.7849, lng: -122.4094 },
    },
    {
      id: "3",
      type: "offering",
      title: "Free piano lessons for beginners",
      description: "I'm a music teacher offering free piano lessons for kids in the neighborhood. 30 min sessions.",
      author: "Emma L.",
      location: "Pine Street",
      distance: 1.2,
      timeAgo: "1 day ago",
      responses: 7,
      coordinates: { lat: 37.7649, lng: -122.4294 },
    },
    {
      id: "4",
      type: "requesting",
      title: "Dog walking while I'm at work",
      description: "Looking for someone to walk my golden retriever during weekday afternoons. Will pay $15/walk.",
      author: "David K.",
      location: "Cedar Lane",
      distance: 0.9,
      timeAgo: "2 days ago",
      responses: 2,
      coordinates: { lat: 37.7549, lng: -122.4394 },
    },
    {
      id: "5",
      type: "offering",
      title: "Homemade bread and pastries",
      description: "I love baking and always make too much! Fresh sourdough, croissants, and cookies available.",
      author: "Maria G.",
      location: "Elm Street",
      distance: 0.5,
      timeAgo: "3 days ago",
      responses: 5,
      coordinates: { lat: 37.7449, lng: -122.4494 },
    },
  ]

  export default function CommunityPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [posts, setPosts] = useState<CommunityPost[]>(samplePosts)
    const [view, setView] = useState<"list" | "map">("list")
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [newPost, setNewPost] = useState({
      type: "offering" as "offering" | "requesting",
      title: "",
      description: "",
      location: "",
    })

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

    const filteredPosts = posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })

    const createPost = () => {
      if (!newPost.title.trim() || !newPost.description.trim()) return

      const post: CommunityPost = {
        id: Date.now().toString(),
        type: newPost.type,
        title: newPost.title,
        description: newPost.description,
        author: session?.user?.name || "You",
        location: newPost.location || "Your Location",
        distance: 0,
        timeAgo: "Just now",
        responses: 0,
        coordinates: { lat: 37.7749 + Math.random() * 0.01, lng: -122.4194 + Math.random() * 0.01 },
      }

      setPosts([post, ...posts])
      setNewPost({
        type: "offering",
        title: "",
        description: "",
        location: "",
      })
      setIsCreatingPost(false)
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Community Hub</h1>
              <p className="text-muted-foreground">Connect with neighbors to offer and request help</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Community Post</DialogTitle>
                    <DialogDescription>Share what you're offering or what you need help with.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="postType">Post Type</Label>
                      <Select
                        value={newPost.type}
                        onValueChange={(value: "offering" | "requesting") => setNewPost({ ...newPost, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offering">Offering Help</SelectItem>
                          <SelectItem value="requesting">Requesting Help</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="What are you offering or requesting?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Provide more details..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        value={newPost.location}
                        onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                        placeholder="e.g., Main Street, Downtown"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={createPost} className="flex-1">
                        Create Post
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingPost(false)} className="bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* View Toggle and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Tabs value={view} onValueChange={(value) => setView(value as "list" | "map")} className="flex-1">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Map View
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {view === "list" ? (
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try adjusting your search or filters"
                        : "Be the first to create a community post"}
                    </p>
                    <Button onClick={() => setIsCreatingPost(true)} variant="outline" className="bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                post.type === "offering" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                              }`}
                            >
                              {post.type === "offering" ? (
                                <Gift className="h-5 w-5" />
                              ) : (
                                <HelpCircle className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{post.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{post.author}</span>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{post.distance} miles away</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{post.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{post.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  post.type === "offering"
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-secondary/10 text-secondary border-secondary/20"
                                }
                              >
                                {post.type === "offering" ? "Offering" : "Requesting"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.responses} responses</span>
                              </div>
                              <Button size="sm" variant="outline" className="bg-transparent" onClick={() => {
                                  setView("map");
                                  setSelectedPost(post);
                                }}>
                                <Heart className="h-4 w-4 mr-2" />
                                Connect
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-secondary" />
                    Interactive Community Map
                  </CardTitle>
                  <CardDescription>
                    View local offers and requests on an interactive map. Click pins to see details and connect with
                    neighbors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GoogleMap posts={filteredPosts} selectedPost={selectedPost} />
                </CardContent>
              </Card>

              {/* Map Legend */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Offering Help</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-secondary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Requesting Help</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }
