import { Subject } from "@prisma/client";

export const SUBJECT_LABELS: Record<Subject, string> = {
  ENGLISH: "English",
  IELTS: "IELTS",
  KAZAKH: "Kazakh language",
  RUSSIAN: "Russian language",
  MATH: "Mathematics",
  PHYSICS: "Physics",
  CHEMISTRY: "Chemistry",
  BIOLOGY: "Biology",
  HISTORY: "History",
  IT: "IT fundamentals",
  PROGRAMMING: "Programming",
  NIS_PREP: "NIS preparation",
  ENT_PREP: "ENT preparation",
  OTHER: "General",
};

export const SUBJECT_LABELS_RU: Record<Subject, string> = {
  ENGLISH: "Английский",
  IELTS: "IELTS",
  KAZAKH: "Казахский язык",
  RUSSIAN: "Русский язык",
  MATH: "Математика",
  PHYSICS: "Физика",
  CHEMISTRY: "Химия",
  BIOLOGY: "Биология",
  HISTORY: "История",
  IT: "Информатика",
  PROGRAMMING: "Программирование",
  NIS_PREP: "Подготовка к НИШ",
  ENT_PREP: "Подготовка к ЕНТ",
  OTHER: "Общий курс",
};

export const SUBJECT_LABELS_KK: Record<Subject, string> = {
  ENGLISH: "Ағылшын тілі",
  IELTS: "IELTS",
  KAZAKH: "Қазақ тілі",
  RUSSIAN: "Орыс тілі",
  MATH: "Математика",
  PHYSICS: "Физика",
  CHEMISTRY: "Химия",
  BIOLOGY: "Биология",
  HISTORY: "Тарих",
  IT: "IT негіздері",
  PROGRAMMING: "Бағдарламалау",
  NIS_PREP: "NIS дайындығы",
  ENT_PREP: "ҰБТ дайындығы",
  OTHER: "Жалпы курс",
};

export const formatSubject = (subject: Subject, locale: "en" | "ru" | "kk" = "en") => {
  if (locale === "ru") {
    return SUBJECT_LABELS_RU[subject] ?? subject;
  }
  if (locale === "kk") {
    return SUBJECT_LABELS_KK[subject] ?? subject;
  }
  return SUBJECT_LABELS[subject] ?? subject;
};
