import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  // ✅ Explicit Prisma typing
  const enrollments: Prisma.EnrollmentGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          email: true;
        };
      };
    };
  }>[] = await prisma.enrollment.findMany({
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
    enrollments.map((e) => ({
      id: e.user.id,
      email: e.user.email,
    }))
  );
}
