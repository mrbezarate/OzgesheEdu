"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import type { EnrollmentDetail, EnrollmentSummary, LessonDto } from "@/types";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: enrollmentsData } = useQuery<{ enrollments: EnrollmentSummary[] }>({
    queryKey: ["my-enrollments"],
    queryFn: () => api.get<{ enrollments: EnrollmentSummary[] }>("/api/my/enrollments"),
  });

  const enrollmentId = useMemo(
    () => enrollmentsData?.enrollments.find((item) => item.course.id === courseId)?.id,
    [courseId, enrollmentsData],
  );

  const { data: enrollmentDetail, isLoading, isError } = useQuery<{ enrollment: EnrollmentDetail }>({
    queryKey: ["enrollment-detail", enrollmentId],
    enabled: Boolean(enrollmentId),
    queryFn: () => api.get<{ enrollment: EnrollmentDetail }>(`/api/my/enrollments/${enrollmentId}`),
  });

  const lessons = useMemo(
    () => enrollmentDetail?.enrollment.course.lessons ?? [],
    [enrollmentDetail?.enrollment.course.lessons],
  );
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const activeLesson = useMemo<LessonDto & { progress: { homeworkAnswer: string | null; isCompleted: boolean; submittedAt: string | null } } | null>(() => {
    if (!lessons.length) return null;
    const lesson = lessons.find((item) => item.id === activeLessonId) ?? lessons[0];
    return lesson as LessonDto & { progress: { homeworkAnswer: string | null; isCompleted: boolean; submittedAt: string | null } };
  }, [lessons, activeLessonId]);

  const [homeworkAnswer, setHomeworkAnswer] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setHomeworkAnswer(activeLesson?.progress?.homeworkAnswer ?? "");
  }, [activeLesson?.progress?.homeworkAnswer]);

  const handleSubmit = async () => {
    if (!activeLesson) return;
    try {
      setSubmitting(true);
      setFeedback(null);
      await api.post(`/api/lessons/${activeLesson.id}/complete`, {
        homeworkAnswer: homeworkAnswer.trim(),
        isCompleted: true,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-enrollments"] }),
        queryClient.invalidateQueries({ queryKey: ["enrollment-detail", enrollmentId] }),
      ]);
      setFeedback("Homework submitted and lesson marked complete.");
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!enrollmentId) {
    return <p className="text-sm text-muted-foreground">You are not enrolled in this course.</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading course…</p>;
  }

  if (isError || !enrollmentDetail) {
    return <p className="text-sm text-destructive">Unable to load course details.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <Card className="h-full border-border/80">
        <CardContent className="h-[70vh] p-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-1 p-4">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex flex-col rounded-lg border border-transparent p-3 text-left transition hover:bg-muted/80 ${
                    activeLesson?.id === lesson.id ? "bg-muted" : "bg-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {lesson.progress.isCompleted ? (
                      <CheckCircle className="mt-1 h-4 w-4 text-emerald-500" />
                    ) : (
                      <span className="mt-1 h-4 w-4 rounded-full border border-border/60" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">Lesson {lesson.orderIndex}</p>
                      <p className="text-xs text-muted-foreground">{lesson.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-2">
          <Badge variant="secondary">Level {enrollmentDetail.enrollment.course.level}</Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            {enrollmentDetail.enrollment.course.title}
          </h1>
          <p className="text-muted-foreground">{enrollmentDetail.enrollment.course.description}</p>
        </div>

        {activeLesson && (
          <div className="space-y-6">
            <div className="aspect-video overflow-hidden rounded-2xl border border-border/80 bg-black">
              <video key={activeLesson.id} controls className="h-full w-full">
                <source src={activeLesson.videoUrl} />
              </video>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{activeLesson.title}</h2>
                <p className="text-sm text-muted-foreground">{activeLesson.description}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Homework</h3>
                <Textarea
                  rows={6}
                  value={homeworkAnswer}
                  onChange={(event) => setHomeworkAnswer(event.target.value)}
                  placeholder="Reflect on the lesson and complete the assigned task."
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit & mark complete"}
                  </Button>
                  {feedback && <p className="text-xs text-muted-foreground">{feedback}</p>}
                </div>
              </div>
              {activeLesson.progress?.submittedAt && (
                <p className="text-xs text-muted-foreground">
                  Last submitted {new Date(activeLesson.progress.submittedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
