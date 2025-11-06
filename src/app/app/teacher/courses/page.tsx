"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { courseCreateSchema, lessonCreateSchema } from "@/lib/validators/courses";
import { useAuth } from "@/components/providers/auth-provider";

interface TeacherCourseDetail {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  isPublished: boolean;
  lessons: Array<{
    id: string;
    title: string;
    description: string;
    orderIndex: number;
  }>;
  enrollmentCount: number;
}

type CourseFormValues = z.infer<typeof courseCreateSchema>;
type LessonFormValues = z.infer<typeof lessonCreateSchema>;

export default function TeacherCoursesPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [courseFeedback, setCourseFeedback] = useState<string | null>(null);
  const [lessonFeedback, setLessonFeedback] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ courses: TeacherCourseDetail[] }>({
    queryKey: ["teacher-courses"],
    queryFn: () => api.get<{ courses: TeacherCourseDetail[] }>("/api/teacher/courses"),
    enabled: isTeacher,
  });

  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "B1",
      price: 99,
      isPublished: false,
    },
  });

  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      homeworkText: "",
      orderIndex: undefined,
      attachmentUrl: "",
    },
  });

  const resetCourseForm = () => {
    courseForm.reset({
      title: "",
      description: "",
      level: "B1",
      price: 99,
      isPublished: false,
    });
  };

  const openCourseDialog = () => {
    setCourseFeedback(null);
    resetCourseForm();
    setCourseDialogOpen(true);
  };

  const createCourse = courseForm.handleSubmit(async (values) => {
    try {
      setCourseFeedback(null);
      await api.post("/api/courses", values);
      await queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      setCourseDialogOpen(false);
      resetCourseForm();
    } catch (error) {
      setCourseFeedback((error as Error).message);
    }
  });

  const openLessonDialog = (courseId: string) => {
    setActiveCourseId(courseId);
    lessonForm.reset({
      title: "",
      description: "",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      homeworkText: "",
      orderIndex: undefined,
      attachmentUrl: "",
    });
    setLessonFeedback(null);
    setLessonDialogOpen(true);
  };

  const addLesson = lessonForm.handleSubmit(async (values) => {
    if (!activeCourseId) return;
    try {
      setLessonFeedback(null);
      await api.post(`/api/courses/${activeCourseId}/lessons`, values);
      await queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      setLessonDialogOpen(false);
    } catch (error) {
      setLessonFeedback((error as Error).message);
    }
  });

  const togglePublish = async (course: TeacherCourseDetail) => {
    await api.patch(`/api/courses/${course.id}`, { isPublished: !course.isPublished });
    await queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
  };

  if (!isTeacher) {
    return <p className="text-sm text-muted-foreground">This section is limited to teachers.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Design, publish, and iterate on your curriculum.</p>
        </div>
        <Button onClick={openCourseDialog}>Create course</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading courses…</p>
      ) : data?.courses.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {data.courses.map((course) => (
            <Card key={course.id} className="border-border/70">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>Level {course.level} • {course.lessons.length} lessons</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => togglePublish(course)}>
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>${course.price.toFixed(2)}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{course.enrollmentCount} enrolled</span>
                </div>
                <div className="rounded-lg border border-border/60">
                  <ScrollArea className="max-h-48">
                    <ul className="divide-y divide-border/60 text-sm">
                      {course.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex items-start justify-between gap-3 px-4 py-3">
                          <div>
                            <div className="font-semibold">Lesson {lesson.orderIndex}: {lesson.title}</div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{lesson.description}</p>
                          </div>
                        </li>
                      ))}
                      {course.lessons.length === 0 && (
                        <li className="px-4 py-4 text-xs text-muted-foreground">No lessons yet.</li>
                      )}
                    </ul>
                  </ScrollArea>
                </div>
                <Button variant="outline" size="sm" onClick={() => openLessonDialog(course.id)}>
                  Add lesson
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
          You don&apos;t have any courses yet. Create your first program to start enrolling students.
        </div>
      )}

      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a course</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={createCourse}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="IELTS Accelerator" {...courseForm.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...courseForm.register("description")} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <select id="level" className="h-11 w-full rounded-lg border border-border bg-background px-3" {...courseForm.register("level")}>
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" min={0} step="0.01" {...courseForm.register("price", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="isPublished" {...courseForm.register("isPublished")} />
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>
            </div>
            {courseFeedback && <p className="text-sm text-destructive">{courseFeedback}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setCourseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create course</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add lesson</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={addLesson}>
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Title</Label>
              <Input id="lesson-title" placeholder="Speaking Lab" {...lessonForm.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-description">Description</Label>
              <Textarea id="lesson-description" rows={3} {...lessonForm.register("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-video">Video URL</Label>
              <Input id="lesson-video" placeholder="https://" {...lessonForm.register("videoUrl")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-homework">Homework instructions</Label>
              <Textarea id="lesson-homework" rows={4} {...lessonForm.register("homeworkText")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-order">Order index (optional)</Label>
              <Input id="lesson-order" type="number" min={1} {...lessonForm.register("orderIndex", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-attachment">Attachment URL (optional)</Label>
              <Input id="lesson-attachment" placeholder="https://" {...lessonForm.register("attachmentUrl")} />
            </div>
            {lessonFeedback && <p className="text-sm text-destructive">{lessonFeedback}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setLessonDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add lesson</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
