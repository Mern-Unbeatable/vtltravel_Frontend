import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted. Email:", email);
    setIsLoading(true);

    try {
      await login(email, password);
      console.log("Login successful! Navigating to /admin");
      navigate("/admin");
    } catch (err) {
      console.error("Login component caught error:", err);
      const errorMsg = err?.message || (typeof err === "string" ? err : "Authentication failed.");
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col justify-center items-center px-4 relative">
      {/* Background decoration matching home page feel */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

      
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium text-sm"
        >
          <IoArrowBackOutline className="text-lg" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 text-slate-900 rounded-lg pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
