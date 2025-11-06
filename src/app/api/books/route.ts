import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { jsonOk, handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validators/books";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({
      books: books.map((book) => ({
        ...book,
        price: Number(book.price),
      })),
    });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to load books",
      status: 400,
      code: "BOOKS_FETCH_FAILED",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, { roles: [Role.ADMIN] });
    const payload = bookSchema.parse(await request.json());

    const book = await prisma.book.create({
      data: {
        title: payload.title,
        author: payload.author,
        description: payload.description,
        price: payload.price.toFixed(2),
        coverImageUrl: payload.coverImageUrl,
      },
    });

    return jsonOk({ ...book, price: Number(book.price) }, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      message: "Unable to create book",
      status: 400,
      code: "BOOK_CREATE_FAILED",
    });
  }
}
