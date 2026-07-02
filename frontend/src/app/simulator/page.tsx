"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Beaker, ChevronRight, TrendingUp, TrendingDown, Clock, Scale } from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from "recharts";

const baseHealthData = [
  { month: 'Jan', health: 70 },
  { month: 'Feb', health: 71 },
  { month: 'Mar', health: 70 },
  { month: 'Apr', health: 72 },
  { month: 'May', health: 73 },
  { month: 'Jun', health: 75 },
];

const simulatedImprovement = [
  { month: 'Jan', health: 70 },
  { month: 'Feb', health: 71 },
  { month: 'Mar', health: 70 },
  { month: 'Apr', health: 72 },
  { month: 'May', health: 73 },
  { month: 'Jun', health: 75 },
  { month: 'Jul', health: 78 },
  { month: 'Aug', health: 82 },
  { month: 'Sep', health: 85 },
  { month: 'Oct', health: 88 },
  { month: 'Nov', health: 91 },
  { month: 'Dec', health: 94 },
];

const simulatedDecline = [
  { month: 'Jan', health: 70 },
  { month: 'Feb', health: 71 },
  { month: 'Mar', health: 70 },
  { month: 'Apr', health: 72 },
  { month: 'May', health: 73 },
  { month: 'Jun', health: 75 },
  { month: 'Jul', health: 73 },
  { month: 'Aug', health: 68 },
  { month: 'Sep', health: 65 },
  { month: 'Oct', health: 61 },
  { month: 'Nov', health: 58 },
  { month: 'Dec', health: 55 },
];

export default function SimulatorPage() {
  const [scenario, setScenario] = useState("current");
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = (type: string) => {
    setSimulating(true);
    setTimeout(() => {
      setScenario(type);
      setSimulating(false);
    }, 1000);
  };

  const getChartData = () => {
    if (scenario === "improve") return simulatedImprovement;
    if (scenario === "decline") return simulatedDecline;
    return baseHealthData;
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Beaker className="w-8 h-8 text-primary" /> AI Health Simulator
          </h1>
          <p className="text-xl text-muted-foreground">
            Run "What-if" scenarios based on your Digital Twin to predict your future Health Age, Longevity, and disease risks.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Longevity Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Chronological Age</span>
                  <span className="font-bold text-lg">34</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4"/> Biological Age</span>
                  <span className={`font-bold text-lg ${scenario === 'improve' ? 'text-green-500' : scenario === 'decline' ? 'text-red-500' : ''}`}>
                    {scenario === 'improve' ? '29' : scenario === 'decline' ? '38' : '32'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Scale className="w-4 h-4"/> Veda Longevity Score</span>
                  <span className={`font-bold text-lg ${scenario === 'improve' ? 'text-green-500' : scenario === 'decline' ? 'text-red-500' : ''}`}>
                    {scenario === 'improve' ? '92/100' : scenario === 'decline' ? '65/100' : '80/100'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Run Scenario</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleSimulate('improve')}
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="font-medium flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500"/> Optimal Habits</p>
                    <p className="text-xs text-muted-foreground mt-1">"If I sleep 8 hours daily and practice Yoga 4x a week for 6 months."</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500" />
                </button>

                <button 
                  onClick={() => handleSimulate('decline')}
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="font-medium flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500"/> Stop Exercising</p>
                    <p className="text-xs text-muted-foreground mt-1">"If I stop exercising entirely and increase sugar intake."</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-red-500" />
                </button>
                
                <button 
                  onClick={() => handleSimulate('current')}
                  className="w-full text-center p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset to Current State
                </button>
              </div>
            </div>
            
          </div>

          {/* Visualization Area */}
          <div className="xl:col-span-2">
            <motion.div 
              key={scenario}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col"
            >
              <h3 className="text-2xl font-bold mb-2">Health Trajectory Projection</h3>
              <p className="text-muted-foreground mb-8">
                {scenario === 'improve' ? "Committing to optimal habits drastically reduces your Biological Age and boosts longevity." :
                 scenario === 'decline' ? "Neglecting your health will accelerate aging and significantly increase disease risk." :
                 "Your current trajectory shows steady maintenance. You have room for optimization."}
              </p>

              <div className="flex-1 min-h-[400px] relative">
                {simulating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm z-10 rounded-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-primary font-medium animate-pulse">Running Multi-Agent Simulation...</p>
                  </div>
                ) : null}

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={scenario === 'decline' ? 'var(--destructive)' : 'var(--primary)'} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={scenario === 'decline' ? 'var(--destructive)' : 'var(--primary)'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                    <YAxis domain={[40, 100]} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="health" 
                      stroke={scenario === 'decline' ? 'var(--destructive)' : 'var(--primary)'} 
                      fillOpacity={1} 
                      fill="url(#colorHealth)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
