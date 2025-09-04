"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mountain,
  MapPin,
  Clock,
  Route,
  Star,
  NavigationIcon,
  Search,
  Loader2,
} from "lucide-react";
import { GoogleMap } from "@/components/google-map";

// The API key is correctly accessed from the environment variable.
const mapsApiKey = "AIzaSyBpFODL788Z1Wy5X1e3XqBx__u0jYlaw94";

// Popular holy places in India
const popularHolyPlaces = [
  {
    id: "1",
    name: "Char Dham (Kedarnath)",
    location: "Uttarakhand",
    coordinates: { lat: 30.7346, lng: 79.0669 },
    description: "Sacred abode of Lord Shiva in the Himalayas",
    significance: "One of the four sacred Char Dham pilgrimage sites",
    bestTime: "May to October",
    image: "/kedarnath-temple-mountains.png",
  },
  {
    id: "2",
    name: "Varanasi (Kashi Vishwanath)",
    location: "Uttar Pradesh",
    coordinates: { lat: 25.3176, lng: 82.9739 },
    description: "The spiritual capital of India on the banks of Ganges",
    significance: "One of the oldest continuously inhabited cities",
    bestTime: "October to March",
    image: "/varanasi-ghats-ganges-river.png",
  },
  {
    id: "3",
    name: "Haridwar",
    location: "Uttarakhand",
    coordinates: { lat: 29.9457, lng: 78.1642 },
    description: "Gateway to the gods where Ganges enters the plains",
    significance: "Sacred city hosting Kumbh Mela every 12 years",
    bestTime: "October to February",
    image: "/haridwar-ganga-aarti-evening.png",
  },
  {
    id: "4",
    name: "Rishikesh",
    location: "Uttarakhand",
    coordinates: { lat: 30.0869, lng: 78.2676 },
    description: "Yoga capital of the world in the Himalayan foothills",
    significance: "Meditation and spiritual learning center",
    bestTime: "September to November, February to May",
    image: "/rishikesh-yoga-ashram-ganges.png",
  },
  {
    id: "5",
    name: "Badrinath",
    location: "Uttarakhand",
    coordinates: { lat: 30.7433, lng: 79.4938 },
    description: "Sacred temple dedicated to Lord Vishnu",
    significance: "One of the four Char Dham pilgrimage sites",
    bestTime: "May to October",
    image: "/badrinath-temple-himalayan-peaks.png",
  },
  {
    id: "6",
    name: "Pushkar",
    location: "Rajasthan",
    coordinates: { lat: 26.4899, lng: 74.5511 },
    description: "Sacred lake town with Brahma temple",
    significance: "One of the few Brahma temples in the world",
    bestTime: "October to March",
    image: "/pushkar-lake-rajasthan-temple.png",
  },
  {
    id: "7",
    name: "Golden Temple (Amritsar)",
    location: "Punjab",
    coordinates: { lat: 31.62, lng: 74.8765 },
    description: "Holiest Gurdwara of Sikhism",
    significance: "Spiritual and cultural center of Sikh religion",
    bestTime: "October to March",
    image: "/golden-temple-amritsar-reflection.png",
  },
];

// Regional suggestions based on major cities
const regionalSuggestions = {
  Delhi: [
    { name: "Kedarnath", distance: "460 km", time: "12-14 hours" },
    { name: "Haridwar", distance: "220 km", time: "5-6 hours" },
    { name: "Rishikesh", distance: "240 km", time: "6-7 hours" },
  ],
  Mumbai: [
    { name: "Shirdi", distance: "240 km", time: "4-5 hours" },
    { name: "Ajanta Ellora", distance: "340 km", time: "6-7 hours" },
    { name: "Nashik", distance: "180 km", time: "3-4 hours" },
  ],
  Kolkata: [
    { name: "Dakshineswar", distance: "20 km", time: "1 hour" },
    { name: "Kalighat", distance: "15 km", time: "45 minutes" },
    { name: "Mayapur", distance: "130 km", time: "3-4 hours" },
  ],
  Chennai: [
    { name: "Tirupati", distance: "150 km", time: "3-4 hours" },
    { name: "Kanchipuram", distance: "75 km", time: "2 hours" },
    { name: "Mahabalipuram", distance: "60 km", time: "1.5 hours" },
  ],
  Bangalore: [
    { name: "Tirupati", distance: "250 km", time: "5-6 hours" },
    { name: "Hampi", distance: "340 km", time: "6-7 hours" },
    { name: "Sringeri", distance: "270 km", time: "5-6 hours" },
  ],
};

