import { Language } from "@/components/providers/language-provider";

export type LandingTranslations = {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    bulletOne: string;
    bulletTwo: string;
  };
  heroCard: {
    title: string;
    description: string;
    planTitle: string;
    planItems: { title: string; time: string }[];
    previewCta: string;
  };
  how: {
    title: string;
    description: string;
    steps: { title: string; description: string }[];
  };
  audience: {
    students: {
      title: string;
      description: string;
      bullets: string[];
    };
    teachers: {
      title: string;
      description: string;
      bullets: string[];
    };
  };
  pricing: {
    title: string;
    billingToggle: { monthly: string; yearly: string; badge: string };
    perLabel: { month: string; year: string };
    tiers: {
      title: string;
      monthlyPrice: number;
      description: string;
      features: string[];
      highlight?: boolean;
      cta: string;
      tag?: string;
    }[];
  };
  testimonials: {
    title: string;
    items: { quote: string; name: string }[];
  };
  finalCta: {
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
};

const landingTranslations: Record<Language, LandingTranslations> = {
  en: {
    hero: {
      badge: "New: community clubs after school",
      title: "Ozgeshe Oku Ortalygy — a joyful hub where kids learn with purpose.",
      description:
        "We blend English, math, creativity, and soft-skill coaching so every child feels safe to ask questions, build projects, and celebrate progress.",
      primaryCta: "Discover programs",
      secondaryCta: "Meet the team",
      bulletOne: "Family-first communication",
      bulletTwo: "Trusted teachers from Almaty",
    },
    heroCard: {
      title: "A day at Ozgeshe Oku Ortalygy",
      description: "Workshops, mentors, and reflections live inside one calm routine.",
      planTitle: "Today's flow",
      planItems: [
        { title: "Story circle • Junior Explorers", time: "15:30" },
        { title: "Math quest • Logic Lab", time: "17:00" },
        { title: "Makers club • Project mentors", time: "18:30" },
      ],
      previewCta: "Peek inside the student journey",
    },
    how: {
      title: "How our learning center works",
      description: "Classes are small, tactile, and story-driven — students move from curiosity to real skills together.",
      steps: [
        {
          title: "Gather",
          description: "Learners arrive to a warm space with tea, journals, and friendly mentors who set the tone.",
        },
        {
          title: "Create",
          description: "We build projects: podcasts, math quests, science fairs, bilingual presentations, and art.",
        },
        {
          title: "Reflect",
          description: "Teachers send voice feedback, parents get weekly snapshots, and goals are updated for the next meetup.",
        },
      ],
    },
    audience: {
      students: {
        title: "For curious students",
        description: "We mix academic rigor with playful workshops so kids stay motivated all year long.",
        bullets: [
          "Project-based English & STEAM routes",
          "Confidence coaching before olympiads and exams",
          "Community challenges, book clubs, and weekend labs",
        ],
      },
      teachers: {
        title: "For caring families",
        description: "Parents see transparent plans, trusted mentors, and safe routines inside Ozgeshe Oku Ortalygy.",
        bullets: [
          "Weekly reports with photos and next steps",
          "Parent circles and open lessons every month",
          "Flexible scheduling for school, sport, and travel",
        ],
      },
    },
    pricing: {
      title: "Choose your pathway",
      billingToggle: {
        monthly: "Monthly",
        yearly: "Yearly",
        badge: "Save 20%",
      },
      perLabel: {
        month: "/month",
        year: "/year",
      },
      tiers: [
        {
          title: "Basic",
          monthlyPrice: 45000,
          description: "Core workshops for one subject, weekly check-ins, and a steady routine.",
          features: ["Small group (max 8)", "Creative home missions", "Progress notebook"],
          cta: "Join the club",
        },
        {
          title: "Pro",
          monthlyPrice: 89000,
          description: "English + STEM labs + weekend meetups for motivated grade 4-8 learners.",
          features: ["All Starter perks", "Monthly project expo", "Teacher hotline"],
          highlight: true,
          tag: "Popular",
          cta: "Upgrade to Pro",
        },
        {
          title: "Max",
          monthlyPrice: 150000,
          description: "1:1 mentoring, olympiad prep, and bespoke study abroad guidance.",
          features: ["Personal learning plan", "On-demand check-ins", "Family strategy sessions"],
          cta: "Talk to a curator",
        },
      ],
    },
    testimonials: {
      title: "Families talk about Ozgeshe Oku Ortalygy",
      items: [
        {
          quote:
            "My daughter runs into class because it feels like a club, not extra school. Her confidence in English skyrocketed.",
          name: "Alia, parent of 6th grader",
        },
        {
          quote:
            "Teachers send recordings, photos, and actionable tips every Friday. I finally understand how my son learns.",
          name: "Sergey, parent of 4th grader",
        },
        {
          quote:
            "Project exhibitions made our shy kids speak proudly in two languages — priceless!",
          name: "Dana, community partner",
        },
      ],
    },
    finalCta: {
      title: "Visit Ozgeshe Oku Ortalygy",
      description: "Book a tour, try a free workshop, and feel the atmosphere that keeps students inspired.",
      primary: "Book a visit",
      secondary: "Message our curator",
    },
  },
  ru: {
    hero: {
      badge: "Новинка: семейные клубы после школы",
      title: "Ozgeshe Oku Ortalygy — место, где дети учатся ради мечты.",
      description:
        "Мы соединяем английский, математику, проекты и мягкие навыки, чтобы каждому ребёнку было комфортно учиться и делиться открытиями.",
      primaryCta: "Посмотреть программы",
      secondaryCta: "Познакомиться с наставниками",
      bulletOne: "Простое общение с семьями",
      bulletTwo: "Наставники из Алматы",
    },
    heroCard: {
      title: "День в Ozgeshe Oku Ortalygy",
      description: "Мастерские, наставники и рефлексия вписаны в спокойный ритуал.",
      planTitle: "Сегодняшний маршрут",
      planItems: [
        { title: "Круг историй • Junior Explorers", time: "15:30" },
        { title: "Математический квест • Logic Lab", time: "17:00" },
        { title: "Makers club • Проектные наставники", time: "18:30" },
      ],
      previewCta: "Посмотреть путь ученика",
    },
    how: {
      title: "Как работает наш центр",
      description:
        "Мини-группы, истории, ручные проекты и спокойный ритм: дети двигаются от любопытства к уверенности.",
      steps: [
        {
          title: "Собираем",
          description: "Уютное пространство, чай, дневники наблюдений и приветливые кураторы задают настроение.",
        },
        {
          title: "Творим",
          description: "Записываем подкасты, решаем математические квесты, делаем STEAM-проекты и двуязычные презентации.",
        },
        {
          title: "Осмысляем",
          description: "По пятницам родители получают голосовые отчёты, фото и планы на следующую неделю.",
        },
      ],
    },
    audience: {
      students: {
        title: "Для любознательных детей",
        description: "Мы даём и академическую базу, и творческую свободу, чтобы интерес не пропадал.",
        bullets: [
          "Проектные маршруты по английскому и STEM",
          "Подготовка к олимпиадам и экзаменам без стресса",
          "Челленджи, книжные клубы и субботние лаборатории",
        ],
      },
      teachers: {
        title: "Для родителей и опекунов",
        description: "Семьи видят прозрачные планы, надёжных наставников и спокойные ритуалы Ozgeshe Oku Ortalygy.",
        bullets: [
          "Еженедельные отчёты с фото и рекомендациями",
          "Открытые уроки и родительские круги",
          "Гибкое расписание под школу, секции и поездки",
        ],
      },
    },
    pricing: {
      title: "Выберите маршрут",
      billingToggle: {
        monthly: "Месяц",
        yearly: "Год (-20%)",
        badge: "Экономия 20%",
      },
      perLabel: {
        month: "/мес",
        year: "/год",
      },
      tiers: [
        {
          title: "Basic",
          monthlyPrice: 45000,
          description: "1 предмет, 4 очных мастер-класса в месяц и еженедельный созвон с наставником.",
          features: ["Группа до 8 детей", "Творческие домашние миссии", "Личный прогресс-блокнот"],
          cta: "Выбрать Basic",
        },
        {
          title: "Pro",
          monthlyPrice: 89000,
          description: "Английский + STEM + встречи по выходным. Любимый пакет для 4-8 классов.",
          features: ["Все плюсы Старт", "Ежемесячная выставка проектов", "Связь с наставником"],
          highlight: true,
          tag: "Популярный",
          cta: "Выбрать Pro",
        },
        {
          title: "Max",
          monthlyPrice: 150000,
          description: "Персональное наставничество, подготовка к олимпиадам и поступлению за рубеж.",
          features: ["Собственный учебный план", "Гибкие созвоны", "Сессии с семьёй"],
          cta: "Связаться с куратором",
        },
      ],
    },
    testimonials: {
      title: "Что говорят семьи Ozgeshe Oku Ortalygy",
      items: [
        {
          quote:
            "Дочка бежит в центр — говорит, что это клуб друзей, а не «ещё одна школа». Уверенность в английском выросла заметно.",
          name: "Алия, мама ученицы 6 класса",
        },
        {
          quote:
            "Пятничные отчёты с голосовыми и фото помогают понимать, как учится сын. Чувствую себя партнёром, а не наблюдателем.",
          name: "Сергей, папа 4-классника",
        },
        {
          quote:
            "На выставках проектов даже самые тихие дети выступают на двух языках. Это трогательно и вдохновляет.",
          name: "Дана, партнёр сообщества",
        },
      ],
    },
    finalCta: {
      title: "Приезжайте в Ozgeshe Oku Ortalygy",
      description: "Запишитесь на экскурсию или пробный мастер-класс и почувствуйте атмосферу центра.",
      primary: "Записаться на визит",
      secondary: "Написать куратору",
    },
  },
  kk: {
    hero: {
      badge: "Жаңа: мектептен кейінгі отбасы клубтары",
      title: "Ozgeshe Oku Ortalygy — балалар арманы үшін білім ордасы.",
      description:
        "Ағылшын, математика, жобалар және жұмсақ дағдыларды біріктіріп, әр балаға сұрақ қойып, идеяларын жүзеге асыруға көмектесеміз.",
      primaryCta: "Бағдарламаларды көру",
      secondaryCta: "Тәлімгерлермен танысу",
      bulletOne: "Ата-анамен тұрақты байланыс",
      bulletTwo: "Алматының сенімді ұстаздары",
    },
    heroCard: {
      title: "Ozgeshe Oku Ortalygy күн тәртібі",
      description: "Шеберханалар, менторлар және рефлексия бір жылы атмосферада өтеді.",
      planTitle: "Бүгінгі ағын",
      planItems: [
        { title: "Әңгіме шеңбері • Junior Explorers", time: "15:30" },
        { title: "Математика квесті • Logic Lab", time: "17:00" },
        { title: "Makers club • Жоба менторлары", time: "18:30" },
      ],
      previewCta: "Оқушы жолын көру",
    },
    how: {
      title: "Орталық қалай жұмыс істейді",
      description:
        "Шағын топтар, әңгімелер және қолмен жасау арқылы балалар қызығушылықтан нақты нәтижеге өтеді.",
      steps: [
        {
          title: "Қуанышпен қарсы аламыз",
          description: "Жылы кеңістік, шай, күнделік және мейірімді кураторлар сабаққа көңіл бөледі.",
        },
        {
          title: "Жобалаймыз",
          description: "Подкаст жазамыз, STEM жобаларын жасаймыз, екі тілде презентациялар дайындаймыз.",
        },
        {
          title: "Қорытындылаймыз",
          description: "Жұма сайын ата-аналарға дауыс хат, фото және келесі қадам жібереміз.",
        },
      ],
    },
    audience: {
      students: {
        title: "Ізденімпаз балаларға",
        description: "Оқу бағдарламасы мен шығармашылық еркіндік бірге жүреді, сондықтан мотивация ұзаққа созылады.",
        bullets: [
          "Ағылшын және STEM бойынша жобалық маршруттар",
          "Олимпиада мен емтиханға сенімді дайындық",
          "Челлендждер, кітап клубтары, демалыс күнгі зертханалар",
        ],
      },
      teachers: {
        title: "Отбасыларға",
        description: "Ата-аналар айқын жоспарды, сенімді тәлімгерлерді және тұрақты ритуалдарды көреді.",
        bullets: [
          "Әр аптада фото және ұсыныстары бар есеп",
          "Ашық сабақтар мен ата-ана шеңберлері",
          "Мектеп, спорт және сапарға ыңғайлы кесте",
        ],
      },
    },
    pricing: {
      title: "Бағыт таңдаңыз",
      billingToggle: {
        monthly: "Ай сайын",
        yearly: "Жылына (-20%)",
        badge: "20% үнем",
      },
      perLabel: {
        month: "/ай",
        year: "/жыл",
      },
      tiers: [
        {
          title: "Basic",
          monthlyPrice: 45000,
          description: "1 пән, айына 4 шеберлік сабағы және апта сайынғы куратор қоңырауы.",
          features: ["8 балаға дейінгі топ", "Шығармашылық үй тапсырмалары", "Жеке прогресс дәптері"],
          cta: "Basic пакеті",
        },
        {
          title: "Pro",
          monthlyPrice: 89000,
          description: "Ағылшын + STEM + демалыс күнгі кездесулер. 4-8 сыныптарға сүйікті пакет.",
          features: ["Start мүмкіндіктері", "Ай сайынғы жоба көрмесі", "Менторға тікелей байланыс"],
          highlight: true,
          tag: "Таңдалған",
          cta: "Pro пакеті",
        },
        {
          title: "Max",
          monthlyPrice: 150000,
          description: "1:1 сабақтар, олимпиадаға және шетелге түсуге дайындық.",
          features: ["Жеке оқу жоспары", "Қажет кезде байланыс", "Отбасылық сессиялар"],
          cta: "Max пакеті",
        },
      ],
    },
    testimonials: {
      title: "Ozgeshe Oku Ortalygy туралы пікірлер",
      items: [
        {
          quote:
            "Қызым орталыққа қуанып барады — бұл достар клубы сияқты. Ағылшынға деген сенімі артты.",
          name: "Алия, 6-сынып анасы",
        },
        {
          quote:
            "Жұма күнгі есептер, фото және кеңестер арқылы ұлымның қалай оқитынын түсінемін.",
          name: "Сергей, 4-сынып әкесі",
        },
        {
          quote:
            "Жоба көрмесінде тұйық балалар да екі тілде сөйлейді. Бұл шабыттандырады.",
          name: "Дана, қауымдастық серіктесі",
        },
      ],
    },
    finalCta: {
      title: "Ozgeshe Oku Ortalygy-ға келіңіз",
      description: "Экскурсияға немесе тегін мастер-класқа жазылып, орталық атмосферасын сезініңіз.",
      primary: "Экскурсияға жазылу",
      secondary: "Куратормен жазысу",
    },
  },
};

export const getLandingTranslations = (language: Language) =>
  landingTranslations[language] ?? landingTranslations.en;
