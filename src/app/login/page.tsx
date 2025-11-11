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
import { useLanguage } from "@/components/providers/language-provider";
import { getAuthTranslations } from "@/lib/auth-translations";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { language } = useLanguage();
  const authCopy = getAuthTranslations(language);
  return (
    <MarketingLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-sm text-muted-foreground">
            {authCopy.login.loadingMessage}
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </MarketingLayout>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { language } = useLanguage();
  const authCopy = getAuthTranslations(language);
  const copy = authCopy.login;
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
      setError((err as Error).message || copy.errorFallback || "");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="container flex flex-1 items-center justify-center py-20">
      <Card className="w-full max-w-md border-border/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">{copy.emailLabel}</Label>
              <Input id="email" type="email" placeholder={copy.emailPlaceholder} {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{copy.passwordLabel}</Label>
              <Input id="password" type="password" placeholder={copy.passwordPlaceholder} {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? copy.submitting : copy.submit}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            {copy.footerPrompt}{" "}
            <Link className="font-semibold text-foreground" href="/register">
              {copy.footerCta}
            </Link>
            .
          </p>
          <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
            {copy.demoTitle && <p>{copy.demoTitle}</p>}
            <p className="mt-1 font-mono">mila@student.dev / password123</p>
            <p className="font-mono">alice@linguaflow.dev / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
