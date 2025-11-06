import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { signAuthToken } from "@/lib/auth";
import { toPublicUser } from "@/lib/dto";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = registerSchema.parse(await request.json());

    if (payload.role === Role.ADMIN) {
      throw Object.assign(new Error("Cannot self-register as admin"), {
        statusCode: 403,
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (existing) {
      throw Object.assign(new Error("Email already registered"), {
        statusCode: 409,
      });
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash: await hashPassword(payload.password),
        role: payload.role ?? Role.STUDENT,
      },
    });

    const token = signAuthToken({ sub: user.id, role: user.role });

    return jsonOk(
      {
        token,
        user: toPublicUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to register",
      status: 400,
      code: "REGISTRATION_FAILED",
    });
  }
}
