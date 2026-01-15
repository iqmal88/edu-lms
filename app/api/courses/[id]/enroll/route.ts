import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "LEARNER") {
    return NextResponse.json(
      { error: "Only learners can enroll" },
      { status: 403 }
    );
  }

  const { id: courseId } = await context.params;

  await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  });

  return NextResponse.json({ success: true });
}
