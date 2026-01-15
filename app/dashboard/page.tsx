"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-100"></div>
            <div className="absolute inset-0 rounded-xl border-t-2 border-indigo-600 animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Syncing Data</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200">
              <span className="text-white font-black italic text-sm">EF</span>
            </div>
            <span className="font-black text-xl tracking-tighter hidden sm:block">EduFairuz</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">{session.user.name}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-black hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 shadow-sm"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-500 text-lg font-medium">
                Welcome back, <span className="text-slate-900 font-bold">{session.user.name}</span>.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4">
              {role === "EDUCATOR" && (
                <Link
                  href="/educator/courses/new"
                  className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span className="text-lg">+</span> Create New Course
                </Link>
              )}
              <div className="hidden md:flex items-center px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Action Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Browse Courses"
            description="Explore our library of curated learning materials and master new skills."
            link="/courses"
            icon="📚"
          />

          {role === "LEARNER" && (
            <DashboardCard
              title="My Learning"
              description="Continue your education and view your personal progress and certificates."
              link="/courses"
              icon="🎯"
            />
          )}

          {role === "EDUCATOR" && (
            <DashboardCard
              title="Course Management"
              description="Update your existing curriculum, manage students, and view analytics."
              link="/educator/courses"
              icon="🛠️"
            />
          )}

          {/* Dynamic Info Card */}
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col justify-between shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Notification</p>
              <h3 className="text-2xl font-black mt-2 leading-tight">
                {role === "EDUCATOR" ? "Ready to teach?" : "Ready to learn?"}
              </h3>
              <p className="text-slate-400 text-xs mt-2">Check your latest notifications and messages.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
  icon,
}: {
  title: string;
  description: string;
  link: string;
  icon: string;
}) {
  return (
    <div className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-1">
        {description}
      </p>

      <Link
        href={link}
        className="inline-flex items-center justify-center w-full py-4 rounded-2xl bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
      >
        Enter Panel
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}