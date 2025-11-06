import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error, {
      message: "Not authenticated",
      status: 401,
      code: "UNAUTHORIZED",
    });
  }
}
