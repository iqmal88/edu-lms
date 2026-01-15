import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses: Prisma.CourseGetPayload<{
    include: {
      educator: {
        select: {
          email: true;
        };
      };
      enrollments: {
        select: {
          userId: true;
        };
      };
    };
  }>[] = await prisma.course.findMany({
    include: {
      educator: {
        select: { email: true },
      },
      enrollments: {
        select: { userId: true },
      },
    },
  });

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    educator: course.educator,
    isEnrolled:
    session.user.role === "LEARNER"
      ? course.enrollments.some(
          (e: { userId: string }) => e.userId === session.user.id
        )
      : false,
  }));

  return NextResponse.json(formattedCourses);
}
