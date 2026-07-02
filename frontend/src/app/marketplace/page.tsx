"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, Filter, Calendar, Video, ShieldCheck, Stethoscope, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const doctors = [
  {
    name: "Dr. Anjali Sharma",
    specialty: "Ayurvedic Physician & Dosha Expert",
    rating: 4.9,
    reviews: 128,
    experience: "15 Years",
    fee: "$45/session",
    tags: ["Pitta Specialist", "Digestive Health"],
    matchScore: 98
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Yoga Therapist & Stress Management",
    rating: 4.8,
    reviews: 95,
    experience: "10 Years",
    fee: "$40/session",
    tags: ["Mental Wellness", "Vata Balancing"],
    matchScore: 85
  },
  {
    name: "Nidhi Patel",
    specialty: "Holistic Nutritionist",
    rating: 4.7,
    reviews: 210,
    experience: "8 Years",
    fee: "$35/session",
    tags: ["Weight Management", "Kapha Specialist"],
    matchScore: 72
  }
];

export default function MarketplacePage() {
  const router = useRouter();
  const [bookingDoc, setBookingDoc] = useState<string | null>(null);

  const handleBook = (name: string) => {
    setBookingDoc(name);
    setTimeout(() => {
      router.push("/telehealth");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {bookingDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Consultation Booked!</h3>
              <p className="text-muted-foreground mb-6">Your session with {bookingDoc} is confirmed. Redirecting you to the Telehealth room...</p>
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="bg-primary h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-primary" /> AI Doctor Marketplace
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with top Ayurvedic experts perfectly matched to your Digital Twin.
            </p>
          </div>
          
          <div className="flex bg-card border border-border p-1 rounded-full w-full md:w-96 shadow-sm">
            <div className="pl-4 flex items-center text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search experts, symptoms..." 
              className="w-full bg-transparent border-none focus:outline-none px-4 py-2"
            />
          </div>
        </div>

        {/* AI Top Match Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-8 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold tracking-wider text-sm uppercase">
              <ShieldCheck className="w-5 h-5" /> AI Recommended Match
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Dr. Anjali Sharma</h2>
            <p className="text-lg text-muted-foreground mb-4">Ayurvedic Physician & Dosha Expert</p>
            <p className="text-foreground font-medium mb-6">
              Based on your elevated Pitta stress score and recent digestive symptoms, Dr. Sharma is the highest-rated specialist in our network for your exact profile.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleBook("Dr. Anjali Sharma")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Calendar className="w-5 h-5" /> Book Consultation
              </button>
            </div>
          </div>
          <div className="w-48 h-48 rounded-full bg-background/50 border-4 border-white/50 shadow-xl flex items-center justify-center shrink-0">
             <div className="text-center">
               <span className="text-4xl font-bold text-primary block">98%</span>
               <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Match</span>
             </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">All Experts</h3>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-4 py-2 border border-border rounded-lg bg-card">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {doc.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="bg-secondary/10 text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {doc.matchScore}% Match
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-1">{doc.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 h-10">{doc.specialty}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm font-medium">
                <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-yellow-500"/> {doc.rating} ({doc.reviews})</span>
                <span className="text-muted-foreground">{doc.experience}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {doc.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-bold text-lg">{doc.fee}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors" title="Video Consult">
                    <Video className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleBook(doc.name)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
