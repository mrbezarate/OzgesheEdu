import { LessonLevel } from "@prisma/client";
import { z } from "zod";

export const courseCreateSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(20).max(1200),
  level: z.nativeEnum(LessonLevel),
  price: z.coerce.number().min(0),
  isPublished: z.boolean().optional(),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export const lessonCreateSchema = z.object({
  title: z.string().min(4).max(160),
  description: z.string().min(10).max(1200),
  videoUrl: z.string().url(),
  homeworkText: z.string().min(10).max(3000),
  attachmentUrl: z.string().url().optional().or(z.literal("").transform((val) => (val ? val : undefined))),
  orderIndex: z.number().int().min(1).optional(),
});

export const lessonUpdateSchema = lessonCreateSchema.partial();
