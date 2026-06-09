import React from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { 
  HeartHandshake, 
  MapPin, 
  Users, 
  Calendar, 
  Check, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function VolunteerGroups() {
  const { volunteerGroups, joinedGroups, toggleJoinGroup } = useCivicData();

  const activeDrives = [
    {
      id: "dr-1",
      title: "Dwarka Sector 6 Metro Station Sweep",
      group: "Dwarka Cleanliness Crusaders",
      date: "Saturday, May 30 - 07:00 AM",
      location: "Dwarka Sector 6 Metro Gate 2, Delhi",
      volunteersCount: 28,
      goal: "Collect 50kg plastic waste & segregate wet/dry bins",
      avatar: "🧹"
    },
    {
      id: "dr-2",
      title: "Yamuna Riverbank Clean-Sweep Phase 4",
      group: "Yamuna Cleanup Force",
      date: "Saturday, May 30 - 06:00 AM",
      location: "Kudsia Ghat, Yamuna Bank, Delhi",
      volunteersCount: 114,
      goal: "Clear microplastics and biological river wastes",
      avatar: "🌊"
    },
    {
      id: "dr-3",
      title: "Sector C Vasant Kunj Tree Plantation Drive",
      group: "Vasant Kunj Green Guardians",
      date: "Sunday, May 31 - 08:00 AM",
      location: "Sector C Park Outer Jogging Ring, Vasant Kunj",
      volunteersCount: 42,
      goal: "Plant 50 native Neem and Gulmohar saplings",
      avatar: "🌱"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-black">Volunteer Circles & Drives</h2>
        <p className="text-xs text-black mt-1">Enroll in localized ecological tasks, join regional cleanup squads, and earns bonus civic XP.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Upcoming Weekend Drives */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-outfit text-black">Weekend Action Campaigns</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">Active schedules</span>
          </div>

          <div className="space-y-4">
            {activeDrives.map((drv) => (
              <div key={drv.id} className="p-6 rounded-2xl glass-panel hover:border-slate-800 transition-all flex flex-col md:flex-row gap-5 justify-between">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl flex-shrink-0">
                    {drv.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black leading-snug">{drv.title}</h4>
                    <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                      {drv.group}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-black">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {drv.date}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {drv.location}
                      </p>
                    </div>

                    {drv.goal && (
                      <div className="mt-3 p-2 bg-slate-900/40 rounded-lg text-[10px] border border-slate-900 text-black">
                        <span className="font-bold text-black uppercase font-mono tracking-wider text-[8px] block mb-0.5">TARGET GOAL:</span>
                        {drv.goal}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4 min-w-[130px] border-t md:border-t-0 border-slate-900/60 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-black block uppercase font-mono tracking-widest leading-none">Registered</span>
                    <span className="text-sm font-bold text-black mt-1 block font-mono">{drv.volunteersCount} Active</span>
                  </div>

                  <button
                    onClick={() => toggleJoinGroup(drv.id, drv.title)}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      joinedGroups.includes(drv.id)
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shimmer-btn'
                    }`}
                  >
                    {joinedGroups.includes(drv.id) ? (
                      <>
                        <Check className="w-4 h-4" /> Registered
                      </>
                    ) : (
                      <>
                        Join Drive <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Volunteer Circles (Permanent Groups) */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-outfit text-black">Permanent Circles</h3>
          <div className="space-y-4">
            {volunteerGroups.map((grp) => (
              <div key={grp.id} className="p-5 rounded-2xl glass-panel space-y-4">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                    {grp.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black leading-snug">{grp.name}</h4>
                    <span className="text-[9px] text-black font-mono uppercase tracking-wider">{grp.city}</span>
                  </div>
                </div>

                <p className="text-xs text-black leading-relaxed">{grp.description}</p>

                <div className="flex items-center justify-between border-t border-slate-900/60 pt-3 text-[10px] text-slate-400 font-mono">
                  <span>MEMBERS:</span>
                  <span className=" text-black  font-bold">{grp.members} Registered</span>
                </div>

                <button
                  onClick={() => toggleJoinGroup(grp.id, grp.name)}
                  className={`w-full py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1 ${
                    joinedGroups.includes(grp.id)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 hover:bg-slate-950  text-slate-200 '
                  }`}
                >
                  {joinedGroups.includes(grp.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Enrolled
                    </>
                  ) : (
                    'Enroll In Circle'
                  )}
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
