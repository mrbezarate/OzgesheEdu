import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.STUDENT] });
    const { id } = await context.params;

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id,
        studentId: user.id,
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      return jsonOk({ message: "Enrollment not found" }, { status: 404 });
    }

    const progressMap = new Map(
      enrollment.lessonProgress.map((item) => [item.lessonId, item]),
    );

    return jsonOk({
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        purchasedAt: enrollment.purchasedAt,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          level: enrollment.course.level,
          lessons: enrollment.course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            orderIndex: lesson.orderIndex,
            videoUrl: lesson.videoUrl,
            homeworkText: lesson.homeworkText,
            attachmentUrl: lesson.attachmentUrl,
            progress: progressMap.get(lesson.id)
              ? {
                  isCompleted: progressMap.get(lesson.id)?.isCompleted ?? false,
                  homeworkAnswer: progressMap.get(lesson.id)?.homeworkAnswer ?? null,
                  submittedAt: progressMap.get(lesson.id)?.submittedAt ?? null,
                }
              : {
                  isCompleted: false,
                  homeworkAnswer: null,
                  submittedAt: null,
                },
          })),
        },
      },
    });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load enrollment",
      status: 400,
      code: "ENROLLMENT_FETCH_FAILED",
    });
  }
}
