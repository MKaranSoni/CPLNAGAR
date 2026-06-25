import React, { useState } from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { Settings as SettingsIcon, Bell, Shield, MapPin, Eye, Check, Globe } from 'lucide-react';

export default function Settings() {
  const { showToast } = useCivicData();
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [digest, setDigest] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [ward, setWard] = useState('Ward 12 - Vasant Kunj');

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Civic preferences saved successfully!", "success");
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-black">System Settings</h2>
        <p className="text-xs text-black mt-1">Configure your personal smart dashboard, adjust notification frequencies, and refine ward locations.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSave} className="p-6 rounded-3xl glass-panel space-y-6">
          
          {/* Section 1: Notification preferences */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-900/60">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Notification Alert Channels</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <h4 className="text-xs font-bold text-black">Push Notifications</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Real-time alerts when AI triage completes or volunteer sweeps dispatched.</p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={() => setPushNotif(!pushNotif)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-900 focus:ring-0 focus:ring-offset-0 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1.5 border-t border-slate-900/40">
                <div>
                  <h4 className="text-xs font-bold text-black">Email Dispatches</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Weekly digests summarizing citizen rankings, badges earned, and resolved tickets.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={() => setEmailNotif(!emailNotif)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-900 focus:ring-0 focus:ring-offset-0 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-1.5 border-t border-slate-900/40">
                <div>
                  <h4 className="text-xs font-bold text-black">Carbon & Cleanup Summary</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Notifications about upcoming native tree sapling allocations and cleanup streak saves.</p>
                </div>
                <input
                  type="checkbox"
                  checked={digest}
                  onChange={() => setDigest(!digest)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-900 focus:ring-0 focus:ring-offset-0 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ward and Location Settings */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-900/60">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Ward & Session Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Primary Ward Circle</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-900 text-slate-200 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Ward 12 - Vasant Kunj">Ward 12 - Vasant Kunj</option>
                  <option value="Ward 4 - Dwarka">Ward 4 - Dwarka</option>
                  <option value="Ward 9 - Saket">Ward 9 - Saket</option>
                  <option value="Ward 15 - Rohini">Ward 15 - Rohini</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Display Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-900 text-slate-200 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="dark">Futuristic Cyber Dark Mode</option>
                  <option value="light">Classic Light (Emulated)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Smart city integration integrations */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-900/60">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Municipal API integrations</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-slate-450 leading-relaxed space-y-2">
              <p className="font-bold text-black font-mono uppercase tracking-wider text-[8px]">ACTIVE API TOKENS AVAILABLE</p>
              <p>NagarSetu is connected to the Municipal Corporations open-data initiative. Your citizen reviews are compiled to optimize street light grid power loads and dump trucks routes.</p>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 max-w-max">
                MUNI-SECURE-SYNC: CONNECTED
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-900/60 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shimmer-btn"
            >
              <Check className="w-4 h-4" /> Save System Preferences
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
