import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCivicData } from '../hooks/useCivicData';
import { registerUser } from "../services/authService";
import { User, Mail, Lock, UserPlus, MapPin } from 'lucide-react';

export default function Signup() {
  const { switchUserRole } = useCivicData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ward, setWard] = useState('Ward 12 - Vasant Kunj');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await registerUser({
      name,
      email,
      password
    });

    

    const token = response.data?.token;

    if (token) {
      localStorage.setItem("token", token);
    }

    switchUserRole("citizen");

    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    alert(error.response?.data || "Registration Failed");
  }
};

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-premium relative bg-white/70">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-outfit text-slate-800">Join NagarSetu</h2>
        <p className="text-xs text-slate-500 mt-1">Connect with your local community</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-2 font-mono">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              required
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-2 font-mono">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
              required
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft"
            />
          </div>
        </div>

        {/* Ward Selection */}
        <div>
          <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-2 font-mono">Municipal Ward</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors appearance-none shadow-soft cursor-pointer"
            >
              <option value="Ward 12 - Vasant Kunj">Ward 12 - Vasant Kunj</option>
              <option value="Ward 4 - Dwarka">Ward 4 - Dwarka</option>
              <option value="Ward 9 - Saket">Ward 9 - Saket</option>
              <option value="Ward 15 - Rohini">Ward 15 - Rohini</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-2 font-mono">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft"
            />
          </div>
        </div>

        {/* Action button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple hover:opacity-90 text-white font-bold text-xs shadow-glow-violet transition-all flex items-center justify-center gap-2 shimmer-btn mt-6"
        >
          <UserPlus className="w-4 h-4 text-white" /> Register Account
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-brand-violet hover:text-brand-violet/85 font-semibold">Sign in instead</Link>
      </div>
    </div>
  );
}
