import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, User, ShieldAlert, CheckCheck, Check, X } from 'lucide-react';
import { useCivicData } from '../hooks/useCivicData';
import { getMyNotifications, markNotificationAsRead, respondToClosure } from '../services/notificationService';

export default function Navbar({ toggleMobileSidebar }) {
  const { 
    notifications, 
    markAllNotificationsRead 
  } = useCivicData();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'CITIZEN';
  const userAvatar = localStorage.getItem('userAvatar'); // usually undefined unless we set it

  const user = { name: userName, role: userRole };
  console.log("Authenticated User:", user);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const [realNotifications, setRealNotifications] = useState([]);
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setRealNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClosureRespond = async (id, accept) => {
    try {
      await respondToClosure(id, accept);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = realNotifications.filter(n => !n.read).length;

  return (
    <header className="h-20 bg-white/30 dark:bg-slate-900/30 border-b border-purple-100/40 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      
      {/* Left side: Burger for mobile & active title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileSidebar} 
          className="lg:hidden p-2 hover:bg-purple-50 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-100"
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
            className="w-full bg-white/70 dark:bg-slate-900/70 border border-purple-100/60 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side: Simulation Switcher, Notifications, Profile */}
      <div className="flex items-center gap-4">
        
        {/* User Role Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-violet/10 border border-brand-violet/25 text-brand-violet text-xs font-bold shadow-soft">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-violet" />
          <span className="hidden sm:inline uppercase tracking-wider">{userRole}</span>
        </div>

        {/* Notifications Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-white dark:bg-slate-900 hover:bg-purple-50/50 rounded-xl border border-purple-100 text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors relative shadow-soft"
          >
            <Bell className="w-5 h-5 text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-violet rounded-full flex items-center justify-center text-[9px] text-white font-bold font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-slate-900/95 border border-purple-100 rounded-2xl shadow-premium z-50 overflow-hidden backdrop-blur-md">
              <div className="px-4 py-3 bg-purple-50/40 border-b border-purple-100 flex justify-between items-center">
                <span className="text-xs font-bold font-outfit text-slate-800 dark:text-slate-100">Civic Notifications</span>
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
                {realNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  realNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 border-b border-purple-100/50 flex flex-col gap-1 transition-colors hover:bg-purple-50/40 ${
                        !notif.read ? 'bg-brand-violet/[0.02]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          notif.type === 'CLOSURE_REQUEST' ? 'text-red-500' :
                          notif.type === 'RESOLVED' ? 'text-emerald-500' : 'text-brand-violet'
                        }`}>
                          {notif.type.replace('_', ' ')}
                        </span>
                        <span className="text-[8px] text-slate-450 font-mono font-medium">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">{notif.message}</p>
                      
                      {!notif.read && notif.type === 'CLOSURE_REQUEST' && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleClosureRespond(notif.id, true)} className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded font-bold">
                            <Check className="w-3 h-3"/> Accept
                          </button>
                          <button onClick={() => handleClosureRespond(notif.id, false)} className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-bold">
                            <X className="w-3 h-3"/> Reject
                          </button>
                        </div>
                      )}
                      {!notif.read && notif.type !== 'CLOSURE_REQUEST' && (
                        <button onClick={() => handleMarkAsRead(notif.id)} className="text-[9px] text-brand-violet hover:underline self-end mt-1">
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                className="w-full text-center py-2.5 bg-purple-50/30 hover:bg-purple-50 text-[9px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-100 uppercase tracking-wider transition-colors border-t border-purple-100"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* User Mini Profile Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 border border-purple-100 p-1.5 pr-3.5 rounded-xl hover:bg-purple-50/50 transition-colors bg-white dark:bg-slate-900 shadow-soft"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="Profile Avatar"
              className="w-7 h-7 rounded-full border border-purple-100 object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-brand-violet text-white flex items-center justify-center text-[10px] font-bold">
              {getInitials(userName)}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-[8px] text-slate-400 font-bold font-mono uppercase tracking-wider leading-none">Account</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5 leading-none truncate max-w-[80px]">{userName.split(' ')[0]}</p>
          </div>
        </button>

      </div>
    </header>
  );
}
