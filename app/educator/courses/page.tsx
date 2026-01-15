"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
};

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  async function loadCourses() {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function createCourse() {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    setIsCreating(false);
    loadCourses();
  }

  async function deleteCourse(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    await fetch(`/api/courses/${id}`, {
      method: "DELETE",
    });
    loadCourses();
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Manage Courses</h1>
            <p className="text-slate-500 text-sm font-medium">Create and oversee your curriculum</p>
          </div>
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-black hover:bg-white transition-all"
          >
            BACK TO DASHBOARD
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: CREATE COURSE FORM */}
        <section className="lg:col-span-4">
          <div className="sticky top-32 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black tracking-tight mb-6">Create New Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                <input
                  placeholder="e.g. Mastering Next.js"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea
                  placeholder="What will students learn?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full mt-1 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={createCourse}
                disabled={isCreating}
                className="w-full mt-4 rounded-2xl bg-indigo-600 px-6 py-4 text-white text-sm font-black hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {isCreating ? "CREATING..." : "PUBLISH COURSE"}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: COURSE LIST */}
        <section className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Your Courses</h2>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">
              Total: {courses.length}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
               {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-[2.5rem] bg-slate-100 animate-pulse" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-20 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-slate-900 font-black text-lg">No courses yet</p>
              <p className="text-slate-400 text-sm mt-1">Start by filling out the form on the left.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                      {course.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    <Link
                      href={`/educator/courses/${course.id}`}
                      className="flex-1 text-center py-3 rounded-xl bg-slate-50 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Edit Details
                    </Link>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-3 rounded-xl bg-white border border-slate-100 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}