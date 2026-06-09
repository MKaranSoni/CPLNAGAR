import React from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { Bell, CheckCheck, Trash2, Calendar, ShieldAlert } from 'lucide-react';

export default function Notifications() {
  const { notifications, markAllNotificationsRead } = useCivicData();

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-slate-900">Civic Notifications</h2>
          <p className="text-xs text-slate-900 mt-1">Review active updates, environmental drive notifications, and system notifications.</p>
        </div>

        {notifications.filter(n => n.unread).length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1.5 transition-all shadow-sm self-start sm:self-center"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="max-w-2xl mx-auto p-6 rounded-3xl glass-panel space-y-4">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 space-y-2">
            <Bell className="w-12 h-12 text-slate-600 mx-auto" />
            <p>Your notification tray is completely empty.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl glass-panel flex gap-4 transition-all relative ${
                  notif.unread 
                    ? 'border-emerald-500/20 bg-emerald-500/[0.01]' 
                    : 'border-slate-900/60 bg-slate-950/20'
                }`}
              >
                
                {/* Visual Type Indicators */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    notif.type === 'status' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    notif.type === 'streak' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {notif.type === 'status' ? <ShieldAlert className="w-4 h-4" /> :
                     notif.type === 'streak' ? <Trash2 className="w-4 h-4" /> :
                     <Calendar className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex-grow min-w-0 pr-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                    <span className="text-[9px] text-slate-500 font-mono font-medium whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed pr-2">{notif.message}</p>
                </div>

                {/* Unread circle badge */}
                {notif.unread && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
