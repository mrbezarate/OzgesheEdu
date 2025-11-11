import { Language } from "@/components/providers/language-provider";

export type AppNavLabelKey =
  | "studentDashboard"
  | "studentCourses"
  | "books"
  | "teacherDashboard"
  | "teacherCourses"
  | "teacherSchedule"
  | "adminUsers";

export type CommonTranslations = {
  nav: {
    home: string;
    courses: string;
    books: string;
    login: string;
  };
  auth: {
    dashboard: string;
    login: string;
    logout: string;
    signup: string;
  };
  footer: {
    about: string;
    exploreTitle: string;
    explore: { courses: string; books: string; login: string };
    connect: string;
    email: string;
    rights: string;
  };
  appNav: {
    mobileTitle: string;
    labels: Record<AppNavLabelKey, string>;
  };
  appShell: {
    loading: string;
  };
};

const translations: Record<Language, CommonTranslations> = {
  en: {
    nav: {
      home: "Home",
      courses: "Courses",
      books: "Books",
      login: "Login",
    },
    auth: {
      dashboard: "Dashboard",
      login: "Log in",
      logout: "Logout",
      signup: "Get started",
    },
    footer: {
      about: "A modern learning platform for English learners and teachers to collaborate, practice, and grow with intention.",
      exploreTitle: "Explore",
      explore: { courses: "Courses", books: "Books", login: "Login" },
      connect: "Connect",
      email: "hello@ozgeshe.edu",
      rights: `© ${new Date().getFullYear()} OzgesheEdu. All rights reserved.`,
    },
    appNav: {
      mobileTitle: "Navigate",
      labels: {
        studentDashboard: "Dashboard",
        studentCourses: "My Courses",
        books: "Book Store",
        teacherDashboard: "Dashboard",
        teacherCourses: "Courses",
        teacherSchedule: "Schedule",
        adminUsers: "Users",
      },
    },
    appShell: {
      loading: "Loading your workspace…",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      courses: "Курсы",
      books: "Книги",
      login: "Вход",
    },
    auth: {
      dashboard: "Кабинет",
      login: "Войти",
      logout: "Выйти",
      signup: "Начать",
    },
    footer: {
      about: "Современная платформа для студентов и преподавателей английского, где всё обучение собрано в одном месте.",
      exploreTitle: "Разделы",
      explore: { courses: "Курсы", books: "Книги", login: "Войти" },
      connect: "Контакты",
      email: "hello@ozgeshe.edu",
      rights: `© ${new Date().getFullYear()} OzgesheEdu. Все права защищены.`,
    },
    appNav: {
      mobileTitle: "Навигация",
      labels: {
        studentDashboard: "Кабинет",
        studentCourses: "Мои курсы",
        books: "Магазин книг",
        teacherDashboard: "Кабинет",
        teacherCourses: "Курсы",
        teacherSchedule: "Расписание",
        adminUsers: "Пользователи",
      },
    },
    appShell: {
      loading: "Загружаем рабочее пространство…",
    },
  },
  kk: {
    nav: {
      home: "Басты бет",
      courses: "Курстар",
      books: "Кітаптар",
      login: "Кіру",
    },
    auth: {
      dashboard: "Кабинет",
      login: "Кіру",
      logout: "Шығу",
      signup: "Тіркелу",
    },
    footer: {
      about: "Ozgeshe Oku Ortalygy — балаларға арналған заманауи білім кеңістігі, мұнда ата-ана, тәлімгер және оқушы бірге жұмыс істейді.",
      exploreTitle: "Бөлімдер",
      explore: { courses: "Курстар", books: "Кітаптар", login: "Кіру" },
      connect: "Байланыс",
      email: "hello@ozgeshe.edu",
      rights: `© ${new Date().getFullYear()} OzgesheEdu. Барлық құқықтар қорғалған.`,
    },
    appNav: {
      mobileTitle: "Навигация",
      labels: {
        studentDashboard: "Кабинет",
        studentCourses: "Менің курстарым",
        books: "Кітап дүкені",
        teacherDashboard: "Кабинет",
        teacherCourses: "Курстар",
        teacherSchedule: "Кесте",
        adminUsers: "Пайдаланушылар",
      },
    },
    appShell: {
      loading: "Жұмыс кеңістігі жүктелуде…",
    },
  },
};

export const getCommonTranslations = (language: Language) =>
  translations[language] ?? translations.en;
