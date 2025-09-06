"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  name: string;
  points: number;
};

const dummyUsers: User[] = [
  { name: "Aarav Sharma", points: 380 },
  { name: "Vivaan Gupta", points: 365 },
  { name: "Aditya Singh", points: 350 },
  { name: "Vihaan Patel", points: 330 },
  { name: "Arjun Kumar", points: 310 },
  { name: "Sai Reddy", points: 290 },
  { name: "Reyansh Joshi", points: 270 },
  { name: "Krishna Nair", points: 250 },
  { name: "Ishaan Iyer", points: 230 },
  { name: "Advik Mehta", points: 210 },
];

export function Leaderboard() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-violet-400">Leaderboard</h2>
      <div className="space-y-4">
        {dummyUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-violet-400">{index + 1}</span>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-lg">{user.name}</span>
            </div>
            <span className="text-lg font-bold text-violet-400">{user.points} Dharmik Points</span>
          </div>
        ))}
      </div>
    </div>
  );
}