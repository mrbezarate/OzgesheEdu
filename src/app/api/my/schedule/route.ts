import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.STUDENT] });

    const schedule = await prisma.scheduleSlot.findMany({
      where: { studentId: user.id, date: { gte: new Date() } },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true, orderIndex: true } },
        teacher: { select: { id: true, name: true } },
      },
      orderBy: { date: "asc" },
      take: 6,
    });

    return jsonOk({ schedule });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load schedule",
      status: 400,
      code: "MY_SCHEDULE_FAILED",
    });
  }
}
