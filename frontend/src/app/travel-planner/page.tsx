"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Hotel, CloudRain, Wallet, Send, User, Bot, Loader2 } from "lucide-react";

export default function TravelPlannerPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Travel Assistant. I can help you with Budget Planning, Hotel Recommendations, Flight Routes, and Weather Forecasts. How can I assist you with your next trip today?", agent: "travel_assistant" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, agent: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // We will proxy through Next.js API or hit the AI service directly.
      // Assuming AI service runs on localhost:5001 for development:
      const response = await fetch(`${process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:5001'}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, sessionId: "travel_session" }),
      });

      const data = await response.json();
      
      setMessages(prev => [
        ...prev, 
        { role: "assistant", content: data.response, agent: data.routedAgent || "travel_assistant" }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev, 
        { role: "assistant", content: "I'm sorry, I am having trouble connecting to my servers right now.", agent: "error" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (agent: string) => {
    if (agent === "budget_planner_agent") return <Wallet className="w-5 h-5 text-green-500" />;
    if (agent === "hotel_recommendation_agent") return <Hotel className="w-5 h-5 text-indigo-500" />;
    if (agent === "flight_recommendation_agent") return <Plane className="w-5 h-5 text-blue-500" />;
    if (agent === "weather_agent") return <CloudRain className="w-5 h-5 text-cyan-500" />;
    return <Bot className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 flex flex-col h-[calc(100vh-8rem)]">
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Travel Planner</h1>
          <p className="text-muted-foreground mt-1">Plan your perfect wellness retreat with specialized AI agents.</p>
        </div>

        <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
          <div className="bg-card border border-border px-4 py-3 rounded-xl shadow-sm flex items-center gap-3 min-w-max">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg"><Wallet className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
            <div>
              <p className="font-semibold text-sm">Budget Planner</p>
              <p className="text-xs text-muted-foreground">Cost estimation</p>
            </div>
          </div>
          <div className="bg-card border border-border px-4 py-3 rounded-xl shadow-sm flex items-center gap-3 min-w-max">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg"><Hotel className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
            <div>
              <p className="font-semibold text-sm">Hotel Agent</p>
              <p className="text-xs text-muted-foreground">Resorts & Stays</p>
            </div>
          </div>
          <div className="bg-card border border-border px-4 py-3 rounded-xl shadow-sm flex items-center gap-3 min-w-max">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
            <div>
              <p className="font-semibold text-sm">Flight Agent</p>
              <p className="text-xs text-muted-foreground">Routes & Airlines</p>
            </div>
          </div>
          <div className="bg-card border border-border px-4 py-3 rounded-xl shadow-sm flex items-center gap-3 min-w-max">
            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg"><CloudRain className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /></div>
            <div>
              <p className="font-semibold text-sm">Weather Agent</p>
              <p className="text-xs text-muted-foreground">Forecasts & Seasons</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : getAgentIcon(msg.agent)}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-none p-4 flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-card border-t border-border">
            <div className="flex gap-3 relative">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask about flights, hotels, weather, or budget for your trip..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition pr-12"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
