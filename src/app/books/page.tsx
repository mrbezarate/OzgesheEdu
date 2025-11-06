"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api-client";
import type { BookDto } from "@/types";

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ books: BookDto[] }>("/api/books")
      .then((response) => setBooks(response.books ?? []))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MarketingLayout>
      <div className="container space-y-12 py-20">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Curated English bookshelf</h1>
          <p className="text-muted-foreground">
            Discover instructor-recommended books to amplify lessons, sharpen grammar, and fuel confident conversations.
          </p>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id} className="flex h-full flex-col overflow-hidden border-border/80">
                <CardHeader className="space-y-3">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={book.coverImageUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <p className="text-sm text-muted-foreground">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">${book.price.toFixed(2)}</span>
                    <Button asChild variant="outline">
                      <Link href="/login?redirect=/app/books">Add to cart</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
