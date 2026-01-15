import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Ideally, move this to a lib/prisma.ts file
const prisma = new PrismaClient();

// --- Response Helpers ---
const success = (data: any, status = 200) => NextResponse.json(data, { status });
const error = (message: string, status = 500) => NextResponse.json({ error: message }, { status });

// --- Route Handlers ---

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isLearner = session?.user?.role === "LEARNER";

    const courses = await prisma.course.findMany({
      include: {
        educator: true,
        enrollments: isLearner 
          ? { where: { userId: session.user.id } } 
          : false,
      },
    });

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      educator: course.educator.email,
      isEnrolled: !!course.enrollments?.length,
    }));

    return success(formattedCourses);
  } catch (err) {
    console.error("GET_COURSES_ERROR:", err);
    return error("Failed to fetch courses");
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authorization Guard
    if (!session || session.user.role !== "EDUCATOR") {
      return error("Forbidden: Educator access required", 403);
    }

    // 2. Data Extraction
    const body = await req.json();
    const { title, description } = body;

    // 3. Simple Validation
    if (!title || !description) {
      return error("Missing title or description", 400);
    }

    // 4. Database Operation
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        educatorId: session.user.id,
      },
    });

    return success(newCourse, 201);
  } catch (err) {
    console.error("POST_COURSE_ERROR:", err);
    return error("Failed to create course");
  }
}