"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

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
import { XpDebugPanel } from "@/features/xp/debug-panel";

const MAX_LEVEL = 50;

export default function StudentDashboardPage() {
  const api = useApi();
  const { user } = useAuth();
  const [bonusXp, setBonusXp] = useState(0);
  const isDebug = process.env.NODE_ENV !== "production";

  const { data: enrollments, isLoading: loadingEnrollments } = useQuery<{ enrollments: EnrollmentSummary[] }>({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get<{ enrollments: EnrollmentSummary[] }>("/api/my/enrollments"),
  });

  const { data: schedule, isLoading: loadingSchedule } = useQuery<{ schedule: ScheduleSlotDto[] }>({
    queryKey: ["my-schedule"],
    queryFn: () => api.get<{ schedule: ScheduleSlotDto[] }>("/api/my/schedule"),
  });

  const inProgress = enrollments?.enrollments.filter((item) => item.course.progress < 100) ?? [];
  const completed = enrollments?.enrollments.filter((item) => item.course.progress >= 100) ?? [];
  const totalCompletedLessons =
    enrollments?.enrollments.reduce((sum, enrollment) => sum + enrollment.course.completedLessons, 0) ?? 0;
  const completedCoursesCount = completed.length;

  const lessonXp = totalCompletedLessons * xpConfig.perLesson;
  const courseXp = completedCoursesCount * xpConfig.perCourse;
  const xpEarned = lessonXp + courseXp + bonusXp;
  const { level, xpIntoLevel, xpForNextLevel } = calculateLevel(xpEarned);
  const xpPercent =
    xpForNextLevel === 0 ? 100 : Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));
  const tierVisual = getTierVisuals(level);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Continue your lessons and stay on top of homework submissions.</p>
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
                <p className="text-sm font-medium uppercase tracking-wide text-white/70">Profile</p>
                <h2 className="text-2xl font-semibold">{user?.name ?? "Your profile"}</h2>
                <p className={cn("text-sm", tierVisual.mutedText)}>
                  Level {level} · {tierVisual.name} tier
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
                Level {level} {level >= MAX_LEVEL ? "(max)" : ""}
              </span>
              <span>{xpForNextLevel ? `${xpForNextLevel - xpIntoLevel} XP to lvl ${Math.min(level + 1, MAX_LEVEL)}` : "Legend achieved"}</span>
            </div>
            <Progress
              value={xpPercent}
              className={cn("h-3 ring-1 ring-white/30", tierVisual.progressTrack)}
              indicatorClassName={cn("transition-all", tierVisual.progressIndicator)}
            />
            <div className={cn("text-xs", tierVisual.mutedText)}>
              {xpIntoLevel}/{xpForNextLevel || xpIntoLevel} XP in current level · {lessonXp} XP lessons · {courseXp} XP courses
              {bonusXp ? ` · ${bonusXp} XP debug` : ""}
            </div>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Courses in progress</CardDescription>
            <CardTitle className="text-3xl">{inProgress.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Keep momentum by finishing this week&apos;s lessons.</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed courses</CardDescription>
            <CardTitle className="text-3xl">{completed.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Celebrate your results and revisit key lessons anytime.</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lessons this week</CardDescription>
            <CardTitle className="text-3xl">{schedule?.schedule.length ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Upcoming sessions booked with your teacher.</CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Active courses</CardTitle>
          <CardDescription>Your enrolled programs and completion status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEnrollments ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : inProgress.length === 0 && completed.length === 0 ? (
            <div className="text-sm text-muted-foreground">You have no active courses yet. Explore the catalogue to get started.</div>
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
                      {enrollment.course.completedLessons} of {enrollment.course.totalLessons} lessons completed
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">{enrollment.course.progress}%</div>
                    <Button asChild variant="outline" className="h-8 px-3 text-xs">
                      <Link href={`/app/courses/${enrollment.course.id}`}>Continue</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isDebug && (
        <XpDebugPanel
          bonusXp={bonusXp}
          onBoost={(amount) => setBonusXp((prev) => prev + amount)}
          onReset={() => setBonusXp(0)}
        />
      )}

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Upcoming sessions</CardTitle>
          <CardDescription>Stay prepared for your live lessons.</CardDescription>
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
                    <Badge variant="secondary">{slot.durationMinutes} mins</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{slot.description ?? "Live coaching session"}</p>
                  {slot.onlineLink && (
                    <Button variant="ghost" className="px-0 h-auto text-sm font-medium" asChild>
                      <a href={slot.onlineLink} target="_blank" rel="noreferrer">
                        Join session
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No upcoming lessons yet. Coordinate with your teacher to schedule the next session.</div>
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
