"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EnrolledCourse = {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastAccessed: string;
};

export default function MyLearningPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>

      {courses.length === 0 ? (
        <p>No enrolled courses.</p>
      ) : (
        courses.map((course) => (
          <div key={course.id} className="mb-4 p-6 bg-white rounded-xl shadow">
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.description}</p>
            <Link
              href={`/courses/${course.id}`}
              className="text-indigo-600 font-bold mt-2 inline-block"
            >
              Continue →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
