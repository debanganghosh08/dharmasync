"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Circle, Plus, Filter, Calendar, Heart, Briefcase, User, Star, Clock } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  category: "mindfulness" | "work" | "personal"
  priority: "low" | "medium" | "high"
  completed: boolean
  dueDate?: string
  time?: string
  createdAt: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Morning meditation",
    description: "10 minutes of mindful breathing",
    category: "mindfulness",
    priority: "high",
    completed: true,
    dueDate: "2024-01-15",
    time: "06:00",
    createdAt: "2024-01-15T06:00:00Z",
  },
  {
    id: "2",
    title: "Complete project proposal",
    description: "Finish the Q1 marketing proposal for client review",
    category: "work",
    priority: "high",
    completed: false,
    dueDate: "2024-01-16",
    time: "09:00",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    title: "Evening gratitude practice",
    description: "Write down 3 things I'm grateful for today",
    category: "mindfulness",
    priority: "medium",
    completed: false,
    dueDate: "2024-01-15",
    time: "20:00",
    createdAt: "2024-01-15T18:00:00Z",
  },
  {
    id: "4",
    title: "Call mom",
    description: "Weekly check-in call with family",
    category: "personal",
    priority: "medium",
    completed: false,
    dueDate: "2024-01-17",
    time: "15:30",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "5",
    title: "Mindful walking",
    description: "20-minute walk in nature, focusing on breath and surroundings",
    category: "mindfulness",
    priority: "low",
    completed: false,
    dueDate: "2024-01-15",
    time: "16:00",
    createdAt: "2024-01-15T14:00:00Z",
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<"all" | "mindfulness" | "work" | "personal">("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "mindfulness" as Task["category"],
    priority: "medium" as Task["priority"],
    dueDate: "",
    time: "",
  })

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      completed: false,
      dueDate: newTask.dueDate || undefined,
      time: newTask.time || undefined,
      createdAt: new Date().toISOString(),
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      category: "mindfulness",
      priority: "medium",
      dueDate: "",
      time: "",
    })
    setIsAddingTask(false)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter !== "all" && task.category !== filter) return false
    if (!showCompleted && task.completed) return false
    return true
  })

  const getCategoryIcon = (category: Task["category"]) => {
    switch (category) {
      case "mindfulness":
        return <Heart className="h-4 w-4" />
      case "work":
        return <Briefcase className="h-4 w-4" />
      case "personal":
        return <User className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Task["category"]) => {
    switch (category) {
      case "mindfulness":
        return "bg-primary/10 text-primary border-primary/20"
      case "work":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "personal":
        return "bg-accent/10 text-accent border-accent/20"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
            <p className="text-muted-foreground">Balance mindfulness with productivity</p>
          </div>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="premium-button bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass-effect border-border/50">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new mindful or productive task.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title..."
                    className="glass-effect border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Add more details..."
                    rows={3}
                    className="glass-effect border-primary/30 focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value: Task["category"]) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger className="glass-effect border-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-effect border-border/50">
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger className="glass-effect border-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-effect border-border/50">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date (Optional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time (Optional)</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className="glass-effect border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={addTask} className="flex-1 premium-button">
                    Add Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingTask(false)}
                    className="glass-button bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-border/50 glass-effect hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center glass-button">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 glass-effect hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center glass-button">
                  <Circle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-foreground">{totalCount - completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 glass-effect hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center glass-button">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(completionPercentage)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 glass-effect hover-lift mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Filter by:</Label>
              </div>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="flex-1">
                <TabsList className="grid w-full grid-cols-4 glass-effect">
                  <TabsTrigger value="all" className="premium-button">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="mindfulness" className="premium-button">
                    Mindfulness
                  </TabsTrigger>
                  <TabsTrigger value="work" className="premium-button">
                    Work
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="premium-button">
                    Personal
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2">
                <Checkbox id="showCompleted" checked={showCompleted} onCheckedChange={setShowCompleted} />
                <Label htmlFor="showCompleted" className="text-sm">
                  Show completed
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="border-border/50 glass-effect hover-lift">
              <CardContent className="p-8 text-center">
                <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === "all" ? "Add your first task to get started" : `No ${filter} tasks found`}
                </p>
                <Button onClick={() => setIsAddingTask(true)} variant="outline" className="glass-button bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`border-border/50 glass-effect hover-lift transition-all ${task.completed ? "opacity-75" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 text-primary hover:text-primary/80 transition-colors premium-button p-1 rounded-full"
                    >
                      {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {task.title}
                          </h3>
                          {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className={`${getCategoryColor(task.category)} hover-lift`}>
                              {getCategoryIcon(task.category)}
                              <span className="ml-1 capitalize">{task.category}</span>
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                              <span className={`text-xs capitalize ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {task.time && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">{task.time}</span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-button bg-transparent ml-auto"
                              onClick={() => {
                                const startDate = task.dueDate || new Date().toISOString().split("T")[0]
                                const startTime = task.time ? task.time.replace(":", "") + "00" : "090000"
                                const endTime = task.time
                                  ? String(Number.parseInt(task.time.replace(":", "")) + 100).padStart(4, "0") + "00"
                                  : "100000"
                                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&details=${encodeURIComponent(task.description || "")}&dates=${startDate.replace(/-/g, "")}T${startTime}Z/${startDate.replace(/-/g, "")}T${endTime}Z`
                                window.open(calendarUrl, "_blank")
                              }}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
