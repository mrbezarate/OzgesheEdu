import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scheduleSlotSchema } from "@/lib/validators/schedule";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const payload = scheduleSlotSchema.partial().parse(await request.json());
    const { id } = await context.params;

    const slot = await prisma.scheduleSlot.findUnique({
      where: { id },
      select: { id: true, teacherId: true, courseId: true },
    });

    if (!slot) {
      return jsonOk({ message: "Slot not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && slot.teacherId !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    if (payload.lessonId) {
      const belongs = await prisma.lesson.findFirst({
        where: { id: payload.lessonId, courseId: payload.courseId ?? slot.courseId },
        select: { id: true },
      });
      if (!belongs) {
        throw Object.assign(new Error("Lesson not part of course"), { statusCode: 400 });
      }
    }

    if (payload.studentId) {
      const student = await prisma.user.findFirst({
        where: { id: payload.studentId, role: Role.STUDENT },
        select: { id: true },
      });
      if (!student) {
        throw Object.assign(new Error("Student not found"), { statusCode: 400 });
      }
    }

    const updated = await prisma.scheduleSlot.update({
      where: { id },
      data: {
        courseId: payload.courseId ?? slot.courseId,
        lessonId: payload.lessonId,
        studentId: payload.studentId,
        date: payload.date,
        durationMinutes: payload.durationMinutes,
        description: payload.description,
        onlineLink: payload.onlineLink,
      },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
        student: { select: { id: true, name: true } },
      },
    });

    return jsonOk(updated);
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to update schedule",
      status: 400,
      code: "SCHEDULE_UPDATE_FAILED",
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

    const slot = await prisma.scheduleSlot.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!slot) {
      return jsonOk({ message: "Slot not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && slot.teacherId !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    await prisma.scheduleSlot.delete({ where: { id } });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to delete schedule slot",
      status: 400,
      code: "SCHEDULE_DELETE_FAILED",
    });
  }
}
