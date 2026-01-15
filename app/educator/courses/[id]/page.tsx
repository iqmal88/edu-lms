"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EducatorCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "EDUCATOR") {
      router.replace("/dashboard");
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch("/api/educator/courses");
        const courses = await res.json();
        const course = courses.find((c: any) => c.id === id);

        if (!course) {
          router.replace("/educator/courses");
        } else {
          setForm({ title: course.title, description: course.description });
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load course");
      }
    };

    fetchCourse();
  }, [session, status, id, router]);

  const handleUpdate = async () => {
    setIsSaving(true);
    const res = await fetch(`/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setIsSaving(false);

    if (res.ok) {
      alert("Changes saved successfully!");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will permanently delete the course.")) return;

    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/educator/courses");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfd]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading Settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      {/* HEADER AREA */}
      <div className="bg-white border-b border-slate-200/60 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <Link 
              href="/educator/courses" 
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-1"
            >
              ← Back to List
            </Link>
            <h1 className="text-3xl font-black tracking-tighter mt-1">Course Settings</h1>
          </div>
          
          <button
            onClick={() => router.push(`/educator/courses/${id}/students`)}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
          >
            Manage Enrollment
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 gap-10">
        
        {/* EDIT SECTION */}
        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
          <div className="mb-10">
            <h2 className="text-xl font-black tracking-tight">General Information</h2>
            <p className="text-slate-500 text-sm font-medium">Update the public details of your course curriculum.</p>
          </div>

          <div className="space-y-8">
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">
                Course Title
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all group-focus-within:bg-white"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Advanced Architecture"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">
                Course Description
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none min-h-[160px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What can students expect from this course?"
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                disabled={isSaving}
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </section>

        {/* DANGER SECTION */}
        <section className="bg-red-50/30 border border-red-100 rounded-[2.5rem] p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h2 className="text-red-900 font-black text-xl tracking-tight">Danger Zone</h2>
              <p className="text-red-600/70 text-sm font-medium mt-1">
                Once you delete a course, there is no going back. All student progress and data will be permanently wiped.
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="bg-white border border-red-200 text-red-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              Delete Course
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}