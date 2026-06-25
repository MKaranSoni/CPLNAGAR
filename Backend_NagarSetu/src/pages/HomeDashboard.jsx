import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivicData } from '../hooks/useCivicData';
import { 
  Trophy, 
  Flame, 
  PlusCircle, 
  Search, 
  Users, 
  Award,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

export default function HomeDashboard() {
  const { currentUser, complaints, feedPosts, likeComplaint } = useCivicData();
  const navigate = useNavigate();

  // Filter complaints related to this user or general ward active ones
  const userComplaints = complaints.filter(
    c => c.citizenName === currentUser.name || c.status !== 'Resolved'
  ).slice(0, 3);

  const percentXp = currentUser.xpToNextLevel 
    ? Math.min(100, (currentUser.xp / currentUser.xpToNextLevel) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">
            Namaste, {currentUser.name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-themeLight-textSub mt-1">
            Ward location: <span className="text-brand-violet font-bold">Ward 12 - Vasant Kunj</span>. Together, we make our city smarter.
          </p>
        </div>
        
        {/* Streak & Active XP pill */}
        <div className="flex items-center gap-3">
          {currentUser.streak && (
            <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-mono font-bold leading-none">Streaks</p>
                <p className="text-xs font-extrabold text-orange-500 mt-0.5 leading-none">{currentUser.streak} Days</p>
              </div>
            </div>
          )}
          <div className="px-4 py-2 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-violet" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-mono font-bold leading-none">Global XP</p>
              <p className="text-xs font-extrabold text-brand-violet mt-0.5 leading-none">{currentUser.xp} Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Stat Showcase Block */}
      {currentUser.role !== 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between shadow-soft">
            <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-gradient-to-l from-brand-violet/5 to-transparent pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-violet uppercase tracking-widest bg-brand-violet/10 px-2 py-0.5 rounded font-mono">CIVIC LEVEL TIER</span>
                  <h3 className="text-xl font-bold font-outfit text-slate-800 mt-1.5">Level {currentUser.level} Citizen Specialist</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">{currentUser.xp} / {currentUser.xpToNextLevel} XP</span>
              </div>
              <div className="w-full bg-purple-100/40 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-violet to-brand-purple h-full rounded-full transition-all duration-750" 
                  style={{ width: `${percentXp}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Earn <span className="text-slate-800 font-bold">{currentUser.xpToNextLevel - currentUser.xp} more XP</span> to advance to Level {currentUser.level + 1} and unlock advanced municipal project credentials.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between shadow-soft">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded font-mono">IMPACT SUMMARY</span>
                <h3 className="text-3xl font-extrabold font-outfit text-slate-800 mt-3">{currentUser.solvedCount}</h3>
                <p className="text-xs text-slate-550 mt-1">Hazard issues resolved</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-650">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="border-t border-purple-100/60 pt-3.5 mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>Current Leaderboard Rank:</span>
              <span className="text-slate-700 font-bold font-mono">#{currentUser.rank} / 12,450</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest mb-4">Quick Operations Hub</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <button
            onClick={() => navigate('/upload')}
            className="p-5 rounded-2xl bg-gradient-to-br from-brand-violet/5 to-transparent border border-purple-100/60 hover:border-brand-violet/40 transition-all text-left group shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-violet/15 text-brand-violet flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5 animate-pulse" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-4 group-hover:text-brand-violet transition-colors">Report New Hazard</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">File potholes, waste overflow, light defects with AI prediction scan.</p>
          </button>

          <button
            onClick={() => navigate('/volunteers')}
            className="p-5 rounded-2xl bg-gradient-to-br from-brand-purple/5 to-transparent border border-purple-100/60 hover:border-brand-purple/40 transition-all text-left group shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-4 group-hover:text-brand-purple transition-colors">Volunteer Cleanup Drives</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Join neighborhood squads, tree plantings, and plastic pickups.</p>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-purple-100/60 hover:border-indigo-500/40 transition-all text-left group shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-4 group-hover:text-indigo-650 transition-colors">Redeem Eco Rewards</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Exchange your Green XP for transit tickets, tax rebates, and seeds.</p>
          </button>

        </div>
      </div>

      {/* Main split: Left (Active Complaints), Right (Mini Feed & Mini Leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Active Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">Active Local Reports</h3>
            <button 
              onClick={() => navigate('/tracking')}
              className="text-xs text-brand-violet hover:text-brand-purple transition-colors flex items-center gap-1 font-bold uppercase tracking-wider font-mono"
            >
              See all logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {userComplaints.map((comp) => (
              <div 
                key={comp.id} 
                className="p-5 rounded-2xl glass-panel hover:border-purple-200 transition-all flex flex-col sm:flex-row gap-5 shadow-soft"
              >
                <img
                  src={comp.photoUrl}
                  alt={comp.title}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl border border-purple-100"
                />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[9px] bg-slate-900/5 text-slate-500 font-mono px-2 py-0.5 rounded font-bold border border-slate-900/5">
                        {comp.id}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase ${
                        comp.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15' :
                        comp.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/15' :
                        comp.status === 'AI Screened' ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/15' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {comp.status}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase ${
                        comp.priority === 'Critical' ? 'bg-red-500/10 text-red-600 border border-red-500/15' :
                        comp.priority === 'High' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/15' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {comp.priority}
                      </span>
                    </div>

                    <h4 
                      onClick={() => navigate('/tracking')}
                      className="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-violet transition-colors cursor-pointer leading-snug"
                    >
                      {comp.title}
                    </h4>
                    
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-purple-100/50 pt-3.5 mt-4">
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                        {comp.locationName.split(',')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => likeComplaint(comp.id)}
                        className="text-[10px] px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-50/50 border border-purple-100 text-slate-650 hover:text-slate-800 flex items-center gap-1.5 transition-all shadow-soft"
                      >
                        👍 {comp.likes}
                      </button>
                      <button
                        onClick={() => navigate('/tracking')}
                        className="text-[10px] text-brand-violet hover:text-brand-purple px-2.5 py-1.5 rounded-lg transition-colors font-bold font-mono"
                      >
                        TRACK &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Mini Feed + Mini Leaderboard */}
        <div className="space-y-6">
          
          {/* Mini Feed Post */}
          <div>
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest mb-4">Trending Cleanup Drive</h3>
            {feedPosts.slice(0, 1).map((post) => (
              <div key={post.id} className="p-5 rounded-2xl glass-panel relative overflow-hidden shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-8 h-8 rounded-full border border-purple-100 object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{post.author}</h5>
                    <p className="text-[9px] text-brand-violet font-mono font-bold leading-none mt-0.5">{post.role}</p>
                  </div>
                </div>
                
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 leading-snug">{post.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">{post.description}</p>
                
                {/* Visual before/after comparative cards side-by-side */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="relative rounded-lg overflow-hidden h-20 border border-purple-100">
                    <img src={post.beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-[8px] font-mono text-red-300 px-1.5 py-0.2 rounded font-bold uppercase">Before</span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden h-20 border border-purple-100">
                    <img src={post.afterImage} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-[8px] font-mono text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">After</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/feed')}
                  className="w-full text-center py-2 bg-purple-50/40 hover:bg-purple-50 rounded-lg text-[9px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors border border-purple-100 font-mono"
                >
                  Join Community Feed
                </button>
              </div>
            ))}
          </div>

          {/* Mini Leaderboard List */}
          <div>
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest mb-4">Ward Leaders</h3>
            <div className="p-4 rounded-2xl glass-panel space-y-3 shadow-soft">
              {[
                { rank: 1, name: "Sneha Reddy", xp: 4890, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
                { rank: 2, name: "Vikram Malhotra", xp: 4210, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
                { rank: 3, name: "Kunal Kapoor", xp: 3950, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" }
              ].map((ldr) => (
                <div key={ldr.rank} className="flex items-center justify-between text-xs py-1.5 border-b border-purple-50/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-bold text-slate-400 font-mono">#{ldr.rank}</span>
                    <img src={ldr.avatar} alt={ldr.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-semibold text-slate-700">{ldr.name}</span>
                  </div>
                  <span className="font-bold text-brand-violet font-mono">{ldr.xp} XP</span>
                </div>
              ))}
              <button
                onClick={() => navigate('/leaderboard')}
                className="w-full text-center py-2 text-[9px] font-bold text-slate-500 hover:text-brand-violet uppercase tracking-wider transition-colors pt-2 block font-mono"
              >
                Show full leaderboard &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
