import React, { useState } from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { motion } from 'framer-motion';
import { 
  Wind, 
  Map, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRightLeft,
  ChevronDown,
  Info
  //changing it for me
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function AqiDashboard() {
  const { wardsAqi, showToast } = useCivicData();
  const [selectedWardId, setSelectedWardId] = useState('aqi-12');
  const [compareWardId1, setCompareWardId1] = useState('aqi-12');
  const [compareWardId2, setCompareWardId2] = useState('aqi-4');
  const wardCoordinates = {
  "aqi-12": { lat: 23.25, lon: 77.41 },
  "aqi-4": { lat: 23.30, lon: 77.45 },
  "aqi-9": { lat: 23.22, lon: 77.38 },
  "aqi-15": { lat: 23.28, lon: 77.50 },
  "aqi-7": { lat: 23.35, lon: 77.42 }
};

  const activeWard = wardsAqi.find(w => w.id === selectedWardId) || wardsAqi[0];
  const compWard1 = wardsAqi.find(w => w.id === compareWardId1) || wardsAqi[0];
  const compWard2 = wardsAqi.find(w => w.id === compareWardId2) || wardsAqi[1];

  const getAqiDescription = (status) => {
    switch (status) {
      case 'Good':
        return {
          label: "Satisfactory air quality. Little or no health risk.",
          caution: "Ideal for outdoor activities, walking, and jogging.",
          icon: CheckCircle2,
          textColor: "text-emerald-600",
          strokeColor: "#10B981"
        };
      case 'Moderate':
        return {
          label: "Acceptable quality; minor risk for sensitive groups.",
          caution: "Sensitive individuals should consider limiting long exertion.",
          icon: Info,
          textColor: "text-yellow-600",
          strokeColor: "#FBBF24"
        };
      case 'Poor':
        return {
          label: "Pollutants may cause breathing discomfort on exposure.",
          caution: "Wear masks if walking near heavy traffic corridors.",
          icon: AlertCircle,
          textColor: "text-orange-600",
          strokeColor: "#F97316"
        };
      default:
        return {
          label: "Severe threat. Respiratory risk for all populations.",
          caution: "Avoid outdoor physical exertion. Keep windows closed.",
          icon: ShieldAlert,
          textColor: "text-red-600",
          strokeColor: "#d42b2b"
        };
    }
  };

  const aqiInfo = getAqiDescription(activeWard.status);

  // Custom tooltips styling for charts
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/95 border border-purple-100 rounded-2xl shadow-premium text-xs text-themeLight-textMain">
          <p className="font-bold text-slate-800">{label}</p>
          {payload.map((val, idx) => (
            <p key={idx} className="font-semibold mt-0.5" style={{ color: val.color || val.fill }}>
              {val.name}: <span className="font-bold font-mono">{val.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleMapWardClick = (id, name) => {
    setSelectedWardId(id);
    showToast(`Focused on ${name} metrics!`, "info");
  };
const compareFromBackend = async () => {
  try {
    const w1 = wardCoordinates[compareWardId1];
    const w2 = wardCoordinates[compareWardId2];

    const res = await fetch(
      `http://localhost:8080/api/aqi/compare?lat1=${w1.lat}&lon1=${w1.lon}&lat2=${w2.lat}&lon2=${w2.lon}`
    );

    const data = await res.json();

    showToast(
      `Difference: ${data.difference} AQI | ${data.recommendation}`,
      "info"
    );

    return data;
  } catch (err) {
    console.error(err);
    showToast("Backend AQI comparison failed", "error");
  }
};
  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain flex items-center gap-2">
          <Wind className="w-7 h-7 text-brand-violet" />
          <span>Atmospheric AQI Monitor</span>
        </h2>
        <p className="text-xs text-themeLight-textSub mt-1">
          Track real-time ward pollution levels, evaluate hourly particulate concentration patterns, and inspect inter-ward comparative heat maps.
        </p>
      </div>

      {/* Row 1: Interactive Heatmap Map (Left) + AQI Gauge Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stylized interactive blueprint Map Heatmap */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest flex items-center gap-1.5">
              <Map className="w-4 h-4 text-brand-violet" />
              <span>Ward AQI Heatmap Blueprint</span>
            </h3>
            <span className="text-[10px] bg-brand-violet/10 text-brand-violet font-mono font-bold px-2 py-0.5 rounded border border-brand-violet/10 uppercase">
              Click Wards To Focus
            </span>
          </div>

          <div className="p-6 rounded-3xl glass-panel relative min-h-[360px] flex flex-col justify-between smart-city-grid">
            
            {/* Visual emulations of abstract road lanes and park zones */}
            <div className="absolute inset-0 smart-city-grid opacity-20 pointer-events-none" />
            <div className="absolute left-[30%] inset-y-0 w-0.5 bg-brand-violet/5 pointer-events-none" />
            <div className="absolute top-[45%] inset-x-0 h-0.5 bg-brand-violet/5 pointer-events-none" />

            {/* Clickable Ward Heatmap boundaries representing Delhi sectors */}
            <div className="relative z-10 w-full h-64 flex items-center justify-center">
              
              {/* Ward 12 (Top Left) */}
              <button
                onClick={() => handleMapWardClick('aqi-12', 'Ward 12 - Vasant Kunj')}
                className={`absolute top-[15%] left-[10%] p-4 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                  selectedWardId === 'aqi-12' 
                    ? 'border-brand-violet bg-white shadow-premium scale-105' 
                    : 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                }`}
              >
                <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase leading-none">WARD 12</span>
                <span className="text-lg font-extrabold font-mono text-emerald-600">42</span>
              </button>

              {/* Ward 4 (Top Right) */}
              <button
                onClick={() => handleMapWardClick('aqi-4', 'Ward 4 - Dwarka')}
                className={`absolute top-[18%] right-[15%] p-4 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                  selectedWardId === 'aqi-4' 
                    ? 'border-brand-violet bg-white shadow-premium scale-105' 
                    : 'border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10'
                }`}
              >
                <span className="text-[9px] font-mono text-yellow-600 font-bold uppercase leading-none">WARD 4</span>
                <span className="text-lg font-extrabold font-mono text-yellow-600">85</span>
              </button>

              {/* Ward 9 (Center) */}
              <button
                onClick={() => handleMapWardClick('aqi-9', 'Ward 9 - Saket')}
                className={`absolute top-[48%] left-[45%] p-4 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                  selectedWardId === 'aqi-9' 
                    ? 'border-brand-violet bg-white shadow-premium scale-105' 
                    : 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10'
                }`}
              >
                <span className="text-[9px] font-mono text-orange-600 font-bold uppercase leading-none">WARD 9</span>
                <span className="text-lg font-extrabold font-mono text-orange-600">120</span>
              </button>

              {/* Ward 15 (Bottom Left) */}
              <button
                onClick={() => handleMapWardClick('aqi-15', 'Ward 15 - Rohini')}
                className={`absolute bottom-[10%] left-[18%] p-4 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                  selectedWardId === 'aqi-15' 
                    ? 'border-brand-violet bg-white shadow-premium scale-105' 
                    : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
                }`}
              >
                <span className="text-[9px] font-mono text-red-600 font-bold uppercase leading-none">WARD 15</span>
                <span className="text-lg font-extrabold font-mono text-red-600">185</span>
              </button>

              {/* Ward 7 (Bottom Right) */}
              <button
                onClick={() => handleMapWardClick('aqi-7', 'Ward 7 - Civil Lines')}
                className={`absolute bottom-[12%] right-[18%] p-4 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                  selectedWardId === 'aqi-7' 
                    ? 'border-brand-violet bg-white shadow-premium scale-105' 
                    : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
                }`}
              >
                <span className="text-[9px] font-mono text-red-600 font-bold uppercase leading-none">WARD 7</span>
                <span className="text-lg font-extrabold font-mono text-red-600">220</span>
              </button>

            </div>

            <div className="text-[10px] text-themeLight-textSub font-mono font-medium flex items-center justify-between border-t border-purple-100/60 pt-3 mt-4">
              <span>ACTIVE CODES: WARD-BOUNDARIES DETECTED</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Good</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Poor</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Severe</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Real-Time AQI Gauge Indicator */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">Atmospheric Gauge</h3>
          
          <div className="p-6 rounded-3xl glass-panel text-center space-y-6 relative overflow-hidden">
            
            {/* Glowing circle rings backdrop */}
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-brand-violet/5 blur-2xl" />

            <div>
              <span className="text-[9px] bg-slate-900/5 text-slate-500 font-mono font-bold px-2.5 py-0.5 rounded border border-slate-900/5">
                {activeWard.name}
              </span>
              <h4 className="text-xs text-themeLight-textSub font-semibold mt-2">Active atmospheric status</h4>
            </div>

            {/* Circular Gauge Ring Visuals */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              
              {/* Outer gauge border */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-slate-100" 
                style={{ 
                  borderRightColor: activeWard.color, 
                  borderTopColor: activeWard.color,
                  transform: 'rotate(-45deg)' 
                }} 
              />

              <div className="text-center z-10 space-y-0.5">
                <span className="text-4xl font-extrabold font-outfit text-themeLight-textMain font-mono leading-none">
                  {activeWard.aqi}
                </span>
                <span className={`block text-[10px] font-extrabold font-mono uppercase tracking-wider ${aqiInfo.textColor}`}>
                  {activeWard.status}
                </span>
              </div>
            </div>

            {/* Caution advisories details */}
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60 text-xs text-themeLight-textSub space-y-2">
              <div className="flex gap-2 items-start leading-normal text-left">
                <aqiInfo.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${aqiInfo.textColor}`} />
                <div>
                  <p className="font-bold text-slate-800">Particulate Advisory</p>
                  <p className="text-[11px] mt-0.5">{aqiInfo.label}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-100/50 flex gap-2 items-start leading-normal text-left">
                <span className="text-xs">⚠️</span>
                <div>
                  <p className="font-bold text-slate-800">Caution guideline</p>
                  <p className="text-[11px] mt-0.5">{aqiInfo.caution}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Row 2: Pollutant breakdown cards (Left 2 Cols) + 24h Trend Chart (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Pollutant concentrations subcards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-purple" />
            <span>Pollutant Particulate Weight Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* PM 2.5 */}
            <div className="p-4 rounded-2xl glass-panel space-y-3">
              <span className="text-[9px] text-slate-500 font-bold font-mono block leading-none">PM2.5 DUST</span>
              <div>
                <span className="text-xl font-extrabold font-mono text-themeLight-textMain leading-none">{activeWard.breakdown.pm25}</span>
                <span className="text-[9px] text-slate-550 font-medium ml-1">μg/m³</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1">
                <div className="bg-brand-violet h-full rounded-full" style={{ width: `${Math.min(100, (activeWard.breakdown.pm25 / 100) * 100)}%` }} />
              </div>
            </div>

            {/* PM 10 */}
            <div className="p-4 rounded-2xl glass-panel space-y-3">
              <span className="text-[9px] text-slate-500 font-bold font-mono block leading-none">PM10 SOOT</span>
              <div>
                <span className="text-xl font-extrabold font-mono text-themeLight-textMain leading-none">{activeWard.breakdown.pm10}</span>
                <span className="text-[9px] text-slate-550 font-medium ml-1">μg/m³</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1">
                <div className="bg-brand-purple h-full rounded-full" style={{ width: `${Math.min(100, (activeWard.breakdown.pm10 / 150) * 100)}%` }} />
              </div>
            </div>

            {/* Carbon Monoxide */}
            <div className="p-4 rounded-2xl glass-panel space-y-3">
              <span className="text-[9px] text-slate-500 font-bold font-mono block leading-none">CO GASEOUS</span>
              <div>
                <span className="text-xl font-extrabold font-mono text-themeLight-textMain leading-none">{activeWard.breakdown.co}</span>
                <span className="text-[9px] text-slate-550 font-medium ml-1">mg/m³</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1">
                <div className="bg-brand-violet h-full rounded-full" style={{ width: `${Math.min(100, (activeWard.breakdown.co / 5) * 100)}%` }} />
              </div>
            </div>

            {/* Nitrogen Dioxide */}
            <div className="p-4 rounded-2xl glass-panel space-y-3">
              <span className="text-[9px] text-slate-500 font-bold font-mono block leading-none">NO2 FUMES</span>
              <div>
                <span className="text-xl font-extrabold font-mono text-themeLight-textMain leading-none">{activeWard.breakdown.no2}</span>
                <span className="text-[9px] text-slate-550 font-medium ml-1">μg/m³</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (activeWard.breakdown.no2 / 80) * 100)}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Right: Hourly 24h Area Trend Chart */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">24-Hour Trend Line</h3>
          
          <div className="p-5 rounded-3xl glass-panel space-y-2">
            <div className="flex justify-between items-center text-[10px] text-themeLight-textSub border-b border-purple-100/60 pb-2 mb-2 font-mono font-medium">
              <span>HOURLY DATA CURVE</span>
              <span className="text-brand-violet">AQI VARIATION</span>
            </div>

            <div className="h-32 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeWard.trend} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeWard.color} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={activeWard.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.03)" />
                  <XAxis dataKey="time" stroke="#9ca3af" strokeWidth={0.5} tickLine={false} />
                  <YAxis stroke="#9ca3af" strokeWidth={0.5} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area name="AQI" type="monotone" dataKey="aqi" stroke={activeWard.color} strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Inter-Ward Comparison Chart (Full Width) */}
      <div className="p-6 rounded-3xl glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-purple-100/60 mb-2">
          <div>
            <h4 className="text-sm font-bold font-outfit text-themeLight-textMain">Inter-Ward Comparative Analysis</h4>
            <p className="text-[11px] text-themeLight-textSub mt-0.5">Compare active air quality ratings side-by-side across all municipal boundaries.</p>
          </div>
          <button
  onClick={compareFromBackend}
  className="px-3 py-1 text-[10px] font-bold bg-brand-violet text-white rounded-lg hover:opacity-90"
>
  🔄 Fetch Live AQI Comparison
</button>
          
          {/* Dropdown selectors for custom double comparison */}
          <div className="flex items-center gap-2 self-start">
            <div className="relative">
              <select
                value={compareWardId1}
                onChange={(e) => setCompareWardId1(e.target.value)}
                className="bg-slate-900/5 border border-purple-100 text-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-lg focus:outline-none appearance-none pr-8 cursor-pointer"
              >
                {wardsAqi.map(w => <option key={w.id} value={w.id}>{w.name.split(' - ')[1]}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-600 pointer-events-none" />
            </div>

            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">VS</span>

            <div className="relative">
              <select
                value={compareWardId2}
                onChange={(e) => setCompareWardId2(e.target.value)}
                className="bg-slate-900/5 border border-purple-100 text-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-lg focus:outline-none appearance-none pr-8 cursor-pointer"
              >
                {wardsAqi.map(w => <option key={w.id} value={w.id}>{w.name.split(' - ')[1]}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-600 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Split Grid: Ward comparing summary + Recharts Comparative Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/10 space-y-2">
              <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Double Triage Summary</h5>
              <p className="text-[11px] text-themeLight-textSub leading-normal">
                Comparing <span className="text-brand-violet font-semibold">{compWard1.name.split(' - ')[1]}</span> (AQI {compWard1.aqi}, {compWard1.status}) with <span className="text-indigo-600 font-semibold">{compWard2.name.split(' - ')[1]}</span> (AQI {compWard2.aqi}, {compWard2.status}).
              </p>
              <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">AQI Variance Gap:</span>
                <span className="font-bold text-brand-violet font-mono">{Math.abs(compWard1.aqi - compWard2.aqi)} points</span>
              </div>
            </div>
          </div>

          {/* Comparative Bar Chart */}
          <div className="md:col-span-2 h-48 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardsAqi} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.03)" />
                <XAxis dataKey="name" stroke="#9ca3af" strokeWidth={0.5} tickFormatter={(val) => val.split(' - ')[1]} tickLine={false} />
                <YAxis stroke="#9ca3af" strokeWidth={0.5} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar name="AQI Rating" dataKey="aqi" radius={[4, 4, 0, 0]}>
                  {wardsAqi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

    </div>
  );
}
