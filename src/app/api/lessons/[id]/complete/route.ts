import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { progressUpdateSchema } from "@/lib/validators/enrollments";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.STUDENT] });
    const payload = progressUpdateSchema.parse(await request.json());
    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { id: true, courseId: true },
    });

    if (!lesson) {
      return jsonOk({ message: "Lesson not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: lesson.courseId,
        },
      },
      select: { id: true },
    });

    if (!enrollment) {
      throw Object.assign(new Error("You are not enrolled in this course"), {
        statusCode: 403,
      });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
      update: {
        homeworkAnswer: payload.homeworkAnswer,
        isCompleted: payload.isCompleted ?? true,
        submittedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        homeworkAnswer: payload.homeworkAnswer,
        isCompleted: payload.isCompleted ?? true,
        submittedAt: new Date(),
      },
    });

    return jsonOk({ progress });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to submit homework",
      status: 400,
      code: "LESSON_PROGRESS_FAILED",
    });
  }
}
