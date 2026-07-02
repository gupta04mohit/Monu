"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Leaf, ArrowRight } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearching(true);
    setResult(null);

    // Simulate RAG Search
    setTimeout(() => {
      setResult({
        answer: "For a Kapha constitution during summer, it's essential to eat light, dry, and easily digestible foods to counterbalance Kapha's heavy, damp nature. Favor astringent, bitter, and pungent tastes. Good choices include quinoa, steamed leafy greens, asparagus, and legumes. Avoid heavy dairy, iced drinks, and excessive sweet fruits.",
        sources: [
          { title: "Charaka Samhita: Diet & Seasons", type: "Ancient Text" },
          { title: "Ayurvedic Nutrition Guidelines 2024", type: "Research Paper" }
        ],
        tags: ["Kapha", "Summer Diet", "Digestion"]
      });
      setSearching(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" /> Gen-AI Health Search
          </h1>
          <p className="text-xl text-muted-foreground">
            Ask any question about Ayurveda, diets, or symptoms. Our RAG-powered engine searches authentic texts and research papers to provide evidence-backed answers.
          </p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-6 text-muted-foreground">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'What should a Kapha person eat in summer?'"
              className="w-full bg-card border-2 border-border rounded-full py-5 pl-16 pr-32 text-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-lg transition-all"
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-3 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {searching ? (
                <>Searching <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div></>
              ) : "Ask"}
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="text-sm text-muted-foreground font-medium">Try asking:</span>
            {["How to improve digestion naturally?", "Best yoga for Vata?", "Ashwagandha benefits?"].map((q) => (
              <button 
                key={q}
                onClick={() => setQuery(q)}
                className="text-sm bg-muted/50 hover:bg-muted text-foreground px-4 py-2 rounded-full border border-border transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="bg-primary/5 p-8 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-xl mt-1">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">AI Synthesis</h3>
                  <p className="text-lg leading-relaxed text-foreground/90">{result.answer}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-card">
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm mb-4">Referenced Sources</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {result.sources.map((source: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                    <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <p className="font-medium text-foreground">{source.title}</p>
                      <p className="text-xs text-muted-foreground">{source.type}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Leaf className="w-4 h-4" /> Topics:
                </span>
                <div className="flex gap-2">
                  {result.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
