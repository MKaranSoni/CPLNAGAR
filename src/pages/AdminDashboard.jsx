import React, { useState } from 'react';
import { useCivicData } from '../hooks/useCivicData';
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
  Grid
} from 'lucide-react';

export default function AdminDashboard() {
  const { complaints, adminStats, updateComplaintStatus, showToast } = useCivicData();
  const [selectedTicketId, setSelectedTicketId] = useState(complaints[0]?.id || '');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  const activeTicket = complaints.find(t => t.id === selectedTicketId) || complaints[0];

  const handleUpdateStatus = (id, status, text) => {
    updateComplaintStatus(id, status, text);
  };

  // Mock map hotspots representing localized civic issue densities
  const mapHotspots = [
    { id: "h1", name: "Sector 4 Market Cluster", count: 8, priority: "High", top: "25%", left: "30%", color: "bg-red-500" },
    { id: "h2", name: "Dwarka Sector 6 Intersection", count: 3, priority: "Medium", top: "55%", left: "65%", color: "bg-orange-500" },
    { id: "h3", name: "Outer Ring Road Exit Flyover", count: 12, priority: "Critical", top: "40%", left: "45%", color: "bg-red-500 animate-ping" },
    { id: "h4", name: "Sector 12 Public Park Side", count: 1, priority: "Low", top: "70%", left: "20%", color: "bg-yellow-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-blue">Municipal Command Center</h2>
        <p className="text-xs text-black mt-1">Direct corporate operations, audit AI Computer Vision diagnostics, and cross-reference geographic hotspot clusters.</p>
      </div>

      {/* Row 1: Municipal Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[9px] text-black font-bold uppercase tracking-widest font-mono block">TOTAL FILED REPORTS</span>
          <h3 className="text-2xl font-extrabold font-outfit blue mt-2">{adminStats.totalComplaints}</h3>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">📈 +12% Weekly increase</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[9px] text-black font-bold uppercase tracking-widest font-mono block">RESOLVED TICKETS</span>
          <h3 className="text-2xl font-extrabold font-outfit text-emerald-400 mt-2">{adminStats.resolvedComplaints}</h3>
          <span className="text-[10px] text-black font-medium mt-1 block">Avg speed: {adminStats.avgResolutionTime}</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel">
          <span className="text-[9px] text-black font-bold uppercase tracking-widest font-mono block">ACTIVE IN PROCESS</span>
          <h3 className="text-2xl font-extrabold font-outfit text-blue-400 mt-2">{adminStats.activeComplaints}</h3>
          <span className="text-[10px] text-blue-400 font-bold mt-1 block">In Dispatch: 42 teams</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel-glow border-emerald-500/20 bg-slate-950/20">
          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-widest font-mono block">AI DUPLICATES FILTERED</span>
          <h3 className="text-2xl font-extrabold font-outfit text-lightblue mt-2">{adminStats.spamFilteredComplaints}</h3>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">🛡️ 100% spam-defense rating</span>
        </div>

      </div>

      {/* Row 2: Split Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: AI Triage Desk */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-outfit text-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>AI-Screened Tickets Triage</span>
            </h3>
            <span className="text-[10px] bg-slate-950 text-white font-mono px-2 py-0.5 rounded border border-slate-900">AUTO-TRIAGE ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* List box */}
            <div className="md:col-span-1 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {complaints.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                    selectedTicketId === t.id
                      ? 'glass-panel-glow border-emerald-500/35 bg-slate-900/50'
                      : 'glass-panel hover:bg-slate-900/40 border-slate-900'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono font-bold text-slate-500">{t.id}</span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      t.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                    }`}>{t.priority}</span>
                  </div>
                  <h4 className="text-xs font-bold text-black line-clamp-1 leading-snug">{t.title}</h4>
                </button>
              ))}
            </div>

            {/* AI analysis metrics + quick action tools */}
            {activeTicket ? (
              <div className="md:col-span-2 p-5 rounded-2xl glass-panel space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-slate-900 pb-3.5 mb-4">
                    <div>
                      <span className="text-[9px] bg-slate-900 text-white font-mono px-2.5 py-0.5 rounded border border-slate-800">{activeTicket.id}</span>
                      <h4 className="text-sm font-bold text-black mt-2">{activeTicket.title}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Category prediction confidence */}
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
                      <span className="text-[8px] text-white font-bold uppercase tracking-wider block">AI CATEGORY CONFIDENCE</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono block mt-1">{activeTicket.aiMetrics.categoryConfidence}</span>
                      <span className="text-[9px] text-white block mt-0.5">{activeTicket.category}</span>
                    </div>

                    {/* Duplicate checker metric */}
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
                      <span className="text-[8px]  text-white font-bold uppercase tracking-wider block">DUPLICATE INDEX</span>
                      <span className="text-sm font-bold text-white font-mono block mt-1">{activeTicket.aiMetrics.isLegit}</span>
                      <span className="text-[9px]  text-white  block mt-0.5 truncate">{activeTicket.aiMetrics.duplicateCheck}</span>
                    </div>

                  </div>

                  {/* Location tag detail */}
                  <div className="mt-4 p-3 bg-slate-900/40 rounded-xl flex items-start gap-2.5 text-xs  text-black leading-normal border border-slate-900">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold  text-black">EXIF Geolocation Coordinates</p>
                      <p className="mt-0.5">{activeTicket.locationName}</p>
                    </div>
                  </div>
                </div>

                {/* Operations quick dispatch button */}
                <div className="border-t border-slate-900/60 pt-4 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleUpdateStatus(activeTicket.id, 'In Progress', "Municipal crew dispatched with vacuum sweeps.")}
                    disabled={activeTicket.status === 'In Progress' || activeTicket.status === 'Resolved'}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900  text-black hover:text-white text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    🚀 Dispatch Crew
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeTicket.id, 'Resolved', "Manually approved and resolved by admin Sandeep Goel.")}
                    disabled={activeTicket.status === 'Resolved'}
                    className={`px-4 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                      activeTicket.status !== 'Resolved'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shimmer-btn cursor-pointer'
                        : 'bg-slate-900 text-slate-600 border border-slate-950 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" /> 
                    {activeTicket.status === 'Resolved' ? 'Ticket Resolved' : 'Mark Resolved'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="md:col-span-2 glass-panel p-16 text-center text-white text-xs">
                Select a ticket to review AI Computer Vision outputs.
              </div>
            )}

          </div>
        </div>

        {/* Right 1 Col: Live Heatmap Cluster Simulation */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-outfit text-black flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-400" />
            <span>Smart City Cluster Map</span>
          </h3>

          <div className="p-4 rounded-3xl glass-panel relative aspect-square overflow-hidden bg-slate-950/60 border border-slate-900 flex flex-col justify-between">
            {/* Map lines blueprint design */}
            <div className="absolute inset-0 smart-city-grid opacity-30 pointer-events-none" />
            
            {/* Abstract highway grid vectors emulations */}
            <div className="absolute inset-x-0 top-[30%] h-0.5 bg-slate-800/40 pointer-events-none" />
            <div className="absolute inset-x-0 top-[65%] h-0.5 bg-slate-800/40 pointer-events-none" />
            <div className="absolute left-[40%] inset-y-0 w-0.5 bg-slate-800/40 pointer-events-none" />

            {/* Pulsing Hotspots nodes */}
            {mapHotspots.map((hot) => (
              <button
                key={hot.id}
                onMouseEnter={() => setHoveredHotspot(hot)}
                onMouseLeave={() => setHoveredHotspot(null)}
                style={{ top: hot.top, left: hot.left }}
                className="absolute w-5 h-5 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 focus:outline-none"
              >
                <span className={`absolute inset-0 rounded-full opacity-60 animate-ping ${hot.color}`} />
                <span className={`absolute w-3.5 h-3.5 rounded-full ${hot.color} border border-slate-950`} />
              </button>
            ))}

            {/* Dynamic tooltips container */}
            <div className="relative z-20 h-full flex flex-col justify-between pointer-events-none">
              <span className="text-[8px] bg-slate-900 px-2 py-0.5 rounded font-mono font-bold text-white self-start border border-slate-800"> blue map coordinates </span>

              {hoveredHotspot ? (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl space-y-1">
                  <p className="text-[10px] font-bold text-white leading-none">{hoveredHotspot.name}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Report Count: <span className="text-white font-bold">{hoveredHotspot.count} active</span></p>
                  <p className="text-[8px] text-red-400 font-mono font-semibold uppercase leading-none mt-1">Priority: {hoveredHotspot.priority}</p>
                </div>
              ) : (
                <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl text-[9px] text-black leading-normal">
                  Hover over the pulsing hotspots to inspect localized issue densities.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
