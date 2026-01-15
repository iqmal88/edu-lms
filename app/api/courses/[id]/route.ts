import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/* =======================
   UPDATE COURSE (EDIT)
======================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const { title, description } = await req.json();

  // Ensure educator owns the course
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course || course.educatorId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const updated = await prisma.course.update({
    where: { id },
    data: { title, description },
  });

  return NextResponse.json(updated);
}

/* =======================
   DELETE COURSE
======================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  // Ensure educator owns the course
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course || course.educatorId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // 🔥 IMPORTANT: delete enrollments first
  await prisma.enrollment.deleteMany({
    where: { courseId: id },
  });

  await prisma.course.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
