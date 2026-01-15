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

  const enrollments: Prisma.EnrollmentGetPayload<{
    include: {
      course: true;
    };
  }>[] = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: true,
    },
  });

  const courses = enrollments.map((e) => e.course);

  return NextResponse.json(courses);
}
