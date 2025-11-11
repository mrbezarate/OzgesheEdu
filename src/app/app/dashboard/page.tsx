"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import type { EnrollmentSummary, ScheduleSlotDto } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { Progress } from "@/components/ui/progress";
import { xpConfig, getTierVisuals } from "@/config/xp";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { getDashboardTranslations } from "@/lib/dashboard-translations";

const MAX_LEVEL = 50;

export default function StudentDashboardPage() {
  const api = useApi();
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = getDashboardTranslations(language);
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    if (!user || isStudent) return;
    const fallback = user.role === "TEACHER" ? "/app/teacher/dashboard" : "/app/admin/users";
    router.replace(fallback);
  }, [user, isStudent, router]);

  const { data: enrollments, isLoading: loadingEnrollments } = useQuery<{ enrollments: EnrollmentSummary[] }>({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get<{ enrollments: EnrollmentSummary[] }>("/api/my/enrollments"),
    enabled: isStudent,
  });

  const { data: schedule, isLoading: loadingSchedule } = useQuery<{ schedule: ScheduleSlotDto[] }>({
    queryKey: ["my-schedule"],
    queryFn: () => api.get<{ schedule: ScheduleSlotDto[] }>("/api/my/schedule"),
    enabled: isStudent,
  });

  const inProgress = enrollments?.enrollments.filter((item) => item.course.progress < 100) ?? [];
  const completed = enrollments?.enrollments.filter((item) => item.course.progress >= 100) ?? [];
  const totalCompletedLessons =
    enrollments?.enrollments.reduce((sum, enrollment) => sum + enrollment.course.completedLessons, 0) ?? 0;
  const completedCoursesCount = completed.length;

  const lessonXp = totalCompletedLessons * xpConfig.perLesson;
  const courseXp = completedCoursesCount * xpConfig.perCourse;
  const xpEarned = lessonXp + courseXp;
  const { level, xpIntoLevel, xpForNextLevel } = calculateLevel(xpEarned);
  const xpPercent =
    xpForNextLevel === 0 ? 100 : Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));
  const tierVisual = getTierVisuals(level);

  if (!isStudent) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
        {t.redirectText}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.welcomeTitle}</h1>
        <p className="text-muted-foreground">{t.welcomeSubtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl transition hover:shadow-2xl md:col-span-2",
            tierVisual.baseBackground,
            tierVisual.textClass,
          )}
          style={{
            backgroundImage: tierVisual.gradient,
            backgroundSize: "cover",
          }}
        >
          <span className={cn("pointer-events-none absolute rounded-full blur-3xl opacity-40", tierVisual.glowClasses[0])} />
          <span className={cn("pointer-events-none absolute rounded-full blur-3xl opacity-40", tierVisual.glowClasses[1])} />
          {tierVisual.sparkles.map((sparkle, index) => (
            <span
              key={`sparkle-${index}`}
              className={cn("pointer-events-none absolute rounded-full blur-[1px] opacity-90", sparkle)}
            />
          ))}
          <div className="relative z-10 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/20 text-lg font-semibold uppercase">
                {user?.name
                  ?.split(" ")
                  .map((part) => part[0]?.toUpperCase())
                  .join("")
                  .slice(0, 2) ?? "OE"}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                  {t.xpCard.profileLabel}
                </p>
                <h2 className="text-2xl font-semibold">{user?.name ?? "Your profile"}</h2>
                <p className={cn("text-sm", tierVisual.mutedText)}>
                  {t.xpCard.levelLabel} {level} · {tierVisual.name}
                </p>
              </div>
            </div>
            <div className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide", tierVisual.accentPill)}>
              {xpEarned} XP
            </div>
          </div>
          <div className="relative z-10 mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                {t.xpCard.levelLabel} {level} {level >= MAX_LEVEL ? t.xpCard.maxLabel : ""}
              </span>
              <span>
                {xpForNextLevel
                  ? `${xpForNextLevel - xpIntoLevel} ${t.xpCard.xpToPrefix} ${Math.min(level + 1, MAX_LEVEL)}`
                  : t.xpCard.legendAchieved}
              </span>
            </div>
            <Progress
              value={xpPercent}
              className={cn("h-3 ring-1 ring-white/30", tierVisual.progressTrack)}
              indicatorClassName={cn("transition-all", tierVisual.progressIndicator)}
            />
            <div className={cn("text-xs", tierVisual.mutedText)}>
              {xpIntoLevel}/{xpForNextLevel || xpIntoLevel} XP · {lessonXp} {t.xpCard.lessonsLabel} · {courseXp} {t.xpCard.coursesLabel}
            </div>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.metrics.inProgress.title}</CardDescription>
            <CardTitle className="text-3xl">{inProgress.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t.metrics.inProgress.description}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.metrics.completed.title}</CardDescription>
            <CardTitle className="text-3xl">{completed.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t.metrics.completed.description}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.metrics.lessons.title}</CardDescription>
            <CardTitle className="text-3xl">{schedule?.schedule.length ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t.metrics.lessons.description}</CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.courses.title}</CardTitle>
          <CardDescription>{t.courses.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEnrollments ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : inProgress.length === 0 && completed.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t.courses.empty}</div>
          ) : (
            <div className="space-y-4">
              {enrollments?.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{enrollment.course.title}</h3>
                      <Badge variant={enrollment.course.progress >= 100 ? "success" : "secondary"}>
                        {enrollment.course.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.courses.progressLabel
                        .replace("{completed}", enrollment.course.completedLessons.toString())
                        .replace("{total}", enrollment.course.totalLessons.toString())}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">{enrollment.course.progress}%</div>
                    <Button asChild variant="outline" className="h-8 px-3 text-xs">
                      <Link href={`/app/courses/${enrollment.course.id}`}>{t.courses.continue}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.schedule.title}</CardTitle>
          <CardDescription>{t.schedule.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSchedule ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : schedule?.schedule.length ? (
            <div className="space-y-4">
              {schedule.schedule.map((slot) => (
                <div key={slot.id} className="rounded-lg border border-border/60 bg-background/80 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold">{slot.course.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(slot.date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {slot.durationMinutes} {t.schedule.durationSuffix}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{slot.description ?? t.schedule.sessionFallback}</p>
                  {slot.onlineLink && (
                    <Button variant="ghost" className="px-0 h-auto text-sm font-medium" asChild>
                      <a href={slot.onlineLink} target="_blank" rel="noreferrer">
                        {t.schedule.joinCta}
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t.schedule.empty}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function calculateLevel(xp: number) {
  let remaining = xp;
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const requirement =
      level === MAX_LEVEL
        ? 0
        : Math.min(4000, Math.round(120 * Math.pow(1.08, level - 1)));
    if (requirement === 0 || remaining < requirement) {
      return {
        level,
        xpIntoLevel: requirement === 0 ? requirement : remaining,
        xpForNextLevel: requirement,
      };
    }
    remaining -= requirement;
  }
  return { level: MAX_LEVEL, xpIntoLevel: 0, xpForNextLevel: 0 };
}
