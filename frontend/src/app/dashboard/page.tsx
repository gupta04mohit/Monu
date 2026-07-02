"use client";

import { motion } from "framer-motion";
import { Activity, Droplets, Moon, Brain, ChevronRight } from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from "recharts";

const doshaData = [
  { subject: 'Vata', A: 120, fullMark: 150 },
  { subject: 'Pitta', A: 98, fullMark: 150 },
  { subject: 'Kapha', A: 86, fullMark: 150 },
];

const progressData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 70 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 75 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 90 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Seeker</h1>
            <p className="text-muted-foreground mt-1">Here is your daily Ayurvedic wellness summary.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-card border border-border rounded-lg px-4 py-2 flex flex-col items-center shadow-sm">
              <span className="text-sm text-muted-foreground font-medium">Overall Wellness</span>
              <span className="text-2xl font-bold text-primary">85%</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-2 flex flex-col items-center shadow-sm">
              <span className="text-sm text-muted-foreground font-medium">Risk Score</span>
              <span className="text-2xl font-bold text-secondary">Low</span>
            </div>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dosha Radar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-4">Dosha Distribution</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={doshaData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--foreground)", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Dosha" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Wellness Progress Line Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:col-span-2"
          >
            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                    itemStyle={{ color: "var(--primary)" }}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* Bottom Grid: Daily Habits & AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-6">Daily Habits Tracker</h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Water Intake</p>
                    <p className="text-sm text-muted-foreground">1.5L / 3L</p>
                  </div>
                </div>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Sleep</p>
                    <p className="text-sm text-muted-foreground">6.5h / 8h</p>
                  </div>
                </div>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Yoga / Exercise</p>
                    <p className="text-sm text-muted-foreground">30m / 45m</p>
                  </div>
                </div>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>

            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Veda Guru Insights</h3>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  Your Vata is slightly elevated today. Favor warm, grounding foods like oatmeal or cooked root vegetables to maintain balance.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer group flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-foreground">Today's Recommended Herb</h4>
                  <p className="text-sm text-muted-foreground">Ashwagandha for stress management</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/chat'}
              className="mt-4 w-full py-2 bg-secondary/10 text-secondary-foreground font-medium rounded-lg hover:bg-secondary/20 transition-colors"
            >
              Chat with Veda Guru
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
