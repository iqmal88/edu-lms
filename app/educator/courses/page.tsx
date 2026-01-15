"use client";

import { useEffect, useState } from "react";

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

  async function loadCourses() {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function createCourse() {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    loadCourses();
  }

  async function deleteCourse(id: string) {
    await fetch(`/api/courses/${id}`, {
      method: "DELETE",
    });

    loadCourses();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Courses
          </h1>
          <p className="mt-2 text-gray-500">
            Create and manage your courses
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Create Course Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create New Course
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            />

            <input
              placeholder="Course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          <button
            onClick={createCourse}
            className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-white font-semibold hover:bg-indigo-700"
          >
            Create Course
          </button>
        </div>

        {/* Course List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Your Courses
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-500">You haven’t created any courses yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {course.description}
                  </p>

                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="mt-4 inline-block rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
