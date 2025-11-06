import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({
      orders: orders.map((order) => ({
        ...order,
        totalPrice: Number(order.totalPrice),
        items: order.items.map((item) => ({
          ...item,
          priceAtPurchase: Number(item.priceAtPurchase),
        })),
      })),
    });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load orders",
      status: 400,
      code: "ORDERS_FETCH_FAILED",
    });
  }
}
