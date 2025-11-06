import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.STUDENT] });

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
        lessonProgress: true,
      },
      orderBy: { purchasedAt: "desc" },
    });

    return jsonOk({
      enrollments: enrollments.map((enrollment) => {
        const completed = enrollment.lessonProgress.filter((p) => p.isCompleted).length;
        const total = enrollment.course.lessons.length;
        return {
          id: enrollment.id,
          status: enrollment.status,
          purchasedAt: enrollment.purchasedAt,
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            level: enrollment.course.level,
            progress: total ? Math.round((completed / total) * 100) : 0,
            completedLessons: completed,
            totalLessons: total,
          },
        };
      }),
    });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load enrollments",
      status: 400,
      code: "ENROLLMENTS_FETCH_FAILED",
    });
  }
}
