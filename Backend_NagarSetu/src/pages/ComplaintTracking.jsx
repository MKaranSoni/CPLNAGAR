import React, { useState } from 'react';
import { useCivicData } from '../hooks/useCivicData';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin, 
  QrCode, 
  Send, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';

export default function ComplaintTracking() {
  const { complaints, updateComplaintStatus, currentUser, showToast } = useCivicData();
  const [selectedCompId, setSelectedCompId] = useState(complaints[0]?.id || '');
  const [chatMessage, setChatMessage] = useState('');
  const [chats, setChats] = useState({
    "NS-COMP-101": [
      { sender: "volunteer", text: "Hello Aarav! I have been assigned to clear this garbage pile. Our Vasant Kunj circle is planning a sweep this evening at 5 PM.", time: "Yesterday, 17:00" },
      { sender: "citizen", text: "Excellent! Thank you so much, Rahul. Let me know if you need any directions or landmark verification.", time: "Yesterday, 17:15" },
      { sender: "volunteer", text: "I have reached the site and we are sweeping it. I will generate the verification QR code once the cleaning is finished.", time: "Today, 09:15" }
    ],
    "NS-COMP-102": [
      { sender: "system", text: "AI Triage complete. Road division notified. Awaiting municipal dispatch team assignments.", time: "Today, 08:35" }
    ],
    "NS-COMP-103": [
      { sender: "volunteer", text: "Hi Amit, the LED replacement crew has successfully replaced the driver boards.", time: "May 20, 15:00" },
      { sender: "citizen", text: "Confirming lights are back on! Thanks for the quick support.", time: "May 21, 18:30" }
    ]
  });

  const activeComplaint = complaints.find(c => c.id === selectedCompId) || complaints[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      sender: "citizen",
      text: chatMessage,
      time: "Just now"
    };

    // Update active chat logs
    setChats(prev => ({
      ...prev,
      [selectedCompId]: [...(prev[selectedCompId] || []), newMsg]
    }));

    const userText = chatMessage;
    setChatMessage('');

    // Simulated volunteer automatic responses
    setTimeout(() => {
      let replyText = "Received! Our teams are on it. I will keep you posted.";
      if (activeComplaint.category === 'Waste Management') {
        replyText = "Thanks for the heads up. I am compiling the before/after photos now. Please scan the QR verification code once the bins are cleared!";
      } else if (activeComplaint.category === 'Road & Infrastructure') {
        replyText = "The road maintenance roller has been scheduled. Ward 4 maintenance department has logged your coordinates.";
      }
      
      const replyMsg = {
        sender: "volunteer",
        text: replyText,
        time: "Just now"
      };

      setChats(prev => ({
        ...prev,
        [selectedCompId]: [...(prev[selectedCompId] || []), replyMsg]
      }));
      
      showToast("Assigned volunteer sent a message!", "info");
    }, 1500);
  };

  // Simulate scanning the verification QR code on-site
  const handleVerifyQR = () => {
    if (activeComplaint.status === 'Resolved') {
      showToast("Complaint is already resolved & verified!", "info");
      return;
    }

    // Trigger state change in context
    updateComplaintStatus(
      activeComplaint.id, 
      'Resolved', 
      "Verified on-site by resident scan. Green XP rewarded."
    );

    // Append system message in chat
    const qrNotif = {
      sender: "system",
      text: "On-site audit completed! Resident scanned verified QR Code. Status marked RESOLVED.",
      time: "Just now"
    };
    
    setChats(prev => ({
      ...prev,
      [selectedCompId]: [...(prev[selectedCompId] || []), qrNotif]
    }));
  };

  const stages = [
    { label: "Submitted", statusKey: "Submitted" },
    { label: "AI Screened", statusKey: "AI Screened" },
    { label: "Assigned", statusKey: "Assigned" },
    { label: "In Progress", statusKey: "In Progress" },
    { label: "Resolved", statusKey: "Resolved" }
  ];

  const getStageIndex = (status) => {
    return stages.findIndex(s => s.statusKey === status);
  };

  const activeStageIndex = getStageIndex(activeComplaint?.status || 'Submitted');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">Live Complaint Tracker</h2>
        <p className="text-xs text-themeLight-textSub mt-1">Audit active municipal works, inspect step-by-step progress timelines, scan verification QRs, and consult assigned crews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Complaints Selection Panel */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-themeLight-textSub uppercase tracking-widest">Active Tickets</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {complaints.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCompId(c.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border shadow-soft ${
                  selectedCompId === c.id 
                    ? 'glass-panel-glow border-brand-violet/35 bg-purple-50/40' 
                    : 'glass-panel hover:bg-purple-50/30 border-purple-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-slate-900/5 px-2 py-0.5 rounded font-mono font-bold text-slate-500 border border-slate-900/5">{c.id}</span>
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                    c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15' :
                    c.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/15' : 'bg-slate-100 text-slate-500'
                  }`}>{c.status}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">{c.title}</h4>
                <p className="text-[10px] text-slate-500 truncate mt-1">{c.locationName.split(',')[0]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Step timelines, Chat, QR Auditor */}
        {activeComplaint ? (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step-by-step progress pipeline visual */}
            <div className="p-6 rounded-3xl glass-panel space-y-6 bg-white/70 shadow-soft">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Status Progression Pipeline</h4>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative">
                {/* Connection line */}
                <div className="hidden sm:block absolute top-[14px] left-[5%] right-[5%] h-0.5 bg-purple-100 z-0" />
                
                {stages.map((stg, idx) => {
                  const isDone = idx <= activeStageIndex;
                  const isCurrent = idx === activeStageIndex;
                  return (
                    <div key={stg.label} className="flex sm:flex-col items-center gap-3 relative z-10 w-full sm:w-auto text-left sm:text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                        isDone 
                          ? 'bg-brand-violet text-white border-brand-violet/50 shadow-glow-violet'
                          : 'bg-white text-slate-400 border-purple-100 shadow-soft'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : idx + 1}
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold ${isDone ? 'text-slate-800' : 'text-slate-400'} ${isCurrent ? 'text-brand-violet font-extrabold' : ''}`}>{stg.label}</p>
                        <p className="text-[8px] text-slate-400 hidden sm:block mt-0.5">{isDone ? 'Completed' : 'Pending'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split layout: Ticket Details + QR auditor on left, chatbox on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Box: Info details and QR code auditor */}
              <div className="space-y-6 flex flex-col">
                
                {/* Details card */}
                <div className="p-5 rounded-3xl glass-panel space-y-4 flex-1 bg-white/70 shadow-soft">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Ticket Specification</h4>
                  <img src={activeComplaint.photoUrl} alt="Complaint source" className="w-full h-28 object-cover rounded-xl border border-purple-100 shadow-soft" />
                  
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-slate-800 leading-snug">{activeComplaint.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{activeComplaint.description}</p>
                    
                    <div className="pt-3 border-t border-purple-100/50 space-y-2 font-mono text-[10px] text-slate-500">
                      <div className="flex justify-between">
                        <span>CATEGORY:</span>
                        <span className="text-slate-850 font-bold">{activeComplaint.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PRIORITY:</span>
                        <span className={`font-bold ${activeComplaint.priority === 'Critical' ? 'text-red-500' : 'text-orange-500'}`}>{activeComplaint.priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VOLUNTEER LEAD:</span>
                        <span className="text-slate-855 font-bold">{activeComplaint.assignedVolunteer}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Auditor */}
                <div className="p-5 rounded-3xl glass-panel-glow border-brand-violet/20 bg-white/70 text-center space-y-4 shadow-soft">
                  <div className="flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5 text-brand-violet animate-pulse" />
                    <span className="text-xs font-bold font-outfit text-slate-800">Physical On-Site QR Verification</span>
                  </div>

                  <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto flex items-center justify-center relative group border border-purple-100 shadow-soft">
                    {/* Simulated visual QR pixels */}
                    <div className="w-full h-full bg-[radial-gradient(#8b5cf6_3px,transparent_3px)] [background-size:8px_8px] opacity-75" />
                    {activeComplaint.status === 'Resolved' && (
                      <div className="absolute inset-0 bg-brand-violet/90 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-white rounded-xl shadow-glow-violet">
                        VERIFIED
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-550 leading-relaxed max-w-[220px] mx-auto">
                    Once the cleanup is completed physically, residents or ward inspectors scan the on-site QR to unlock citizen XP benefits.
                  </p>

                  <button
                    onClick={handleVerifyQR}
                    disabled={activeComplaint.status === 'Resolved'}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      activeComplaint.status !== 'Resolved'
                        ? 'bg-gradient-to-r from-brand-violet to-brand-purple text-white shadow-glow-violet hover:opacity-95 shimmer-btn cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    {activeComplaint.status === 'Resolved' ? 'Verified & Completed' : 'Simulate QR Audit scan'}
                  </button>
                </div>

              </div>

              {/* Right Box: Chatbox communication */}
              <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between h-[480px] bg-white/70 shadow-soft">
                
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-violet" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Municipal Chat log</h4>
                      <p className="text-[8px] text-slate-500 font-mono font-bold mt-0.5 uppercase">DIRECT COMMUNICATOR</p>
                    </div>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs mb-3">
                  {(chats[activeComplaint.id] || []).map((msg, index) => {
                    const isSystem = msg.sender === 'system';
                    const isMe = msg.sender === 'citizen';
                    
                    if (isSystem) {
                      return (
                        <div key={index} className="p-2 bg-brand-violet/5 border border-brand-violet/10 text-brand-violet rounded-lg text-[9px] font-mono leading-relaxed text-center">
                          {msg.text}
                        </div>
                      );
                    }

                    return (
                      <div key={index} className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <div className={`p-3 rounded-2xl ${
                          isMe 
                            ? 'bg-gradient-to-tr from-brand-violet to-brand-purple text-white rounded-tr-none shadow-soft' 
                            : 'bg-purple-50/50 border border-purple-100 text-slate-800 rounded-tl-none shadow-soft'
                        }`}>
                          <p className="leading-relaxed font-medium">{msg.text}</p>
                        </div>
                        <span className="text-[8px] text-slate-400 mt-1 px-1 font-mono font-medium">{msg.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Form Message Typing input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask official about status..."
                    className="flex-1 bg-white border border-purple-100 text-slate-800 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 shadow-soft"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-white border border-purple-100 hover:bg-purple-50 text-brand-violet hover:text-brand-purple transition-colors shadow-soft"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 glass-panel p-16 rounded-2xl text-center text-slate-400 text-xs">
            No complaints available to track.
          </div>
        )}

      </div>
    </div>
  );
}
