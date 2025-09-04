// app/wisdom-library/page.tsx
'use client'

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, ShoppingCart } from "lucide-react"
import { bookImages } from "@/lib/images"

const books = [
  {
    name: "The Holy Vedas",
    amazonLink: "https://amzn.to/45XYPIn",
  },
  {
    name: "Bhagwat Geeta",
    amazonLink: "https://amzn.to/4p9vC6f",
  },
  {
    name: "The Holy Bible",
    amazonLink: "https://amzn.to/3JI16zW",
  },
  {
    name: "The Upanishads",
    amazonLink: "https://amzn.to/45Jsma0",
  },
  {
    name: "The Shiva Sutras",
    amazonLink: "https://amzn.to/4ncZL2B",
  },
]

export default function WisdomLibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 glass-effect">
            <Book className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Wisdom Library</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore a curated collection of books on Dharma, philosophy, and spiritual stories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map((book, index) => (
            <Card key={index} className="border-border/50 hover-lift glass-effect overflow-hidden">
              <div className="w-full h-48 relative p-2">
                <img
                  src={bookImages[book.name as keyof typeof bookImages]}
                  alt={book.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="flex-1 flex flex-col justify-between p-4">
                <CardTitle className="text-center text-base mb-2">{book.name}</CardTitle>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => window.open(book.amazonLink, "_blank")}
                    size="sm"
                    className="w-full premium-button"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy
                  </Button>
                  <Button
                    onClick={() => window.open(book.amazonLink, "_blank")}
                    size="sm"
                    variant="outline"
                    className="w-full glass-button"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}