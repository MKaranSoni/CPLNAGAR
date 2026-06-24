import React, { useState, useEffect } from 'react';
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
  const [wardName, setWardName] = useState('');
  const [wardNumber, setWardNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    setLocationStatus('detecting');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
          
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          
          const address = data.address || {};
          const detectedCity = address.city || address.state_district || address.state || 'Unknown City';
          const detectedArea = address.suburb || address.neighbourhood || address.town || address.county || 'Unknown Area';
          const detectedLandmark = address.road || address.amenity || address.building || detectedArea;
          
          let hash = 0;
          for (let i = 0; i < detectedArea.length; i++) {
            hash = detectedArea.charCodeAt(i) + ((hash << 5) - hash);
          }
          const generatedWardNumber = Math.abs(hash) % 100 + 1;
          
          setCity(detectedCity);
          setArea(detectedArea);
          setLandmark(detectedLandmark);
          setWardNumber(`Ward ${generatedWardNumber}`);
          setWardName(detectedArea);
          setLocationStatus('success');
        } catch (err) {
          setLocationStatus('error');
        }
      },
      (err) => {
        setLocationStatus('error');
      }
    );
  };

  const validate = () => {
    if (!name.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (locationStatus !== 'success') return 'Location access is required for Ward detection.';
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
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        wardName,
        wardNumber,
        landmark,
        area,
        city,
        latitude,
        longitude
      };
      
      const response = await sendOtp(payload);

      if (response.data.success) {
        navigate('/verify-otp', {
          state: {
            registrationData: payload,
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
    <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-premium relative bg-white/70 dark:bg-slate-900/70">
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold font-outfit text-slate-800 dark:text-slate-100">Join NagarSetu</h2>
        <p className="text-xs text-slate-500 mt-1">Connect with your local community</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4" noValidate>
        <div>
          <label htmlFor="signup-name" className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest block mb-2 font-mono">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black dark:text-white">
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
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-purple-100 text-black dark:text-white pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest block mb-2 font-mono">
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
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-purple-100 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest block mb-2 font-mono">
            Municipal Ward
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </span>
            {locationStatus === 'detecting' ? (
              <input
                type="text"
                value="[ Auto Detecting... ]"
                readOnly
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-purple-100 text-slate-400 pl-10 pr-4 py-3 rounded-xl text-xs font-mono shadow-soft"
              />
            ) : locationStatus === 'error' ? (
              <div className="w-full bg-red-50/50 border border-red-200 text-red-500 pl-10 pr-4 py-2.5 rounded-xl text-xs shadow-soft flex items-center justify-between">
                <span>Location access required</span>
                <button type="button" onClick={detectLocation} className="font-bold underline">Retry Detection</button>
              </div>
            ) : (
              <input
                type="text"
                value={`${wardNumber} - ${wardName}`}
                readOnly
                className="w-full bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 text-brand-violet dark:text-purple-300 pl-10 pr-4 py-3 rounded-xl text-xs font-bold shadow-soft"
              />
            )}
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest block mb-2 font-mono">
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
              className="w-full bg-white/80 dark:bg-slate-900/80 border border-purple-100 text-slate-800 dark:text-slate-100 pl-10 pr-10 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60"
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
          <label htmlFor="signup-confirm-password" className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest block mb-2 font-mono">
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
              className={`w-full bg-white/80 dark:bg-slate-900/80 border text-slate-800 dark:text-slate-100 pl-10 pr-10 py-3 rounded-xl text-xs focus:outline-none transition-colors placeholder:text-slate-400 shadow-soft disabled:opacity-60 ${
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
