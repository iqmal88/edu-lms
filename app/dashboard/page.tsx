"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-600 font-medium">You are not logged in</p>
      </div>
    );
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-xs">EF</span>
              </div>
              <span className="font-bold text-slate-900 tracking-tight hidden sm:block">
                Edu Fairuzullah
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-slate-500 mt-1">{session.user.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl bg-slate-50 px-4 py-2 text-slate-600 text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Welcome back! Here is what’s happening with your account.
              </p>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2" />
              Role: {role}
            </div>
          </div>
        </header>

        {/* Action Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Common Card */}
          <DashboardCard
            title="Browse Courses"
            description="Explore our library of curated learning materials."
            link="/courses"
            icon="📚"
            accent="indigo"
          />

          {/* Educator Only */}
          {role === "EDUCATOR" && (
            <DashboardCard
              title="Manage Courses"
              description="Create new content or update existing lectures."
              link="/educator/courses"
              icon="🛠️"
              accent="emerald"
            />
          )}

          {/* Learner Only */}
          {role === "LEARNER" && (
            <DashboardCard
              title="My Learning"
              description="Pick up exactly where you left off last time."
              link="/courses"
              icon="🎯"
              accent="blue"
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* Reusable Card Component */
function DashboardCard({
  title,
  description,
  link,
  icon,
  accent,
}: {
  title: string;
  description: string;
  link: string;
  icon: string;
  accent: "indigo" | "emerald" | "blue" | "slate";
}) {
  const accents = {
    indigo: "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700",
    emerald: "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700",
    blue: "bg-blue-600 shadow-blue-200 hover:bg-blue-700",
    slate: "bg-slate-700 shadow-slate-200 hover:bg-slate-800",
  };

  return (
    <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-slate-500 text-sm font-medium leading-relaxed">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between">
        <Link
          href={link}
          className={`inline-flex items-center px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg ${accents[accent]}`}
        >
          Open Panel
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}