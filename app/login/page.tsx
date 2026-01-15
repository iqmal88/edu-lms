"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-3xl" />
      </div>

      <div className="w-full max-w-[440px] space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-xl shadow-indigo-200">
            <span className="text-white text-3xl font-bold">EF</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-medium">
            Edu Fairuzullah LMS
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs text-red-600 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-white font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
            >
              Sign In
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500">
              New to the platform?{" "}
              <Link
                href="/register"
                className="text-indigo-600 font-bold hover:text-indigo-700 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} iqmal hafiy yang buat
        </p>
      </div>
    </div>
  );
}