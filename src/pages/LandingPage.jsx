import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Users2, 
  Trophy, 
  ArrowRight, 
  Activity, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const stats = [
    { value: "48.2K+", label: "Active Citizens", color: "text-brand-violet" },
    { value: "12,450+", label: "Complaints Solved", color: "text-brand-purple" },
    { value: "310+", label: "Volunteer Squads", color: "text-indigo-600" },
    { value: "98.4%", label: "Accuracy Index", color: "text-brand-violet" }
  ];

  const features = [
    {
      title: "AI Issue Recognition",
      desc: "Upload a photo; our embedded computer vision model immediately predicts the category, tags the GPS coordinates, and screens duplicates.",
      icon: Sparkles,
      color: "from-brand-violet/10 to-brand-purple/5",
      border: "hover:border-brand-violet/40"
    },
    {
      title: "Real-Time Tracking",
      desc: "Follow complaints along a step-by-step progress pipeline. Get direct notifications when municipal crews or community volunteers take active steps.",
      icon: MapPin,
      color: "from-brand-purple/10 to-brand-violet/5",
      border: "hover:border-brand-purple/40"
    },
    {
      title: "Gamified Civic Rewards",
      desc: "Earn XP points and custom badges by filing legit reports and joining weekend cleanup drives. Redeem accumulated XP for metro passes and property tax rebates.",
      icon: Trophy,
      color: "from-orange-500/10 to-yellow-500/5",
      border: "hover:border-orange-500/40"
    },
    {
      title: "Volunteering Drives",
      desc: "Join neighborhood groups, organize local trash sweeps, plant tree saplings, or paint beautiful social-awareness murals on public walls.",
      icon: Users2,
      color: "from-indigo-500/10 to-brand-violet/5",
      border: "hover:border-indigo-500/40"
    }
  ];

  return (
    <div  className="min-h-screen bg-[#F7F5FC] text-slate-700 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 inset-x-0 h-[200px] smart-city-grid opacity-30" /> 
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Landing Header */}
      <header  className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-purple flex items-center justify-center font-bold text-white shadow-glow-violet text-xl">
            NS
          </div>
          <div>
            <h1 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-100 leading-none">NagarSetu</h1>
            <span className="text-[10px] text-brand-violet font-semibold tracking-widest uppercase">Smart Civic Alliance</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 text-xs font-bold text-slate-650 hover:text-slate-900 hover:bg-purple-50/50 transition-all shadow-soft"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-10 relative z-10 text-center -mt-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-xs font-bold mb-6"
        >
          <Activity className="w-4 h-4 animate-pulse text-brand-violet" />
          <span>Fusing AI & Community for Smarter Wards</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl sm:text-6xl font-extrabold font-outfit text-slate-850 tracking-tight leading-[1.1] mb-6"
        >
          Connecting Citizens, Volunteers & <br />
          <span className="text-gradient-civic">Municipal Corporations</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          NagarSetu is a premium decentralized civic-tech hub. Report issues, get automated AI validation, mobilize localized volunteer cleanup circles, track ward AQI scores, and earn verified rewards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/register')}
           className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple hover:from-brand-violet/90 hover:to-brand-purple/90 text-white font-bold text-xs shadow-glow-violet transition-all flex items-center justify-center gap-2 shimmer-btn"
          >
            Join as Citizen Volunteer
          </button>
        </motion.div>
      </section>
      {/* How It Works - Visual Lifecycle Node */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold font-outfit text-slate-800 dark:text-slate-100 mb-4">The Civic Lifecycle</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">See how NagarSetu bridges the gap seamlessly between complaints, algorithms, and active solutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Visual arrow pipelines for desktop */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-purple-100 z-0" />

          {/* Node 1 */}
          <div className="glass-panel p-6 rounded-2xl relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold font-mono text-brand-violet">01</span>
            </div>
            <h4 className="text-xs font-bold font-outfit text-slate-800 dark:text-slate-100 mb-2">Citizen Reports</h4>
            <p className="text-[11px] text-slate-500">Citizen snaps a photo of public garbage, potholes, or light outages on our portal.</p>
          </div>

          {/* Node 2 */}
          <div className="glass-panel p-6 rounded-2xl relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold font-mono text-brand-purple">02</span>
            </div>
            <h4 className="text-xs font-bold font-outfit text-slate-800 dark:text-slate-100 mb-2">AI Triage & AQI</h4>
            <p className="text-[11px] text-slate-500">AI screen duplicates, tags location coordinates, and cross-references active atmospheric AQIs.</p>
          </div>

          {/* Node 3 */}
          <div className="glass-panel p-6 rounded-2xl relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold font-mono text-indigo-600">03</span>
            </div>
            <h4 className="text-xs font-bold font-outfit text-slate-800 dark:text-slate-100 mb-2">Volunteers Dispatched</h4>
            <p className="text-[11px] text-slate-500">Assigned local volunteer crews and municipal wards receive notifications to clear the issue.</p>
          </div>

          {/* Node 4 */}
          <div className="glass-panel p-6 rounded-2xl relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
              <span className="text-lg font-bold font-mono text-orange-500">04</span>
            </div>
            <h4 className="text-xs font-bold font-outfit text-slate-800 dark:text-slate-100 mb-2">Resolved + XP</h4>
            <p className="text-[11px] text-slate-500">Status gets updated via on-site QR. Citizen and Volunteers claim green XP rewards!</p>
          </div>

        </div>
      </section>

      {/* Feature Grid Showcase */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold font-outfit text-slate-800 dark:text-slate-100 mb-4">Robust Features for Active Change</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">Explore the modules designed to streamline urban cleanliness, civic accountability, and gamified engagement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`p-8 rounded-3xl bg-gradient-to-br ${feature.color} border border-purple-100/50 shadow-soft transition-all duration-300 flex items-start gap-4`}
              >
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 text-brand-violet flex-shrink-0 shadow-soft">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-outfit text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA bottom banner */}
      <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <div className="p-10 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-violet/10 via-brand-purple/10 to-transparent border border-purple-100 text-center relative overflow-hidden shadow-soft">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-outfit text-slate-855 mb-4">Ready to Transform Your Ward?</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">Join thousands of citizens cleaning their streets, tracking potholes, and collaborating directly with ward commanders.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple text-white font-bold text-xs shadow-glow-violet hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            Get Started Now <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>

    </div>
  );
}
