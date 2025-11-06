import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validators/books";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });
    const payload = bookSchema.partial().parse(await request.json());
    const { id } = await context.params;

    const exists = await prisma.book.findUnique({ where: { id } });
    if (!exists) {
      return jsonOk({ message: "Book not found" }, { status: 404 });
    }

    const updated = await prisma.book.update({
      where: { id },
      data: {
        title: payload.title ?? exists.title,
        author: payload.author ?? exists.author,
        description: payload.description ?? exists.description,
        price: payload.price !== undefined ? payload.price.toFixed(2) : exists.price,
        coverImageUrl: payload.coverImageUrl ?? exists.coverImageUrl,
      },
    });

    return jsonOk({ ...updated, price: Number(updated.price) });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to update book",
      status: 400,
      code: "BOOK_UPDATE_FAILED",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });
    const { id } = await context.params;

    const exists = await prisma.book.findUnique({ where: { id } });
    if (!exists) {
      return jsonOk({ message: "Book not found" }, { status: 404 });
    }

    await prisma.book.delete({ where: { id } });
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to delete book",
      status: 400,
      code: "BOOK_DELETE_FAILED",
    });
  }
}
