import React, { useEffect, useState } from 'react';
import { 
  Award, 
  MapPin, 
  Mail,
  HeartHandshake,
  Loader2
} from 'lucide-react';
import { getCurrentUser } from '../services/userService';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Location unavailable');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
        const storedLoc = localStorage.getItem('userLocation');
        if (storedLoc) {
          setLocation(storedLoc);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-slate-500 mt-10">
        Failed to load profile.
      </div>
    );
  }

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown Date';

  return (
    <div className="space-y-8">
      {/* Profile Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-slate-800">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-2xl font-bold font-outfit text-slate-900">{user.name}</h2>
            
            <div className="flex items-center gap-1.5 justify-center mt-1 sm:mt-0">
              <span className="text-[10px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded font-bold border border-slate-800 uppercase">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 text-xs text-slate-900 justify-center sm:justify-start">
            <p className="flex items-center justify-center sm:justify-start gap-1 leading-none">
              <MapPin className="w-3.5 h-3.5 text-slate-900" />
              {location}
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-1 leading-none">
              <Mail className="w-3.5 h-3.5 text-slate-900" />
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Split section: Left (Badges cabinet), Right (History log ledger) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Badges cabinet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-outfit text-slate-900">Verified Badge Showcase</h3>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-8 rounded-2xl glass-panel-glow border-emerald-500/10 bg-slate-950/20 flex flex-col items-center justify-center text-center">
            <Award className="w-12 h-12 text-slate-400 mb-3 opacity-50" />
            <h4 className="text-lg font-bold text-slate-900">Coming Soon</h4>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              We are working on exciting new verified badges. Stay tuned!
            </p>
          </div>
        </div>

        {/* Right: History Log Ledger */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-outfit text-slate-900">Recent Civic Actions</h3>
          
          <div className="p-5 rounded-2xl glass-panel space-y-4 max-h-[360px] overflow-y-auto pr-1">
            
            {/* Action 1 */}
            <div className="flex gap-3 text-xs border-b border-slate-900/60 pb-3 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900">NagarSetu Member Since</h5>
                <p className="text-[10px] text-slate-900 mt-0.5">Joined NagarSetu</p>
                <span className="text-[8px] text-slate-900 font-mono mt-1 block">{joinDate}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
