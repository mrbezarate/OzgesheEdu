import { Course, Lesson, User } from "@prisma/client";

type CourseWithRelations = Course & {
  createdBy?: Pick<User, "id" | "name"> | null;
  lessons?: Lesson[];
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
