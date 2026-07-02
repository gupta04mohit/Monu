"use client";

import { motion } from "framer-motion";
import { Activity, Watch, Heart, Moon, Zap, RefreshCw, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from "recharts";

const mockHeartRate = [
  { time: '08:00', value: 65 },
  { time: '10:00', value: 72 },
  { time: '12:00', value: 115 }, // Workout
  { time: '14:00', value: 78 },
  { time: '16:00', value: 75 },
  { time: '18:00', value: 70 },
  { time: '20:00', value: 68 },
];

export default function WearablesPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  // Dynamic metrics state
  const [metrics, setMetrics] = useState({
    hr: 62,
    hrChange: -3,
    spo2: 98,
    sleepH: 2,
    sleepM: 15,
    hrv: 42
  });

  const handleSendToDoctor = () => {
    if (sent) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    setSynced(false);
    setTimeout(() => {
      // Simulate data changes
      setMetrics({
        hr: Math.floor(Math.random() * (75 - 55 + 1)) + 55, // 55 to 75
        hrChange: Math.floor(Math.random() * 10) - 5,
        spo2: Math.floor(Math.random() * (100 - 95 + 1)) + 95, // 95 to 100
        sleepH: Math.floor(Math.random() * 3) + 1, // 1 to 3
        sleepM: Math.floor(Math.random() * 60),
        hrv: Math.floor(Math.random() * (60 - 30 + 1)) + 30 // 30 to 60
      });
      setSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Watch className="w-8 h-8 text-primary" /> Wearable Intelligence
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time biological metrics synced from your Apple Watch.
            </p>
          </div>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className={`px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 ${
              synced ? "bg-green-500/20 text-green-500 border border-green-500/20" : "bg-secondary/10 text-secondary-foreground border border-secondary/20 hover:bg-secondary/20"
            }`}
          >
            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : synced ? <CheckCircle2 className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            {syncing ? "Syncing..." : synced ? "Synced" : "Sync Now"}
          </button>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Heart className="w-16 h-16" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Resting Heart Rate</p>
            <h3 className="text-4xl font-bold text-foreground">{metrics.hr} <span className="text-xl text-muted-foreground font-normal">bpm</span></h3>
            <p className={`text-sm font-medium mt-2 ${metrics.hrChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.hrChange > 0 ? '+' : ''}{metrics.hrChange} bpm from last week
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-16 h-16" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Blood Oxygen (SpO2)</p>
            <h3 className="text-4xl font-bold text-foreground">{metrics.spo2} <span className="text-xl text-muted-foreground font-normal">%</span></h3>
            <p className={`text-sm font-medium mt-2 ${metrics.spo2 >= 95 ? 'text-green-500' : 'text-orange-500'}`}>
              {metrics.spo2 >= 98 ? "Optimal" : metrics.spo2 >= 95 ? "Normal" : "Low"}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Moon className="w-16 h-16" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Deep Sleep</p>
            <h3 className="text-4xl font-bold text-foreground">{metrics.sleepH}<span className="text-xl text-muted-foreground font-normal">h</span> {metrics.sleepM}<span className="text-xl text-muted-foreground font-normal">m</span></h3>
            <p className={`text-sm font-medium mt-2 ${metrics.sleepH >= 2 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.sleepH >= 2 ? "Optimal Sleep" : "Below target (Kapha imbalance)"}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-16 h-16" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Stress Score (HRV)</p>
            <h3 className="text-4xl font-bold text-foreground">{metrics.hrv} <span className="text-xl text-muted-foreground font-normal">ms</span></h3>
            <p className={`text-sm font-medium mt-2 ${metrics.hrv > 50 ? 'text-green-500' : 'text-orange-500'}`}>
              {metrics.hrv > 50 ? "Balanced Dosha" : "Elevated Pitta detected"}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Area */}
          <div className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold mb-6">Heart Rate Variance Today</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHeartRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="lg:col-span-1 bg-primary/5 border border-primary/20 p-8 rounded-3xl shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" /> AI Wearable Insights
            </h3>
            
            <div className="space-y-6 flex-1">
              <div className="bg-background/60 p-4 rounded-xl border border-border">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1 block">Anomaly Detected</span>
                <p className="text-sm font-medium">Your sleep quality dropped by 15% last night. Your resting heart rate remained elevated above 65 bpm during deep sleep.</p>
              </div>

              <div className="bg-background/60 p-4 rounded-xl border border-border">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">VedaAI Recommendation</span>
                <p className="text-sm font-medium">This pattern often precedes a viral infection or burnout. Take 500mg Ashwagandha tonight and avoid screens 1 hour before bed.</p>
              </div>
            </div>

            <button 
              onClick={handleSendToDoctor}
              disabled={sending || sent}
              className={`w-full mt-6 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                sent ? "bg-green-500/20 text-green-500 border border-green-500/50" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {sending && <Loader2 className="w-5 h-5 animate-spin" />}
              {sent && <CheckCircle2 className="w-5 h-5" />}
              {sending ? "Sending Data..." : sent ? "Report Sent to Doctor" : "Send to My Doctor"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
