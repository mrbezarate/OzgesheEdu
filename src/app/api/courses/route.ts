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

    const course = await prisma.course.create({
      data: {
        title: payload.title,
        description: payload.description,
        level: payload.level,
        price: payload.price.toFixed(2),
        isPublished: payload.isPublished ?? false,
        createdById: user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        lessons: true,
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
