import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useCivicData } from '../hooks/useCivicData';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toasts } = useCivicData();

  return (
    <div className="flex h-screen bg-[#F7F5FC] overflow-hidden text-slate-700 font-sans">
      
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-45 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar toggleClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right Column: Navbar + Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 smart-city-grid">
          {/* Animated Page Transitions via react-router Outlet */}
          <div className="max-w-6xl mx-auto w-full pb-16">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Shared Global Toast System */}
      <Toast toasts={toasts} />
    </div>
  );
}
