import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F5FC] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

      {/* Background Neon Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-brand-violet/8 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-brand-purple/8 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* Blueprint Grid */}
      <div className="absolute inset-0 smart-city-grid opacity-40 pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-purple flex items-center justify-center font-bold text-white shadow-glow-violet text-base">
          NS
        </div>
        <span className="text-lg font-bold font-outfit text-slate-800 tracking-wide">
          NagarSetu
        </span>
      </div>

      {/* Animated Auth Pages */}
      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-[9px] text-slate-400 font-mono font-medium tracking-widest uppercase">
        &copy; {new Date().getFullYear()} NAGARSETU CIVIC TECHNOLOGIES. ALL RIGHTS RESERVED.
      </div>

    </div>
  );
}