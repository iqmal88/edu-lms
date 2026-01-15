"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
  educator?: { email: string };
  isEnrolled?: boolean;
};

export default function LearnerCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);

    const res = await fetch(`/api/courses/${courseId}/enroll`, {
      method: "POST",
    });

    if (res.ok) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, isEnrolled: true } : c
        )
      );
    }

    setEnrollingId(null);
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-10 grid grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold">{course.title}</h3>
          <p className="text-sm text-gray-500">{course.description}</p>

          {course.isEnrolled ? (
            <Link
              href="/my-learning"
              className="block mt-4 text-center bg-green-600 text-white py-2 rounded"
            >
              Enrolled
            </Link>
          ) : (
            <button
              onClick={() => handleEnroll(course.id)}
              disabled={enrollingId === course.id}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded"
            >
              {enrollingId === course.id ? "Enrolling..." : "Enroll"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
