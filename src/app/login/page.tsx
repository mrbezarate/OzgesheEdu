"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <MarketingLayout>
      <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </MarketingLayout>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirect = searchParams.get("redirect") || "/app/dashboard";

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setError(null);
      setLoading(true);
      await login(values.email, values.password);
      router.push(redirect);
    } catch (err) {
      setError((err as Error).message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="container flex flex-1 items-center justify-center py-20">
      <Card className="w-full max-w-md border-border/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Log in to OzgesheEdu</CardTitle>
          <CardDescription>Welcome back. Continue where you left off.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            No account yet? <Link className="font-semibold text-foreground" href="/register">Create one</Link>.
          </p>
          <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
            <p>Demo credentials:</p>
            <p className="mt-1 font-mono">mila@student.dev / password123</p>
            <p className="font-mono">alice@linguaflow.dev / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
