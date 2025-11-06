"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { scheduleSlotSchema } from "@/lib/validators/schedule";
import type { ScheduleSlotDto, TeacherEnrollmentDto } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";

interface TeacherCourseSummary {
  id: string;
  title: string;
  lessons: Array<{ id: string; title: string; orderIndex: number }>;
}

type ScheduleFormValues = z.infer<typeof scheduleSlotSchema>;

type ExtendedSchedule = ScheduleSlotDto & {
  teacher?: { id: string; name: string } | null;
};

export default function TeacherSchedulePage() {
  const api = useApi();
  const { user } = useAuth();
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ExtendedSchedule | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: schedule, isLoading: loadingSchedule } = useQuery<{ schedule: ExtendedSchedule[] }>({
    queryKey: ["teacher-schedule"],
    queryFn: () => api.get<{ schedule: ExtendedSchedule[] }>("/api/teacher/schedule"),
    enabled: isTeacher,
  });

  const { data: courses } = useQuery<{ courses: TeacherCourseSummary[] }>({
    queryKey: ["teacher-courses"],
    queryFn: () =>
      api.get<{ courses: TeacherCourseSummary[] }>("/api/teacher/courses").then((response) => ({
        courses: response.courses.map((course) => ({
          id: course.id,
          title: course.title,
          lessons: course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            orderIndex: lesson.orderIndex,
          })),
        })),
      })),
    enabled: isTeacher,
  });

  const { data: enrollments } = useQuery<{ enrollments: TeacherEnrollmentDto[] }>({
    queryKey: ["teacher-enrollments"],
    queryFn: () => api.get<{ enrollments: TeacherEnrollmentDto[] }>("/api/teacher/enrollments"),
    enabled: isTeacher,
  });

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSlotSchema),
    defaultValues: {
      courseId: "",
      lessonId: undefined,
      studentId: undefined,
      date: new Date(),
      durationMinutes: 60,
      description: "",
      onlineLink: "",
    },
  });

  const selectedCourseId = form.watch("courseId");

  const students = useMemo(
    () =>
      Array.from(
        new Map(
          (enrollments?.enrollments ?? []).map((enrollment) => [
            enrollment.student.id,
            { id: enrollment.student.id, name: enrollment.student.name, email: enrollment.student.email },
          ]),
        ).values(),
      ),
    [enrollments?.enrollments],
  );

  const openCreate = () => {
    form.reset({
      courseId: "",
      lessonId: undefined,
      studentId: undefined,
      date: new Date(),
      durationMinutes: 60,
      description: "",
      onlineLink: "",
    });
    setEditing(null);
    setError(null);
    setDialogOpen(true);
  };

  const openEdit = (slot: ExtendedSchedule) => {
    setEditing(slot);
    form.reset({
      courseId: slot.course.id,
      lessonId: slot.lesson?.id ?? undefined,
      studentId: slot.student?.id ?? undefined,
      date: new Date(slot.date),
      durationMinutes: slot.durationMinutes,
      description: slot.description ?? "",
      onlineLink: slot.onlineLink ?? "",
    });
    setError(null);
    setDialogOpen(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      setError(null);
      const payload: ScheduleFormValues = {
        ...values,
        date: new Date(values.date),
        lessonId: values.lessonId || undefined,
        studentId: values.studentId || undefined,
        onlineLink: values.onlineLink || undefined,
        description: values.description || undefined,
      };

      if (editing) {
        await api.patch(`/api/teacher/schedule/${editing.id}`, payload);
      } else {
        await api.post("/api/teacher/schedule", payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["teacher-schedule"] });
      setDialogOpen(false);
      setEditing(null);
    } catch (err) {
      setError((err as Error).message ?? "Unable to save slot");
    } finally {
      setSubmitting(false);
    }
  });

  const removeSlot = async (id: string) => {
    if (!confirm("Delete this schedule entry?")) return;
    await api.del(`/api/teacher/schedule/${id}`);
    await queryClient.invalidateQueries({ queryKey: ["teacher-schedule"] });
  };

  if (!isTeacher) {
    return <p className="text-sm text-muted-foreground">This section is limited to teachers.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teaching schedule</h1>
          <p className="text-muted-foreground">Manage live lessons and coaching sessions.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add slot
        </Button>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Upcoming sessions</CardTitle>
          <CardDescription>Your next lessons sorted chronologically.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSchedule ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : schedule?.schedule.length ? (
            <div className="space-y-2">
              {schedule.schedule.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">{slot.course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(slot.date), "PPpp")} &bull; {slot.durationMinutes} mins
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {slot.student ? `With ${slot.student.name}` : "Open session"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(slot)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSlot(slot.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No sessions yet. Add your first schedule entry.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit schedule" : "New schedule slot"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Controller
              name="courseId"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course</Label>
                  <select
                    id="courseId"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      form.setValue("lessonId", undefined);
                    }}
                  >
                    <option value="">Select course</option>
                    {(courses?.courses ?? []).map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.courseId && (
                    <p className="text-xs text-destructive">{form.formState.errors.courseId.message as string}</p>
                  )}
                </div>
              )}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date & time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...form.register("date")}
                  value={format(form.watch("date") ?? new Date(), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(event) => form.setValue("date", new Date(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input id="durationMinutes" type="number" min={15} max={180} {...form.register("durationMinutes", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessonId">Lesson (optional)</Label>
              <select
                id="lessonId"
                className="h-11 w-full rounded-lg border border-border bg-background px-3"
                {...form.register("lessonId")}
              >
                <option value="">Select lesson</option>
                {(courses?.courses.find((course) => course.id === selectedCourseId)?.lessons ?? []).map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    Lesson {lesson.orderIndex}: {lesson.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student (optional)</Label>
              <select
                id="studentId"
                className="h-11 w-full rounded-lg border border-border bg-background px-3"
                {...form.register("studentId")}
              >
                <option value="">Open session</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="onlineLink">Online meeting link</Label>
              <Input id="onlineLink" placeholder="https://" {...form.register("onlineLink")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Notes</Label>
              <Textarea id="description" rows={4} {...form.register("description")} placeholder="Add context for the session." />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : editing ? "Save changes" : "Create slot"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
