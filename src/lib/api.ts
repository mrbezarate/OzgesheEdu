import { NextResponse } from "next/server";

type ErrorLike = Error & { statusCode?: number; code?: string };

type ApiError = {
  message: string;
  status?: number;
  code?: string;
};

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function handleApiError(error: unknown, fallback?: ApiError) {
  const err = error as ErrorLike | undefined;
  const status = err?.statusCode ?? fallback?.status ?? 500;
  const message = err?.message ?? fallback?.message ?? "Internal server error";
  const code = err?.code ?? fallback?.code ?? "SERVER_ERROR";
  console.error(err);
  return NextResponse.json({ message, code }, { status });
}
