import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });
    const { id } = await context.params;

    const group = await prisma.courseGroup.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } },
    });

    if (!group) {
      return jsonOk({ message: "Course group not found" }, { status: 404 });
    }

    if (group._count.courses > 0) {
      throw Object.assign(new Error("Course group still has linked courses"), { statusCode: 400 });
    }

    await prisma.courseGroup.delete({ where: { id } });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to delete course group",
      status: 400,
      code: "COURSE_GROUP_DELETE_FAILED",
    });
  }
}
