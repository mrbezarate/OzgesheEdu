"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import type { EnrollmentSummary, ScheduleSlotDto } from "@/types";

export default function StudentDashboardPage() {
  const api = useApi();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Continue your lessons and stay on top of homework submissions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
