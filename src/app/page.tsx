import Link from "next/link";
import { ArrowRight, CheckCircle, PlayCircle, Sparkles } from "lucide-react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "LinguaFlow brings structure to my self-study. I log in, press play, and instantly feel guided toward my goals.",
    name: "Sophie, Product Designer",
  },
  {
    quote:
      "The teacher dashboard is the best I have used. Scheduling lessons and tracking progress takes minutes instead of hours.",
    name: "Carlos, English Coach",
  },
  {
    quote:
      "Homework submissions are finally organised. Feedback loops with students are seamless and motivating.",
    name: "Amelia, IELTS Specialist",
  },
];

const pricing = [
  {
    title: "Starter",
    price: "$49",
    description: "Self-paced lessons with guided homework and book recommendations.",
    features: ["2 active courses", "Homework submission tracker", "Private community"],
  },
  {
    title: "Guided",
    price: "$129",
    description: "Hybrid plan with teacher office hours and live feedback.",
    features: ["Everything in Starter", "Teacher chat", "Monthly live workshop"],
  },
  {
    title: "Pro Team",
    price: "Contact",
    description: "Designed for schools and language studios with growth ambitions.",
    features: ["Unlimited courses", "Advanced reporting", "Dedicated success partner"],
  },
];

export default function LandingPage() {
  return (
    <MarketingLayout>
      <section className="border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/40">
        <div className="container grid gap-16 pb-20 pt-24 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-8">
            <Badge variant="success" className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700">
              <Sparkles className="h-4 w-4" />
              New: Guided speaking labs for B2 learners
            </Badge>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Learn English with structure,<br className="hidden sm:block" /> confidence, and human support.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                LinguaFlow blends cinematic lessons, teacher feedback, and curated books in one minimal workspace. Progress from A2 to C1 with measurable momentum.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start learning now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/courses">Browse courses</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Guided homework feedback
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Teacher lesson scheduler
              </div>
            </div>
          </div>
          <Card className="relative overflow-hidden border-none bg-card/70 shadow-2xl">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5" />
            <CardHeader>
              <CardTitle className="text-xl">Launch your next lesson in seconds</CardTitle>
              <CardDescription>
                Visualise your learning lane, track submissions, and jump into live calls from one dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-border/70 bg-gradient-to-br from-muted/30 via-background to-background p-6 shadow-inner">
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s plan</p>
                <ul className="mt-4 space-y-4 text-sm">
                  <li className="flex items-center justify-between rounded-lg bg-background/70 px-4 py-3 shadow-sm">
                    <span className="font-medium">Speaking Lab • IELTS Accelerator</span>
                    <span className="text-muted-foreground">17:30</span>
                  </li>
                  <li className="flex items-center justify-between rounded-lg bg-background/70 px-4 py-3 shadow-sm">
                    <span className="font-medium">Homework review • Mila Chen</span>
                    <span className="text-muted-foreground">19:00</span>
                  </li>
                  <li className="flex items-center justify-between rounded-lg bg-background/70 px-4 py-3 shadow-sm">
                    <span className="font-medium">Book club • Fluent Futures</span>
                    <span className="text-muted-foreground">20:00</span>
                  </li>
                </ul>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  Preview the dashboard
                  <PlayCircle className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background py-20">
        <div className="container grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How LinguaFlow works</h2>
            <p className="text-lg text-muted-foreground">
              We combine on-demand lessons, collaborative feedback, and curated materials to help learners stay accountable without burning out.
            </p>
          </div>
          <div className="grid gap-6">
            {["Activate", "Practice", "Optimise"].map((stage, index) => (
              <Card key={stage} className="border-border/70">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{stage}</CardTitle>
                    <CardDescription>
                      {index === 0
                        ? "Choose your course, set your fluency goal, and unlock a guided path crafted by certified teachers."
                        : index === 1
                          ? "Stream interactive lessons, submit homework within minutes, and receive actionable feedback."
                          : "Track progress, analyse weak spots, and refine with live coaching built into your calendar."}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">0{index + 1}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-muted/20 py-20">
        <div className="container grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Built for students</h2>
            <p className="text-lg text-muted-foreground">
              Focus on outcomes. Track lessons, submit homework, revisit teacher feedback, and keep motivation high.
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                Structured learning journeys from A1 to C1
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                Embedded video lessons with spaced repetition reminders
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                Instant homework submissions and progress tracking
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Empowering teachers</h2>
            <p className="text-lg text-muted-foreground">
              Streamline operations. Align calendar, lessons, and student metrics without juggling multiple tools.
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                Calendar-first schedule builder with live session links
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                Course and lesson authoring with drag-to-order sequences
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                Cohort-level insights on student momentum and completion
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-background py-20">
        <div className="container space-y-12">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Pricing to match your goals</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {pricing.map((tier) => (
              <Card key={tier.title} className="flex flex-col border-border/80">
                <CardHeader className="space-y-3">
                  <CardTitle>{tier.title}</CardTitle>
                  <div className="text-3xl font-semibold">{tier.price}</div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.title === "Guided" ? "default" : "outline"}>
                    {tier.title === "Pro Team" ? "Talk to sales" : "Choose plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-muted/10 py-20">
        <div className="container space-y-12">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by ambitious learners and coaches
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border/70 bg-background/80 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">“{testimonial.quote}”</p>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container flex flex-col items-center gap-6 rounded-3xl border border-border/60 bg-gradient-to-r from-background via-background to-muted/30 px-8 py-16 text-center shadow-lg">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your fluency system?
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Join thousands of learners and coaches using LinguaFlow to deliver structured lessons, confident speaking, and measurable results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Create your account</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
