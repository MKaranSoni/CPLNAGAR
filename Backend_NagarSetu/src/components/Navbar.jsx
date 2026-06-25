import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, User, ShieldAlert, ChevronDown, CheckCheck } from 'lucide-react';
import { useCivicData } from '../hooks/useCivicData';

export default function Navbar({ toggleMobileSidebar }) {
  const { 
    currentUser, 
    notifications, 
    switchUserRole, 
    markAllNotificationsRead 
  } = useCivicData();
  
  const [showRoles, setShowRoles] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleRoleSwitch = (role) => {
    switchUserRole(role);
    setShowRoles(false);
    
    // Redirect appropriately based on new role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="h-20 bg-white/30 border-b border-purple-100/40 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      
      {/* Left side: Burger for mobile & active title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileSidebar} 
          className="lg:hidden p-2 hover:bg-purple-50 rounded-lg text-slate-500 hover:text-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search Bar - hidden on small mobile */}
        <div className="relative hidden md:block w-72">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search complaints, drives, areas..."
            className="w-full bg-white/70 border border-purple-100/60 text-slate-800 pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side: Simulation Switcher, Notifications, Profile */}
      <div className="flex items-center gap-4">
        
        {/* Simulation Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoles(!showRoles)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-brand-violet/25 text-brand-violet hover:bg-white text-xs font-bold shadow-soft transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-brand-violet" />
            <span className="hidden sm:inline">Role: {currentUser.role === 'admin' ? 'Municipal Admin' : currentUser.role === 'volunteer' ? 'Volunteer' : 'Citizen'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-violet" />
          </button>
          
          {showRoles && (
            <div className="absolute right-0 mt-2 w-52 bg-white/95 border border-purple-100 rounded-2xl shadow-premium p-2 z-50 backdrop-blur-md">
              <div className="px-3 py-2 border-b border-purple-100/40 mb-1">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono">Select Simulator Role</p>
              </div>
              <button
                onClick={() => handleRoleSwitch('citizen')}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-purple-50 transition-colors flex flex-col ${
                  currentUser.role === 'citizen' ? 'bg-brand-violet/10 text-brand-violet font-bold' : 'text-slate-600'
                }`}
              >
                <span>Citizen Profile</span>
                <span className="text-[8px] text-slate-450 mt-0.5">File complaints, track, social feed</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('volunteer')}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-purple-50 transition-colors flex flex-col mt-1 ${
                  currentUser.role === 'volunteer' ? 'bg-brand-violet/10 text-brand-violet font-bold' : 'text-slate-600'
                }`}
              >
                <span>Volunteer Profile</span>
                <span className="text-[8px] text-slate-450 mt-0.5">Join drives, cleanup tasks, earn XP</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-purple-50 transition-colors flex flex-col mt-1 ${
                  currentUser.role === 'admin' ? 'bg-brand-violet/10 text-brand-violet font-bold' : 'text-slate-600'
                }`}
              >
                <span>Municipal Corp Admin</span>
                <span className="text-[8px] text-slate-450 mt-0.5">Validate reports, charts, heatmaps</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-white hover:bg-purple-50/50 rounded-xl border border-purple-100 text-slate-400 hover:text-slate-800 transition-colors relative shadow-soft"
          >
            <Bell className="w-5 h-5 text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-violet rounded-full flex items-center justify-center text-[9px] text-white font-bold font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 border border-purple-100 rounded-2xl shadow-premium z-50 overflow-hidden backdrop-blur-md">
              <div className="px-4 py-3 bg-purple-50/40 border-b border-purple-100 flex justify-between items-center">
                <span className="text-xs font-bold font-outfit text-slate-800">Civic Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[9px] text-brand-violet hover:text-brand-violet/80 font-bold flex items-center gap-1 uppercase tracking-wider"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 border-b border-purple-100/50 flex flex-col gap-1 transition-colors hover:bg-purple-50/40 ${
                        notif.unread ? 'bg-brand-violet/[0.02]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          notif.type === 'status' ? 'text-blue-600' :
                          notif.type === 'streak' ? 'text-orange-500' : 'text-brand-violet'
                        }`}>
                          {notif.title}
                        </span>
                        <span className="text-[8px] text-slate-450 font-mono font-medium">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                className="w-full text-center py-2.5 bg-purple-50/30 hover:bg-purple-50 text-[9px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors border-t border-purple-100"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* User Mini Profile Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 border border-purple-100 p-1.5 pr-3.5 rounded-xl hover:bg-purple-50/50 transition-colors bg-white shadow-soft"
        >
          <img
            src={currentUser.avatar}
            alt="Profile Avatar"
            className="w-7 h-7 rounded-full border border-purple-100 object-cover"
          />
          <div className="text-left hidden sm:block">
            <p className="text-[8px] text-slate-400 font-bold font-mono uppercase tracking-wider leading-none">Account</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5 leading-none truncate max-w-[80px]">{currentUser.name.split(' ')[0]}</p>
          </div>
        </button>

      </div>
    </header>
  );
}
