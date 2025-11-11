"use client";

import { Subject } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { courseCreateSchema, courseGroupSchema, lessonCreateSchema } from "@/lib/validators/courses";
import { useAuth } from "@/components/providers/auth-provider";
import { formatSubject } from "@/lib/subjects";
import { useLanguage } from "@/components/providers/language-provider";
import type { Language } from "@/components/providers/language-provider";
import type { CourseGroupDto } from "@/types";

interface TeacherCourseDetail {
  id: string;
  createdById: string;
  createdAt: string;
  title: string;
  description: string;
  level: string;
  subject: Subject;
  price: number;
  isPublished: boolean;
  group?: { id: string; name: string; subject: Subject } | null;
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
type CourseGroupFormValues = z.infer<typeof courseGroupSchema>;

export default function TeacherCoursesPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [courseFeedback, setCourseFeedback] = useState<string | null>(null);
  const [lessonFeedback, setLessonFeedback] = useState<string | null>(null);
  const [groupFeedback, setGroupFeedback] = useState<string | null>(null);
  const [courseSort, setCourseSort] = useState<"title" | "created">("title");

  const { data, isLoading } = useQuery<{ courses: TeacherCourseDetail[] }>({
    queryKey: ["teacher-courses"],
    queryFn: () => api.get<{ courses: TeacherCourseDetail[] }>("/api/teacher/courses"),
    enabled: isTeacher,
  });

  const { data: courseGroupsData } = useQuery<{ groups: CourseGroupDto[] }>({
    queryKey: ["course-groups"],
    queryFn: () => api.get<{ groups: CourseGroupDto[] }>("/api/course-groups"),
    enabled: isTeacher,
  });

  const courseGroups = courseGroupsData?.groups ?? [];
  const noGroupMessages: Record<Language, string> = {
    en: "No groups for this subject yet. Contact an administrator.",
    ru: "Для этого предмета нет групп. Обратитесь к администратору.",
    kk: "Бұл пән үшін топ әлі жоқ. Әкімшіге хабарласыңыз.",
  };
  const noGroupMessage = noGroupMessages[language] ?? noGroupMessages.en;

  const availableSubjects = useMemo(() => {
    if (user?.role === "TEACHER") {
      return user.subjects && user.subjects.length > 0 ? user.subjects : [];
    }
    return Object.values(Subject);
  }, [user]);

  const defaultSubject = availableSubjects[0] ?? Subject.OTHER;

  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "B1",
      price: 99,
      isPublished: false,
      subject: defaultSubject,
      groupId: "",
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

  const groupForm = useForm<CourseGroupFormValues>({
    resolver: zodResolver(courseGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: Subject.ENGLISH,
    },
  });

  const resetCourseForm = () => {
    courseForm.reset({
      title: "",
      description: "",
      level: "B1",
      price: 99,
      isPublished: false,
      subject: defaultSubject,
      groupId: "",
    });
  };

  const resetGroupForm = () => {
    groupForm.reset({
      name: "",
      description: "",
      subject: Subject.ENGLISH,
    });
  };

  const selectedSubject = useWatch({
    control: courseForm.control,
    name: "subject",
  }) ?? defaultSubject;
  const filteredGroups = courseGroups.filter((group) => group.subject === selectedSubject);
  const selectedGroupId =
    useWatch({
      control: courseForm.control,
      name: "groupId",
    }) ?? "";

  useEffect(() => {
    if (filteredGroups.length === 0) {
      courseForm.setValue("groupId", "");
      return;
    }
    const exists = filteredGroups.some((group) => group.id === selectedGroupId);
    if (!exists) {
      courseForm.setValue("groupId", filteredGroups[0].id);
    }
  }, [filteredGroups, selectedGroupId, courseForm]);

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

  const createGroup = groupForm.handleSubmit(async (values) => {
    try {
      setGroupFeedback(null);
      await api.post("/api/course-groups", values);
      await queryClient.invalidateQueries({ queryKey: ["course-groups"] });
      resetGroupForm();
    } catch (error) {
      setGroupFeedback((error as Error).message);
    }
  });

