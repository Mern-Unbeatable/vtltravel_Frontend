import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline, IoArrowBackOutline } from 'react-icons/io5';

const Login = () => {
  const [email, setEmail] = useState('admin@vtltravel.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      if (email === 'admin@vtltravel.com' && password === 'admin123') {
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin');
      } else {
        setError('Invalid email or password. Use the dummy credentials provided.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col justify-center items-center px-4 relative">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-[var(--color-primary)] font-medium text-sm transition-colors duration-200 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
      >
        <IoArrowBackOutline className="text-lg" />
        Back to Home
      </Link>

      {/* Background decoration matching home page feel */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg flex items-center">
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="admin@vtltravel.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 text-slate-900 rounded-lg pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <IoEyeOffOutline className="text-lg" />
                ) : (
                  <IoEyeOutline className="text-lg" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="inline-block bg-[#f7f8fa] rounded-lg p-3 text-left border border-gray-200/60">
            <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
              Dummy Credentials:
            </span>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p><span className="font-semibold text-gray-700">Email:</span> admin@vtltravel.com</p>
              <p><span className="font-semibold text-gray-700">Password:</span> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
