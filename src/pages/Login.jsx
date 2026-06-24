import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCivicData } from '../hooks/useCivicData';
import { loginUser } from "../services/authService";
import { Mail, Lock, LogIn, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { switchUserRole } = useCivicData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
 

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser({ email, password });

    console.log("LOGIN RESPONSE:", response.data);

    const token = response.data?.token;

    if (!token) throw new Error("Token missing");

    localStorage.setItem("token", token);
    localStorage.setItem("userName", response.data?.name);
    localStorage.setItem("userRole", response.data?.role);

    const userRole = response.data?.role?.toLowerCase() || "citizen";
    switchUserRole(userRole);

    if (userRole === 'admin') {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

  } catch (error) {
    console.error(error);
    const errData = error.response?.data;
    const errorMsg = errData?.message || (typeof errData === 'string' ? errData : "Login Failed");
    alert(errorMsg);
  }
};

  const handleRoleQuickLogin = (role) => {
    setSelectedRole(role);
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.focus();
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-premium relative bg-white/70 dark:bg-slate-900/70">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-outfit text-slate-800 dark:text-slate-100">
          {selectedRole ? `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login` : 'Welcome Back'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">Access the NagarSetu Smart-City hub</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-2 font-mono">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-purple-100 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft"
            />
          </div>
        </div>
        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-mono">Password</label>
            <a href="#" className="text-[10px] text-brand-violet hover:text-brand-violet/85 font-bold">Forgot?</a>
          </div>
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
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-purple-100 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft"
            />
          </div>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple hover:opacity-90 text-white font-bold text-xs shadow-glow-violet transition-all flex items-center justify-center gap-2 shimmer-btn mt-6"
        >
          <LogIn className="w-4 h-4 text-white" /> Sign In
        </button>
      </form>

      {/* Role Selection Section */}
      <div className="mt-8 pt-6 border-t border-purple-100/50">
        <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center mb-4 font-mono">Select Role to Login</p>
        
        <div className="grid grid-cols-3 gap-2">
          
          <button
            onClick={() => handleRoleQuickLogin('citizen')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all group shadow-soft ${selectedRole === 'citizen' ? 'bg-purple-100 border-brand-violet' : 'bg-purple-50/40 hover:bg-purple-50 border-purple-100'}`}
          >
            <div className="w-7 h-7 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet group-hover:bg-brand-violet/20 transition-all">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-500 font-bold">Citizen</span>
          </button>
          <button
            onClick={() => handleRoleQuickLogin('volunteer')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all group shadow-soft ${selectedRole === 'volunteer' ? 'bg-purple-100 border-brand-purple' : 'bg-purple-50/40 hover:bg-purple-50 border-purple-100'}`}
          >
            <div className="w-7 h-7 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple/20 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-500 font-bold">Volunteer</span>
          </button>

          <button
            onClick={() => handleRoleQuickLogin('admin')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all group shadow-soft ${selectedRole === 'admin' ? 'bg-purple-100 border-indigo-500' : 'bg-purple-50/40 hover:bg-purple-50 border-purple-100'}`}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500/20 transition-all">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] text-slate-500 font-bold">Admin</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        New to NagarSetu?{' '}
        <Link to="/signup" className="text-brand-violet hover:text-brand-violet/85 font-semibold">Create account</Link>
      </div>
    </div>
  );
}
