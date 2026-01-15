"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] p-6 selection:bg-indigo-100">
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      <div className="w-full max-w-[460px]">
        {/* Brand Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 shadow-2xl shadow-slate-200 rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-white text-3xl font-black italic">EF</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              Welcome Back
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
              Edu Fairuzullah LMS
            </p>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/40 p-10 md:p-12">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-[11px] text-red-600 text-center font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full rounded-[1.5rem] bg-indigo-600 py-4.5 py-4 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.96] transition-all disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm font-medium text-slate-400">
              New here?{" "}
              <Link
                href="/register"
                className="text-slate-900 font-black hover:text-indigo-600 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Designed by iqmal hafiy
          </p>
        </div>
      </div>
    </div>
  );
}