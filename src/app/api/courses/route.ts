import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeCourse } from "@/lib/serializers/courses";
import { courseCreateSchema } from "@/lib/validators/courses";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        createdBy: { select: { id: true, name: true } },
        lessons: true,
        group: { select: { id: true, name: true, subject: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({ courses: courses.map(serializeCourse) });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to fetch courses",
      status: 500,
      code: "COURSES_FETCH_FAILED",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const payload = courseCreateSchema.parse(await request.json());

    const group = await prisma.courseGroup.findUnique({
      where: { id: payload.groupId },
      select: { id: true, name: true, subject: true },
    });

    if (!group) {
      throw Object.assign(new Error("Course group not found"), { statusCode: 404 });
    }

    if (group.subject !== payload.subject) {
      throw Object.assign(new Error("Course subject must match the group subject"), { statusCode: 400 });
    }

    if (user.role === Role.TEACHER && !user.subjects?.includes(payload.subject)) {
      throw Object.assign(new Error("Subject not permitted for this teacher"), { statusCode: 403 });
    }

    const course = await prisma.course.create({
      data: {
        title: payload.title,
        description: payload.description,
        level: payload.level,
        subject: payload.subject,
        price: payload.price.toFixed(2),
        isPublished: payload.isPublished ?? false,
        createdById: user.id,
        groupId: group.id,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        lessons: true,
        group: { select: { id: true, name: true, subject: true, description: true } },
      },
    });

    return jsonOk(serializeCourse(course), { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to create course",
      status: 400,
      code: "COURSE_CREATE_FAILED",
    });
  }
}
