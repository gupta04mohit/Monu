"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, MessageSquare, HeartPulse, Sparkles, Volume2, Loader2 } from "lucide-react";

export default function AvatarPage() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste. I am Veda, your personal AI Ayurvedic Doctor. Tap to speak, and let me know how you're feeling today." }
  ]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          setIsListening(false);
        };

        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleUserAudio(transcript);
        };
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUserAudio = async (text: string) => {
    if (synthRef.current) synthRef.current.cancel(); // Stop AI talking if user interrupts

    const newHistory = [...messages, { role: "user", text }];
    setMessages(newHistory);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          history: messages.map(m => ({ sender: m.role, text: m.text })) 
        })
      });

      const data = await response.json();
      const aiReply = data.reply || "I'm sorry, I didn't quite catch that.";

      setMessages([...newHistory, { role: "ai", text: aiReply }]);
      
      // Speak response aloud
      if (synthRef.current) {
        // Strip markdown and emojis for text-to-speech
        const cleanText = aiReply
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
          .replace(/[\u{2600}-\u{26FF}]/gu, '')
          .replace(/[\u{2700}-\u{27BF}]/gu, '');
          
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Attempt to find an Indian or female English voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.name.includes('Female')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 0.95;
        synthRef.current.speak(utterance);
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages([...newHistory, { role: "ai", text: "I'm having trouble connecting to my knowledge base right now." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support voice recognition. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel();
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
      }
    }
  };

  // Render markdown for UI
  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("- ")) {
        return <div key={i} className="ml-2 flex items-start gap-1"><span className="text-primary">•</span> <span>{line.substring(2)}</span></div>;
      }
      return <p key={i} className="mb-1">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" /> Veda: AI Health Avatar
          </h1>
          <p className="text-xl text-muted-foreground">
            Have a natural voice conversation with your personalized Ayurvedic doctor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl p-8 shadow-xl min-h-[500px]">
          
          {/* Avatar Visualizer Area */}
          <div className="flex flex-col items-center justify-center h-full border-r border-border pr-8">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer pulsing ring if speaking/listening */}
              {isListening && (
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              )}
              
              {/* Core Avatar representation (Glowing Orb) */}
              <div className={`absolute inset-4 bg-gradient-to-br from-primary via-secondary to-blue-500 rounded-full shadow-2xl flex items-center justify-center opacity-90 transition-all duration-700 ${isProcessing ? 'animate-pulse scale-105' : 'animate-[pulse_4s_ease-in-out_infinite]'}`}>
                 <div className="w-32 h-32 bg-white/20 rounded-full blur-md"></div>
              </div>
              
              {/* Icon Overlay */}
              <div className="relative z-10 text-white drop-shadow-md">
                {isProcessing ? <Loader2 className="w-16 h-16 animate-spin" /> : isListening ? <Mic className="w-16 h-16" /> : <HeartPulse className="w-16 h-16" />}
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={toggleListen}
                disabled={isProcessing}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
                  isProcessing ? "bg-muted text-muted-foreground cursor-not-allowed" :
                  isListening 
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                }`}
              >
                {isProcessing ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                ) : isListening ? (
                  <><MicOff className="w-6 h-6" /> Stop Listening</>
                ) : (
                  <><Mic className="w-6 h-6" /> Tap to Speak</>
                )}
              </button>
              <p className="text-sm text-muted-foreground mt-4">
                {isProcessing ? "Veda is thinking..." : isListening ? "Listening... speak clearly." : "Powered by Web Speech API & Gemini"}
              </p>
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div className="flex flex-col h-[500px]">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Live Transcript</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar flex flex-col-reverse">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                      msg.role === "user" 
                        ? "bg-secondary text-secondary-foreground rounded-tr-sm" 
                        : "bg-muted text-foreground border border-border rounded-tl-sm"
                    }`}>
                      {msg.role === "ai" && (
                        <div className="flex items-center gap-2 mb-2 border-b border-border/50 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">Veda Avatar</span>
                          <Volume2 className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{formatText(msg.text)}</div>
                    </div>
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground border border-border rounded-2xl rounded-tl-sm p-4 w-24 flex justify-center">
                      <div className="flex gap-1.5 items-center h-4">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
