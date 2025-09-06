'use client'

import { useState, useEffect } from 'react'
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star } from "lucide-react"

const activityData = Array.from({ length: 365 }).map((_, i) => ({
  date: new Date(new Date().getFullYear(), 0, i + 1).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 5),
}));

const getHeatmapColor = (count: number) => {
  if (count === 0) return "bg-gray-200 dark:bg-gray-500";
  if (count === 1) return "bg-amber-100 dark:bg-amber-700";
  if (count === 2) return "bg-amber-300 dark:bg-amber-600";
  if (count === 3) return "bg-amber-400 dark:bg-amber-500";
  if (count >= 4) return "bg-amber-700 dark:bg-amber-400";
  return "bg-gray-200 dark:bg-gray-500";
};

const medals = [
  {
    name: "Uncommon",
    threshold: 100,
    description: "Motivated & Strong 💪",
    color: "text-green-500",
    icon: "🟢",
  },
  {
    name: "Rare",
    threshold: 200,
    description: "Symbol of Excellence & Dedication ❤️‍🔥",
    color: "text-blue-500",
    icon: "🔵",
  },
  {
    name: "Legendary",
    threshold: 500,
    description: "Ultimate Achiever! 🏆",
    color: "text-yellow-500",
    icon: "🟡",
  },
];

export default function RewardsPage() {
  const [dharmikPoints, setDharmikPoints] = useState(0);

  useEffect(() => {
    const storedPoints = localStorage.getItem("dharmikPoints");
    if (storedPoints) {
      setDharmikPoints(parseInt(storedPoints, 10));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Achievements</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrate your progress and earned rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-border/50 glass-effect hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Total Dharmik Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-center text-primary">{dharmikPoints}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 glass-effect hover-lift">
            <CardHeader>
              <CardTitle>Medals & Titles</CardTitle>
              <CardDescription>Unlock special titles as you earn more Dharmik Points.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {medals.map((medal) => (
                <TooltipProvider key={medal.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex items-center gap-3 p-4 rounded-lg border ${dharmikPoints >= medal.threshold ? "border-primary/50 bg-primary/10" : "border-border/30 bg-card"}`}
                      >
                        <span className={`text-3xl ${medal.color}`}>{medal.icon}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{medal.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dharmikPoints >= medal.threshold ? "Achieved!" : `Requires ${medal.threshold} points`}
                          </p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Points required: {medal.threshold}</p>
                      <p>Description: {medal.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 glass-effect hover-lift mb-8">
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
            <CardDescription>Your daily task completion activity over the year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-auto-fill gap-0.5 overflow-x-auto pb-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))' }}>
              {activityData.map((day) => (
                <TooltipProvider key={day.date}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)}`}
                        title={`${day.date}: ${day.count} tasks completed`}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{day.date}</p>
                      <p>{day.count} tasks completed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
