import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scheduleSlotSchema } from "@/lib/validators/schedule";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });

    const slots = await prisma.scheduleSlot.findMany({
      where: user.role === Role.ADMIN ? {} : { teacherId: user.id },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true, orderIndex: true } },
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    return jsonOk({ schedule: slots });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load schedule",
      status: 400,
      code: "SCHEDULE_FETCH_FAILED",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const payload = scheduleSlotSchema.parse(await request.json());

    const course = await prisma.course.findUnique({
      where: { id: payload.courseId },
      select: { id: true, createdById: true },
    });

    if (!course) {
      return jsonOk({ message: "Course not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && course.createdById !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    if (payload.lessonId) {
      const lesson = await prisma.lesson.findFirst({
        where: { id: payload.lessonId, courseId: payload.courseId },
        select: { id: true },
      });
      if (!lesson) {
        throw Object.assign(new Error("Lesson not part of this course"), {
          statusCode: 400,
        });
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

    const slot = await prisma.scheduleSlot.create({
      data: {
        teacherId: user.role === Role.ADMIN ? course.createdById : user.id,
        courseId: payload.courseId,
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

    return jsonOk(slot, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to create schedule slot",
      status: 400,
      code: "SCHEDULE_CREATE_FAILED",
    });
  }
}
