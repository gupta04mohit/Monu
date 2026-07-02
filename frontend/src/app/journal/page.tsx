"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Smile, Frown, Meh, Zap, Moon, Heart, TrendingUp, Sparkles, CheckCircle, Loader2, AlertCircle } from "lucide-react";

type Mood = "Great" | "Okay" | "Low";

const moods: { label: Mood; icon: typeof Smile; selectedClass: string; iconClass: string }[] = [
  { label: "Great", icon: Smile, selectedClass: "bg-green-500/10 border-green-500/40", iconClass: "text-green-500" },
  { label: "Okay", icon: Meh, selectedClass: "bg-yellow-500/10 border-yellow-500/40", iconClass: "text-yellow-500" },
  { label: "Low", icon: Frown, selectedClass: "bg-red-500/10 border-red-500/40", iconClass: "text-red-500" },
];

const recentEntries = [
  {
    date: "Today, Jun 19",
    mood: "Okay",
    energy: 6,
    symptoms: "Mild bloating after lunch",
    note: "Feeling a bit sluggish. Had a late dinner last night. Noticed Pitta flare — slight heartburn.",
    insight: "AI detected correlation between late dinners and next-day fatigue in 3 of your last 5 logs.",
  },
  {
    date: "Yesterday, Jun 18",
    mood: "Great",
    energy: 9,
    symptoms: "None",
    note: "Slept well, meditated for 20 mins. Energy has been excellent. Kitchari for lunch.",
    insight: "Your best health score this week! Morning meditation correlated with +18% energy.",
  },
  {
    date: "Monday, Jun 17",
    mood: "Low",
    energy: 4,
    symptoms: "Headache, brain fog",
    note: "Woke up feeling extremely tired despite 8 hours of sleep. Vata feels highly imbalanced today.",
    insight: "Consider warm, grounding foods today. Avoid cold drinks to help balance Vata dosha.",
  },
  {
    date: "Sunday, Jun 16",
    mood: "Great",
    energy: 8,
    symptoms: "Slight joint stiffness",
    note: "Spent the day outdoors. Feeling mentally clear but physically a little stiff from the hike.",
    insight: "Great physical activity! AI suggests a warm oil self-massage (Abhyanga) to soothe joint stiffness.",
  }
];

// Render **bold** and bullet points from the AI markdown response
function AIMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>
        );
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 ml-1">
              <span className="text-primary shrink-0 mt-0.5">•</span>
              <span className="text-foreground/90">{parts}</span>
            </div>
          );
        }
        return <p key={i} className="text-foreground/90">{parts}</p>;
      })}
    </div>
  );
}

export default function JournalPage() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [journalNote, setJournalNote] = useState("");
  const [energy, setEnergy] = useState(7);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      setErrorMsg("Please select how you're feeling before saving.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setAnalysis(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          energy,
          symptoms: symptoms.trim() || "None",
          note: journalNote.trim() || "No additional notes",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze journal entry.");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setSymptoms("");
    setJournalNote("");
    setEnergy(7);
    setStatus("idle");
    setAnalysis(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> AI-Powered Health Journaling
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" /> AI Health Journal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Log your daily health. VedaAI's Dosha Intelligence analyzes patterns and gives you personalized Ayurvedic guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Entry Form ─────────────────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-primary" /> Today's Entry
              </h3>

              {/* Mood Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  How are you feeling?
                </label>
                <div className="flex gap-3">
                  {moods.map(({ label, icon: Icon, selectedClass, iconClass }) => (
                    <button
                      key={label}
                      onClick={() => { setSelectedMood(label); if (status !== "idle") setStatus("idle"); }}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        selectedMood === label
                          ? `${selectedClass} border-opacity-80 scale-105`
                          : "border-transparent bg-muted/40 hover:bg-muted hover:scale-102"
                      }`}
                    >
                      <Icon className={`w-8 h-8 transition-colors ${selectedMood === label ? iconClass : "text-muted-foreground"}`} />
                      <span className={`text-sm font-semibold transition-colors ${selectedMood === label ? iconClass : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div className="mb-6">
                <label className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" /> Energy Level
                  </span>
                  <span className="text-primary font-bold text-sm">{energy}/10</span>
                </label>
                <div className="relative">
                  <input
                    type="range" min="1" max="10" value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full h-2.5 rounded-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Exhausted</span><span>Excellent</span>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Symptoms Today
                </label>
                <input
                  type="text"
                  placeholder="e.g., mild headache, bloating, cold hands..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Journal Note */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Journal Note
                </label>
                <textarea
                  rows={4}
                  placeholder="How was your day? What did you eat? How did you sleep? What's on your mind?..."
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={status === "loading"}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
                ) : (
                  <><Heart className="w-5 h-5" /> Save & Analyze with AI</>
                )}
              </button>

              {/* Error state */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── AI Analysis Result ───────────────────────────── */}
            <AnimatePresence>
              {status === "success" && analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-primary/8 via-card to-accent/5 border border-primary/20 rounded-3xl p-8 shadow-md"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground">Veda Guru's Analysis</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" /> Entry saved · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <AIMarkdown text={analysis} />

                  <button
                    onClick={handleReset}
                    className="mt-6 w-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    + Add Another Entry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Recent Entries ──────────────────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" /> Recent Entries
              </h3>
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {showAll ? "View Less" : "View All"}
              </button>
            </div>

            {recentEntries.slice(0, showAll ? recentEntries.length : 2).map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{entry.date}</p>
                    <p className="font-bold text-lg mt-0.5">Mood: {entry.mood} · Energy: {entry.energy}/10</p>
                  </div>
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">Symptoms: </span>{entry.symptoms}
                </p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{entry.note}</p>
                <div className="bg-primary/6 border border-primary/15 rounded-xl p-3">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Behavioral Insight
                  </p>
                  <p className="text-sm text-foreground">{entry.insight}</p>
                </div>
              </motion.div>
            ))}

            {/* Weekly Summary Card */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-6">
              <h4 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> This Week's Pattern
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Avg Mood", value: "Good", color: "bg-green-500" },
                  { label: "Avg Energy", value: "7.2/10", color: "bg-primary" },
                  { label: "Top Symptom", value: "Bloating", color: "bg-orange-400" },
                  { label: "Dosha Alert", value: "Pitta ↑", color: "bg-red-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">{row.label}</span>
                    <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${row.color}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
