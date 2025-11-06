import { EnrollmentStatus, Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.STUDENT] });
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, role: true } } },
    });

    if (!course || (!course.isPublished && user.role !== Role.ADMIN)) {
      return jsonOk({ message: "Course not available" }, { status: 404 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existing) {
      throw Object.assign(new Error("Already enrolled"), { statusCode: 409 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: user.id,
        courseId: course.id,
        teacherId: course.createdBy?.role === Role.TEACHER ? course.createdBy.id : null,
        status: EnrollmentStatus.ACTIVE,
      },
      include: {
        course: true,
      },
    });

    return jsonOk(enrollment, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to enroll",
      status: 400,
      code: "ENROLLMENT_FAILED",
    });
  }
}
