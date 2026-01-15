import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params; // ✅ MUST AWAIT

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(
  enrollments.map((e: { user: { id: string; email: string } }) => e.user)
  );
}
