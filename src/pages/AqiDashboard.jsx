import React, { useState, useEffect } from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { getCurrentAqi, compareAqi, getAqiHistory } from '../services/aqiService';
import { motion } from 'framer-motion';
import { 
  Wind, Map, Activity, AlertCircle, CheckCircle2, ShieldAlert, 
  ArrowRightLeft, ChevronDown, Info, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

function MapUpdater({ sensors }) {
  const map = useMap();
  useEffect(() => {
    if (sensors && sensors.length > 0) {
      const bounds = L.latLngBounds(sensors.map(s => [s.lat, s.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sensors, map]);
  return null;
}

const createCustomIcon = (aqi, color, isCenter) => {
  return L.divIcon({
    className: 'custom-aqi-marker',
    html: `<div style="
      background-color: white; 
      border: 3px solid ${color};
      border-radius: ${isCenter ? '50%' : '12px'};
      padding: 4px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      width: ${isCenter ? '40px' : '36px'};
      height: ${isCenter ? '40px' : '36px'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: ${color};
      font-family: monospace;
      font-size: 14px;
    ">${aqi}</div>`,
    iconSize: isCenter ? [40, 40] : [36, 36],
    iconAnchor: isCenter ? [20, 20] : [18, 18],
  });
};

export default function AqiDashboard() {
  const { showToast } = useCivicData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [userLocation, setUserLocation] = useState(null);
  const [activeSensor, setActiveSensor] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  // Comparison State
  const [compareId1, setCompareId1] = useState(0);
  const [compareId2, setCompareId2] = useState(1);
  const [compareResult, setCompareResult] = useState(null);

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = () => {
    setLoading(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          await fetchAllData(lat, lon);
        },
        async (err) => {
          setLoading(false);
          let errorMsg = "Location access denied. AQI data requires location.";
          switch(err.code) {
            case 1: errorMsg = "Permission Denied: Please enable location access in your browser to view local AQI."; console.error("Geolocation: PERMISSION_DENIED"); break;
            case 2: errorMsg = "Position Unavailable: Could not determine your location."; console.error("Geolocation: POSITION_UNAVAILABLE"); break;
            case 3: errorMsg = "Timeout: Location request timed out."; console.error("Geolocation: TIMEOUT"); break;
          }
          setError(errorMsg);
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by your browser.");
    }
  };

  const fetchAllData = async (lat, lon) => {
    setLoading(true);
    try {
      // 1. Fetch User AQI
      const userRes = await getCurrentAqi(lat, lon);
      const mainAqi = { ...userRes.data, id: 0, name: "Your Location", color: getAqiColor(userRes.data.aqi) };
      
      // 2. Fetch History for User
      const histRes = await getAqiHistory(lat, lon);
      const parsedHistory = histRes.data.map(h => {
        const d = new Date(h.timestamp * 1000);
        return {
          time: d.getHours() + ':00',
          aqi: h.aqi,
          category: h.category,
          color: getAqiColor(h.aqi)
        };
      });

      // 3. Generate 4 nearby sensors by shifting coordinates slightly
      const offsets = [
        { lat: 0.05, lon: 0.05 },
        { lat: -0.05, lon: 0.05 },
        { lat: 0.05, lon: -0.05 },
        { lat: -0.05, lon: -0.05 }
      ];

      const nearbyPromises = offsets.map(off => getCurrentAqi(lat + off.lat, lon + off.lon));
      const nearbyResponses = await Promise.all(nearbyPromises);
      
      const allSensors = [mainAqi];
      nearbyResponses.forEach((res, index) => {
        // Debugging output as requested
        const rawName = res.data.locationName;
        const mappedName = (rawName && rawName !== "Unknown Location") 
            ? `Near ${rawName}` 
            : `Coordinates: ${(lat + offsets[index].lat).toFixed(2)}, ${(lon + offsets[index].lon).toFixed(2)}`;
            
        console.log(`Raw API Station Name: ${rawName}`);
        console.log(`Mapped Station Name: ${mappedName}`);
        console.log(`Displayed Station Name: ${mappedName}`);

        allSensors.push({
          ...res.data,
          id: index + 1,
          name: mappedName,
          color: getAqiColor(res.data.aqi)
        });
      });

      setSensors(allSensors);
      setActiveSensor(mainAqi);
      setHistoryData(parsedHistory);
      setUserLocation({ lat, lon });

    } catch (err) {
      console.error(err);
      setError("Failed to fetch AQI data.");
    } finally {
      setLoading(false);
    }
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "#10B981"; // Good
    if (aqi <= 100) return "#FBBF24"; // Moderate
    if (aqi <= 150) return "#F97316"; // Poor
    if (aqi <= 200) return "#EF4444"; // Unhealthy
    if (aqi <= 300) return "#8B5CF6"; // Severe
    return "#4C1D95"; // Hazardous
  };

  const getAqiDescription = (category) => {
    switch (category) {
      case 'Good':
        return { label: "Satisfactory air quality.", caution: "Ideal for outdoor activities.", icon: CheckCircle2, textColor: "text-emerald-600" };
      case 'Moderate':
        return { label: "Acceptable quality.", caution: "Sensitive individuals should consider limiting long exertion.", icon: Info, textColor: "text-yellow-600" };
      case 'Poor':
        return { label: "Pollutants may cause breathing discomfort.", caution: "Wear masks if walking near traffic.", icon: AlertCircle, textColor: "text-orange-600" };
      default:
        return { label: "Severe threat to health.", caution: "Avoid outdoor physical exertion.", icon: ShieldAlert, textColor: "text-red-600" };
    }
  };

  const handleMapSensorClick = (id) => {
    const s = sensors.find(s => s.id === id);
    if (s) {
      setActiveSensor(s);
      showToast(`Focused on ${s.name}`, "info");
    }
  };

  const handleCompare = async () => {
    const s1 = sensors.find(s => s.id === parseInt(compareId1));
    const s2 = sensors.find(s => s.id === parseInt(compareId2));
    if (!s1 || !s2) return;

    try {
      const res = await compareAqi(s1.lat, s1.lon, s2.lat, s2.lon);
      setCompareResult(res.data);
    } catch (err) {
      console.error(err);
      showToast("Comparison failed", "error");
    }
  };

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/95 dark:bg-slate-900/95 border border-purple-100 rounded-2xl shadow-premium text-xs text-slate-800 dark:text-slate-100">
          <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
          {payload.map((val, idx) => (
            <p key={idx} className="font-semibold mt-0.5" style={{ color: val.color || val.fill }}>
              AQI: <span className="font-bold font-mono">{val.value}</span>
            </p>
          ))}
          {payload[0].payload.category && (
            <p className="text-[10px] mt-1 text-slate-500 font-mono font-bold uppercase">{payload[0].payload.category}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Initializing Live Atmospheric Sensors...</div>;
  if (error) return (
    <div className="p-10 text-center space-y-4">
      <div className="text-red-500 font-bold max-w-md mx-auto">{error}</div>
      <button 
        onClick={initDashboard}
        className="px-4 py-2 bg-brand-violet text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Location
      </button>
    </div>
  );
  if (!activeSensor) return null;

  const aqiInfo = getAqiDescription(activeSensor.category);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain flex items-center gap-2">
          <Wind className="w-7 h-7 text-brand-violet" />
          <span>Live AQI & Environmental Sensors</span>
        </h2>
        <p className="text-xs text-themeLight-textSub mt-1">
          Real-time hyper-local air quality index based on your coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leaflet Interactive Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest flex items-center gap-1.5">
              <Map className="w-4 h-4 text-brand-violet" />
              <span>Ward AQI Leaflet Map</span>
            </h3>
          </div>

          <div className="rounded-3xl overflow-hidden glass-panel relative h-[360px] border border-purple-100/50">
            <MapContainer 
              center={[userLocation.lat, userLocation.lon]} 
              zoom={13} 
              style={{ height: '100%', width: '100%', zIndex: 10 }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
              <MapUpdater sensors={sensors} />
              
              {sensors.map((s) => {
                const isCenter = s.id === 0;
                return (
                  <Marker 
                    key={s.id} 
                    position={[s.lat, s.lon]} 
                    icon={createCustomIcon(s.aqi, s.color, isCenter)}
                    eventHandlers={{
                      click: () => handleMapSensorClick(s.id),
                    }}
                  >
                    <Popup>
                      <div className="text-center p-1">
                        <strong className="block text-[11px] uppercase tracking-wider mb-1" style={{ color: s.color }}>
                          {s.name}
                        </strong>
                        <span className="text-xl font-black">{s.aqi}</span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Gauge Indicator */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">Atmospheric Gauge</h3>
          <div className="p-6 rounded-3xl glass-panel text-center space-y-6 relative overflow-hidden">
            <div>
              <span className="text-[9px] bg-slate-900/5 text-slate-500 font-mono font-bold px-2.5 py-0.5 rounded border border-slate-900/5">
                {activeSensor.name}
              </span>
              <p className="text-[9px] mt-1 text-slate-400 font-mono">Location: {activeSensor.lat.toFixed(4)}, {activeSensor.lon.toFixed(4)}</p>
            </div>

            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-4 border-slate-100" 
                style={{ borderRightColor: activeSensor.color, borderTopColor: activeSensor.color, transform: 'rotate(-45deg)' }} 
              />
              <div className="text-center z-10 space-y-0.5">
                <span className="text-4xl font-extrabold font-outfit text-themeLight-textMain font-mono leading-none">
                  {activeSensor.aqi}
                </span>
                <span className={`block text-[10px] font-extrabold font-mono uppercase tracking-wider ${aqiInfo.textColor}`}>
                  {activeSensor.category}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60 text-xs text-themeLight-textSub space-y-2">
              <div className="flex gap-2 items-start leading-normal text-left">
                <aqiInfo.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${aqiInfo.textColor}`} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">Particulate Advisory</p>
                  <p className="text-[11px] mt-0.5">{aqiInfo.label}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-purple-100/50 flex gap-2 items-start leading-normal text-left">
                <span className="text-xs">⚠️</span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">Caution guideline</p>
                  <p className="text-[11px] mt-0.5">{aqiInfo.caution}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutants Breakdown & 24h Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-purple" />
            <span>Pollutant Particulate Breakdown (Live API)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(activeSensor.components || {}).filter(([k,v]) => ['pm2_5', 'pm10', 'co', 'no2'].includes(k)).map(([key, val]) => {
              const maxLims = { pm2_5: 50, pm10: 100, co: 5, no2: 80 };
              const max = maxLims[key] || 100;
              const pct = Math.min(100, (val / max) * 100);
              return (
                <div key={key} className="p-4 rounded-2xl glass-panel space-y-3">
                  <span className="text-[9px] text-slate-500 font-bold font-mono uppercase tracking-wider block leading-none">{key}</span>
                  <div>
                    <span className="text-xl font-extrabold font-mono text-themeLight-textMain leading-none">{val.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-550 font-medium ml-1">μg/m³</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: getAqiColor(activeSensor.aqi) }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 24h Trend Area Chart */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">24-Hour Trend Line</h3>
          <div className="p-5 rounded-3xl glass-panel space-y-2">
            <div className="h-32 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqiHist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeSensor.color} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={activeSensor.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.03)" />
                  <XAxis dataKey="time" stroke="#9ca3af" strokeWidth={0.5} tickLine={false} />
                  <YAxis stroke="#9ca3af" strokeWidth={0.5} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area name="AQI" type="monotone" dataKey="aqi" stroke={activeSensor.color} strokeWidth={2} fillOpacity={1} fill="url(#colorAqiHist)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Inter-Ward Comparison */}
      <div className="p-6 rounded-3xl glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-purple-100/60 mb-2">
          <div>
            <h4 className="text-sm font-bold font-outfit text-themeLight-textMain">Inter-Ward Competitive Analysis</h4>
            <p className="text-[11px] text-themeLight-textSub mt-0.5">Compare active air quality ratings side-by-side.</p>
          </div>
          
          <div className="flex items-center gap-2 self-start">
            <select
              value={compareId1}
              onChange={(e) => setCompareId1(e.target.value)}
              className="bg-slate-900/5 text-slate-800 dark:text-slate-100 text-[10px] font-bold py-1.5 px-3 rounded-lg"
            >
              {sensors.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">VS</span>
            <select
              value={compareId2}
              onChange={(e) => setCompareId2(e.target.value)}
              className="bg-slate-900/5 text-slate-800 dark:text-slate-100 text-[10px] font-bold py-1.5 px-3 rounded-lg"
            >
              {sensors.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <button
              onClick={handleCompare}
              className="px-3 py-1.5 text-[10px] font-bold bg-brand-violet text-white rounded-lg hover:opacity-90"
            >
              Compare
            </button>
          </div>
        </div>

        {compareResult && (
          <div className="p-5 bg-white dark:bg-slate-900 border border-purple-100 rounded-2xl shadow-soft">
            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-3">Travel Safety Recommendation</h5>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2 text-xs">
                <p><strong>From:</strong> AQI {compareResult.from.aqi} ({compareResult.from.category})</p>
                <p><strong>To:</strong> AQI {compareResult.to.aqi} ({compareResult.to.category})</p>
                <p className="pt-2 border-t border-purple-50"><strong>AQI Difference:</strong> {compareResult.difference}</p>
              </div>
              <div className="flex-1 p-4 bg-purple-50 rounded-xl text-brand-purple font-medium text-xs flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p>{compareResult.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
