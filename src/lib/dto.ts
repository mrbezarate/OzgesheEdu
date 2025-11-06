import { User } from "@prisma/client";

export function toPublicUser(user: Pick<User, "id" | "name" | "email" | "role" | "createdAt" | "updatedAt">) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
