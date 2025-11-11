import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseGroupSchema } from "@/lib/validators/courses";

export async function GET() {
  try {
    const groups = await prisma.courseGroup.findMany({
      include: { _count: { select: { courses: true } } },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ groups });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to fetch course groups",
      status: 500,
      code: "COURSE_GROUPS_FETCH_FAILED",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });
    const payload = courseGroupSchema.parse(await request.json());

    const group = await prisma.courseGroup.create({ data: payload });
    return jsonOk(group, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to create course group",
      status: 400,
      code: "COURSE_GROUP_CREATE_FAILED",
    });
  }
}
