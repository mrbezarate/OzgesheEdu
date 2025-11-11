import { Language } from "@/components/providers/language-provider";

type DashboardMetricsCopy = {
  title: string;
  description: string;
};

export type DashboardTranslations = {
  welcomeTitle: string;
  welcomeSubtitle: string;
  redirectText: string;
  xpCard: {
    profileLabel: string;
    levelLabel: string;
    maxLabel: string;
    xpToPrefix: string;
    legendAchieved: string;
    xpSummaryPrefix: string;
    lessonsLabel: string;
    coursesLabel: string;
  };
  metrics: {
    inProgress: DashboardMetricsCopy;
    completed: DashboardMetricsCopy;
    lessons: DashboardMetricsCopy;
  };
  courses: {
    title: string;
    description: string;
    empty: string;
    progressLabel: string;
    continue: string;
  };
  schedule: {
    title: string;
    description: string;
    empty: string;
    sessionFallback: string;
    joinCta: string;
    durationSuffix: string;
  };
};

const translations: Record<Language, DashboardTranslations> = {
  en: {
    welcomeTitle: "Welcome back",
    welcomeSubtitle: "Continue your lessons and stay on top of homework submissions.",
    redirectText: "Redirecting to your dashboard…",
    xpCard: {
      profileLabel: "Profile",
      levelLabel: "Level",
      maxLabel: "(max)",
      xpToPrefix: "XP to lvl",
      legendAchieved: "Legend achieved",
      xpSummaryPrefix: "",
      lessonsLabel: "XP lessons",
      coursesLabel: "XP courses",
    },
    metrics: {
      inProgress: {
        title: "Courses in progress",
        description: "Keep momentum by finishing this week's lessons.",
      },
      completed: {
        title: "Completed courses",
        description: "Celebrate your wins and revisit key lessons anytime.",
      },
      lessons: {
        title: "Lessons this week",
        description: "Upcoming sessions booked with your teacher.",
      },
    },
    courses: {
      title: "Active courses",
      description: "Your enrolled programs and completion status.",
      empty: "You have no active courses yet. Explore the catalogue to get started.",
      progressLabel: "{completed} of {total} lessons completed",
      continue: "Continue",
    },
    schedule: {
      title: "Upcoming sessions",
      description: "Stay prepared for your live lessons.",
      empty: "No upcoming lessons yet. Coordinate with your teacher to schedule the next session.",
      sessionFallback: "Live coaching session",
      joinCta: "Join session",
      durationSuffix: "mins",
    },
  },
  ru: {
    welcomeTitle: "С возвращением",
    welcomeSubtitle: "Продолжайте занятия и держите домашние задания под контролем.",
    redirectText: "Перенаправляем в ваш кабинет…",
    xpCard: {
      profileLabel: "Профиль",
      levelLabel: "Уровень",
      maxLabel: "(макс.)",
      xpToPrefix: "XP до уровня",
      legendAchieved: "Статус Legend достигнут",
      xpSummaryPrefix: "",
      lessonsLabel: "XP уроки",
      coursesLabel: "XP курсы",
    },
    metrics: {
      inProgress: {
        title: "Идут курсы",
        description: "Сохраняйте темп и завершайте занятия этой недели.",
      },
      completed: {
        title: "Завершённые курсы",
        description: "Отмечайте результаты и при необходимости возвращайтесь к урокам.",
      },
      lessons: {
        title: "Уроки на этой неделе",
        description: "Следующие сессии, запланированные с преподавателем.",
      },
    },
    courses: {
      title: "Активные курсы",
      description: "Ваши программы и статус выполнения.",
      empty: "Пока нет активных курсов. Откройте каталог, чтобы выбрать программу.",
      progressLabel: "{completed} из {total} уроков завершено",
      continue: "Продолжить",
    },
    schedule: {
      title: "Предстоящие занятия",
      description: "Подготовьтесь к живым урокам заранее.",
      empty: "Пока нет встреч. Свяжитесь с преподавателем, чтобы запланировать урок.",
      sessionFallback: "Живое занятие",
      joinCta: "Подключиться",
      durationSuffix: "мин",
    },
  },
  kk: {
    welcomeTitle: "Қайта келдіңіз",
    welcomeSubtitle: "Сабақтарды жалғастырып, үй тапсырмаларын дер кезінде тапсырыңыз.",
    redirectText: "Кабинетіңізге бағыттап жатырмыз…",
    xpCard: {
      profileLabel: "Профиль",
      levelLabel: "Деңгей",
      maxLabel: "(макс.)",
      xpToPrefix: "Келесі деңгейге XP",
      legendAchieved: "Legend мәртебесі алынды",
      xpSummaryPrefix: "",
      lessonsLabel: "XP сабақтар",
      coursesLabel: "XP курстар",
    },
    metrics: {
      inProgress: {
        title: "Жүріп жатқан курстар",
        description: "Осы аптадағы сабақтарды аяқтап, қарқыныңызды сақтаңыз.",
      },
      completed: {
        title: "Аяқталған курстар",
        description: "Нәтижелеріңізді атап, қажет кезде сабақтарға қайта оралыңыз.",
      },
      lessons: {
        title: "Осы аптадағы сабақтар",
        description: "Алдағы кездесулер мен ментормен сессиялар.",
      },
    },
    courses: {
      title: "Белсенді курстар",
      description: "Қатысып жүрген бағдарламалар мен прогресс.",
      empty: "Әзірге белсенді курс жоқ. Каталогтан бағдарлама таңдаңыз.",
      progressLabel: "{completed} / {total} сабақ аяқталды",
      continue: "Жалғастыру",
    },
    schedule: {
      title: "Алдағы сессиялар",
      description: "Жанды сабақтарға алдын ала дайындалыңыз.",
      empty: "Әзірге кездесу жоқ. Келесі сабақты жоспарлау үшін ұстазбен келісіңіз.",
      sessionFallback: "Тікелей сессия",
      joinCta: "Қосылу",
      durationSuffix: "мин",
    },
  },
};

export const getDashboardTranslations = (language: Language) =>
  translations[language] ?? translations.en;
