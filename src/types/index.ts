import { EnrollmentStatus, LessonLevel, Role, Subject } from "@prisma/client";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  subjects?: Subject[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LessonDto {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  videoUrl: string;
  homeworkText: string;
  attachmentUrl?: string | null;
  isCompleted?: boolean;
}

export interface CourseDto {
  id: string;
  title: string;
  description: string;
  level: LessonLevel;
  subject: Subject;
  price: number;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy?: {
    id: string;
    name: string;
  } | null;
  group?: { id: string; name: string; subject: Subject; description?: string | null } | null;
  lessons?: LessonDto[];
}

export interface EnrollmentSummary {
  id: string;
  status: EnrollmentStatus;
  purchasedAt: string;
  course: {
    id: string;
    title: string;
    level: LessonLevel;
    progress: number;
    completedLessons: number;
    totalLessons: number;
  };
}

export interface EnrollmentDetail {
  id: string;
  status: EnrollmentStatus;
  purchasedAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    level: LessonLevel;
    lessons: Array<
      LessonDto & {
        progress: {
          isCompleted: boolean;
          homeworkAnswer: string | null;
          submittedAt: string | null;
        };
      }
    >;
  };
}

export interface BookDto {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImageUrl: string;
}

export interface ScheduleSlotDto {
  id: string;
  date: string;
  durationMinutes: number;
  description?: string | null;
  onlineLink?: string | null;
  course: { id: string; title: string };
  lesson?: { id: string; title: string; orderIndex?: number | null } | null;
  student?: { id: string; name: string; email?: string | null } | null;
  teacher?: { id: string; name: string } | null;
}

export interface TeacherEnrollmentDto {
  id: string;
  status: EnrollmentStatus;
  purchasedAt: string;
  student: { id: string; name: string; email: string };
  course: { id: string; title: string; level: LessonLevel };
}

export interface CourseGroupDto {
  id: string;
  name: string;
  description?: string | null;
  subject: Subject;
  _count?: { courses: number };
}
