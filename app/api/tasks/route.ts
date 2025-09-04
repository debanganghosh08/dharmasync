
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Task from '@/models/Task';
import UserTaskProgress from '@/models/UserTaskProgress';
import { connectToDB } from '@/lib/mongodb';


const defaultTasks = [
    {
      title: "Morning meditation",
      category: "mindfulness",
      priority: "high",
      isDefault: true,
    },
    {
      title: "Call Family",
      category: "personal",
      priority: "medium",
      isDefault: true,
    },
    {
      title: "Mindful walking",
      category: "mindfulness",
      priority: "low",
      isDefault: true,
    },
    {
      title: "Write down the Goals for next week",
      category: "work",
      priority: "medium",
      isDefault: true,
    },
  ];


export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    await connectToDB();
  
    const userId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    let userTasks = await Task.find({
      userId,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });
  
    if (userTasks.length === 0) {
      const tasksToCreate = defaultTasks.map((task) => ({ ...task, userId, createdAt: new Date() }));
      userTasks = await Task.insertMany(tasksToCreate);
    }
  
    return NextResponse.json(userTasks);
  }



export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      
        await connectToDB();
      
        const userId = session.user.id;
        const body = await req.json();
      
        const newTask = new Task({
          ...body,
          userId,
          createdAt: new Date(),
        });
      
        await newTask.save();
      
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    await connectToDB();
  
    const userId = session.user.id;
    const { id, completed } = await req.json();
  
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      { completed },
      { new: true }
    );
  
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const tasks = await Task.find({ userId, createdAt: { $gte: today, $lt: tomorrow } });
    const completedTasks = tasks.filter((task) => task.completed).length;
  
    await UserTaskProgress.findOneAndUpdate(
      { userId, date: today },
      { completedTasks, totalTasks: tasks.length },
      { upsert: true }
    );
  
    return NextResponse.json(updatedTask);
  }
