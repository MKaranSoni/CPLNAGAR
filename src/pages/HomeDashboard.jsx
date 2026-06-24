import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivicData } from '../hooks/useCivicData';
import { getAllComplaints, upvoteComplaint, removeUpvote } from '../services/complaintService';
import { 
  Trophy, 
  PlusCircle, 
  Users, 
  Clock,
  RefreshCw,
  FileText,
  CheckCircle,
  ThumbsUp,
  ArrowRight
} from 'lucide-react';
import AddressDisplay from '../components/AddressDisplay';
import { getUserStats } from '../services/userService';
import { getWardLeaderboard } from '../services/leaderboardService';

export default function HomeDashboard() {
  const { currentUser, feedPosts, showToast } = useCivicData();
  const navigate = useNavigate();

  const [localUpvoted, setLocalUpvoted] = useState(new Set());

  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('Fetching location...');
  const [liveReports, setLiveReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState(null);

  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const fetchUserLocation = () => {
    setUserLocation('Fetching location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            
            const amenity = data.address?.amenity || data.address?.building || data.address?.shop || data.address?.historic;
            const road = data.address?.road || data.address?.pedestrian;
            const locality = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || data.address?.village || data.address?.town;
            const city = data.address?.city || data.address?.state_district || data.address?.state;
            
            const parts = [];
            if (amenity) parts.push(amenity);
            else if (road) parts.push(road);
            if (locality) parts.push(locality);
            if (city) parts.push(city);
            
            const formattedLoc = parts.length > 0 ? parts.join(', ') : "Known Location";
            setUserLocation(formattedLoc);
            localStorage.setItem('userLocation', formattedLoc);
          } catch (err) {
            setUserLocation("Location unavailable");
          }
        },
        (err) => {
          let errorMsg = "Location access denied";
          switch(err.code) {
            case 1: errorMsg = "Please enable location access to see your ward details."; console.error("Geolocation: PERMISSION_DENIED"); break;
            case 2: errorMsg = "Location unavailable. Please try again."; console.error("Geolocation: POSITION_UNAVAILABLE"); break;
            case 3: errorMsg = "Location request timed out. Please try again."; console.error("Geolocation: TIMEOUT"); break;
          }
          setUserLocation(errorMsg);
        }
      );
    } else {
      setUserLocation("Geolocation not supported");
    }
  };

  const handleUpvote = async (compId) => {
    try {
      if (localUpvoted.has(compId)) {
        await removeUpvote(compId);
        setLocalUpvoted(prev => {
          const next = new Set(prev);
          next.delete(compId);
          return next;
        });
        setLiveReports(prev => prev.map(c => 
          c.id === compId ? { ...c, upvoteCount: Math.max(0, (c.upvoteCount || 1) - 1) } : c
        ));
      } else {
        await upvoteComplaint(compId);
        setLocalUpvoted(prev => new Set(prev).add(compId));
        setLiveReports(prev => prev.map(c => 
          c.id === compId ? { ...c, upvoteCount: (c.upvoteCount || 0) + 1 } : c
        ));
      }
    } catch (err) {
      console.error("Upvote action failed", err);
      // Fallback if backend says already upvoted when we didn't know
      if (err.response?.status === 500 || err.response?.data?.message?.includes("Already")) {
        setLocalUpvoted(prev => new Set(prev).add(compId));
        getAllComplaints().then(res => {
          const data = res.data?.content || res.data || [];
          setLiveReports(Array.isArray(data) ? data : []);
        });
      } else {
        showToast("Failed to process upvote.", "error");
      }
    }
  };

  useEffect(() => {
    // 1. User Name
    const storedName = localStorage.getItem('userName') || currentUser.name;
    setUserName(storedName.split(' ')[0]);

    // 2. User Location (Reverse Geocoding)
    const storedLoc = localStorage.getItem('userLocation');
    if (storedLoc) {
      setUserLocation(storedLoc);
    } else {
      fetchUserLocation();
    }

    // 4. Fetch Live Reports & Analytics
    const fetchData = async () => {
      try {
        const [reportsRes, statsRes, lbRes] = await Promise.all([
          getAllComplaints(),
          getUserStats(),
          getWardLeaderboard()
        ]);
        const data = reportsRes.data?.content || reportsRes.data || [];
        setLiveReports(Array.isArray(data) ? data : []);
        setReportsLoading(false);
        
        setUserStats(statsRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) {
        setReportsError("Failed to load reports");
        setReportsLoading(false);
        console.error("Analytics fetch error:", err);
      } finally {
        setStatsLoading(false);
        setLeaderboardLoading(false);
      }
    };
    fetchData();
  }, [currentUser.name]);

  return (
    <div className="space-y-8">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">
            Namaste, {userName}!
          </h2>
          <div className="text-xs text-themeLight-textSub mt-1 flex items-center gap-2">
            <span>Ward location: <span className="text-brand-violet font-bold">{userLocation}</span>. Together, we make our city smarter.</span>
            <button onClick={fetchUserLocation} className="text-brand-violet hover:text-brand-purple transition-all p-1" title="Retry Location">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* My Complaint Statistics */}
      {currentUser.role !== 'admin' && (
        <div>
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest mb-4">My Complaint Statistics</h3>
          {statsLoading ? (
             <div className="text-center p-4 text-xs text-slate-500 animate-pulse">Loading stats...</div>
          ) : userStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Card 1: Total Complaints Filed */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between shadow-soft">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-slate-100">{userStats.totalComplaints}</h3>
                    <p className="text-xs text-slate-550 mt-1 font-bold">Complaints Filed</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Card 2: Complaints Resolved */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between shadow-soft">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-slate-100">{userStats.resolvedComplaints}</h3>
                    <p className="text-xs text-slate-550 mt-1 font-bold">Complaints Resolved</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Card 3: Most Upvoted Complaint */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between shadow-soft">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded font-mono">MOST UPVOTED</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                </div>
                
                {userStats.mostUpvotedComplaint ? (
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">{userStats.mostUpvotedComplaint.title}</h4>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{userStats.mostUpvotedComplaint.upvotes} Upvotes</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono uppercase bg-slate-100 text-slate-500">{userStats.mostUpvotedComplaint.status}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic mt-2">No complaints filed yet</div>
                )}
              </div>

            </div>
          ) : (
             <div className="text-center p-4 text-xs text-red-500">Failed to load statistics</div>
          )}
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
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-4 group-hover:text-brand-violet transition-colors">Report New Hazard</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">File potholes, waste overflow, light defects with AI prediction scan.</p>
          </button>

          <button
            onClick={() => navigate('/volunteers')}
            className="p-5 rounded-2xl bg-gradient-to-br from-brand-purple/5 to-transparent border border-purple-100/60 hover:border-brand-purple/40 transition-all text-left group shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-4 group-hover:text-brand-purple transition-colors">Volunteer Cleanup Drives</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Join neighborhood squads, tree plantings, and plastic pickups.</p>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-purple-100/60 hover:border-indigo-500/40 transition-all text-left group shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mt-4 group-hover:text-indigo-650 transition-colors">Redeem Eco Rewards</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Exchange your civic actions for transit tickets, tax rebates, and seeds.</p>
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
            {reportsLoading && <div className="text-center p-4">Loading reports...</div>}
            {reportsError && <div className="text-center p-4 text-red-500">{reportsError}</div>}
            {!reportsLoading && !reportsError && liveReports.length === 0 && (
              <div className="text-center p-4 text-slate-500">No active reports found.</div>
            )}
            {!reportsLoading && Array.isArray(liveReports) && liveReports.slice(0, 3).map((comp) => (
              <div 
                key={comp.id} 
                className="p-5 rounded-2xl glass-panel hover:border-purple-200 transition-all flex flex-col sm:flex-row gap-5 shadow-soft"
              >
                <img
                  src={comp.imageUrl || "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80"}
                  alt={comp.title}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl border border-purple-100"
                />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[9px] bg-slate-900/5 text-slate-500 font-mono px-2 py-0.5 rounded font-bold border border-slate-900/5">
                        NS-{comp.id}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase ${
                        comp.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15' :
                        comp.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/15' :
                        comp.status === 'AI Screened' ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/15' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {comp.status}
                      </span>
                      {comp.severity && (
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase ${
                          comp.severity === 'Critical' ? 'bg-red-500/10 text-red-600 border border-red-500/15' :
                          comp.severity === 'High' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/15' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {comp.severity}
                        </span>
                      )}
                      {comp.category && (
                        <span className="text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase bg-purple-500/10 text-purple-600 border border-purple-500/15">
                          {comp.category}
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => navigate('/tracking')}
                      className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-brand-violet transition-colors cursor-pointer leading-snug"
                    >
                      {comp.title}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-purple-100/50 pt-3.5 mt-4">
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                      <AddressDisplay latitude={comp.latitude} longitude={comp.longitude} />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpvote(comp.id)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all shadow-soft ${
                          localUpvoted.has(comp.id)
                            ? "bg-purple-100/50 border-brand-violet text-brand-violet"
                            : "bg-white dark:bg-slate-900 hover:bg-purple-50/50 border-purple-100 text-slate-650 hover:text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        👍 {comp.upvoteCount || 0}
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
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest mb-4">Trending Cleanup Drives</h3>
            <div className="p-5 rounded-2xl glass-panel relative overflow-hidden shadow-soft flex items-center justify-center min-h-[200px]">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Coming Soon</p>
            </div>
          </div>

          {/* Top Community Contributors */}
          <div>
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest mb-4">Top Community Contributors</h3>
            <div className="p-4 rounded-2xl glass-panel space-y-3 shadow-soft">
              {leaderboardLoading ? (
                <div className="text-center p-4 text-xs text-slate-500 animate-pulse">Loading contributors...</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center p-4 text-xs text-slate-500">No contributors found in this ward.</div>
              ) : (
                leaderboard.map((ldr) => (
                  <div key={ldr.userId} className="flex items-center justify-between text-xs py-2 border-b border-purple-50/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-slate-400 font-mono text-sm">
                        {ldr.rank === 1 ? '🥇' : ldr.rank === 2 ? '🥈' : ldr.rank === 3 ? '🥉' : `#${ldr.rank}`}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{ldr.userName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-lg">
                      <ThumbsUp className="w-3 h-3 text-orange-500" />
                      <span className="font-bold text-orange-600 font-mono">{ldr.totalUpvotes}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
