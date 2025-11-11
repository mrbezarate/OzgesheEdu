import { Course, Lesson, User, CourseGroup } from "@prisma/client";

type CourseWithRelations = Course & {
  createdBy?: Pick<User, "id" | "name"> | null;
  lessons?: Lesson[];
  group?: Pick<CourseGroup, "id" | "name" | "subject" | "description"> | null;
};

type LessonWithProgress = Lesson & {
  progress?: { isCompleted: boolean }[];
};

export function serializeCourse(course: CourseWithRelations) {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level,
    subject: course.subject,
    price: Number(course.price),
    isPublished: course.isPublished,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    createdBy: course.createdBy
      ? {
          id: course.createdBy.id,
          name: course.createdBy.name,
        }
      : null,
    group: course.group
      ? {
          id: course.group.id,
          name: course.group.name,
          subject: course.group.subject,
          description: course.group.description,
        }
      : null,
    lessons: course.lessons?.sort((a, b) => a.orderIndex - b.orderIndex) ?? [],
  };
}

export function serializeLesson(lesson: LessonWithProgress) {
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    orderIndex: lesson.orderIndex,
    videoUrl: lesson.videoUrl,
    homeworkText: lesson.homeworkText,
    attachmentUrl: lesson.attachmentUrl,
    isCompleted: lesson.progress?.[0]?.isCompleted ?? false,
  };
}
