import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(2).max(160),
  author: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().min(0),
  coverImageUrl: z.string().url(),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        bookId: z.string().cuid(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
});
