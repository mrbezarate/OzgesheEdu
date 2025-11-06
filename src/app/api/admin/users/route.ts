import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return jsonOk({ users });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load users",
      status: 400,
      code: "ADMIN_USERS_FAILED",
    });
  }
}
