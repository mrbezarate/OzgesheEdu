import { Subject, User } from "@prisma/client";

export function toPublicUser(
  user: Pick<User, "id" | "name" | "email" | "role" | "createdAt" | "updatedAt" | "subjects">,
) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    subjects: user.subjects ?? ([] as Subject[]),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
