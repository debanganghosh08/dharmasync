'use client'

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mentors = [
  {
    name: "Dr. Anya Sharma",
    title: "Certified Psychologist",
    bio: "Dr. Sharma specializes in cognitive-behavioral therapy and helps clients overcome anxiety, depression, and procrastination. She is passionate about empowering individuals to build resilient minds.",
    image: "/doc1.jpg",
  },
  {
    name: "Dr. Rahul Kapoor",
    title: "Mindfulness Coach",
    bio: "Rahul is a certified mindfulness and meditation coach with over 10 years of experience. He helps clients develop a deeper connection with their inner selves and cultivate a sense of calm and focus.",
    image: "/doc3.jpg",
  },
  {
    name: "Priya Singh",
    title: "Habit Formation Specialist",
    bio: "Priya is an expert in the science of habit formation. She works with clients to create sustainable routines and break free from negative patterns, leading to long-term personal growth.",
    image: "/doc2.jpg",
  },
];

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Connect with a Mentor</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to mental well-being and personal growth, guided by certified professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <Card key={index} className="border-border/50 hover-lift glass-effect overflow-hidden flex flex-col items-center p-6">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={mentor.image} alt={mentor.name} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-xl font-bold mb-1">{mentor.name}</CardTitle>
                <Badge variant="secondary" className="mb-2">{mentor.title}</Badge>
              </CardHeader>
              <CardContent className="p-0 text-center">
                <p className="text-muted-foreground mb-4 text-sm">{mentor.bio}</p>
                <Button className="w-full premium-button">Book Appointment</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
