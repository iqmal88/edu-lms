import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json([]);

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: { include: { educator: true } },
    },
  });

  return NextResponse.json(
    enrollments.map((e) => ({
      id: e.course.id,
      title: e.course.title,
      description: e.course.description,
      educator: e.course.educator,
      progress: 0,
      lastAccessed: "Today",
    }))
  );
}
