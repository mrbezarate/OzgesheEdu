"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api-client";
import type { CourseDto } from "@/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ courses: CourseDto[] }>("/api/courses")
      .then((response) => {
        setCourses(response.courses ?? []);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MarketingLayout>
      <div className="container space-y-12 py-20">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <Badge variant="secondary">Curated curriculum</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Courses designed for measurable progress</h1>
          <p className="text-muted-foreground">
            Choose from guided programs crafted by expert teachers. Unlock lessons, follow structured homework, and track achievements.
          </p>
        </div>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading courses…</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col border-border/80">
                <CardHeader className="space-y-3">
                  <Badge variant="outline" className="w-fit">
                    Level {course.level}
                  </Badge>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div className="text-lg font-semibold">${course.price.toFixed(2)}</div>
                  <Button asChild className="w-full">
                    <Link href={`/login?redirect=/courses`}>Enroll now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
