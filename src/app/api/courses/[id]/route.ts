import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { getOptionalUser, requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeCourse } from "@/lib/serializers/courses";
import { courseUpdateSchema } from "@/lib/validators/courses";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getOptionalUser(request);
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        lessons: { orderBy: { orderIndex: "asc" } },
      },
    });

    if (!course) {
      return jsonOk({ message: "Course not found" }, { status: 404 });
    }

    if (!course.isPublished && user?.role !== Role.ADMIN && user?.id !== course.createdById) {
      return jsonOk({ message: "Course not available" }, { status: 404 });
    }

    let progressMap = new Map<string, { isCompleted: boolean }>();

    if (user && user.role === Role.STUDENT) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.id,
          },
        },
        include: {
          lessonProgress: true,
        },
      });

      if (enrollment) {
        progressMap = new Map(
          enrollment.lessonProgress.map((item) => [item.lessonId, { isCompleted: item.isCompleted }]),
        );
      }
    }

    return jsonOk({
      course: {
        ...serializeCourse(course),
        lessons: course.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          orderIndex: lesson.orderIndex,
          videoUrl: lesson.videoUrl,
          homeworkText: lesson.homeworkText,
          attachmentUrl: lesson.attachmentUrl,
          isCompleted: progressMap.get(lesson.id)?.isCompleted ?? false,
        })),
      },
    });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load course",
      status: 400,
      code: "COURSE_FETCH_FAILED",
    });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(request, { roles: [Role.TEACHER, Role.ADMIN] });
    const payload = courseUpdateSchema.parse(await request.json());
    const { id } = await context.params;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return jsonOk({ message: "Course not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && course.createdById !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title: payload.title ?? course.title,
        description: payload.description ?? course.description,
        level: payload.level ?? course.level,
        price: payload.price !== undefined ? payload.price.toFixed(2) : course.price,
        isPublished: payload.isPublished ?? course.isPublished,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        lessons: { orderBy: { orderIndex: "asc" } },
      },
    });

    return jsonOk(serializeCourse(updated));
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to update course",
      status: 400,
      code: "COURSE_UPDATE_FAILED",
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

    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, createdById: true },
    });

    if (!course) {
      return jsonOk({ message: "Course not found" }, { status: 404 });
    }

    if (user.role !== Role.ADMIN && course.createdById !== user.id) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    await prisma.course.delete({ where: { id } });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to delete course",
      status: 400,
      code: "COURSE_DELETE_FAILED",
    });
  }
}
