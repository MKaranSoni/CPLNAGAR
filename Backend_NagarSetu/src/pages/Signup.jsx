import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCivicData } from '../hooks/useCivicData';
import { User, Mail, Lock, UserPlus, MapPin, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendOtp } from '../services/authService';

export default function Signup() {
  const { switchUserRole } = useCivicData();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ward, setWard] = useState('Ward 12 - Vasant Kunj');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!name.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      switchUserRole('citizen');
      const response = await sendOtp({
        name: name.trim(),
        email: email.trim(),
        password,
        ward,
      });

      if (response.data.success) {
        navigate('/verify-otp', {
          state: {
            registrationData: {
              name: name.trim(),
              email: email.trim(),
              password,
              ward,
            },
          },
        });
      } else {
        throw new Error(response.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-premium relative bg-white/70">
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold font-outfit text-slate-800">Join NagarSetu</h2>
        <p className="text-xs text-slate-500 mt-1">Connect with your local community</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4" noValidate>
        <div>
          <label htmlFor="signup-name" className="text-[10px] font-bold text-black uppercase tracking-widest block mb-2 font-mono">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
              <User className="w-4 h-4" />
            </span>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Aarav Sharma"
              required
              disabled={isLoading}
              className="w-full bg-white/80 border border-purple-100 text-black pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="text-[10px] font-bold text-black uppercase tracking-widest block mb-2 font-mono">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="aarav@example.com"
              required
              disabled={isLoading}
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-ward" className="text-[10px] font-bold text-black uppercase tracking-widest block mb-2 font-mono">
            Municipal Ward
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            <select
              id="signup-ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors appearance-none shadow-soft cursor-pointer disabled:opacity-60"
            >
              <option value="Ward 12 - Vasant Kunj">Ward 12 - Vasant Kunj</option>
              <option value="Ward 4 - Dwarka">Ward 4 - Dwarka</option>
              <option value="Ward 9 - Saket">Ward 9 - Saket</option>
              <option value="Ward 15 - Rohini">Ward 15 - Rohini</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="text-[10px] font-bold text-black uppercase tracking-widest block mb-2 font-mono">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Min. 8 characters"
              required
              disabled={isLoading}
              className="w-full bg-white/80 border border-purple-100 text-slate-800 pl-10 pr-10 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="signup-confirm-password" className="text-[10px] font-bold text-black uppercase tracking-widest block mb-2 font-mono">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Re-enter password"
              required
              disabled={isLoading}
              className={`w-full bg-white/80 border text-slate-800 pl-10 pr-10 py-3 rounded-xl text-xs focus:outline-none transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60 ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-300 focus:border-red-400 bg-red-50/20'
                  : confirmPassword && confirmPassword === password
                  ? 'border-emerald-300 focus:border-emerald-400 bg-emerald-50/20'
                  : 'border-purple-100 focus:border-brand-violet/50'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[10px] mt-1.5 font-medium ${
                confirmPassword === password ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
            </motion.p>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          id="signup-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple hover:opacity-90 text-white font-bold text-xs shadow-glow-violet transition-all flex items-center justify-center gap-2 shimmer-btn mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending OTP…
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-white" />
              Register &amp; Send OTP
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-brand-violet hover:text-brand-violet/85 font-semibold">
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
