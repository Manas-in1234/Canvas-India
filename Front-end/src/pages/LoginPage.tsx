import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  KeyRound,
  RotateCw,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOtp,
    signInWithEmailOtp,
  } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  // Active Login Method: 'phone' | 'email'
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useEmailOtp, setUseEmailOtp] = useState(false);

  // Phone form state
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Google OAuth Login
  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error: googleError } = await signInWithGoogle(redirectUrl);
    setGoogleLoading(false);

    if (googleError) {
      setError(googleError.message || 'Google sign-in failed. Please try again.');
    }
  };

  // Email & Password / OTP Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    if (useEmailOtp) {
      // Magic Link / Email OTP flow
      const { error: otpError } = await signInWithEmailOtp(email, redirectUrl);
      setLoading(false);
      if (otpError) {
        setError(otpError.message || 'Failed to send login link. Please try password login.');
      } else {
        setSuccess('We have sent a login link/OTP to your email address.');
      }
      return;
    }

    // Standard Password Login
    if (!password) {
      setLoading(false);
      setError('Please enter your password.');
      return;
    }

    const { error: signInError } = await signIn({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Invalid email or password.');
    } else {
      setSuccess('Login successful! Redirecting to your account...');
      setTimeout(() => {
        navigate(redirectUrl);
      }, 600);
    }
  };

  // Send Phone OTP
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const { error: phoneError } = await signInWithPhone(cleanPhone);
    setLoading(false);

    if (phoneError) {
      setError(phoneError.message || 'Unable to send OTP to this mobile number. Please check the number or use Email/Google.');
    } else {
      setOtpSent(true);
      setTimer(30);
      setSuccess(`OTP sent successfully to +91 ${cleanPhone}`);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!phoneOtp || phoneOtp.trim().length < 4) {
      setError('Please enter the verification code sent to your mobile.');
      return;
    }

    setLoading(true);
    const { error: verifyError } = await verifyPhoneOtp(phone, phoneOtp);
    setLoading(false);

    if (verifyError) {
      setError(verifyError.message || 'Invalid or expired OTP code. Please try again.');
    } else {
      setSuccess('Verification successful! Logging you in...');
      setTimeout(() => {
        navigate(redirectUrl);
      }, 600);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-blue-50 text-[#002B49] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            Welcome to Canvas India
          </span>
          <h2 className="text-3xl font-extrabold text-[#002B49] tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-semibold text-[#002B49] hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          
          {/* 1. GOOGLE 1-CLICK SIGN IN */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-xs text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002B49] transition disabled:opacity-50 cursor-pointer"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* DIVIDER */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* 2 TABS: PHONE NUMBER (STANDARD E-COMMERCE) OR EMAIL */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('phone');
                setError(null);
                setSuccess(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'phone'
                  ? 'bg-white text-[#002B49] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('email');
                setError(null);
                setSuccess(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-white text-[#002B49] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email &amp; Password</span>
            </button>
          </div>

          {/* ALERT MESSAGES */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm flex items-start gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: PHONE NUMBER LOGIN */}
          {activeTab === 'phone' && (
            <div>
              {!otpSent ? (
                <form className="space-y-4" onSubmit={handleSendPhoneOtp}>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative rounded-lg shadow-xs flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm font-semibold select-none">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhone(val);
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-[#002B49] focus:border-transparent outline-none transition"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-500">
                      We will send a 6-digit verification code to your phone.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.replace(/\D/g, '').length !== 10}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#002B49] hover:bg-[#001f35] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002B49] disabled:opacity-50 transition cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleVerifyPhoneOtp}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setPhoneOtp('');
                          setError(null);
                        }}
                        className="text-xs text-[#002B49] font-medium hover:underline cursor-pointer"
                      >
                        Change number
                      </button>
                    </div>

                    <div className="relative rounded-lg shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        maxLength={8}
                        autoFocus
                        required
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="Enter OTP code"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm tracking-widest font-mono focus:ring-2 focus:ring-[#002B49] focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Sent to +91 {phone}</span>
                      {timer > 0 ? (
                        <span className="text-gray-500">Resend in {timer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendPhoneOtp()}
                          className="text-[#002B49] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneOtp.trim().length === 0}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#002B49] hover:bg-[#001f35] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002B49] disabled:opacity-50 transition cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify &amp; Sign In</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL LOGIN */}
          {activeTab === 'email' && (
            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {!useEmailOtp ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-[#002B49] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#002B49] focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUseEmailOtp(!useEmailOtp);
                    setError(null);
                  }}
                  className="text-[#002B49] font-medium hover:underline cursor-pointer"
                >
                  {useEmailOtp ? 'Use password instead' : 'Log in with Email Link / OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#002B49] hover:bg-[#001f35] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002B49] disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>{useEmailOtp ? 'Send Login Link' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* QUICK GUEST CHECKOUT LINK IF ARRIVING FROM CART */}
          {redirectUrl.includes('checkout') && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-2">Want to finish your order right away?</p>
              <Link
                to="/checkout?guest=true"
                className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Continue as Guest →
              </Link>
            </div>
          )}

          {/* TRUST BADGE */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>100% Secure SSL Encrypted Sign In</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
