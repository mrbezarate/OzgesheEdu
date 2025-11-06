import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators/books";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const payload = orderSchema.parse(await request.json());

    const bookIds = payload.items.map((item) => item.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
    });

    if (books.length !== payload.items.length) {
      throw Object.assign(new Error("Some books are no longer available"), {
        statusCode: 400,
      });
    }

    const priceMap = new Map(books.map((book) => [book.id, Number(book.price)]));

    const total = payload.items.reduce((sum, item) => {
      const price = priceMap.get(item.bookId) ?? 0;
      return sum + price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalPrice: total.toFixed(2),
        items: {
          create: payload.items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            priceAtPurchase: (priceMap.get(item.bookId) ?? 0).toFixed(2),
          })),
        },
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    return jsonOk({
      order: {
        ...order,
        totalPrice: Number(order.totalPrice),
        items: order.items.map((item) => ({
          ...item,
          priceAtPurchase: Number(item.priceAtPurchase),
        })),
      },
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to place order",
      status: 400,
      code: "ORDER_CREATE_FAILED",
    });
  }
}
