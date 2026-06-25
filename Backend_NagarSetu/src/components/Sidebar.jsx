import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  MapPin, 
  Newspaper, 
  HeartHandshake, 
  Trophy, 
  UserCircle, 
  Bell, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Globe,
  Wind
} from 'lucide-react';
import { useCivicData } from '../hooks/useCivicData';

export default function Sidebar({ isOpen, toggleClose }) {
  const { currentUser } = useCivicData();

  const links = [
    { to: "/", label: "Landing Page", icon: Globe },
    { to: "/dashboard", label: "Home Dashboard", icon: LayoutDashboard },
    { to: "/aqi", label: "AQI Tracking", icon: Wind },
    { to: "/upload", label: "File Complaint", icon: UploadCloud },
    { to: "/tracking", label: "Track Complaint", icon: MapPin },
    { to: "/feed", label: "Community Feed", icon: Newspaper },
    { to: "/volunteers", label: "Volunteer Drives", icon: HeartHandshake },
    { to: "/leaderboard", label: "City Leaderboard", icon: Trophy },
    { to: "/profile", label: "My Profile", icon: UserCircle },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  // Admin-only menu links (visible to all but marked/dynamic)
  const adminLinks = [
    { to: "/admin", label: "Admin Portal", icon: ShieldCheck, adminOnly: true },
    { to: "/analytics", label: "Smart Analytics", icon: BarChart3, adminOnly: true },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLinkClick = () => {
    if (toggleClose) toggleClose();
  };

  const percentXp = currentUser.xpToNextLevel 
    ? Math.min(100, (currentUser.xp / currentUser.xpToNextLevel) * 100) 
    : 0;

  return (
    <aside className="w-64 bg-white/80 border-r border-purple-100/40 h-full flex flex-col justify-between py-6 backdrop-blur-md">
      {/* Brand Header */}
      <div>
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-purple flex items-center justify-center font-bold text-white shadow-glow-violet text-xl">
            NS
          </div>
          <div>
            <h1 className="text-xl font-bold font-outfit text-slate-800 leading-none">NagarSetu</h1>
            <span className="text-[10px] text-brand-violet font-semibold tracking-widest uppercase">Civic-Tech Platform</span>
          </div>
        </div>

        {/* Navigation Routes */}
        <nav className="px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand-violet/10 text-brand-violet border-l-2 border-brand-violet font-semibold"
                      : "text-slate-500 hover:bg-purple-50/50 hover:text-slate-800"
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-xs font-sans font-medium">{link.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-purple-100/50 my-2 px-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Management</span>
          </div>

          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isRestricted = link.adminOnly && currentUser.role !== 'admin';
            
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand-violet/10 text-brand-violet border-l-2 border-brand-violet font-semibold"
                      : "text-slate-500 hover:bg-purple-50/50 hover:text-slate-800"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-xs font-sans font-medium">{link.label}</span>
                </div>
                {link.adminOnly && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                    isRestricted ? 'bg-slate-100 text-slate-400' : 'bg-brand-violet/20 text-brand-violet'
                  }`}>
                    {isRestricted ? 'Lock' : 'Admin'}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Gamification Profile Footer */}
      {currentUser.role !== 'admin' ? (
        <div className="mx-4 p-4 rounded-2xl bg-white/90 shadow-soft border border-purple-100/40">
          <div className="flex items-center gap-3 mb-2.5">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-brand-violet/25 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] bg-brand-violet/15 text-brand-violet font-mono px-1.5 py-0.2 rounded font-bold">
                  LVL {currentUser.level}
                </span>
                <span className="text-[9px] text-slate-500 truncate capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
          
          {/* XP Bar */}
          <div>
            <div className="flex justify-between items-center text-[9px] mb-1">
              <span className="text-slate-400 font-medium">XP Level Meter</span>
              <span className="text-slate-600 font-bold font-mono">{currentUser.xp} / {currentUser.xpToNextLevel}</span>
            </div>
            <div className="w-full bg-purple-100/40 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-violet to-brand-purple h-full rounded-full transition-all duration-500" 
                style={{ width: `${percentXp}%` }}
              />
            </div>
          </div>
          
          {/* Streak Indicator */}
          {currentUser.streak && (
            <div className="mt-3 flex items-center justify-between border-t border-purple-100/50 pt-2.5">
              <span className="text-[9px] text-slate-450 font-medium">Cleanup Streak:</span>
              <span className="text-xs font-bold text-orange-500 flex items-center gap-0.5">
                🔥 {currentUser.streak} Days
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-4 p-4 rounded-2xl bg-white/90 shadow-soft border border-purple-100/40 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border border-brand-violet/25 object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[8px] text-brand-violet font-mono font-bold truncate mt-0.5">MUNICIPAL COMMANDER</p>
          </div>
        </div>
      )}
    </aside>
  );
}
