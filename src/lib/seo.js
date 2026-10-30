export const supportedLocales = ["uz", "ru", "en"];

const pageMetadata = {
  uz: {
    home: {
      title: "Turk va Yevropa taomlari",
      description:
        "Saray City — 100% halol turk va yevropa taomlari restorani. Stol band qilish va banketlar uchun bog‘laning.",
    },
    menu: {
      title: "Menyu",
      description:
        "Saray City restoranining menyusi: turk va yevropa taomlari, ichimliklar, desertlar va narxlar.",
    },
    contacts: {
      title: "Kontaktlar va stol band qilish",
      description:
        "Saray City bilan bog‘laning, ish vaqtini ko‘ring va stolingizni onlayn band qiling.",
    },
  },
  ru: {
    home: {
      title: "Турецкая и европейская кухня",
      description:
        "Saray City — ресторан с турецкой и европейской кухней. Бронирование столов и банкетов.",
    },
    menu: {
      title: "Меню ресторана",
      description:
        "Меню ресторана Saray City: турецкие и европейские блюда, напитки, десерты и цены.",
    },
    contacts: {
      title: "Контакты и бронирование",
      description:
        "Свяжитесь с Saray City, узнайте время работы и забронируйте стол онлайн.",
    },
  },
  en: {
    home: {
      title: "Turkish & European Restaurant",
      description:
        "Discover Turkish and European cuisine at Saray City. Reserve a table or enquire about a celebration.",
    },
    menu: {
      title: "Restaurant Menu",
      description:
        "Explore Saray City’s menu of Turkish and European dishes, drinks, desserts, and prices.",
    },
    contacts: {
      title: "Contact & Table Reservations",
      description:
        "Contact Saray City, check our opening hours, and request a table reservation online.",
    },
  },
};

export function getPageMetadata(locale, page) {
  const content = pageMetadata[locale][page];
  const suffix = page === "home" ? "" : `/${page}`;
  const route = `/${locale}${suffix}`;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: route,
      languages: {
        uz: `/uz${suffix}`,
        ru: `/ru${suffix}`,
        en: `/en${suffix}`,
        "x-default": `/uz${suffix}`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      siteName: "Saray City",
      locale: { uz: "uz_UZ", ru: "ru_RU", en: "en_US" }[locale],
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
