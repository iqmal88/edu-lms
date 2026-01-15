"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
  isEnrolled?: boolean;
};

export default function CoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  async function enroll(courseId: string) {
    const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
    if (res.ok) {
      router.refresh();
      // Update local state to show enrollment immediately
      setCourses(courses.map(c => c.id === courseId ? { ...c, isEnrolled: true } : c));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="animate-pulse text-slate-400 font-black text-xs uppercase tracking-widest">
          Loading Catalog...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 backdrop-blur-xl px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Course Catalog</h1>
            <p className="text-slate-500 font-medium mt-1">Discover your next skill today.</p>
          </div>
          <Link 
            href="/dashboard" 
            className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-black hover:bg-white transition-all text-center"
          >
            BACK TO DASHBOARD
          </Link>
        </div>
      </header>

      {/* CATALOG GRID */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              {/* Enrollment Badge */}
              {course.isEnrolled && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Joined
                </div>
              )}

              <div className="mb-6 h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📚
              </div>

              <h2 className="text-xl font-black tracking-tight text-slate-900 leading-snug">
                {course.title}
              </h2>
              
              <p className="text-sm text-slate-500 font-medium mt-3 mb-8 line-clamp-3 leading-relaxed flex-1">
                {course.description}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50">
                {session?.user.role === "LEARNER" && (
                  course.isEnrolled ? (
                    <button
                      disabled
                      className="w-full bg-slate-100 text-slate-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Already Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => enroll(course.id)}
                      className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95"
                    >
                      Enroll Now
                    </button>
                  )
                )}

                {session?.user.role === "EDUCATOR" && (
                  <button
                    onClick={() => router.push(`/educator/courses/${course.id}`)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
                  >
                    View / Edit Course
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}