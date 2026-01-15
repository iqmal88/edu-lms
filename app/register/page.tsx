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
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] p-6 selection:bg-indigo-100">
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-50/50 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      <div className="w-full max-w-[500px]">
        {/* Brand Header */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Join the Edu Fairuzullah community
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/40 p-10 md:p-12">
          <div className="space-y-6">
            
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

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
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Register as
              </label>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100">
                <button
                  type="button"
                  onClick={() => setRole("LEARNER")}
                  className={`py-3 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                    role === "LEARNER"
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Learner
                </button>
                <button
                  type="button"
                  onClick={() => setRole("EDUCATOR")}
                  className={`py-3 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                    role === "EDUCATOR"
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-400 hover:text-slate-600"
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
              className="w-full mt-4 rounded-[1.5rem] bg-indigo-600 py-4.5 py-4 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.96] transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm font-medium text-slate-400">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-slate-900 font-black hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-relaxed max-w-[300px] mx-auto">
            © {new Date().getFullYear()} Designed with 🖤 by iqmal hafiy
          </p>
        </div>
      </div>
    </div>
  );
}