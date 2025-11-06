import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });

    const enrollments = await prisma.enrollment.findMany({
      where:
        user.role === Role.ADMIN
          ? {}
          : {
              OR: [
                { teacherId: user.id },
                { course: { createdById: user.id } },
              ],
            },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, level: true } },
      },
      orderBy: { purchasedAt: "desc" },
    });

    return jsonOk({ enrollments });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load teacher enrollments",
      status: 400,
      code: "TEACHER_ENROLLMENTS_FAILED",
    });
  }
}
