"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { getLandingTranslations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { formatKzt } from "@/lib/currency";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const t = getLandingTranslations(language);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const isYearly = billingCycle === "yearly";
  const billingMultiplier = isYearly ? 12 * 0.8 : 1;

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app/dashboard");
    }
  }, [loading, user, router]);

  return (
    <MarketingLayout>
      <section className="border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/40">
        <div className="container grid gap-16 pb-20 pt-24 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge variant="success" className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700">
              <Sparkles className="h-4 w-4" />
              {t.hero.badge}
            </Badge>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t.hero.title}
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {t.hero.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  {t.hero.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/courses">{t.hero.secondaryCta}</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t.hero.bulletOne}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t.hero.bulletTwo}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="relative h-full overflow-hidden border-none bg-card/70 shadow-2xl">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5" />
            <CardHeader>
              <CardTitle className="text-xl">{t.heroCard.title}</CardTitle>
              <CardDescription>{t.heroCard.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-border/70 bg-gradient-to-br from-muted/30 via-background to-background p-6 shadow-inner">
                <p className="text-sm font-medium text-muted-foreground">{t.heroCard.planTitle}</p>
                <ul className="mt-4 space-y-4 text-sm">
                  {t.heroCard.planItems.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-center justify-between rounded-lg bg-background/70 px-4 py-3 shadow-sm"
                    >
                      <span className="font-medium">{item.title}</span>
                      <span className="text-muted-foreground">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  {t.heroCard.previewCta}
                  <PlayCircle className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background py-20">
        <div className="container grid gap-12 md:grid-cols-2">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.how.title}</h2>
            <p className="text-lg text-muted-foreground">
              {t.how.description}
            </p>
          </motion.div>
          <div className="grid gap-6">
            {t.how.steps.map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card className="border-border/70">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{stage.title}</CardTitle>
                    <CardDescription>{stage.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">0{index + 1}</Badge>
                </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-muted/20 py-20">
        <div className="container grid gap-12 md:grid-cols-2">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">{t.audience.students.title}</h2>
            <p className="text-lg text-muted-foreground">
              {t.audience.students.description}
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {t.audience.students.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">{t.audience.teachers.title}</h2>
            <p className="text-lg text-muted-foreground">
              {t.audience.teachers.description}
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {t.audience.teachers.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background py-20">
        <div className="container space-y-10">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.pricing.title}</h2>
            <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-inner">
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-1 transition",
                  billingCycle === "monthly"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setBillingCycle("monthly")}
              >
                {t.pricing.billingToggle.monthly}
              </button>
              <button
                type="button"
                className={cn(
                  "relative rounded-full px-4 py-1 transition",
                  billingCycle === "yearly"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setBillingCycle("yearly")}
              >
                {t.pricing.billingToggle.yearly}
                {billingCycle === "yearly" && (
                  <span className="absolute -top-3 right-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {t.pricing.billingToggle.badge}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {t.pricing.tiers.map((tier) => {
              const formattedPrice = formatKzt(tier.monthlyPrice * billingMultiplier, language);
              const suffix = isYearly ? t.pricing.perLabel.year : t.pricing.perLabel.month;
              return (
                <motion.div
                  key={tier.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, scale: 1.01 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                  className="group"
                >
                  <Card
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden border border-border/60 bg-card/90 transition duration-300 group-hover:border-foreground/40",
                      tier.highlight && "ring-1 ring-white/20 shadow-[0_25px_50px_-35px_rgba(15,23,42,1)]",
                    )}
                  >
                  <CardHeader className="space-y-3">
                    {tier.tag && (
                      <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
                        {tier.tag}
                      </span>
                    )}
                    <CardTitle className="text-xl">{tier.title}</CardTitle>
                    <div className="text-3xl font-bold text-emerald-600">
                      {formattedPrice} <span className="text-base font-medium text-muted-foreground">{suffix}</span>
                    </div>
                    <CardDescription className="opacity-0 transition duration-300 group-hover:opacity-100">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 rounded-lg border border-transparent bg-muted/30 px-3 py-2 transition duration-300 group-hover:border-border/80 group-hover:bg-muted/60 group-hover:text-foreground"
                        >
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="opacity-95 transition duration-300 group-hover:opacity-100">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={cn(
                        "w-full border border-border/60 bg-transparent text-foreground transition hover:bg-foreground hover:text-background",
                        tier.highlight && "bg-foreground text-background hover:bg-black",
                      )}
                      variant="default"
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-muted/10 py-20">
        <div className="container space-y-12">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {t.testimonials.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {t.testimonials.items.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border/70 bg-background/80 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">“{testimonial.quote}”</p>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="bg-background py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex flex-col items-center gap-6 rounded-3xl border border-border/60 bg-gradient-to-r from-background via-background to-muted/30 px-8 py-16 text-center shadow-lg">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.finalCta.title}
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t.finalCta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">{t.finalCta.primary}</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/login">{t.finalCta.secondary}</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </MarketingLayout>
  );
}
