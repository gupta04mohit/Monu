"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Activity, Zap, Moon, Shield, HeartPulse, CloudRain, ThermometerSun, Wind } from "lucide-react";
import { useState, useEffect } from "react";

export default function DigitalTwinPage() {
  const [envData, setEnvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnvironment() {
      try {
        const res = await fetch("/api/environment");
        const data = await res.json();
        if (res.ok) {
          setEnvData(data);
        }
      } catch (err) {
        console.error("Failed to fetch env data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEnvironment();
  }, []);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Digital Ayurvedic Twin</h1>
          <p className="text-xl text-muted-foreground">
            A real-time reflection of your physiological state powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Twin Visual Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10 opacity-50 pointer-events-none"></div>
            <div className="relative z-10 w-48 h-48 rounded-full border-4 border-primary/20 flex items-center justify-center mb-6 animate-pulse bg-background/50 backdrop-blur-sm">
              <UserIcon className="w-24 h-24 text-primary opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Vata-Pitta Profile</h3>
            <div className="flex gap-2 text-sm text-muted-foreground mb-6">
              <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">Vata: 65%</span>
              <span className="bg-secondary/10 px-3 py-1 rounded-full text-secondary-foreground">Pitta: 25%</span>
              <span className="bg-muted px-3 py-1 rounded-full">Kapha: 10%</span>
            </div>
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>AI Health Score</span>
                <span className="text-primary">82/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Twin Metrics & Real World Data */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* REAL WORLD DATA MODULE */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1 sm:col-span-2 bg-gradient-to-br from-card to-primary/5 p-6 rounded-2xl border border-primary/20 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <CloudRain className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold">Real-World Environmental Impact</h4>
                </div>
                {loading ? (
                   <span className="text-xs bg-muted px-2 py-1 rounded-full animate-pulse">Syncing APIs...</span>
                ) : (
                   <span className="text-xs bg-green-500/20 text-green-500 px-3 py-1 rounded-full font-bold border border-green-500/20">LIVE: {envData?.location}</span>
                )}
              </div>
              
              {envData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-background/50 backdrop-blur border border-border p-3 rounded-xl flex items-center gap-3">
                    <ThermometerSun className="text-orange-500 w-5 h-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-bold">{envData.temperature}°C</p>
                    </div>
                  </div>
                  <div className="bg-background/50 backdrop-blur border border-border p-3 rounded-xl flex items-center gap-3">
                    <Wind className="text-blue-500 w-5 h-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind Speed</p>
                      <p className="font-bold">{envData.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="bg-background/50 backdrop-blur border border-border p-3 rounded-xl flex items-center gap-3">
                    <CloudRain className="text-indigo-500 w-5 h-5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="font-bold">{envData.humidity}%</p>
                    </div>
                  </div>
                </div>
              )}

              {envData && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl">
                  <p className="text-sm font-bold text-primary mb-1">Dosha Alert: {envData.doshaImpact.primary}</p>
                  <p className="text-sm text-foreground">{envData.doshaImpact.recommendation}</p>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold">Immunity State</h4>
              </div>
              <p className="text-3xl font-bold mb-2">Strong</p>
              <p className="text-sm text-muted-foreground">Ojas levels are well maintained. Keep up the Ashwagandha routine.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold">Metabolism (Agni)</h4>
              </div>
              <p className="text-3xl font-bold mb-2">Variable</p>
              <p className="text-sm text-muted-foreground">Typical for Vata dominance. Eat warm meals at regular intervals to stabilize.</p>
            </motion.div>
          </div>
        </div>

        {/* Timeline Visualization placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-card border border-border rounded-2xl p-8 shadow-sm"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Predictive Health Timeline
          </h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary rounded-full relative z-10 mb-2"></div>
                <span className="text-sm font-medium">Today</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary/60 rounded-full relative z-10 mb-2"></div>
                <span className="text-sm font-medium text-muted-foreground">30 Days</span>
                <span className="text-xs text-muted-foreground mt-1 text-center w-24">Digestion stabilizes</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary/40 rounded-full relative z-10 mb-2"></div>
                <span className="text-sm font-medium text-muted-foreground">90 Days</span>
                <span className="text-xs text-muted-foreground mt-1 text-center w-24">Deep sleep improves</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary/20 rounded-full relative z-10 mb-2"></div>
                <span className="text-sm font-medium text-muted-foreground">180 Days</span>
                <span className="text-xs text-muted-foreground mt-1 text-center w-24">Peak energy levels</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
