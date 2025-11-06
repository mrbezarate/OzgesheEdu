import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { signAuthToken } from "@/lib/auth";
import { toPublicUser } from "@/lib/dto";
import { comparePassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user || !(await comparePassword(payload.password, user.passwordHash))) {
      throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
    }

    if (!user.isActive) {
      throw Object.assign(new Error("Account disabled"), { statusCode: 403 });
    }

    const token = signAuthToken({ sub: user.id, role: user.role });

    return jsonOk({ token, user: toPublicUser(user) });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to sign in",
      status: 400,
      code: "LOGIN_FAILED",
    });
  }
}
