"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("LEARNER");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Registration successful");
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-50 blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-[35%] h-[35%] rounded-full bg-blue-50 blur-3xl" />
      </div>

      <div className="w-full max-w-[480px] space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-500 font-medium">
            Join the Edu Fairuzullah LMS community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          <div className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

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
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("LEARNER")}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    role === "LEARNER"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  Learner
                </button>
                <button
                  type="button"
                  onClick={() => setRole("EDUCATOR")}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    role === "EDUCATOR"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  Educator
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-indigo-600 py-3.5 text-white font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-bold hover:text-indigo-700 underline-offset-4 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-slate-400 font-medium">
          By registering, you agree to our Terms and Conditions.
        </p>
      </div>
    </div>
  );
}