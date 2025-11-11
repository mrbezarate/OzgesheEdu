"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Subject } from "@prisma/client";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api-client";
import { useLanguage } from "@/components/providers/language-provider";
import type { Language } from "@/components/providers/language-provider";
import { formatSubject } from "@/lib/subjects";
import { formatUsdAsKzt } from "@/lib/currency";
import type { CourseDto } from "@/types";

type CoursesCopy = {
  badge: string;
  title: string;
  description: string;
  cta: string;
  otherGroup: string;
};

const COURSE_COPY: Record<Language, CoursesCopy> = {
  en: {
    badge: "Curated curriculum",
    title: "Courses designed for measurable progress",
    description:
      "Choose from guided programs crafted by expert teachers. Unlock lessons, follow structured homework, and track achievements.",
    cta: "Enroll now",
    otherGroup: "Other courses",
  },
  ru: {
    badge: "Подборка программ",
    title: "Курсы, которые дают измеримый прогресс",
    description:
      "Выбирайте программы от экспертов, следуйте структурированным урокам и отслеживайте свои достижения.",
    cta: "Записаться",
    otherGroup: "Другие курсы",
  },
  kk: {
    badge: "Таңдамалы бағдарлама",
    title: "Нақты нәтижеге жетелейтін курстар",
    description:
      "Қамқор ұстаздар дайындаған бағдарламаларды таңдаңыз. Сабақтарды ашып, құрылымдалған тапсырмаларды орындап, прогрессті бақылаңыз.",
    cta: "Қатысу",
    otherGroup: "Басқа курстар",
  },
};

export default function CoursesPage() {
  const { language } = useLanguage();
  const copy = COURSE_COPY[language] ?? COURSE_COPY.en;
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
          <Badge variant="secondary">{copy.badge}</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.description}</p>
        </div>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading courses…</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupCourses(courses, language, copy.otherGroup)).map(([groupKey, group]) => (
              <section key={groupKey} className="space-y-4 rounded-2xl border border-border/60 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold">{group.title}</h2>
                    {group.description && (
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary">{group.subjectLabel}</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.courses.map((course) => (
                    <Card key={course.id} className="flex flex-col border-border/80 bg-background/80">
                      <CardHeader className="space-y-3">
                        {shouldShowLevel(course.subject) && (
                          <Badge variant="outline" className="w-fit">
                            Level {course.level}
                          </Badge>
                        )}
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto space-y-4">
                        <div className="text-lg font-semibold">
                          {formatUsdAsKzt(course.price, language)}
                        </div>
                        <Button asChild className="w-full">
                          <Link href={`/login?redirect=/courses`}>
                            {copy.cta}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}

function shouldShowLevel(subject: Subject) {
  return subject === Subject.ENGLISH || subject === Subject.IELTS;
}

function groupCourses(courses: CourseDto[], language: Language, fallbackGroupTitle: string) {
  const map = new Map<
    string,
    { title: string; description?: string | null; subjectLabel: string; courses: CourseDto[] }
  >();

  courses.forEach((course) => {
    const key = course.group?.id ?? `other-${course.subject}`;
    if (!map.has(key)) {
      map.set(key, {
        title:
          course.group?.name ??
          fallbackGroupTitle,
        description: course.group?.description,
        subjectLabel: formatSubject(course.subject, language),
        courses: [],
      });
    }
    map.get(key)!.courses.push(course);
  });

  return Object.fromEntries(map.entries());
}
