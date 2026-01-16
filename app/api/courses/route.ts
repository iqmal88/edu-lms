import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// --- EXISTING GET FUNCTION (Keep this) ---
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await prisma.course.findMany({
    include: {
      educator: { select: { email: true } },
      enrollments: { select: { userId: true } },
    },
  });

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    educator: course.educator,
    isEnrolled:
      session.user.role === "LEARNER"
        ? course.enrollments.some((e) => e.userId === session.user.id)
        : false,
  }));

  return NextResponse.json(formattedCourses);
}

// --- NEW POST FUNCTION (Add this to fix the 405 error) ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Check if user is logged in
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if the user is an EDUCATOR (Optional but recommended)
    if (session.user.role !== "EDUCATOR") {
      return NextResponse.json({ error: "Only educators can create courses" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description } = body;

    // 3. Basic validation
    if (!title || !description) {
      return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    }

    // 4. Create the course in the database
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        educatorId: session.user.id, // Links the course to the logged-in educator
      },
    });

    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error("CREATE_COURSE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}