export default function AdventurePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleLocationSearch = async () => {
    if (!userLocation.trim()) return;

    setIsLoading(true);
    try {
      // Get regional suggestions based on user input
      const city = userLocation.toLowerCase();
      let suggestions = [];

      if (city.includes("delhi") || city.includes("new delhi")) {
        suggestions = regionalSuggestions["Delhi"];
      } else if (city.includes("mumbai") || city.includes("bombay")) {
        suggestions = regionalSuggestions["Mumbai"];
      } else if (city.includes("kolkata") || city.includes("calcutta")) {
        suggestions = regionalSuggestions["Kolkata"];
      } else if (city.includes("chennai") || city.includes("madras")) {
        suggestions = regionalSuggestions["Chennai"];
      } else if (city.includes("bangalore") || city.includes("bengaluru")) {
        suggestions = regionalSuggestions["Bangalore"];
      } else {
        // Default suggestions for other cities
        suggestions = regionalSuggestions["Delhi"];
      }

      setNearbyPlaces(suggestions);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDirections = async (place: any) => {
    if (userLocation.trim()) {
      const url = `https://www.google.com/maps/dir/${encodeURIComponent(
        userLocation
      )}/${encodeURIComponent(place.name + " " + place.location)}`;
      window.open(url, "_blank");
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(
              place.name + " " + place.location
            )}`;
            window.open(url, "_blank");
          },
          (error) => {
            console.error("Error getting user location:", error);
            alert("Could not get your location. Please enter it manually.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser. Please enter your location manually.");
      }
    }
  };

  const handleViewOnMap = (place: any) => {
    // Corrected URL for viewing a place in a new tab
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.name + " " + place.location
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex-col text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 glass-effect">
            <Mountain className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sacred Adventures
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover holy places and spiritual destinations across India
          </p>
        </div>
        {/* Location Search */}
        <Card className="border-border/50 hover-lift glass-effect mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Find Sacred Places Near You
            </CardTitle>
            <CardDescription>
              Enter your city to discover the closest holy places and spiritual
              destinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="location" className="sr-only">
                  Your Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your city (e.g., Delhi, Mumbai, Kolkata)"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="glass-effect border-primary/30 focus:border-primary"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleLocationSearch()
                  }
                />
              </div>
              <Button
                onClick={handleLocationSearch}
                disabled={isLoading}
                className="premium-button"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Nearby Places Results */}
        {nearbyPlaces.length > 0 && (
          <Card className="border-border/50 hover-lift glass-effect mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                Closest Sacred Places
              </CardTitle>
              <CardDescription>
                Based on your location: {userLocation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {nearbyPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="p-4 bg-card rounded-lg border border-border/30 hover-lift"
                  >
                    <h3 className="font-semibold text-foreground mb-2">
                      {place.name}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4" />
                        <span>{place.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{place.time}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleGetDirections(place)}
                      size="sm"
                      className="w-full mt-3 premium-button"
                    >
                      <NavigationIcon className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Popular Holy Places */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Most Visited Sacred Destinations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularHolyPlaces.map((place, index) => (
              <Card
                key={index}
                className="border-border/50 hover-lift glass-effect overflow-hidden"
              >
                <div className="h-100 relative">
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{place.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {place.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {place.description}
                  </p>
                  <div className="space-y-2">
                    <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-xs font-medium text-primary mb-1">
                        Significance
                      </p>
                      <p className="text-xs text-foreground">
                        {place.significance}
                      </p>
                    </div>
                    <div className="bg-accent/5 p-3 rounded-lg border-l-4 border-accent">
                      <p className="text-xs font-medium text-accent mb-1">
                        Best Time to Visit
                      </p>
                      <p className="text-xs text-foreground">
                        {place.bestTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewOnMap(place)}
                      size="sm"
                      variant="outline"
                      className="flex-1 glass-button"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                    <Button
                      onClick={() => handleGetDirections(place)}
                      size="sm"
                      className="flex-1 premium-button"
                    >
                      <NavigationIcon className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Interactive Map Section */}
        <Card className="border-border/50 hover-lift glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Explore on Interactive Map
            </CardTitle>
            <CardDescription>
              Explore the sacred destinations directly on the map.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full h-96 rounded-lg overflow-hidden border border-border/30">
              <GoogleMap type="adventure" places={popularHolyPlaces} apiKey={mapsApiKey} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
