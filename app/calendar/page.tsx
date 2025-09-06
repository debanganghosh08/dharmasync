'use client'

import { useState, useEffect, useMemo } from 'react'
import Confetti from 'react-confetti'
import { toast } from "sonner"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

interface CalendarEvent {
  id: string
  title: string
  description: string
  type: "mindfulness" | "work" | "personal" | "community"
  startTime: string
  endTime: string
  date: string
  location?: string
  status: "pending" | "completed"
}

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Morning Meditation",
    description: "Daily mindfulness practice to start the day with intention",
    type: "mindfulness",
    startTime: "07:00",
    endTime: "07:15",
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  },
  {
    id: "2",
    title: "Team Meeting",
    description: "Weekly team sync and project updates",
    type: "work",
    startTime: "10:00",
    endTime: "11:00",
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  },
];

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "mindfulness" as CalendarEvent["type"],
    startTime: "",
    endTime: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const startDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentDate]);

  const monthlyProgress = useMemo(() => {
    const totalTasks = events.length;
    const completedTasks = events.filter(e => e.status === 'completed').length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return { totalTasks, completedTasks, percentage };
  }, [events]);

  useEffect(() => {
    if (monthlyProgress.percentage === 100) {
      const storedPoints = localStorage.getItem("dharmikPoints");
      if (storedPoints) {
        setShowCelebration(true);
        toast("Congrats!🥳 You completed all the tasks");
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }
  }, [monthlyProgress.percentage]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  }

  const handleEventStatusChange = (status: 'completed' | 'pending') => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, status } : e));
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    }
  }

  const createEvent = () => {
    if (!newEvent.title.trim() || !newEvent.startTime || !newEvent.endTime) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      date: newEvent.date,
      location: newEvent.location || undefined,
      status: 'pending',
    }

    setEvents([...events, event]);
    setIsCreateModalOpen(false);
    setNewEvent({
        title: "",
        description: "",
        type: "mindfulness",
        startTime: "",
        endTime: "",
        location: "",
        date: new Date().toISOString().split("T")[0],
    });
  }

  const getEventTypeColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "mindfulness": return "bg-blue-500 hover:bg-blue-600";
      case "work": return "bg-green-500 hover:bg-green-600";
      case "personal": return "bg-yellow-500 hover:bg-yellow-600";
      case "community": return "bg-purple-500 hover:bg-purple-600";
    }
  };

  if (status === 'loading') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
            <CalendarIcon className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {showCelebration && <Confetti />}
      <Toaster />
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Mindful Calendar</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}><Plus className="mr-2 h-4 w-4"/>Add Event</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className="border-border/50 glass-effect">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Button variant="outline" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}><ChevronLeft/></Button>
                        <CardTitle className="text-xl font-bold text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
                        <Button variant="outline" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}><ChevronRight/></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-muted-foreground text-sm">
                            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mt-2">
                            {Array.from({ length: startDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                            {daysInMonth.map(day => (
                                <div key={day.toString()} className="h-24 border border-border/20 rounded-md p-1 text-sm overflow-y-auto">
                                    <div>{day.getDate()}</div>
                                    {events.filter(e => new Date(e.date).toDateString() === day.toDateString() && e.status === 'pending').map(event => (
                                        <div key={event.id} onClick={() => handleEventClick(event)} className={`text-white p-1 rounded-md text-xs cursor-pointer mt-1 ${getEventTypeColor(event.type)}`}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="border-border/50 glass-effect">
                    <CardHeader>
                        <CardTitle>
                          Monthly Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{monthlyProgress.completedTasks} / {monthlyProgress.totalTasks}</p>
                            <p className="text-muted-foreground">Tasks Completed</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${monthlyProgress.percentage}%` }}></div>
                        </div>
                        <p className="text-center text-muted-foreground mt-2">{monthlyProgress.percentage.toFixed(2)}% Complete</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
          <DialogContent className="glass-effect border-border/50">
              <DialogHeader>
                  <DialogTitle>{selectedEvent?.title}</DialogTitle>
                  <DialogDescription>{selectedEvent?.description}</DialogDescription>
              </DialogHeader>
              <div>
                  <p><strong>Time:</strong> {selectedEvent?.startTime} - {selectedEvent?.endTime}</p>
                  <p><strong>Location:</strong> {selectedEvent?.location || 'Not specified'}</p>
                  <p><strong>Type:</strong> {selectedEvent?.type}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => handleEventStatusChange('pending')}>Pending</Button>
                  <Button onClick={() => handleEventStatusChange('completed')}>Completed</Button>
              </div>
          </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="glass-effect border-border/50">
              <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                  <Input placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                  <Textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                  <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="time" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                    <Input type="time" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                  </div>
                  <Input placeholder="Location (optional)" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                  <Select onValueChange={(value: CalendarEvent["type"]) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="mindfulness">Mindfulness</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                  </Select>
                  <Button onClick={createEvent} className="w-full">Create Event</Button>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  )
}