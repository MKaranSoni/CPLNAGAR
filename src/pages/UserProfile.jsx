import React from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { 
  Award, 
  Flame, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  User,
  HeartHandshake
} from 'lucide-react';

export default function UserProfile() {
  const { currentUser, myRedeemedCodes, complaints } = useCivicData();

  const myReports = complaints.filter(
    c => c.citizenName === currentUser.name
  );

  const percentXp = currentUser.xpToNextLevel 
    ? Math.min(100, (currentUser.xp / currentUser.xpToNextLevel) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Profile Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-slate-800">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />

        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/40 shadow-emerald-glow"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-2xl font-bold font-outfit text-slate-900">{currentUser.name}</h2>
            
            <div className="flex items-center gap-1.5 justify-center mt-1 sm:mt-0">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold border border-emerald-500/10 uppercase">
                LVL {currentUser.level || 1}
              </span>
              <span className="text-[10px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded font-bold border border-slate-800 uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-900 flex items-center justify-center sm:justify-start gap-1 leading-none">
            <MapPin className="w-3.5 h-3.5 text-slate-900" />
            Vasant Kunj Ward 12, New Delhi, India
          </p>

          <p className="text-xs text-slate-450 leading-relaxed max-w-lg">
            Dedicated green resident advocating smart sanitation grids and carbon footprint reduction drives. Active since May 2026.
          </p>
        </div>

        {/* Action values */}
        {currentUser.streak && (
          <div className="px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-center min-w-[110px]">
            <Flame className="w-6 h-6 text-orange-400 mx-auto animate-pulse mb-1" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">STREAK</span>
            <span className="text-sm font-extrabold text-orange-400 mt-1 block font-mono leading-none">{currentUser.streak} Days</span>
          </div>
        )}
      </div>

      {/* Gamification progress bar */}
      {currentUser.role !== 'admin' && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-medium">Accumulated Green XP Meter</span>
            <span className="text-slate-900 font-bold font-mono">{currentUser.xp} / {currentUser.xpToNextLevel} XP</span>
          </div>
          
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${percentXp}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Unlock Level {currentUser.level + 1} to claim advanced digital smart-meter energy benefits.</p>
        </div>
      )}

      {/* Split section: Left (Badges cabinet), Right (History log ledger) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Badges cabinet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-outfit text-slate-900">Verified Badge Showcase</h3>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(currentUser.badges || []).map((bdg) => (
              <div key={bdg.id} className="p-5 rounded-2xl glass-panel-glow border-emerald-500/10 bg-slate-950/20 flex gap-4 hover:border-emerald-500/25 transition-all">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {bdg.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{bdg.title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono mt-0.5">COMPLETED</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-2">{bdg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: History Log Ledger */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-outfit text-slate-900">Recent Civic Actions</h3>
          
          <div className="p-5 rounded-2xl glass-panel space-y-4 max-h-[360px] overflow-y-auto pr-1">
            
            {/* Action 1 */}
            {myReports.length > 0 && myReports.map((rep) => (
              <div key={rep.id} className="flex gap-3 text-xs border-b border-slate-900/60 pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Filed Ticket {rep.id}</h5>
                  <p className="text-[10px] text-slate-900 truncate mt-0.5">{rep.title}</p>
                  <span className="text-[8px] text-slate-500 font-mono mt-1 block">Status: {rep.status}</span>
                </div>
              </div>
            ))}

            {/* Action 2 */}
            {myRedeemedCodes.length > 0 && myRedeemedCodes.map((code, index) => (
              <div key={index} className="flex gap-3 text-xs border-b border-slate-900/60 pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Redeemed Eco Benefit</h5>
                  <p className="text-[10px] text-slate-900 truncate mt-0.5">{code.title}</p>
                  <span className="text-[8px] text-slate-900 font-mono mt-1 block">Voucher Code: {code.code}</span>
                </div>
              </div>
            ))}

            {/* Action default */}
            <div className="flex gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900">Joined NagarSetu</h5>
                <p className="text-[10px] text-slate-900 mt-0.5">Activated smart-city citizen session.</p>
                <span className="text-[8px] text-slate-900 font-mono mt-1 block">May 24, 2026</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
