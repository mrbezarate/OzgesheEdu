"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookOpenCheck, GraduationCap, type LucideIcon } from "lucide-react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { getAuthTranslations } from "@/lib/auth-translations";

const ROLE_VALUES = ["STUDENT", "TEACHER"] as const;
type TeacherRole = (typeof ROLE_VALUES)[number];

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(ROLE_VALUES),
});

type RegisterValues = z.infer<typeof registerSchema>;

const ROLE_ICON_MAP: Record<TeacherRole, LucideIcon> = {
  STUDENT: GraduationCap,
  TEACHER: BookOpenCheck,
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { language } = useLanguage();
  const authCopy = getAuthTranslations(language);
  const copy = authCopy.register;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setError(null);
      setLoading(true);
      await registerUser(values);
      router.push("/app/dashboard");
    } catch (err) {
      setError((err as Error).message || copy.errorFallback || "");
    } finally {
      setLoading(false);
    }
  });

  const roleOptions = ROLE_VALUES.map((role) => ({
    value: role,
    title: copy.roles?.[role] ?? role,
    icon: ROLE_ICON_MAP[role],
  }));

  const selectedRole = form.watch("role");

  return (
    <MarketingLayout>
      <div className="container flex flex-1 items-center justify-center py-20">
        <Card className="w-full max-w-md border-border/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label>{copy.roleHeading}</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {roleOptions.map((option) => {
                    const selected = selectedRole === option.value;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "rounded-2xl border px-4 py-6 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          selected ? "border-primary bg-primary/5 shadow-md" : "border-border/70 hover:border-primary/60",
                        )}
                        onClick={() => form.setValue("role", option.value, { shouldValidate: true })}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <span className={cn(
                            "grid h-14 w-14 place-items-center rounded-full",
                            selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                          )}>
                            <Icon className="h-7 w-7" />
                          </span>
                          <p className="text-base font-semibold">{option.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" {...form.register("role")} />
                {form.formState.errors.role && (
                  <p className="text-sm text-destructive">{copy.roleError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{copy.nameLabel}</Label>
                <Input id="name" placeholder={copy.namePlaceholder} {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
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
              <Link className="font-semibold text-foreground" href="/login">
                {copy.footerCta}
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
