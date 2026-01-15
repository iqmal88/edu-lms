"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Student = {
  id: string;
  email: string;
};

export default function StudentsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "EDUCATOR") {
      router.replace("/dashboard");
      return;
    }

    fetch(`/api/courses/${id}/students`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  }, [session, status, id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfd]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Syncing Roster</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      {/* STICKY HEADER */}
      <div className="bg-white border-b border-slate-200/60 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <Link 
              href={`/educator/courses/${id}`} 
              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-1"
            >
              ← Back to Settings
            </Link>
            <h1 className="text-3xl font-black tracking-tighter mt-1">Enrolled Students</h1>
          </div>
          
          <div className="flex items-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Total: {students.length}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        {students.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-20 text-center">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-slate-900 font-black text-lg">No students yet</p>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              Once learners enroll in your course, they will appear here automatically.
            </p>
          </div>
        ) : (
          <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Student
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Email Address
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((s) => (
                    <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                            {s.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                            {s.email.split('@')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-slate-500 italic">
                          {s.email}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                          Unenroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Showing {students.length} active learners
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}