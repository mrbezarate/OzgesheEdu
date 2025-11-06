import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lessonCreateSchema } from "@/lib/validators/courses";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const payload = lessonCreateSchema.parse(await request.json());
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { lessons: { orderBy: { orderIndex: "asc" } } },
    });

    if (!course) {
      return jsonOk({ message: "Course not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && course.createdById !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    const orderIndex = payload.orderIndex ?? course.lessons.length + 1;

    const lesson = await prisma.$transaction(async (tx) => {
      await tx.lesson.updateMany({
        where: {
          courseId: course.id,
          orderIndex: { gte: orderIndex },
        },
        data: {
          orderIndex: { increment: 1 },
        },
      });

      return tx.lesson.create({
        data: {
          courseId: course.id,
          orderIndex,
          title: payload.title,
          description: payload.description,
          videoUrl: payload.videoUrl,
          homeworkText: payload.homeworkText,
          attachmentUrl: payload.attachmentUrl,
        },
      });
    });

    return jsonOk(lesson, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to create lesson",
      status: 400,
      code: "LESSON_CREATE_FAILED",
    });
  }
}
