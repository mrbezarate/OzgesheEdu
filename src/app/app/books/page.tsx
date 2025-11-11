"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useApi } from "@/hooks/use-api";
import { useLanguage } from "@/components/providers/language-provider";
import { getBooksTranslations } from "@/lib/books-translations";
import { formatUsdAsKzt } from "@/lib/currency";
import type { BookDto } from "@/types";

interface CartItem {
  book: BookDto;
  quantity: number;
}

export default function AppBooksPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const copy = getBooksTranslations(language).app;
  const { data, isLoading } = useQuery<{ books: BookDto[] }>({
    queryKey: ["books"],
    queryFn: () => api.get<{ books: BookDto[] }>("/api/books"),
  });
  const { data: orders } = useQuery<{ orders: Array<{ id: string; totalPrice: number; createdAt: string }> }>({
    queryKey: ["my-orders"],
    queryFn: () => api.get<{ orders: Array<{ id: string; totalPrice: number; createdAt: string }> }>("/api/my/orders"),
  });

  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const addToCart = (book: BookDto) => {
    setStatus(null);
    setCart((prev) => {
      const existing = prev[book.id];
      return {
        ...prev,
        [book.id]: {
          book,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
    setSheetOpen(true);
  };

  const removeItem = (bookId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[bookId];
      return newCart;
    });
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const total = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const totalFormatted = formatUsdAsKzt(total, language);

  const placeOrder = async () => {
    try {
      await api.post("/api/orders", {
        items: cartItems.map((item) => ({
          bookId: item.book.id,
          quantity: item.quantity,
        })),
      });
      setStatus(copy.orderSuccess);
      setCart({});
      await queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.subtitle}</p>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              {copy.cartLabel} ({cartItems.length})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{copy.cartTitle}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.cartEmpty}</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.book.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                      <Image src={item.book.coverImageUrl} alt={item.book.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.book.title}</div>
                      <p className="text-xs text-muted-foreground">{item.book.author}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatUsdAsKzt(item.book.price, language)} × {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => removeItem(item.book.id)}
                        >
                          {copy.remove}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="border-t border-border/60 pt-4 text-sm font-semibold">
                {copy.total}: {totalFormatted}
              </div>
              {status && <p className="text-sm text-muted-foreground">{status}</p>}
              <Button className="w-full" disabled={cartItems.length === 0} onClick={placeOrder}>
                {copy.placeOrder}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.books.map((book) => (
            <Card key={book.id} className="flex h-full flex-col border-border/70">
              <CardHeader className="space-y-3">
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-muted">
                  <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
                </div>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <p className="text-sm text-muted-foreground">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {formatUsdAsKzt(book.price, language)}
                  </span>
                  <Button onClick={() => addToCart(book)}>{copy.buttonAdd}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {orders?.orders.length ? (
        <div>
          <h2 className="text-lg font-semibold">{copy.ordersTitle}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {orders.orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">
                <div className="font-semibold text-foreground">Order {order.id.slice(-6)}</div>
                <div>{new Date(order.createdAt).toLocaleString()}</div>
                <div className="text-foreground font-semibold">
                  {formatUsdAsKzt(order.totalPrice, language)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : orders ? (
        <p className="text-sm text-muted-foreground">{copy.ordersEmpty}</p>
      ) : null}
    </div>
  );
}
