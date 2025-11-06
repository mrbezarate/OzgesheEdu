import { z } from "zod";

export const enrollmentCreateSchema = z.object({
  paymentReference: z.string().optional(),
});

export const progressUpdateSchema = z.object({
  homeworkAnswer: z.string().min(3).max(4000).optional(),
  isCompleted: z.boolean().optional(),
});
