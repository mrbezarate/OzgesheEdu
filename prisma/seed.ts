import { PrismaClient, Role, LessonLevel, EnrollmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.scheduleSlot.deleteMany(),
    prisma.lessonProgress.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.course.deleteMany(),
    prisma.book.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const password = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: "Ava Reynolds",
      email: "admin@linguaflow.dev",
      passwordHash: password,
      role: Role.ADMIN,
    },
  });

  const teacherAlice = await prisma.user.create({
    data: {
      name: "Alice Carter",
      email: "alice@linguaflow.dev",
      passwordHash: password,
      role: Role.TEACHER,
    },
  });

  const teacherNoah = await prisma.user.create({
    data: {
      name: "Noah Singh",
      email: "noah@linguaflow.dev",
      passwordHash: password,
      role: Role.TEACHER,
    },
  });

  const students = await Promise.all(
    [
      { name: "Mila Chen", email: "mila@student.dev" },
      { name: "Leo Martins", email: "leo@student.dev" },
      { name: "Sofia Malik", email: "sofia@student.dev" },
    ].map((student) =>
      prisma.user.create({
        data: {
          ...student,
          passwordHash: password,
          role: Role.STUDENT,
        },
      }),
    ),
  );

  const [contemporaryCourse, examCourse] = await Promise.all([
    prisma.course.create({
      data: {
        title: "Contemporary Conversations",
        description: "Intermediate speaking course focused on real-world discussions and confidence building.",
        level: LessonLevel.B1,
        price: "129.00",
        isPublished: true,
        createdById: teacherAlice.id,
        lessons: {
          create: Array.from({ length: 6 }).map((_, index) => ({
            orderIndex: index + 1,
            title: `Conversation Module ${index + 1}`,
            description:
              "Guided dialogue practice with vocabulary development and live speaking simulations.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            homeworkText:
              "Record a 2-minute audio answering the discussion prompt and share two new phrases you learned.",
          })),
        },
      },
      include: { lessons: true },
    }),
    prisma.course.create({
      data: {
        title: "IELTS Accelerator",
        description: "Targeted preparation for IELTS speaking and writing with weekly feedback loops.",
        level: LessonLevel.B2,
        price: "159.00",
        isPublished: true,
        createdById: teacherNoah.id,
        lessons: {
          create: Array.from({ length: 5 }).map((_, index) => ({
            orderIndex: index + 1,
            title: `Exam Prep Sprint ${index + 1}`,
            description:
              "Focused exam simulations with vocabulary banks and strategy breakdowns.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            homeworkText:
              "Submit your written response to the mock question and highlight phrases you are unsure about.",
          })),
        },
      },
      include: { lessons: true },
    }),
  ]);

  await prisma.enrollment.create({
    data: {
      studentId: students[0].id,
      courseId: contemporaryCourse.id,
      teacherId: teacherAlice.id,
      status: EnrollmentStatus.ACTIVE,
      lessonProgress: {
        create: [
          {
            lessonId: contemporaryCourse.lessons[0].id,
            isCompleted: true,
            homeworkAnswer: "Shared my daily routine in English with confidence.",
            submittedAt: new Date(),
          },
          {
            lessonId: contemporaryCourse.lessons[1].id,
            isCompleted: false,
          },
        ],
      },
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: students[1].id,
      courseId: contemporaryCourse.id,
      teacherId: teacherAlice.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: students[2].id,
      courseId: examCourse.id,
      teacherId: teacherNoah.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  const [book1, book2] = await prisma.$transaction([
    prisma.book.create({
      data: {
        title: "Fluent Futures",
        author: "Riley Cooper",
        description:
          "Short stories and mini debates designed to level up comprehension and speaking agility.",
        price: "24.99",
        coverImageUrl:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
      },
    }),
    prisma.book.create({
      data: {
        title: "Grammar in Motion",
        author: "Jordan Ellis",
        description:
          "Interactive grammar workout book blending micro lessons with deliberate practice tasks.",
        price: "29.50",
        coverImageUrl:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80",
      },
    }),
    prisma.book.create({
      data: {
        title: "IELTS Writing Mastery",
        author: "Emily Novak",
        description: "Step-by-step templates and annotated samples for high-band writing responses.",
        price: "32.00",
        coverImageUrl:
          "https://images.unsplash.com/photo-1485119584289-30ca2b38c67e?auto=format&fit=crop&w=600&q=80",
      },
    }),
  ]);

  await prisma.order.create({
    data: {
      userId: students[0].id,
      totalPrice: "56.49",
      items: {
        create: [
          {
            bookId: book1.id,
            quantity: 1,
            priceAtPurchase: book1.price,
          },
          {
            bookId: book2.id,
            quantity: 1,
            priceAtPurchase: book2.price,
          },
        ],
      },
    },
  });

  const baseDate = new Date();
  baseDate.setHours(9, 0, 0, 0);

  await prisma.scheduleSlot.createMany({
    data: [
      {
        teacherId: teacherAlice.id,
        courseId: contemporaryCourse.id,
        lessonId: contemporaryCourse.lessons[0].id,
        studentId: students[0].id,
        date: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000),
        durationMinutes: 60,
        description: "Live session: Structuring compelling introductions",
        onlineLink: "https://meet.linguaflow.dev/session/123",
      },
      {
        teacherId: teacherAlice.id,
        courseId: contemporaryCourse.id,
        lessonId: contemporaryCourse.lessons[1].id,
        studentId: students[1].id,
        date: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        durationMinutes: 60,
        description: "Group conversation lab",
        onlineLink: "https://meet.linguaflow.dev/session/456",
      },
      {
        teacherId: teacherNoah.id,
        courseId: examCourse.id,
        lessonId: examCourse.lessons[0].id,
        studentId: students[2].id,
        date: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        durationMinutes: 90,
        description: "Writing Task 2 clinic",
        onlineLink: "https://meet.linguaflow.dev/session/789",
      },
    ],
  });

  console.info("Database seeded successfully ✅");
}

main()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
