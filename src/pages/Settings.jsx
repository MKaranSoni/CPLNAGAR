import React, { useState } from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Moon, Sun, LogOut, Check, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const { theme, toggleTheme, pushNotifications, togglePushNotifications, showToast } = useCivicData();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    showToast("Logged out successfully.", "info");
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit">System Settings</h2>
        <p className="text-xs mt-1 dark:text-slate-400">Manage your preferences, appearance, and account access.</p>
      </div>

      <div className="space-y-6">
        
        {/* PREFERENCES SECTION */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Preferences</h3>
          
          <div className="glass-panel dark:bg-slate-900/50 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
            
            {/* Push Notifications Toggle */}
            <div className="p-6 border-b border-purple-100/40 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Push Notifications</h4>
                  <p className="text-[11px] opacity-70 mt-0.5">Receive updates on complaints and community alerts.</p>
                </div>
              </div>
              
              <button 
                onClick={togglePushNotifications}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${pushNotifications ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className="sr-only">Toggle push notifications</span>
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-violet/10 dark:bg-brand-violet/20 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-brand-violet" /> : <Sun className="w-5 h-5 text-brand-violet" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold">Application Theme</h4>
                  <p className="text-[11px] opacity-70 mt-0.5">Switch between Light and Dark mode globally.</p>
                </div>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => toggleTheme('light')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-900 dark:bg-slate-700 shadow-sm text-brand-violet dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => toggleTheme('dark')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ACCOUNT SECTION */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80 mt-10">Account</h3>
          
          <div className="glass-panel dark:bg-slate-900/50 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-500 dark:text-red-400">Logout Session</h4>
                  <p className="text-[11px] opacity-70 mt-0.5">Securely end your current session and return to login.</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 font-bold text-xs rounded-xl transition-colors border border-red-100 dark:border-red-500/30 whitespace-nowrap"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white/90 dark:bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
            >
              <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 border border-red-100 dark:border-red-500/20 shadow-sm">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold font-outfit mb-2">
                Confirm Logout
              </h3>
              
              <p className="text-sm opacity-70 mb-8 leading-relaxed">
                Are you sure you want to logout from NagarSetu? You will need to sign in again to access the dashboard.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
