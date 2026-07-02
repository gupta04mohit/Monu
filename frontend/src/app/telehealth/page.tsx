"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, FileText, Clock, User, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

export default function TelehealthPage() {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [aiNotes, setAiNotes] = useState<string[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Simulate Doctor joining
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnected(true);
      
      // Simulate AI notes populating
      setTimeout(() => setAiNotes(prev => [...prev, "Patient reports persistent digestive discomfort after meals."]), 2000);
      setTimeout(() => setAiNotes(prev => [...prev, "SpO2 readings from wearable: <span class='text-green-400 font-semibold'>98% — normal</span>."]), 5000);
      setTimeout(() => setAiNotes(prev => [...prev, "Dosha Profile: <span class='text-orange-400 font-semibold'>Vata-Pitta</span>. Possible Sama Agni issue."]), 8000);
      
    }, 4000); // Connects after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  // Initialize camera and mic
  useEffect(() => {
    async function setupMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn("Could not access media devices (Permission Denied). Running in fallback mode.", err);
        setError("Could not access camera or microphone. Please check permissions.");
      }
    }
    setupMedia();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle tracks when state changes
  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => { track.enabled = micOn; });
      stream.getVideoTracks().forEach(track => { track.enabled = camOn; });
    }
  }, [micOn, camOn, stream]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-md">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Consultation with Dr. Anjali Sharma</h2>
          <p className="text-white/50 text-sm flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5" /> Session active · 12:34 mins</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-green-400 text-sm font-semibold tracking-wide">Live</span>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Doctor Video Feed (Main) */}
        <div className="lg:col-span-2 relative bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl min-h-[450px] flex items-center justify-center group">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50"></div>
          
          {!connected ? (
            <div className="text-center z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                <User className="w-10 h-10 text-white/40" />
              </div>
              <p className="text-xl text-white font-medium mb-2">Waiting for Dr. Sharma...</p>
              <p className="text-white/40 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Establishing secure P2P connection
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-900 z-10">
              {/* Fallback avatar if no video available, but we use a cool animated pulse to look like active audio */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-primary flex items-center justify-center relative z-10">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <p className="mt-6 text-white text-lg font-medium">Dr. Sharma is speaking...</p>
                
                {/* Audio visualizer simulation */}
                <div className="flex items-center gap-1.5 mt-4">
                  {[...Array(8)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: ["10px", "30px", "10px"] }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: Math.random() }}
                      className="w-1.5 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Doctor Name Tag */}
          <div className="absolute bottom-6 left-6 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl transition-transform group-hover:scale-105">
            <p className="text-white font-bold text-lg">Dr. Anjali Sharma</p>
            <p className="text-primary text-sm font-medium">Ayurvedic Physician {connected && "• Connected"}</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Self Video */}
          <div className="bg-gray-900 rounded-3xl border border-white/5 overflow-hidden relative h-56 flex items-center justify-center shadow-xl">
            {error ? (
              <div className="text-center px-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : (
              <>
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${!camOn ? 'opacity-0' : 'opacity-100'}`} 
                />
                {!camOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white/30">
                    <VideoOff className="w-12 h-12 mb-2" />
                    <p className="text-sm">Camera is off</p>
                  </div>
                )}
              </>
            )}
            
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <p className="text-white text-xs font-semibold">You</p>
              {!micOn && <MicOff className="w-3 h-3 text-red-400" />}
            </div>
          </div>

          {/* AI Notes */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex-1 flex flex-col shadow-xl">
            <h4 className="text-white/90 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-4 h-4 text-primary" /> Live AI Session Notes
            </h4>
            <div className="space-y-3 text-sm flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {!connected ? (
                 <p className="text-white/40 italic text-center mt-10">AI will start taking notes once the consultation begins.</p>
              ) : (
                <AnimatePresence>
                  {aiNotes.map((note, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 p-3 rounded-xl border border-white/5"
                    >
                      <p className="text-white/80 leading-relaxed" dangerouslySetInnerHTML={{__html: note}} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <AnimatePresence>
              {connected && aiNotes.length >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-white/10 bg-primary/10 -mx-6 -mb-6 p-6 rounded-b-3xl border-t-primary/20"
                >
                  <p className="text-xs text-primary font-bold tracking-widest mb-3">AI SUGGESTED PRESCRIPTIONS</p>
                  <ul className="space-y-2">
                    <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.2}} className="text-white/90 text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> Triphala Churna — 1 tsp with warm water before bed.
                    </motion.li>
                    <motion.li initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.5}} className="text-white/90 text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> Avoid raw, cold salads for 2 weeks to balance Agni.
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-950 border-t border-white/5 px-6 py-6 flex items-center justify-center gap-6 relative z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMicOn(!micOn)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${micOn ? 'bg-white/10 hover:bg-white/20 border border-white/10' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
          title={micOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCamOn(!camOn)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${camOn ? 'bg-white/10 hover:bg-white/20 border border-white/10' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
          title={camOn ? "Turn off Camera" : "Turn on Camera"}
        >
          {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all shadow-lg"
          title="Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={() => router.push("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-16 rounded-2xl flex items-center justify-center text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 px-6 ml-4"
          title="End Call"
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
        </motion.button>
      </div>
    </div>
  );
}
