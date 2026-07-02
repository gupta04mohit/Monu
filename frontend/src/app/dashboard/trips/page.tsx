"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Calendar, MapPin, Download, DollarSign, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Trip {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  itinerary: any;
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch from /api/trips. 
    // Using mock data for demonstration to avoid needing auth token setup right now.
    const mockTrips: Trip[] = [
      {
        _id: "1",
        destination: "Kerala Backwaters",
        startDate: "2026-08-10T00:00:00Z",
        endDate: "2026-08-15T00:00:00Z",
        budget: 1500,
        itinerary: {
          days: [
            { day: 1, activity: "Arrival in Kochi, check-in to houseboat." },
            { day: 2, activity: "Cruise through Alleppey backwaters." },
            { day: 3, activity: "Ayurvedic Spa and Wellness Retreat." }
          ]
        }
      },
      {
        _id: "2",
        destination: "Rishikesh Yoga Retreat",
        startDate: "2026-10-05T00:00:00Z",
        endDate: "2026-10-12T00:00:00Z",
        budget: 800,
        itinerary: {
          days: [
            { day: 1, activity: "Arrival and Ganga Aarti." },
            { day: 2, activity: "Morning Yoga and Meditation." }
          ]
        }
      }
    ];
    
    setTimeout(() => {
      setTrips(mockTrips);
      setLoading(false);
    }, 1000);
  }, []);

  const exportPDF = (trip: Trip) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(`Itinerary: ${trip.destination}`, 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dates: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`, 14, 30);
    doc.text(`Budget: $${trip.budget}`, 14, 38);

    const tableData = trip.itinerary.days?.map((d: any) => [
      `Day ${d.day}`,
      d.activity
    ]) || [];

    (doc as any).autoTable({
      startY: 45,
      head: [['Day', 'Activity']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [65, 105, 225] }
    });

    doc.save(`${trip.destination.replace(/\s+/g, '_')}_Itinerary.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground mt-1">Manage your wellness retreats and travel plans.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/travel-planner'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Plan New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No trips planned yet</h3>
            <p className="text-muted-foreground mt-2">Start planning your next wellness journey today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={trip._id}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {trip.destination}
                  </h3>
                  <button 
                    onClick={() => exportPDF(trip)}
                    className="p-2 bg-secondary/20 text-secondary-foreground rounded-lg hover:bg-secondary/30 transition tooltip"
                    title="Export PDF Itinerary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 flex-1 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Budget: ${trip.budget}</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                  <h4 className="font-medium text-sm mb-2">Highlights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {trip.itinerary.days?.slice(0, 2).map((d: any, i: number) => (
                      <li key={i} className="truncate">{d.activity}</li>
                    ))}
                    {trip.itinerary.days?.length > 2 && (
                      <li className="text-primary text-xs mt-2 italic">+ {trip.itinerary.days.length - 2} more days</li>
                    )}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
