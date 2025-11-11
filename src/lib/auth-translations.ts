import { Language } from "@/components/providers/language-provider";

type TeacherRole = "STUDENT" | "TEACHER";

type AuthSection = {
  title: string;
  description: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submit: string;
  submitting: string;
  footerPrompt: string;
  footerCta: string;
  demoTitle?: string;
  roleHeading?: string;
  roleError?: string;
  roles?: Record<TeacherRole, string>;
  loadingMessage?: string;
  errorFallback?: string;
};

export type AuthTranslations = {
  login: AuthSection;
  register: AuthSection;
};

const translations: Record<Language, AuthTranslations> = {
  en: {
    login: {
      title: "Log in to Ozgeshe Oku Ortalygy",
      description: "Enter your credentials to continue where you left off.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      submit: "Sign in",
      submitting: "Signing in…",
      footerPrompt: "No account yet?",
      footerCta: "Create one",
      demoTitle: "Demo credentials",
      loadingMessage: "Loading form…",
      errorFallback: "Unable to sign in",
    },
    register: {
      title: "Create your account",
      description: "Join the Ozgeshe community and access curated programs.",
      nameLabel: "Full name",
      namePlaceholder: "Aruzhan Bek",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 8 characters",
      submit: "Create account",
      submitting: "Creating account…",
      footerPrompt: "Already have an account?",
      footerCta: "Log in",
      roleHeading: "Choose your role",
      roleError: "Please select a role to continue.",
      roles: {
        STUDENT: "Student",
        TEACHER: "Teacher",
      },
      errorFallback: "Unable to create account",
    },
  },
  ru: {
    login: {
      title: "Войти в Ozgeshe Oku Ortalygy",
      description: "Введите свои данные, чтобы продолжить обучение.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      submit: "Войти",
      submitting: "Выполняем вход…",
      footerPrompt: "Ещё нет аккаунта?",
      footerCta: "Создать",
      demoTitle: "Демо-логины",
      loadingMessage: "Форма загружается…",
      errorFallback: "Не удалось войти",
    },
    register: {
      title: "Создайте аккаунт",
      description: "Вступайте в сообщество Ozgeshe и получайте доступ к программам.",
      nameLabel: "Полное имя",
      namePlaceholder: "Аружан Бек",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Минимум 8 символов",
      submit: "Создать аккаунт",
      submitting: "Создаём аккаунт…",
      footerPrompt: "Уже есть аккаунт?",
      footerCta: "Войти",
      roleHeading: "Кто вы?",
      roleError: "Пожалуйста, выберите роль.",
      roles: {
        STUDENT: "Студент",
        TEACHER: "Преподаватель",
      },
      errorFallback: "Не удалось создать аккаунт",
    },
  },
  kk: {
    login: {
      title: "Ozgeshe Oku Ortalygy жүйесіне кіріңіз",
      description: "Сабақтарды жалғастыру үшін деректерді енгізіңіз.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Құпия сөз",
      passwordPlaceholder: "••••••••",
      submit: "Кіру",
      submitting: "Кіру жүріп жатыр…",
      footerPrompt: "Әлі аккаунт жоқ па?",
      footerCta: "Тіркелу",
      demoTitle: "Демо-профильдер",
      loadingMessage: "Форма жүктелуде…",
      errorFallback: "Кіру мүмкін болмады",
    },
    register: {
      title: "Аккаунт құрыңыз",
      description: "Ozgeshe қауымдастығына қосылып, бағдарламаларды ашыңыз.",
      nameLabel: "Толық аты-жөні",
      namePlaceholder: "Аружан Бек",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Құпия сөз",
      passwordPlaceholder: "Кемінде 8 таңба",
      submit: "Аккаунт құру",
      submitting: "Аккаунт құрылуда…",
      footerPrompt: "Аккаунт бар ма?",
      footerCta: "Кіру",
      roleHeading: "Өзіңізді таңдаңыз",
      roleError: "Жалғастыру үшін рөлді таңдаңыз.",
      roles: {
        STUDENT: "Оқушы",
        TEACHER: "Ұстаз",
      },
      errorFallback: "Аккаунт құру мүмкін болмады",
    },
  },
};

export const getAuthTranslations = (language: Language) =>
  translations[language] ?? translations.en;
