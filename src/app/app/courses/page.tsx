"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import type { EnrollmentSummary } from "@/types";

export default function MyCoursesPage() {
  const api = useApi();

  const { data, isLoading, isError } = useQuery<{ enrollments: EnrollmentSummary[] }>({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get<{ enrollments: EnrollmentSummary[] }>("/api/my/enrollments"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">Resume lessons, submit homework, and review teacher feedback.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Unable to load courses right now.</p>
      ) : data?.enrollments.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {data.enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="flex h-full flex-col border-border/70">
              <CardHeader>
                <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                <CardDescription>Level {enrollment.course.level}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{enrollment.course.progress}%</span>
                  </div>
                  <Progress value={enrollment.course.progress} />
                  <p className="text-xs text-muted-foreground">
                    {enrollment.course.completedLessons} / {enrollment.course.totalLessons} lessons completed
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/app/courses/${enrollment.course.id}`}>Continue course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
          You have not enrolled in any courses yet. Head to the courses catalogue to get started.
        </div>
      )}
    </div>
  );
}
