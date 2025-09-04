'use client'

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Edit, Save, X, Camera, Loader2 } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  address: string
  gender: string
  profilePicture: string
  age: number | string
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    address: "",
    gender: "",
    profilePicture: "",
    age: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)
  const [isUploading, setIsUploading] = useState(false)
  const [imageBase64, setImageBase64] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session) {
      setProfile({
        name: session.user?.name || "",
        email: session.user?.email || "",
        address: (session.user as any)?.address || "",
        gender: (session.user as any)?.gender || "",
        profilePicture: session.user?.image || "",
        age: (session.user as any)?.age || "",
      })
      setEditedProfile({
        name: session.user?.name || "",
        email: session.user?.email || "",
        address: (session.user as any)?.address || "",
        gender: (session.user as any)?.gender || "",
        profilePicture: session.user?.image || "",
        age: (session.user as any)?.age || "",
      })
    }
  }, [session, status, router])

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: (session?.user as any)?.id, updates: { ...editedProfile, profilePicture: imageBase64 } }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const { profilePicture: newProfilePicture } = await res.json();

      await update({
          ...session,
          user: {
              ...session?.user,
              name: editedProfile.name,
              email: editedProfile.email,
              image: newProfilePicture,
              address: editedProfile.address,
              gender: editedProfile.gender,
              age: editedProfile.age,
          }
      })
      setProfile({ ...editedProfile, profilePicture: newProfilePicture })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setEditedProfile({ ...editedProfile, profilePicture: reader.result as string })
        setImageBase64(reader.result as string)
        setIsUploading(false)
      }
    }
  }

  const getInitials = (name: string) => {
    if (!name) return ''
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (status === 'loading') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 glass-effect hover-lift">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <Card className="border-border/50 glass-effect hover-lift">
          <CardHeader className="text-center pb-6">
            <div className="relative mx-auto mb-4">
              <Avatar className="w-24 h-24 mx-auto glass-effect border-2 border-primary/20">
                <AvatarImage src={isEditing ? editedProfile.profilePicture : profile.profilePicture} />
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {getInitials(isEditing ? editedProfile.name : profile.name) || "U"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors glass-button">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              )}
            </div>
            <CardTitle className="text-2xl">{profile.name || "Welcome to DharmaSync"}</CardTitle>
            <CardDescription>{profile.email || "Complete your profile to get started"}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <div className="p-3 bg-card/50 rounded-lg border border-border/30">
                      <p className="text-foreground">{profile.name || "Not set"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="p-3 bg-card/50 rounded-lg border border-border/30">
                      <p className="text-foreground">{profile.email || "Not set"}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <div className="p-3 bg-card/50 rounded-lg border border-border/30">
                      <p className="text-foreground">{profile.address || "Not set"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                    <div className="p-3 bg-card/50 rounded-lg border border-border/30">
                      <p className="text-foreground">{profile.gender || "Not set"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                    <div className="p-3 bg-card/50 rounded-lg border border-border/30">
                      <p className="text-foreground">{profile.age || "Not set"}</p>
                    </div>
                  </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full premium-button bg-primary hover:bg-primary/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      placeholder="Enter your name"
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      placeholder="Enter your email"
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    placeholder="Enter your address"
                    className="glass-effect border-primary/30 focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                            value={editedProfile.gender}
                            onValueChange={(value) => setEditedProfile({ ...editedProfile, gender: value })}
                        >
                            <SelectTrigger className="glass-effect border-primary/30">
                            <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent className="glass-effect border-border/50">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                        id="age"
                        type="number"
                        value={editedProfile.age}
                        onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                        placeholder="Enter your age"
                        className="glass-effect border-primary/30 focus:border-primary"
                        />
                    </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1 premium-button bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 glass-button bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-border/50 glass-effect hover-lift mt-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Mindful Journey</h3>
              <p className="text-sm text-muted-foreground">
                Your profile helps us personalize your DharmaSync experience and connect you with your local mindfulness
                community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