  const deleteCourse = async (course: TeacherCourseDetail) => {
    if (!window.confirm(`Delete course "${course.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.del(`/api/courses/${course.id}`);
      await queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
    } catch (error) {
      window.alert((error as Error).message);
    }
  };

  const deleteGroup = async (group: CourseGroupDto) => {
    if (group._count?.courses) {
      window.alert("Remove or move all courses out of the group before deleting it.");
      return;
    }
    if (!window.confirm(`Delete course group "${group.name}"?`)) {
      return;
    }
    try {
      await api.del(`/api/course-groups/${group.id}`);
      await queryClient.invalidateQueries({ queryKey: ["course-groups"] });
    } catch (error) {
      window.alert((error as Error).message);
    }
  };

  const togglePublish = async (course: TeacherCourseDetail) => {
    await api.patch(`/api/courses/${course.id}`, { isPublished: !course.isPublished });
    await queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
  };

  if (!isTeacher) {
    return <p className="text-sm text-muted-foreground">This section is limited to teachers.</p>;
  }

  const sortedCourses = useMemo(() => {
    if (!data?.courses) return [];
    const items = [...data.courses];
    if (courseSort === "title") {
      return items.sort((a, b) => a.title.localeCompare(b.title));
    }
    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data?.courses, courseSort]);

  if (user?.role === "TEACHER" && availableSubjects.length === 0) {
    return <p className="text-sm text-muted-foreground">You do not have subject permissions yet. Please contact an administrator.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Design, publish, and iterate on your curriculum.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            value={courseSort}
            onChange={(event) => setCourseSort(event.target.value as typeof courseSort)}
          >
            <option value="title">Sort A-Z</option>
            <option value="created">Newest first</option>
          </select>
          <Button onClick={openCourseDialog}>Create course</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading courses…</p>
      ) : sortedCourses.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {sortedCourses.map((course) => (
            <Card key={course.id} className="border-border/70">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      Level {course.level} • {course.lessons.length} lessons
                      <span className="ml-2 text-xs uppercase text-muted-foreground">
                        {formatSubject(course.subject, language)}{course.group ? ` • ${course.group.name}` : ""}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => togglePublish(course)}>
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    {(isAdmin || course.createdById === user?.id) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteCourse(course)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
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

      {isAdmin && (
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Course groups</CardTitle>
            <CardDescription>Organize catalog clusters for any subject and remove unused ones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={createGroup}>
              <div className="grid gap-3 md:grid-cols-[2fr,1fr,auto]">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Name</Label>
                  <Input id="group-name" placeholder="Conversation Labs" {...groupForm.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-subject">Subject</Label>
                  <select
                    id="group-subject"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3"
                    {...groupForm.register("subject")}
                  >
                    {Object.values(Subject).map((subject) => (
                      <option key={subject} value={subject}>
                        {formatSubject(subject, language)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full md:w-auto">
                    Create group
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea id="group-description" rows={3} {...groupForm.register("description")} />
              </div>
              {groupFeedback && <p className="text-sm text-destructive">{groupFeedback}</p>}
            </form>
            <div>
              {courseGroups.length ? (
                <ul className="divide-y divide-border/60">
                  {courseGroups.map((group) => (
                    <li key={group.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold">{group.name}</p>
                        <p className="text-xs uppercase text-muted-foreground">
                          {formatSubject(group.subject, language)}
                        </p>
                        {group.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {(group._count?.courses ?? 0)} courses
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={(group._count?.courses ?? 0) > 0}
                          onClick={() => deleteGroup(group)}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No groups yet. Create one to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>
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
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3"
                  {...courseForm.register("subject")}
                >
                  {availableSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {formatSubject(subject, language)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupId">Course group</Label>
                <select
                  id="groupId"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3"
                  {...courseForm.register("groupId")}
                  disabled={filteredGroups.length === 0}
                >
                  {filteredGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {filteredGroups.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {noGroupMessage}
                  </p>
                )}
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
