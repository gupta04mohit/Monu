"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callerId: string; callerName: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const socketInstance = io(backendUrl);

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      const storedUser = localStorage.getItem("veda_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          socketInstance.emit("register", { userId: parsedUser._id, role: parsedUser.role });
        } catch (e) {}
      }
    });

    socketInstance.on("incoming-call", (data: { callerId: string; callerName: string }) => {
      setIncomingCall(data);
    });

    socketInstance.on("call-rejected", () => {
      setIncomingCall(null);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Sync user state with localStorage when navigating (e.g. after login/logout)
  useEffect(() => {
    if (socket) {
      const storedUser = localStorage.getItem("veda_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (!user || parsedUser._id !== user._id || parsedUser.role !== user.role) {
            setUser(parsedUser);
            socket.emit("register", { userId: parsedUser._id, role: parsedUser.role });
          }
        } catch (e) {}
      } else if (!storedUser && user) {
        setUser(null);
      }
    }
  }, [pathname, socket, user]);



  const handleAccept = () => {
    if (incomingCall && socket) {
      const roomId = `${incomingCall.callerId}-${Date.now()}`;
      socket.emit("accept-call", { callerId: incomingCall.callerId, roomId });
      setIncomingCall(null);
      router.push(`/telehealth?roomId=${roomId}&callerName=${encodeURIComponent(incomingCall.callerName)}`);
    }
  };

  const handleReject = () => {
    if (incomingCall && socket) {
      socket.emit("reject-call", { callerId: incomingCall.callerId });
      setIncomingCall(null);
    }
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
      <AnimatePresence>
        {incomingCall && user?.role === 'DOCTOR' && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-6 w-80 text-white"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-primary flex items-center justify-center relative z-10">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-bold">Incoming Consultation</h3>
              <p className="text-sm text-gray-400 mt-1">{incomingCall.callerName} is calling you...</p>
              
              <div className="flex gap-4 mt-6 w-full">
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-colors"
                >
                  <PhoneOff className="w-4 h-4" /> Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse"
                >
                  <Phone className="w-4 h-4" /> Accept
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SocketContext.Provider>
  );
}
