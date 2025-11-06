import { Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;

    const user = await prisma.user.update({
      where: { id },
      data: payload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to update user",
      status: 400,
      code: "ADMIN_USER_UPDATE_FAILED",
    });
  }
}
