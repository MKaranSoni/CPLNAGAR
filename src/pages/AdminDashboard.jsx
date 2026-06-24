import React, { useState, useEffect } from 'react';
import {
  getAdminStats,
  getRecentComplaints,
  getTopComplaints,
  requestComplaintClosure
} from '../services/adminService';
import { getAllNotifications } from '../services/notificationService';
import { updateComplaintStatus } from '../services/complaintService'; // note the casing of complaintService
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Trash2, 
  Check, 
  AlertTriangle,
  Map,
  Activity,
  BarChart,
  Grid,
  Bell,
  CheckCircle,
  Clock,
  ThumbsUp
} from 'lucide-react';

export default function AdminDashboard() {
  const [adminStats, setAdminStats] = useState({});
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [topComplaints, setTopComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, recentRes, topRes, notifRes] = await Promise.all([
        getAdminStats(),
        getRecentComplaints(50), // fetch more for map
        getTopComplaints(10),
        getAllNotifications()
      ]);

      setAdminStats(statsRes.data);
      setRecentComplaints(recentRes.data);
      setTopComplaints(topRes.data);
      
      // Sort notifications: CLOSURE_REQUEST first
      const sortedNotifs = notifRes.data.sort((a, b) => {
        if (a.type === 'CLOSURE_REQUEST' && b.type !== 'CLOSURE_REQUEST') return -1;
        if (a.type !== 'CLOSURE_REQUEST' && b.type === 'CLOSURE_REQUEST') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setNotifications(sortedNotifs);

      if (recentRes.data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(recentRes.data[0].id);
      }
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const activeTicket = recentComplaints.find(t => t.id === selectedTicketId) || recentComplaints[0];

  const handleRequestClosure = async (id) => {
    try {
      await requestComplaintClosure(id);
      // reload dashboard data to reflect changes
      loadDashboard();
    } catch (err) {
      console.error("Failed to request closure", err);
    }
  };

  const getStatusBadgeColors = (status) => {
    switch (status) {
      case 'SUBMITTED':
      case 'PENDING': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'AI_SCREENED': return 'bg-brand-violet/20 text-brand-violet border-brand-violet/30';
      case 'ASSIGNED': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'RESOLVED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // Compute map markers directly from recent complaints
  // Normalizing lat/lon for the fixed CSS map display (mocking actual coordinates to visual space)
  const mapMarkers = recentComplaints.filter(c => c.latitude && c.longitude).map((c, idx) => {
    // Basic mapping: assume lat 28.5 to 28.7 maps to 0-100%, lon 77.1 to 77.3 maps to 0-100%
    const top = `${Math.min(Math.max((c.latitude - 28.5) / 0.2 * 100, 10), 90)}%`;
    const left = `${Math.min(Math.max((c.longitude - 77.1) / 0.2 * 100, 10), 90)}%`;
    let color = "bg-blue-500";
    if (c.status === 'RESOLVED') color = "bg-emerald-500";
    else if (c.upvoteCount > 50) color = "bg-red-500 animate-ping";
    else if (c.upvoteCount > 20) color = "bg-orange-500";
    
    return {
      id: c.id,
      name: c.title,
      upvotes: c.upvoteCount,
      status: c.status,
      category: c.category,
      imageUrl: c.imageUrl,
      top, left, color
    };
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-blue">Municipal Command Center</h2>
        <p className="text-xs text-black dark:text-white mt-1">Direct corporate operations, audit AI diagnostics, and manage community complaints.</p>
      </div>

      {/* Row 1: Municipal Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[9px] text-black dark:text-white font-bold uppercase tracking-widest font-mono block">TOTAL FILED REPORTS</span>
          <h3 className="text-2xl font-extrabold font-outfit text-blue mt-2">{adminStats.totalComplaints || 0}</h3>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Live tracking active</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[9px] text-black dark:text-white font-bold uppercase tracking-widest font-mono block">RESOLVED TICKETS</span>
          <h3 className="text-2xl font-extrabold font-outfit text-emerald-500 mt-2">{adminStats.resolved || 0}</h3>
          <span className="text-[10px] text-black dark:text-white font-medium mt-1 block">Community approved</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[9px] text-black dark:text-white font-bold uppercase tracking-widest font-mono block">ACTIVE IN PROCESS</span>
          <h3 className="text-2xl font-extrabold font-outfit text-blue-500 mt-2">{(adminStats.pending || 0) + (adminStats.inProgress || 0)}</h3>
          <span className="text-[10px] text-blue-500 font-bold mt-1 block">Pending Action</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-brand-violet/20 bg-brand-violet/5">
          <span className="text-[9px] text-brand-violet font-bold uppercase tracking-widest font-mono block">AI DUPLICATES FILTERED</span>
          <h3 className="text-2xl font-extrabold font-outfit text-brand-violet mt-2">{adminStats.aiDuplicatesFiltered || 0}</h3>
          <span className="text-[10px] text-brand-violet font-bold mt-1 block">🛡️ Spam-defense active</span>
        </div>

      </div>

      {/* Row 2: Split Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Incoming Complaints */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-outfit text-black dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Incoming Complaints</span>
            </h3>
            <span className="text-[10px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded border border-slate-800">LIVE FEED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* List box */}
            <div className="md:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {recentComplaints.length === 0 ? (
                <div className="text-xs text-slate-500 p-4">No recent complaints found.</div>
              ) : (
                recentComplaints.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                      selectedTicketId === t.id
                        ? 'bg-blue-50 border-blue-200 shadow-soft'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono font-bold text-slate-500">ID: {t.id}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${getStatusBadgeColors(t.status)}`}>
                        {t.status || 'SUBMITTED'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug">{t.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <ThumbsUp className="w-3 h-3 text-brand-violet" />
                      <span className="text-[10px] font-bold text-slate-600">{t.upvoteCount || 0}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Ticket Details */}
            {activeTicket ? (
              <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 shadow-soft space-y-5 flex flex-col justify-between h-[500px] overflow-y-auto">
                <div>
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3.5 mb-4">
                    <div>
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2.5 py-0.5 rounded border border-slate-200">#{activeTicket.id}</span>
                      <h4 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-100 mt-2">{activeTicket.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{activeTicket.description}</p>
                    </div>
                  </div>

                  {activeTicket.imageUrl && (
                    <div className="w-full h-40 mb-4 rounded-xl overflow-hidden border border-slate-200">
                      <img src={activeTicket.imageUrl} alt={activeTicket.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!activeTicket.imageUrl && (
                    <div className="w-full h-24 mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      No image attached
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Category prediction confidence */}
                    <div className="p-3 bg-brand-violet/5 border border-brand-violet/10 rounded-xl">
                      <span className="text-[8px] text-brand-violet font-bold uppercase tracking-wider block">AI CATEGORY CONFIDENCE</span>
                      <span className="text-sm font-bold text-brand-violet font-mono block mt-1">{activeTicket.authenticityPercentage || 0}% Authentic</span>
                      <span className="text-[9px] text-slate-600 block mt-0.5 font-bold uppercase">{activeTicket.category || 'General'}</span>
                    </div>

                    {/* Duplicate checker metric */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">DUPLICATE INDEX</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono block mt-1">{activeTicket.suspicious || activeTicket.duplicateImage ? "Duplicate Detected" : "Unique Issue"}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">Confidence: {100 - (activeTicket.authenticityPercentage || 50)}% Duplicate</span>
                    </div>
                  </div>

                  {/* Location tag detail */}
                  <div className="p-3 bg-blue-50/50 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 leading-normal border border-blue-100">
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-blue-900">Geospatial Location</p>
                      <p className="mt-0.5">{activeTicket.latitude && activeTicket.longitude ? `${activeTicket.latitude.toFixed(4)}, ${activeTicket.longitude.toFixed(4)}` : 'Location unavailable'}</p>
                      <p className="mt-0.5 font-medium text-slate-600">{activeTicket.city ? `Near ${activeTicket.city}` : 'City unverified'}</p>
                    </div>
                  </div>
                </div>

                {/* Operations quick dispatch button */}
                <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 justify-end mt-4">
                  <div className="flex items-center gap-2 mr-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <ThumbsUp className="w-4 h-4 text-brand-violet" />
                    <span className="text-xs font-bold text-slate-700">Upvotes: {activeTicket.upvoteCount || 0}</span>
                  </div>

                  {activeTicket.closureRequestedAt ? (
                    <div className="px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 text-xs font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Closure Requested
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequestClosure(activeTicket.id)}
                      disabled={activeTicket.status === 'RESOLVED'}
                      className={`px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                        activeTicket.status !== 'RESOLVED'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" /> 
                      {activeTicket.status === 'RESOLVED' ? 'Resolved' : 'Request Complaint Closure'}
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="md:col-span-2 glass-panel p-16 text-center text-slate-500 text-xs bg-white dark:bg-slate-900">
                Select a ticket to review details.
              </div>
            )}

          </div>
        </div>

        {/* Right 1 Col: Top Right Notification Center */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-outfit text-black dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-violet" />
            <span>Notification Center</span>
          </h3>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 shadow-soft h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10">No recent notifications.</div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        n.type === 'CLOSURE_REQUEST' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        {n.type.replace('_', ' ')}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold font-outfit text-black dark:text-white flex items-center gap-2 mt-6">
            <ThumbsUp className="w-5 h-5 text-emerald-500" />
            <span>Most Supported Community Complaints</span>
          </h3>
          <p className="text-[10px] text-slate-500 -mt-2 mb-2 ml-7">Sorted by Community Upvotes</p>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 shadow-soft h-[350px] overflow-y-auto space-y-3">
            {topComplaints.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10">No complaints found.</div>
            ) : (
              topComplaints.map(t => (
                <div key={t.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedTicketId(t.id)}>
                  <div className="flex-1 overflow-hidden pr-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{t.title}</h4>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase inline-block mt-1 ${getStatusBadgeColors(t.status)}`}>
                      {t.status || 'SUBMITTED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-brand-violet/10 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5 text-brand-violet" />
                    <span className="text-xs font-bold text-brand-violet">{t.upvoteCount || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Row 3: Smart City Map */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold font-outfit text-black dark:text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-indigo-500" />
          <span>Smart City Cluster Map</span>
        </h3>

        <div className="p-4 rounded-3xl glass-panel relative h-[400px] overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between">
          {/* Map lines blueprint design */}
          <div className="absolute inset-0 smart-city-grid opacity-30 pointer-events-none" />
          
          <div className="absolute inset-x-0 top-[30%] h-0.5 bg-slate-800/40 pointer-events-none" />
          <div className="absolute inset-x-0 top-[65%] h-0.5 bg-slate-800/40 pointer-events-none" />
          <div className="absolute left-[40%] inset-y-0 w-0.5 bg-slate-800/40 pointer-events-none" />

          {mapMarkers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
              No geographical data available
            </div>
          )}

          {mapMarkers.map((hot) => (
            <button
              key={hot.id}
              onMouseEnter={() => setHoveredHotspot(hot)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={() => setSelectedTicketId(hot.id)}
              style={{ top: hot.top, left: hot.left }}
              className="absolute w-5 h-5 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 focus:outline-none"
            >
              <span className={`absolute inset-0 rounded-full opacity-60 ${hot.color}`} />
              <span className={`absolute w-3.5 h-3.5 rounded-full ${hot.color} border border-slate-950`} />
            </button>
          ))}

          {/* Dynamic tooltips container */}
          <div className="relative z-20 h-full flex flex-col justify-between pointer-events-none">
            <span className="text-[8px] bg-slate-900 px-2 py-0.5 rounded font-mono font-bold text-white self-start border border-slate-800"> live tracking </span>

            {hoveredHotspot ? (
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl space-y-1 max-w-xs self-end mb-4 mr-4 pointer-events-auto">
                <p className="text-xs font-bold text-white leading-tight">{hoveredHotspot.name}</p>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-[9px] text-emerald-400 uppercase font-bold">{hoveredHotspot.category}</span>
                  <span className="text-[9px] text-slate-400">Upvotes: {hoveredHotspot.upvotes}</span>
                </div>
                <p className="text-[8px] text-blue-400 font-mono font-semibold uppercase leading-none mt-1">Status: {hoveredHotspot.status}</p>
                {hoveredHotspot.imageUrl && (
                  <img src={hoveredHotspot.imageUrl} alt="" className="w-full h-16 object-cover rounded mt-2 border border-slate-800"/>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[9px] text-slate-300 leading-normal max-w-xs self-start mt-auto pointer-events-auto">
                Hover over the pulsing hotspots to inspect localized issue densities based on real complaint data.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
