import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRY = "7d";

type TokenPayload = {
  sub: string;
  role: Role;
};

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function signAuthToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export async function requireAuth(
  request: NextRequest,
  options?: { roles?: Role[] },
): Promise<AuthenticatedUser> {
  const header = request.headers.get("authorization");
  if (!header) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  const [, token] = header.split(" ");
  if (!token) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  let payload: TokenPayload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    throw Object.assign(new Error("Invalid token"), { statusCode: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw Object.assign(new Error("Account disabled"), { statusCode: 401 });
  }

  if (options?.roles && !options.roles.includes(user.role)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function getOptionalUser(
  request: NextRequest,
): Promise<AuthenticatedUser | null> {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const [, token] = header.split(" ");
  if (!token) return null;
  try {
    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
    if (!user || !user.isActive) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}
