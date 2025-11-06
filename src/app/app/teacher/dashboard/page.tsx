"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, GraduationCap, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/components/providers/auth-provider";
import type { ScheduleSlotDto, TeacherEnrollmentDto } from "@/types";

interface TeacherCourse {
  id: string;
  title: string;
  isPublished: boolean;
  lessons: { id: string }[];
  enrollmentCount: number;
}

export default function TeacherDashboardPage() {
  const api = useApi();
  const { user } = useAuth();
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";

  const { data: enrollments } = useQuery<{ enrollments: TeacherEnrollmentDto[] }>({
    queryKey: ["teacher-enrollments"],
    queryFn: () => api.get<{ enrollments: TeacherEnrollmentDto[] }>("/api/teacher/enrollments"),
    enabled: isTeacher,
  });

  const { data: schedule, isLoading: loadingSchedule } = useQuery<{ schedule: ScheduleSlotDto[] }>({
    queryKey: ["teacher-schedule"],
    queryFn: () => api.get<{ schedule: ScheduleSlotDto[] }>("/api/teacher/schedule"),
    enabled: isTeacher,
  });

  const { data: courses, isLoading: loadingCourses } = useQuery<{ courses: TeacherCourse[] }>({
    queryKey: ["teacher-courses"],
    queryFn: () => api.get<{ courses: TeacherCourse[] }>("/api/teacher/courses"),
    enabled: isTeacher,
  });

  const uniqueStudents = new Set((enrollments?.enrollments ?? []).map((item) => item.student.id));

  if (!isTeacher) {
    return <p className="text-sm text-muted-foreground">This section is limited to teachers.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teaching Overview</h1>
        <p className="text-muted-foreground">Monitor your cohorts, upcoming lessons, and course performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Total students</CardDescription>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{uniqueStudents.size}</div>
            <p className="text-xs text-muted-foreground">Across all active enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active courses</CardDescription>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{courses?.courses.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Including published and draft courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Upcoming lessons</CardDescription>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{schedule?.schedule.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Next confirmed sessions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Upcoming sessions</CardTitle>
          <CardDescription>Your next engagements with students.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSchedule ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : schedule?.schedule.length ? (
            <div className="space-y-4">
              {schedule.schedule.slice(0, 6).map((slot) => (
                <div key={slot.id} className="rounded-lg border border-border/60 bg-background/80 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{slot.course.title}</div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(slot.date).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {slot.lesson?.title ?? "Custom session"}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {slot.student ? `With ${slot.student.name}` : "Open group session"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming sessions scheduled. Add your next lessons from the schedule tab.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Course performance</CardTitle>
          <CardDescription>Snapshot of enrolments per course.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCourses ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : courses?.courses.length ? (
            <div className="space-y-3">
              {courses.courses.map((course) => (
                <div key={course.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/80 p-4">
                  <div>
                    <div className="text-sm font-semibold">{course.title}</div>
                    <p className="text-xs text-muted-foreground">
                      {course.lessons.length} lessons • {course.isPublished ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">{course.enrollmentCount} learners</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Create your first course to start onboarding students.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
