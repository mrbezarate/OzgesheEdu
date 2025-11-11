import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });

    const courses = await prisma.course.findMany({
      where: user.role === Role.ADMIN ? {} : { createdById: user.id },
      include: {
        lessons: true,
        enrollments: true,
        group: { select: { id: true, name: true, subject: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({
      courses: courses.map((course) => ({
        id: course.id,
        createdById: course.createdById,
        createdAt: course.createdAt,
        title: course.title,
        description: course.description,
        level: course.level,
        subject: course.subject,
        price: Number(course.price),
        isPublished: course.isPublished,
        group: course.group,
        lessons: [...course.lessons].sort((a, b) => a.orderIndex - b.orderIndex),
        enrollmentCount: course.enrollments.length,
      })),
    });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load teacher courses",
      status: 400,
      code: "TEACHER_COURSES_FAILED",
    });
  }
}
