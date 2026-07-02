"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User as UserIcon, Leaf, Sparkles, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const SUGGESTIONS = [
  "What is my Dosha type?",
  "How can I improve my digestion?",
  "Best herbs for stress relief?",
  "Yoga for better sleep?",
];

function MarkdownText({ text }: { text: string }) {
  // Simple markdown-like renderer for bold and bullets
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        
        // Bold sections: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        });

        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>{rendered.slice(line.startsWith("- ") ? 1 : 1)}</span>
            </div>
          );
        }

        return <p key={i} className="leading-relaxed">{rendered}</p>;
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-3 max-w-[80%]">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
          <Leaf size={16} className="text-primary-foreground" />
        </div>
        <div className="bg-card border border-border rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2 shadow-sm">
          <span className="text-xs text-muted-foreground font-medium mr-1">Veda Guru is thinking</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Namaste! I am **Veda Guru**, your personal AI Ayurvedic consultant. 🙏\n\nI combine ancient Ayurvedic wisdom with modern health analytics to guide your wellness journey.\n\nHow can I help you achieve balance today? You can ask me about:\n- Your Dosha constitution\n- Diet & nutrition advice\n- Herbal remedies\n- Yoga & meditation\n- Symptom analysis",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history from recent messages (last 10)
      const history = messages.slice(-10).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I was unable to generate a response. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please check your connection and try again. 🙏",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "Namaste! I am **Veda Guru**, your personal AI Ayurvedic consultant. 🙏\n\nHow can I help you achieve balance today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[800px] w-full max-w-4xl mx-auto bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-primary-foreground flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Veda Guru</h2>
            <p className="text-xs opacity-75 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Ayurvedic Consultant & Orchestrator
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          title="Start new conversation"
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[82%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md self-end ${
                  msg.sender === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
                }`}>
                  {msg.sender === "user" ? <UserIcon size={16} /> : <Leaf size={16} />}
                </div>

                {/* Bubble */}
                <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border text-foreground rounded-tl-none"
                }`}>
                  {msg.sender === "bot" ? (
                    <MarkdownText text={msg.text} />
                  ) : (
                    <p className="leading-relaxed">{msg.text}</p>
                  )}
                  <p suppressHydrationWarning className={`text-xs mt-2 ${msg.sender === "user" ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions (shown when few messages) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap border-t border-border bg-card shrink-0">
          <p className="w-full text-xs text-muted-foreground pt-3 pb-1 font-medium">Quick questions:</p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 bg-card border-t border-border shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Veda Guru about your health, herbs, or Dosha..."
            disabled={isLoading}
            className="flex-1 rounded-2xl border border-input bg-background px-5 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            whileTap={{ scale: 0.92 }}
            className="bg-primary text-primary-foreground p-3.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Veda Guru provides wellness guidance, not medical diagnoses. Consult a doctor for serious conditions.
        </p>
      </div>
    </div>
  );
}
