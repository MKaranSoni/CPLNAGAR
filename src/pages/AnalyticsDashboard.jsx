import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { mockAdminStats } from '../data/mockData';
import { BarChart3, TrendingUp, HelpCircle, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
  
  // Custom tooltips styling for dark mode charts
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl space-y-1 text-xs">
          <p className="font-bold text-slate-350">{label}</p>
          {payload.map((val, idx) => (
            <p key={idx} className="font-medium" style={{ color: val.color || val.fill }}>
              {val.name}: <span className="font-bold font-mono">{val.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-black dark:text-white">Smart Analytics Dashboard</h2>
        <p className="text-xs text-black dark:text-white mt-1">Audit predictive resolution curves, categorize ward-level concerns, and evaluate municipal speed trends.</p>
      </div>

      {/* Row 1: Shared global stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <TrendingUp className="w-5 h-5 text-emerald-400 absolute top-6 right-6" />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block">COMPLIANCE RATING</span>
          <h3 className="text-3xl font-extrabold font-outfit text-black dark:text-white mt-3">{mockAdminStats.resolutionRate}</h3>
          <p className="text-xs text-black dark:text-white mt-1.5 leading-relaxed">Average citizen endorsement index stands at <span className="text-white font-semibold">94.2% positive feedback</span>.</p>
        </div>

        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <Activity className="w-5 h-5 text-blue-400 absolute top-6 right-6" />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block">AVERAGE RESOLUTION TIME</span>
          <h3 className="text-3xl font-extrabold font-outfit text-black dark:text-white mt-3">{mockAdminStats.avgResolutionTime}</h3>
          <p className="text-xs text-black dark:text-white mt-1.5 leading-relaxed">AI screening auto-triage reduced municipal ticket response delays by <span className="text-emerald-400 font-bold">14 hours</span>.</p>
        </div>

        <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
          <BarChart3 className="w-5 h-5 text-purple-400 absolute top-6 right-6" />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block">ACTIVE DISPATCH SPEND</span>
          <h3 className="text-3xl font-extrabold font-outfit text-black dark:text-white mt-3">₹4.8L / Mo</h3>
          <p className="text-xs text-black dark:text-white mt-1.5 leading-relaxed">Direct ward allocations focusing on sorting equipment, sapling seeds, and safety guards.</p>
        </div>

      </div>

      {/* Row 2: Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly trends Line/Area chart */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900/60 mb-2">
            <h4 className="text-sm font-bold font-outfit text-black dark:text-white">Weekly Ticket Velocity</h4>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20">LIVE REPORTS</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAdminStats.weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#6B7280" strokeWidth={0.5} tickLine={false} />
                <YAxis stroke="#6B7280" strokeWidth={0.5} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend iconType="circle" />
                <Area name="Reported Concerns" type="monotone" dataKey="reported" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" />
                <Area name="Resolved Tasks" type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900/60 mb-2">
            <h4 className="text-sm font-bold font-outfit text-black dark:text-white">Citizen Concern Share</h4>
            <span className="text-[9px] bg-blue-500/10 text-blue-400 font-mono font-bold px-2 py-0.5 rounded border border-blue-500/20">AI CLASSIFIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* Chart */}
            <div className="h-56 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockAdminStats.categoryShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {mockAdminStats.categoryShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends list with color metrics */}
            <div className="space-y-2 text-xs">
              {mockAdminStats.categoryShare.map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b border-slate-900/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-350 text-[11px] font-medium">{entry.name}</span>
                  </div>
                  <span className="font-bold text-black dark:text-white font-mono">{entry.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Row 3: Ward performance bar charts */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-900/60 mb-2">
          <h4 className="text-sm font-bold font-outfit text-black dark:text-white">Ward Performance Comparison</h4>
          <span className="text-[9px] bg-purple-500/10 text-purple-400 font-mono font-bold px-2 py-0.5 rounded border border-purple-500/20">SECTOR INDEX</span>
        </div>

        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAdminStats.wardPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="ward" stroke="#6B7280" strokeWidth={0.5} tickLine={false} />
              <YAxis stroke="#6B7280" strokeWidth={0.5} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend iconType="circle" />
              <Bar name="Avg Resolution Speed (Hours)" dataKey="speed" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar name="Total Reports Filed" dataKey="reports" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
