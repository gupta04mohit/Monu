"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Target, Star, ShieldCheck, Zap } from "lucide-react";

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-primary" /> Wellness Rewards
          </h1>
          <p className="text-xl text-muted-foreground">
            Turn healthy habits into a fun, rewarding journey. Track streaks, earn badges, and level up your Ayurvedic lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 rounded-3xl shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">12 Days</h3>
            <p className="text-muted-foreground font-medium">Current Wellness Streak</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 p-6 rounded-3xl shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">2,450</h3>
            <p className="text-muted-foreground font-medium">Total Veda Points</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 p-6 rounded-3xl shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">Level 5</h3>
            <p className="text-muted-foreground font-medium">Mindful Master</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Challenges */}
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" /> Active Challenges
            </h3>
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">30-Day Hydration Goal</h4>
                  <span className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">+500 pts</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Drink 2.5L of water daily for 30 consecutive days.</p>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-right mt-1 font-medium text-muted-foreground">12/30 Days</p>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">Vata-Pacifying Week</h4>
                  <span className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">+200 pts</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Eat 3 warm, cooked meals per day for a week.</p>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-right mt-1 font-medium text-muted-foreground">6/7 Days</p>
              </div>
            </div>
          </div>

          {/* Earned Badges */}
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> Your Badges
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2 shadow-md transform hover:scale-110 transition-transform">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold">7-Day Streak</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-2 shadow-md transform hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold">First Goal Met</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-md transform hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold">Dosha Master</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl opacity-40 grayscale">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold">30-Day Streak</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl opacity-40 grayscale">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold">Sleep Guru</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
