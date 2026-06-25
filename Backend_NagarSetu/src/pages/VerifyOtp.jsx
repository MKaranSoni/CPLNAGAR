import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  MailCheck,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { verifyOtp, resendOtp } from '../services/authService';
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds
export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  // Registration data passed via router state
  const registrationData = location.state?.registrationData || null;
  const email = registrationData?.email || '';
  // Redirect back if no registration data
  useEffect(() => {
    if (!registrationData) {
      navigate('/signup', { replace: true });
    }
  }, [registrationData, navigate]);
  // OTP digit state
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef([]);
  // UI state
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verified, setVerified] = useState(false);
  // Countdown timer
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const timerRef = useRef(null);
  const startTimer = useCallback(() => {
    setCountdown(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);
  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);
  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  /* ─── OTP input handlers ─── */
  const handleDigitChange = (index, value) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = sanitized;
    setOtpDigits(next);
    setError('');
    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otpDigits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };
  const otpValue = otpDigits.join('');
  const isOtpComplete = otpValue.length === OTP_LENGTH;
  /* ─── Verify OTP ─── */
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isOtpComplete) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await verifyOtp(email, otpValue);

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        setVerified(true);
        setSuccessMsg(
          'Your email has been verified successfully! Redirecting to login…'
        );

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2500);
      } else {
        throw new Error(response.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  /* ─── Resend OTP ─── */
  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      const response = await resendOtp(email);

      if (response.data.success) {
        setOtpDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        startTimer();
      } else {
        throw new Error(response.data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + '*'.repeat(b.length))
    : '';
  if (!registrationData) return null;
  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-premium relative bg-white/70">
      <AnimatePresence mode="wait">
        {verified ? (
          /* ── Success State ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center justify-center gap-5 py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold font-outfit text-slate-800 mb-1">Verified!</h2>
              <p className="text-xs text-slate-500">{successMsg}</p>
            </div>
            <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-purple"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ) : (
          /* ── Verification Form ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-violet/15 to-brand-purple/10 border border-brand-violet/20 mb-4 shadow-glow-violet">
                <MailCheck className="w-7 h-7 text-brand-violet" />
              </div>
              <h2 className="text-2xl font-bold font-outfit text-slate-800">Check Your Inbox</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                We sent a 6-digit code to
              </p>
              <p className="text-xs font-bold text-brand-violet mt-0.5">{maskedEmail}</p>
            </div>
            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Input Grid */}
              <div>
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-3 font-mono text-center">
                  Enter OTP
                </label>
                <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <motion.input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      whileFocus={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`w-11 h-13 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-white/80 text-slate-800 shadow-soft
                        ${digit
                          ? 'border-brand-violet bg-brand-violet/5 shadow-glow-violet'
                          : 'border-purple-100 focus:border-brand-violet/60'
                        }
                        ${error ? 'border-red-400 bg-red-50/30' : ''}
                      `}
                      style={{ paddingTop: '10px', paddingBottom: '10px' }}
                    />
                  ))}
                </div>
              </div>
              {/* Error Message */}
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
              {/* Verify Button */}
              <button
                id="verify-otp-btn"
                type="submit"
                disabled={isVerifying || !isOtpComplete}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple hover:opacity-90 text-white font-bold text-xs shadow-glow-violet transition-all flex items-center justify-center gap-2 shimmer-btn disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify OTP
                  </>
                )}
              </button>
            </form>
            {/* Resend Section */}
            <div className="mt-6 pt-5 border-t border-purple-100/60 text-center">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500">
                  Resend code in{' '}
                  <span className="font-bold text-brand-violet tabular-nums">
                    00:{String(countdown).padStart(2, '0')}
                  </span>
                </p>
              ) : (
                <button
                  id="resend-otp-btn"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet hover:text-brand-violet/80 transition-colors disabled:opacity-50"
                >
                  {isResending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  {isResending ? 'Sending…' : 'Resend OTP'}
                </button>
              )}
            </div>
            {/* Back link */}
            <div className="mt-4 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
