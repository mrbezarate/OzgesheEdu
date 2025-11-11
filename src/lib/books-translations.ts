import { Language } from "@/components/providers/language-provider";

type PublicBooksCopy = {
  title: string;
  description: string;
  loading: string;
  error: string;
  button: string;
};

type AppBooksCopy = {
  title: string;
  subtitle: string;
  cartLabel: string;
  cartTitle: string;
  cartEmpty: string;
  remove: string;
  total: string;
  orderSuccess: string;
  placeOrder: string;
  buttonAdd: string;
  ordersTitle: string;
  ordersEmpty: string;
  loading: string;
};

export type BooksTranslations = {
  public: PublicBooksCopy;
  app: AppBooksCopy;
};

const translations: Record<Language, BooksTranslations> = {
  en: {
    public: {
      title: "Curated English bookshelf",
      description:
        "Discover books recommended by our mentors to extend lessons, improve grammar, and inspire curious minds.",
      loading: "Loading books…",
      error: "Unable to load books right now.",
      button: "Add to cart",
    },
    app: {
      title: "Book store",
      subtitle: "Enhance your lessons with curated reading material.",
      cartLabel: "Cart",
      cartTitle: "Your cart",
      cartEmpty: "Your cart is empty.",
      remove: "Remove",
      total: "Total",
      orderSuccess: "Order placed successfully.",
      placeOrder: "Place order",
      buttonAdd: "Add to cart",
      ordersTitle: "Recent orders",
      ordersEmpty: "No orders yet.",
      loading: "Loading books…",
    },
  },
  ru: {
    public: {
      title: "Подборка вдохновляющих книг",
      description:
        "Откройте книги, которые рекомендуют наставники, чтобы усилить уроки, подтянуть грамматику и поддерживать интерес.",
      loading: "Загружаем книги…",
      error: "Сейчас не удалось загрузить список книг.",
      button: "Добавить в корзину",
    },
    app: {
      title: "Магазин книг",
      subtitle: "Дополните занятия тщательно подобранной литературой.",
      cartLabel: "Корзина",
      cartTitle: "Ваша корзина",
      cartEmpty: "Корзина пуста.",
      remove: "Удалить",
      total: "Итого",
      orderSuccess: "Заказ успешно оформлен.",
      placeOrder: "Оформить заказ",
      buttonAdd: "Добавить",
      ordersTitle: "Недавние заказы",
      ordersEmpty: "Заказов пока нет.",
      loading: "Загружаем книги…",
    },
  },
  kk: {
    public: {
      title: "Таңдамалы кітап сөресі",
      description:
        "Ұстаздар ұсынатын кітаптармен сабақтарды толықтырып, грамматиканы жақсартып, қызығушылықты арттырыңыз.",
      loading: "Кітаптар жүктелуде…",
      error: "Кітаптар тізімін жүктеу мүмкін болмады.",
      button: "Себетке қосу",
    },
    app: {
      title: "Кітап дүкені",
      subtitle: "Сабақтарыңызды мұқият таңдалған әдебиетпен кеңейтіңіз.",
      cartLabel: "Себет",
      cartTitle: "Сіздің себетіңіз",
      cartEmpty: "Себет бос.",
      remove: "Өшіру",
      total: "Жалпы",
      orderSuccess: "Тапсырыс сәтті рәсімделді.",
      placeOrder: "Тапсырыс беру",
      buttonAdd: "Қосу",
      ordersTitle: "Соңғы тапсырыстар",
      ordersEmpty: "Әзірге тапсырыстар жоқ.",
      loading: "Кітаптар жүктелуде…",
    },
  },
};

export const getBooksTranslations = (language: Language) =>
  translations[language] ?? translations.en;
