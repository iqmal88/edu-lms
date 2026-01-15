import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  const courses = await prisma.course.findMany({
    include: {
      educator: true,
      enrollments: session
        ? { where: { userId: session.user.id } }
        : false,
    },
  });

  return NextResponse.json(
    courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      educator: course.educator,
      isEnrolled: course.enrollments?.length > 0,
    }))
  );
}
