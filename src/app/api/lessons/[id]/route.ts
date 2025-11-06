import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lessonUpdateSchema } from "@/lib/validators/courses";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const payload = lessonUpdateSchema.parse(await request.json());
    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, createdById: true } },
      },
    });

    if (!lesson) {
      return jsonOk({ message: "Lesson not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && lesson.course.createdById !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (payload.orderIndex && payload.orderIndex !== lesson.orderIndex) {
        const total = await tx.lesson.count({ where: { courseId: lesson.courseId } });
        const newIndex = Math.min(Math.max(payload.orderIndex, 1), total);

        if (newIndex < lesson.orderIndex) {
          await tx.lesson.updateMany({
            where: {
              courseId: lesson.courseId,
              orderIndex: {
                gte: newIndex,
                lt: lesson.orderIndex,
              },
            },
            data: { orderIndex: { increment: 1 } },
          });
        } else {
          await tx.lesson.updateMany({
            where: {
              courseId: lesson.courseId,
              orderIndex: {
                gt: lesson.orderIndex,
                lte: newIndex,
              },
            },
            data: { orderIndex: { decrement: 1 } },
          });
        }

        lesson.orderIndex = newIndex;
      }

      return tx.lesson.update({
        where: { id },
        data: {
          title: payload.title ?? lesson.title,
          description: payload.description ?? lesson.description,
          videoUrl: payload.videoUrl ?? lesson.videoUrl,
          homeworkText: payload.homeworkText ?? lesson.homeworkText,
          attachmentUrl: payload.attachmentUrl ?? lesson.attachmentUrl,
          orderIndex: lesson.orderIndex,
        },
      });
    });

    return jsonOk(result);
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to update lesson",
      status: 400,
      code: "LESSON_UPDATE_FAILED",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: { select: { createdById: true } } },
    });

    if (!lesson) {
      return jsonOk({ message: "Lesson not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && lesson.course.createdById !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.lesson.delete({ where: { id } });
      await tx.lesson.updateMany({
        where: {
          courseId: lesson.courseId,
          orderIndex: { gt: lesson.orderIndex },
        },
        data: { orderIndex: { decrement: 1 } },
      });
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to delete lesson",
      status: 400,
      code: "LESSON_DELETE_FAILED",
    });
  }
}
