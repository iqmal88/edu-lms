import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "LEARNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId: context.params.id,
    },
  });

  return NextResponse.json({ success: true });
}
