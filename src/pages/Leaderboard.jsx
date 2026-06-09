import React, { useState } from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { 
  Trophy, 
  Award, 
  Ticket, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { mockLeaderboard } from '../data/mockData';

export default function Leaderboard() {
  const { currentUser, userRewards, claimReward, myRedeemedCodes } = useCivicData();
  const [activeTab, setActiveTab] = useState('citizens'); // citizens | volunteers | wards

  const handleClaim = (reward) => {
    claimReward(reward.id, reward.cost, reward.title);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-gray-900">City Leaderboard & Rewards</h2>
        <p className="text-xs text-slate-400 mt-1">Compare environmental stats, climb the ward hierarchy, and spend your Green XP in the merchant rewards store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Leaderboard ladder lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs bar */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900">
            <button
              onClick={() => setActiveTab('citizens')}
              className={`flex-1 py-3 text-xs font-bold font-outfit rounded-xl transition-colors ${
                activeTab === 'citizens' ? 'bg-slate-900 text-emerald-400 border border-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              🥇 Citizen Ladder
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`flex-1 py-3 text-xs font-bold font-outfit rounded-xl transition-colors ${
                activeTab === 'volunteers' ? 'bg-slate-900 text-blue-400 border border-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧹 Volunteer squad
            </button>
            <button
              onClick={() => setActiveTab('wards')}
              className={`flex-1 py-3 text-xs font-bold font-outfit rounded-xl transition-colors ${
                activeTab === 'wards' ? 'bg-slate-900 text-purple-400 border border-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏠 Ward Rankings
            </button>
          </div>

          {/* Ladder Display Board */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            
            {/* Citizens Roster */}
            {activeTab === 'citizens' && (
              <div className="space-y-3">
                <div className="grid grid-cols-6 text-[10px] font-bold text-gray-900 uppercase tracking-widest pb-2 border-b border-slate-900/60 font-mono">
                  <div className="col-span-3">Citizen Name</div>
                  <div className="text-center">Level</div>
                  <div className="text-center">Streak</div>
                  <div className="text-right">XP Points</div>
                </div>

                {mockLeaderboard.citizens.map((cit) => (
                  <div 
                    key={cit.rank} 
                    className={`grid grid-cols-6 items-center text-xs py-3 border-b border-slate-900/40 last:border-0 ${
                      cit.name.includes("You") ? 'bg-emerald-500/[0.03] rounded-xl px-2 border border-emerald-500/10' : ''
                    }`}
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <span className={`w-6 text-center font-bold font-mono text-xs ${
                        cit.rank === 1 ? 'text-yellow-400' : cit.rank === 2 ? 'text-gray-900' : cit.rank === 3 ? 'text-amber-600' : 'text-gray-900'
                      }`}>
                        {cit.rank === 1 ? '🥇' : cit.rank === 2 ? '🥈' : cit.rank === 3 ? '🥉' : `#${cit.rank}`}
                      </span>
                      <img src={cit.avatar} alt={cit.name} className="w-8 h-8 rounded-full border border-slate-800 object-cover" />
                      <span className="font-bold text-gray-900">{cit.name}</span>
                    </div>
                    <div className="text-center font-mono font-bold text-gray-900">{cit.level}</div>
                    <div className="text-center font-bold text-orange-400">🔥 {cit.streak}d</div>
                    <div className="text-right font-bold text-emerald-400 font-mono">{cit.xp} XP</div>
                  </div>
                ))}
              </div>
            )}

            {/* Volunteers Roster */}
            {activeTab === 'volunteers' && (
              <div className="space-y-3">
                <div className="grid grid-cols-5 text-[10px] font-bold text-gray-900 uppercase tracking-widest pb-2 border-b border-slate-900/60 font-mono">
                  <div className="col-span-3">Volunteer Leader</div>
                  <div className="text-center">Cleanups</div>
                  <div className="text-right">Reliability</div>
                </div>

                {mockLeaderboard.volunteers.map((vol) => (
                  <div 
                    key={vol.rank} 
                    className={`grid grid-cols-5 items-center text-xs py-3 border-b border-slate-900/40 last:border-0 ${
                      vol.name.includes("You") ? 'bg-blue-500/[0.03] rounded-xl px-2 border border-blue-500/10' : ''
                    }`}
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <span className={`w-6 text-center font-bold font-mono text-xs ${
                        vol.rank === 1 ? 'text-yellow-400' : vol.rank === 2 ? 'text-gray-900' : vol.rank === 3 ? 'text-amber-600' : 'text-gray-900'
                      }`}>
                        {vol.rank === 1 ? '🥇' : vol.rank === 2 ? '🥈' : vol.rank === 3 ? '🥉' : `#${vol.rank}`}
                      </span>
                      <img src={vol.avatar} alt={vol.name} className="w-8 h-8 rounded-full border border-slate-800 object-cover" />
                      <span className="font-bold text-gray-900">{vol.name}</span>
                    </div>
                    <div className="text-center font-mono font-bold text-gray-900">{vol.solvedCount}</div>
                    <div className="text-right font-bold text-blue-400 font-mono">{vol.score}%</div>
                  </div>
                ))}
              </div>
            )}

            {/* Wards Roster */}
            {activeTab === 'wards' && (
              <div className="space-y-3">
                <div className="grid grid-cols-5 text-[10px] font-bold text-gray-900 uppercase tracking-widest pb-2 border-b border-slate-900/60 font-mono">
                  <div className="col-span-2">Ward Name</div>
                  <div className="text-center">Issues Solved</div>
                  <div className="text-center">Compliance</div>
                  <div className="text-right">Combined XP</div>
                </div>

                {mockLeaderboard.wards.map((wrd) => (
                  <div key={wrd.rank} className="grid grid-cols-5 items-center text-xs py-3 border-b border-slate-900/40 last:border-0">
                    <div className="col-span-2 flex items-center gap-3">
                      <span className={`w-6 text-center font-bold font-mono text-xs ${
                        wrd.rank === 1 ? 'text-yellow-400' : wrd.rank === 2 ? 'text-gray-900' : wrd.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {wrd.rank === 1 ? '🥇' : wrd.rank === 2 ? '🥈' : wrd.rank === 3 ? '🥉' : `#${wrd.rank}`}
                      </span>
                      <span className="font-bold text-gray-900">{wrd.name}</span>
                    </div>
                    <div className="text-center font-mono font-bold text-gray-900">{wrd.resolvedCount}</div>
                    <div className="text-center font-bold text-emerald-400 font-mono">{wrd.compliance}</div>
                    <div className="text-right font-bold text-purple-400 font-mono">{wrd.xp} XP</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Merchant Rewards Store */}
        <div className="space-y-6">
          
          {/* Personal balance overview */}
          <div className="p-5 rounded-2xl glass-panel-glow border-emerald-500/25 bg-slate-950/20 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-gray-900 font-bold uppercase tracking-wider block">YOUR GREEN BALANCE</span>
              <span className="text-2xl font-extrabold font-outfit text-emerald-400 mt-1 block font-mono">{currentUser.xp} XP</span>
            </div>
            <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>

          <h3 className="text-lg font-bold font-outfit text-gray-900">Merchant Rewards Store</h3>
          
          {/* Rewards Lists */}
          <div className="space-y-3">
            {userRewards.map((reward) => {
              
              const canAfford = currentUser.xp >= reward.cost;
              return (
                <div key={reward.id} className="p-4 rounded-xl glass-panel flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-snug">{reward.title}</h4>
                      <p className="text-[9px] text-gray-900 font-mono font-semibold mt-0.5 uppercase">{reward.sponsor}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{reward.cost} XP</span>
                    <button
                      
  disabled={!canAfford}
  onClick={() => handleClaim(reward)}
  className={`px-4 py-2 rounded-lg font-bold text-[10px] shadow-sm transition-all ${
    canAfford
      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950'
      : 'bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50 text-slate-950 cursor-not-allowed'
  }`}
>
  Redeem Coupon
</button>
                    
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redeemed Codes Vault panel */}
          {myRedeemedCodes.length > 0 && (
            <div className="p-5 rounded-2xl glass-panel space-y-4">
              <h4 className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>My Redeemed Vouchers</span>
              </h4>

              <div className="space-y-2">
                {myRedeemedCodes.map((code, index) => (
                  <div key={index} className="p-3 bg-slate-900/50 border border-slate-850 rounded-xl space-y-1.5 text-xs text-slate-350">
                    <p className="font-bold text-gray-900">{code.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{code.code}</span>
                      <span className="text-[9px] text-gray-900 uppercase font-mono font-bold">Unused</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
