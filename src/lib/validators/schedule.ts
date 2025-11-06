import { z } from "zod";

export const scheduleSlotSchema = z.object({
  courseId: z.string().cuid(),
  lessonId: z.string().cuid().optional(),
  studentId: z.string().cuid().optional(),
  date: z.coerce.date(),
  durationMinutes: z.number().int().min(15).max(180),
  description: z.string().max(500).optional(),
  onlineLink: z.string().url().optional(),
});
