"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowDownRight,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiInstagram,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { menuCategories, menuItems } from "../data.js";
import styles from "../app/page.module.css";

const phone = "+998944557313";
const storageKey = "saraycity-cart";
const supportedLocales = ["uz", "ru", "en"];
let memoryCartSnapshot = "{}";

function subscribeToCart(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener("saraycity-cart-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("saraycity-cart-change", onChange);
  };
}

function getCartSnapshot() {
  try {
    memoryCartSnapshot = window.localStorage.getItem(storageKey) || "{}";
  } catch (error) {
    console.error("Could not read the Saray City cart from local storage.", error);
  }
  return memoryCartSnapshot;
}

function getServerCartSnapshot() {
  return "{}";
}

function parseCartSnapshot(snapshot) {
  try {
    const parsed = JSON.parse(snapshot);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, quantity]) =>
          menuItems.some((dish) => dish.id === Number(id)) &&
          Number.isInteger(quantity) &&
          quantity > 0 &&
          quantity < 100,
      ),
    );
  } catch (error) {
    console.error("Could not parse the saved Saray City cart.", error);
    return {};
  }
}

function saveCartSnapshot(cart) {
  memoryCartSnapshot = JSON.stringify(cart);
  try {
    window.localStorage.setItem(storageKey, memoryCartSnapshot);
  } catch (error) {
    console.error("Could not save the Saray City cart to local storage.", error);
  }
  window.dispatchEvent(new Event("saraycity-cart-change"));
}

const copy = {
  uz: {
    navigationLabel: "Asosiy navigatsiya",
    languageLabel: "Tilni tanlang",
    navMenu: "Menyu",
    navAbout: "Restoran haqida",
    navBanquet: "Banketlar",
    navContacts: "Kontaktlar",
    promiseLabel: "Restoran haqida qisqacha",
    contactDetails: "Kontakt ma’lumotlari",
    contactPhoneText: "Har kuni 10:00 dan 03:00 gacha qo‘ng‘iroq qiling",
    contactTitle: "Sizni Saray Cityda kutamiz",
    contactText: "Stol band qilish yoki manzilni aniqlashtirish uchun biz bilan bog‘laning.",
    menuAllLink: "To‘liq menyu",
    menuCount: "taom",
    priceUnavailable: "Narxni telefon orqali aniqlang",
    sourceNote: "Menyu Mison sahifasidagi ma’lumotlar asosida.",
    reserve: "Stol band qilish",
    heroEyebrow: "SARAY CITY · RESTAURANT",
    heroTitle: "Har bir lahza —",
    heroAccent: "shohona.",
    heroText:
      "Turk va Yevropa taomlari, iliq mehmondo‘stlik va yaqinlaringiz davrasida unutilmas oqshomlar.",
    menuButton: "Menyuni ko‘rish",
    discover: "Biz haqimizda",
    halal: "100% halol",
    halalText: "Ishonch bilan tanlangan mahsulotlar",
    hours: "Har kuni ochiq",
    hoursText: "10:00 dan 03:00 gacha",
    banquet: "Banket va marosimlar",
    banquetText: "Muhim kunlaringiz uchun shinam maskan",
    introLabel: "SARAY CITYGA XUSH KELIBSIZ",
    introTitle: "Yaxshi taom. Yaxshi davra. Yaxshi xotiralar.",
    introText:
      "Saray City — oila va do‘stlar bilan bir dasturxon atrofida jam bo‘lish, sevimli taomlardan bahramand bo‘lish va bayramlarni chiroyli nishonlash uchun yaratilgan maskan.",
    introLink: "Bizni tanlang",
    menuLabel: "SAROYONA TANLOV",
    menuTitle: "Menyudan sevimlilar",
    fullMenuTitle: "Saray City menyusi",
    menuText:
      "Oshxonamizning eng sara ta’mlari — har bir dasturxon va kayfiyat uchun.",
    all: "Barchasi",
    popular: "Mashhur",
    hot: "Issiq taomlar",
    salads: "Salatlar",
    grill: "Gril",
    desserts: "Desertlar",
    add: "Savatga",
    added: "Qo‘shildi",
    moreMenu: "Menyu va narxlar Mison sahifasidan olindi.",
    bannerTitle: "Har bir bayramingizga munosib muhit.",
    bannerText:
      "Tug‘ilgan kun, oilaviy uchrashuv yoki katta marosim — siz uchun shinam zal va e’tiborli xizmat.",
    banquetLink: "Banket haqida so‘rang",
    reserveLabel: "SIZNI KUTAMIZ",
    reserveTitle: "Stolingizni band qiling",
    reserveText:
      "Qulay vaqtingizni tanlang — adminimiz bandlovni tasdiqlash uchun siz bilan bog‘lanadi.",
    name: "Ismingiz",
    guestPhone: "Telefon raqamingiz",
    date: "Sana",
    time: "Vaqt",
    guests: "Mehmonlar",
    guestsOption: "Mehmonlar soni",
    note: "Izoh (ixtiyoriy)",
    notePlaceholder: "Maxsus istaklaringiz bo‘lsa yozing",
    sendBooking: "Bandlov yuborish",
    sending: "Yuborilmoqda...",
    bookingSuccess: "Rahmat! Adminimiz tez orada siz bilan bog‘lanadi.",
    bookingError: "Bandlov yuborilmadi. Iltimos, qayta urinib ko‘ring yoki qo‘ng‘iroq qiling.",
    serviceNotReady: "Bandlov xizmati hozircha sozlanmagan. Iltimos, bizga qo‘ng‘iroq qiling.",
    bookingPhone: "Yoki bizga qo‘ng‘iroq qiling",
    contactLabel: "BIZ BILAN BOG‘LANING",
    address: "Manzil",
    addressValue: "Manzilni telefon orqali aniqlashtiring",
    schedule: "Ish vaqti",
    phoneLabel: "Telefon",
    follow: "Bizni kuzating",
    rights: "Barcha huquqlar himoyalangan.",
    cart: "Savat",
    emptyCart: "Savatingiz hozircha bo‘sh",
    emptyCartHint: "Menyudan yoqtirgan taomlaringizni qo‘shing.",
    total: "Jami",
    orderCall: "Buyurtma berish uchun qo‘ng‘iroq qiling",
    cartHint: "Buyurtmangizni telefon orqali tasdiqlaymiz.",
    close: "Yopish",
    viewDish: "Taom haqida",
    dishDescriptionMissing: "Taom tavsifi hozircha qo‘shilmagan.",
    weight: "Og‘irligi",
    addedToast: "Savatga qo‘shildi:",
  },
  ru: {
    navigationLabel: "Основная навигация",
    languageLabel: "Выбрать язык",
    navMenu: "Меню",
    navAbout: "О ресторане",
    navBanquet: "Банкеты",
    navContacts: "Контакты",
    promiseLabel: "О ресторане",
    contactDetails: "Контактная информация",
    contactPhoneText: "Звоните ежедневно с 10:00 до 03:00",
    contactTitle: "Будем рады видеть вас в Saray City",
    contactText: "Свяжитесь с нами, чтобы забронировать стол или уточнить адрес.",
    menuAllLink: "Полное меню",
    menuCount: "позиций",
    priceUnavailable: "Уточните цену по телефону",
    sourceNote: "Меню загружено со страницы Mison.",
    reserve: "Забронировать стол",
    heroEyebrow: "SARAY CITY · RESTAURANT",
    heroTitle: "Каждый момент —",
    heroAccent: "по-королевски.",
    heroText:
      "Турецкая и европейская кухня, тёплое гостеприимство и незабываемые вечера в кругу близких.",
    menuButton: "Смотреть меню",
    discover: "О ресторане",
    halal: "100% халяль",
    halalText: "Тщательно отбираем продукты",
    hours: "Открыты каждый день",
    hoursText: "С 10:00 до 03:00",
    banquet: "Банкеты и торжества",
    banquetText: "Уютное место для ваших важных дней",
    introLabel: "ДОБРО ПОЖАЛОВАТЬ В SARAY CITY",
    introTitle: "Вкусная еда. Близкие люди. Тёплые воспоминания.",
    introText:
      "Saray City — место, где собираются за одним столом с семьёй и друзьями, наслаждаются любимыми блюдами и красиво отмечают важные события.",
    introLink: "Почему выбирают нас",
    menuLabel: "ВЫБОР САРАЯ",
    menuTitle: "Любимые блюда",
    fullMenuTitle: "Меню Saray City",
    menuText:
      "Лучшие вкусы нашей кухни — для любого повода и настроения.",
    all: "Все",
    popular: "Популярное",
    hot: "Горячее",
    salads: "Салаты",
    grill: "Гриль",
    desserts: "Десерты",
    add: "В корзину",
    added: "Добавлено",
    moreMenu: "Меню и цены загружены со страницы Mison.",
    bannerTitle: "Атмосфера, достойная вашего праздника.",
    bannerText:
      "День рождения, семейная встреча или большое торжество — уютный зал и внимательный сервис для вас.",
    banquetLink: "Узнать о банкетах",
    reserveLabel: "БУДЕМ ВАС ЖДАТЬ",
    reserveTitle: "Забронируйте столик",
    reserveText:
      "Выберите удобное время — администратор свяжется с вами, чтобы подтвердить бронь.",
    name: "Ваше имя",
    guestPhone: "Ваш номер телефона",
    date: "Дата",
    time: "Время",
    guests: "Гостей",
    guestsOption: "Количество гостей",
    note: "Комментарий (необязательно)",
    notePlaceholder: "Напишите, если есть особые пожелания",
    sendBooking: "Отправить бронь",
    sending: "Отправляем...",
    bookingSuccess: "Спасибо! Администратор скоро свяжется с вами.",
    bookingError: "Не удалось отправить бронь. Попробуйте ещё раз или позвоните нам.",
    serviceNotReady: "Сервис бронирования пока не настроен. Пожалуйста, позвоните нам.",
    bookingPhone: "Или позвоните нам",
    contactLabel: "МЫ НА СВЯЗИ",
    address: "Адрес",
    addressValue: "Уточните адрес по телефону",
    schedule: "Время работы",
    phoneLabel: "Телефон",
    follow: "Следите за нами",
    rights: "Все права защищены.",
    cart: "Корзина",
    emptyCart: "Пока здесь ничего нет",
    emptyCartHint: "Добавьте любимые блюда из меню.",
    total: "Итого",
    orderCall: "Позвонить для заказа",
    cartHint: "Подтвердим ваш заказ по телефону.",
    close: "Закрыть",
    viewDish: "О блюде",
    dishDescriptionMissing: "Описание блюда пока не добавлено.",
    weight: "Вес",
    addedToast: "В корзину добавлено:",
  },
  en: {
    navigationLabel: "Main navigation",
    languageLabel: "Choose language",
    navMenu: "Menu",
    navAbout: "Our story",
    navBanquet: "Celebrations",
    navContacts: "Contact",
    promiseLabel: "Restaurant highlights",
    contactDetails: "Contact information",
    contactPhoneText: "Call us daily from 10:00 AM to 3:00 AM",
    contactTitle: "We look forward to welcoming you",
    contactText: "Get in touch to reserve a table or ask for directions.",
    menuAllLink: "View full menu",
    menuCount: "items",
    priceUnavailable: "Call us for the price",
    sourceNote: "Menu sourced from the Mison menu page.",
    reserve: "Reserve a table",
    heroEyebrow: "SARAY CITY · RESTAURANT",
    heroTitle: "Make every moment",
    heroAccent: "remarkable.",
    heroText:
      "Turkish and European cuisine, warm hospitality, and memorable evenings with the people you love.",
    menuButton: "Explore the menu",
    discover: "Our story",
    halal: "100% halal",
    halalText: "Thoughtfully selected ingredients",
    hours: "Open every day",
    hoursText: "10:00 AM – 3:00 AM",
    banquet: "Banquets & celebrations",
    banquetText: "A welcoming setting for your special days",
    introLabel: "WELCOME TO SARAY CITY",
    introTitle: "Good food. Great company. Lasting memories.",
    introText:
      "Saray City is a place to gather around the table with family and friends, enjoy your favourite dishes, and celebrate life's special moments.",
    introLink: "Why choose us",
    menuLabel: "A TASTE OF SARAY",
    menuTitle: "Guest favourites",
    fullMenuTitle: "The Saray City menu",
    menuText: "Signature flavours from our kitchen, made for every occasion.",
    all: "All",
    popular: "Popular",
    hot: "Hot dishes",
    salads: "Salads",
    grill: "Grill",
    desserts: "Desserts",
    add: "Add to cart",
    added: "Added",
    moreMenu: "Menu and prices sourced from Mison.",
    bannerTitle: "A setting worthy of your celebration.",
    bannerText:
      "A birthday, family gathering, or a grand occasion — enjoy a welcoming hall and thoughtful service.",
    banquetLink: "Ask about celebrations",
    reserveLabel: "WE LOOK FORWARD TO WELCOMING YOU",
    reserveTitle: "Reserve your table",
    reserveText:
      "Choose a time that suits you. Our team will be in touch to confirm your reservation.",
    name: "Your name",
    guestPhone: "Your phone number",
    date: "Date",
    time: "Time",
    guests: "Guests",
    guestsOption: "Number of guests",
    note: "Note (optional)",
    notePlaceholder: "Add any special requests",
    sendBooking: "Request a reservation",
    sending: "Sending...",
    bookingSuccess: "Thank you! Our team will contact you shortly.",
    bookingError: "We couldn't send your request. Please try again or call us.",
    serviceNotReady: "Online reservations are not set up yet. Please call us.",
    bookingPhone: "Or give us a call",
    contactLabel: "COME SAY HELLO",
    address: "Location",
    addressValue: "Call us for directions",
    schedule: "Opening hours",
    phoneLabel: "Phone",
    follow: "Follow along",
    rights: "All rights reserved.",
    cart: "Your cart",
    emptyCart: "Your cart is empty",
    emptyCartHint: "Choose something you love from our menu.",
    total: "Total",
    orderCall: "Call to place your order",
    cartHint: "We'll confirm your order over the phone.",
    close: "Close",
    viewDish: "About this dish",
    dishDescriptionMissing: "A description for this dish has not been added yet.",
    weight: "Weight",
    addedToast: "Added to your cart:",
  },
};

const categoryLabels = {
  uz: {
    "MILK SHAKE": "Sutli kokteyllar",
    "ICE TEA": "Muzli choy",
    MATCHA: "Matcha",
    Смузи: "Smuzilar",
    FRESH: "Fresh sharbatlar",
    Tea: "Choy",
    Coffee: "Qahva",
    DESERT: "Desertlar",
    DONAR: "Donar",
    Кебаб: "Kebab",
    Гарнир: "Garnirlar",
    Cocktail: "Kokteyllar",
    PIDE: "Pide",
    Пицца: "Pitsa",
    Шурпа: "Sho‘rvalar",
    "Второе блюдо": "Asosiy taomlar",
    Салат: "Salatlar",
    Меззе: "Mezze",
    Хлеб: "Non",
  },
  ru: {
    "MILK SHAKE": "Молочные коктейли",
    "ICE TEA": "Холодный чай",
    MATCHA: "Матча",
    Смузи: "Смузи",
    FRESH: "Фреши",
    Tea: "Чай",
    Coffee: "Кофе",
    DESERT: "Десерты",
    DONAR: "Донер",
    Кебаб: "Кебаб",
    Гарнир: "Гарниры",
    Cocktail: "Коктейли",
    PIDE: "Пиде",
    Пицца: "Пицца",
    Шурпа: "Супы",
    "Второе блюдо": "Горячие блюда",
    Салат: "Салаты",
    Меззе: "Мезе",
    Хлеб: "Хлеб",
  },
  en: {
    "MILK SHAKE": "Milkshakes",
    "ICE TEA": "Iced tea",
    MATCHA: "Matcha",
    Смузи: "Smoothies",
    FRESH: "Fresh juices",
    Tea: "Tea",
    Coffee: "Coffee",
    DESERT: "Desserts",
    DONAR: "Doner",
    Кебаб: "Kebabs",
    Гарнир: "Side dishes",
    Cocktail: "Cocktails",
    PIDE: "Pide",
    Пицца: "Pizza",
    Шурпа: "Soups",
    "Второе блюдо": "Main courses",
    Салат: "Salads",
    Меззе: "Mezze",
    Хлеб: "Bread",
  },
};

const featuredCategories = ["Кебаб", "Второе блюдо", "Салат", "Шурпа", "DESERT", "Пицца"];
const featuredDishes = featuredCategories
  .map((category) => menuItems.find((dish) => dish.category === category))
  .filter(Boolean);

function getCategoryLabel(category, language) {
  return categoryLabels[language][category] || category;
}

function formatPrice(price) {
  if (price === null) return "—";
  return `${new Intl.NumberFormat("ru-RU").format(price)} so‘m`;
}

export default function Site({ locale, pageType = "home" }) {
  const language = supportedLocales.includes(locale) ? locale : "uz";
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const cart = useMemo(() => parseCartSnapshot(cartSnapshot), [cartSnapshot]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedDish, setAddedDish] = useState("");
  const [selectedDish, setSelectedDish] = useState(null);
  const [notification, setNotification] = useState(null);
  const [bookingState, setBookingState] = useState("idle");
  const [bookingError, setBookingError] = useState("");
  const t = copy[language];
  const homePath = `/${language}`;
  const pagePath = pageType === "home" ? homePath : `${homePath}/${pageType}`;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!notification) return undefined;
    const timeout = window.setTimeout(() => setNotification(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  useEffect(() => {
    if (!selectedDish && !cartOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedDish(null);
        setCartOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDish, cartOpen]);

  const filteredDishes = useMemo(
    () => {
      if (pageType === "contacts") return [];
      if (category !== "all") {
        return menuItems.filter((dish) => dish.categoryId === Number(category));
      }
      return pageType === "menu" ? menuItems : featuredDishes;
    },
    [category, pageType],
  );
  const cartItems = menuItems.filter((dish) => cart[dish.id] > 0);
  const cartCount = cartItems.reduce((sum, dish) => sum + cart[dish.id], 0);
  const cartTotal = cartItems.some((dish) => dish.price === null)
    ? null
    : cartItems.reduce((sum, dish) => sum + dish.price * cart[dish.id], 0);

  function updateQuantity(dishId, change) {
    const next = { ...cart };
    const nextQuantity = (next[dishId] || 0) + change;
    if (nextQuantity <= 0) {
      delete next[dishId];
    } else {
      next[dishId] = nextQuantity;
    }
    saveCartSnapshot(next);
    if (change > 0) {
      const dish = menuItems.find((item) => item.id === dishId);
      if (dish) setNotification({ type: "success", message: `${t.addedToast} ${dish.name}` });
    }
  }

  async function submitReservation(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBookingState("sending");
    setBookingError("");
    const formData = new FormData(form);
    const reservation = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || `Reservation failed (${response.status}).`);
      }
      setBookingState("success");
      setNotification({ type: "success", message: t.bookingSuccess });
      form.reset();
    } catch (error) {
      console.error("Could not submit the Saray City reservation.", error);
      setBookingError(error.message);
      setBookingState("error");
      setNotification({
        type: "error",
        message: error.message.includes("not configured")
          ? t.serviceNotReady
          : t.bookingError,
      });
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href={`${homePath}#top`} aria-label="Saray City home">
            <Image
              className={styles.brandLogo}
              src="/images/logo.PNG"
              alt=""
              width={100}
              height={100}
              priority
            />
            <span className={styles.brandText}>
              <strong>SARAY CITY</strong>
              <small>RESTAURANT</small>
            </span>
          </a>

          <nav className={styles.navigation} aria-label={t.navigationLabel}>
            <a href={`${homePath}/menu`} aria-current={pageType === "menu" ? "page" : undefined}>
              {t.navMenu}
            </a>
            <a href={`${homePath}#about`}>{t.navAbout}</a>
            <a href={`${homePath}#celebrations`}>{t.navBanquet}</a>
            <a
              href={`${homePath}/contacts`}
              aria-current={pageType === "contacts" ? "page" : undefined}
            >
              {t.navContacts}
            </a>
          </nav>

          <div className={styles.headerActions}>
            <div className={styles.languagePicker} aria-label={t.languageLabel}>
              {supportedLocales.map((item) => (
                <a
                  key={item}
                  className={language === item ? styles.activeLanguage : ""}
                  aria-current={language === item ? "page" : undefined}
                  href={`/${item}${pageType === "home" ? "" : `/${pageType}`}`}
                >
                  {item.toUpperCase()}
                </a>
              ))}
            </div>
            <button
              className={styles.cartButton}
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`${t.cart}${cartCount ? `, ${cartCount}` : ""}`}
            >
              <FiShoppingBag aria-hidden="true" />
              <span>{t.cart}</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
            <a className={styles.headerReserve} href={`${homePath}/contacts#reserve`}>
              {t.reserve}
              <FiArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {pageType === "home" && (
        <>
          <section className={styles.hero} id="top">
        <div className={styles.heroImage} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span />
            {t.heroEyebrow}
          </div>
          <h1>
            {t.heroTitle}
            <br />
            <em>{t.heroAccent}</em>
          </h1>
          <p>{t.heroText}</p>
          <div className={styles.heroButtons}>
            <a className={styles.primaryButton} href={`${homePath}/menu`}>
              {t.menuButton}
              <FiArrowRight aria-hidden="true" />
            </a>
            <a className={styles.textButton} href="#about">
              {t.discover}
              <FiArrowDownRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className={styles.heroStamp} aria-label={t.halal}>
          <span>100%</span>
          <small>HALAL</small>
        </div>
        <div className={styles.heroBottom}>
          <span>{t.hoursText}</span>
          <a href="#about">
            {t.discover}
            <FiChevronDown aria-hidden="true" />
          </a>
          <span>100% HALAL</span>
        </div>
          </section>

          <section className={styles.promiseStrip} aria-label={t.promiseLabel}>
        <div>
          <span className={styles.promiseIcon}>
            <FiCheck aria-hidden="true" />
          </span>
          <span>
            <strong>{t.halal}</strong>
            <small>{t.halalText}</small>
          </span>
        </div>
        <div>
          <span className={styles.promiseIcon}>
            <FiClock aria-hidden="true" />
          </span>
          <span>
            <strong>{t.hours}</strong>
            <small>{t.hoursText}</small>
          </span>
        </div>
        <div>
          <span className={styles.promiseIcon}>
            <FiMapPin aria-hidden="true" />
          </span>
          <span>
            <strong>{t.banquet}</strong>
            <small>{t.banquetText}</small>
          </span>
        </div>
          </section>

          <section className={styles.introSection} id="about">
        <div className={styles.introCopy}>
          <span className={styles.sectionEyebrow}>{t.introLabel}</span>
          <h2>{t.introTitle}</h2>
        </div>
        <div className={styles.introAside}>
          <span className={styles.goldRule} />
          <p>{t.introText}</p>
          <a href="#celebrations">
            {t.introLink}
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>
          </section>
        </>
      )}

      {pageType === "contacts" && (
        <>
          <section className={styles.contactHero}>
            <span className={styles.sectionEyebrow}>{t.contactLabel}</span>
            <h1>{t.contactTitle}</h1>
            <p>{t.contactText}</p>
          </section>
          <section className={styles.contactDetails}>
            <div className={styles.contactHeading}>
              <span className={styles.sectionEyebrow}>{t.contactLabel}</span>
              <h2>{t.contactDetails}</h2>
            </div>
            <div className={styles.contactGrid}>
              <article>
                <FiMapPin aria-hidden="true" />
                <h3>{t.address}</h3>
                <p>{t.addressValue}</p>
              </article>
              <article>
                <FiClock aria-hidden="true" />
                <h3>{t.schedule}</h3>
                <p>10:00 – 03:00</p>
              </article>
              <article>
                <FiArrowRight aria-hidden="true" />
                <h3>{t.phoneLabel}</h3>
                <a href={`tel:${phone}`}>+998 94 455 73 13</a>
                <p>{t.contactPhoneText}</p>
              </article>
              <article>
                <FiInstagram aria-hidden="true" />
                <h3>{t.follow}</h3>
                <a
                  href="https://www.instagram.com/saray_city_restaurant/"
                  target="_blank"
                  rel="noreferrer"
                >
                  saray_city_restaurant
                </a>
              </article>
            </div>
          </section>
        </>
      )}

      {pageType !== "contacts" && (
      <section className={styles.menuSection} id="menu">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionEyebrow}>{t.menuLabel}</span>
            {pageType === "menu" ? (
              <h1>{t.fullMenuTitle}</h1>
            ) : (
              <h2>{t.menuTitle}</h2>
            )}
          </div>
          <p>{t.menuText}</p>
        </div>

        {pageType === "menu" && (
          <div className={styles.categoryList} aria-label={t.navMenu}>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={category === "all" ? styles.activeCategory : ""}
              aria-pressed={category === "all"}
            >
              {t.all}
            </button>
            {menuCategories.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setCategory(String(item.id))}
                className={category === String(item.id) ? styles.activeCategory : ""}
                aria-pressed={category === String(item.id)}
              >
                {getCategoryLabel(item.name, language)}
              </button>
            ))}
          </div>
        )}

        <div className={styles.dishGrid}>
          {filteredDishes.map((dish, index) => {
            const inCart = (cart[dish.id] || 0) > 0;
            return (
              <article className={styles.dishCard} key={dish.id}>
                <div className={`${styles.dishArt} ${styles[`dishArt${index % 6}`]}`}>
                  <button
                    className={styles.dishPhotoButton}
                    type="button"
                    onClick={() => setSelectedDish(dish)}
                    aria-label={`${t.viewDish}: ${dish.name}`}
                  >
                  {dish.image ? (
                    <Image
                      className={styles.productImage}
                      src={dish.image}
                      alt={dish.name}
                      width={600}
                      height={400}
                      sizes="(max-width: 560px) 100vw, (max-width: 800px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  ) : (
                      <div className={styles.plate} aria-hidden="true">
                        <span />
                      </div>
                  )}
                  </button>
                  <span className={styles.dishTag}>
                    {getCategoryLabel(dish.category, language)}
                  </span>
                  <span className={styles.dishNumber}>
                    {String(dish.id).padStart(2, "0")}
                  </span>
                  <span className={styles.dishArtCaption}>SARAY CITY</span>
                </div>
                <div className={styles.dishInfo}>
                  <div>
                    <h3>{dish.name}</h3>
                    {dish.description && <p>{dish.description}</p>}
                  </div>
                  <div className={styles.dishOrder}>
                    <strong>
                      {dish.price === null ? t.priceUnavailable : formatPrice(dish.price)}
                    </strong>
                    <button
                      type="button"
                      className={addedDish === dish.id ? styles.added : undefined}
                      onClick={() => {
                        updateQuantity(dish.id, 1);
                        setAddedDish(dish.id);
                        window.setTimeout(() => setAddedDish(""), 1200);
                      }}
                      aria-label={`${t.add}: ${dish.name}`}
                    >
                      {addedDish === dish.id ? (
                        <FiCheck aria-hidden="true" />
                      ) : (
                        <FiPlus aria-hidden="true" />
                      )}
                      <span>{inCart ? cart[dish.id] : addedDish === dish.id ? t.added : t.add}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className={styles.menuFootnote}>
          {pageType === "menu" ? `${menuItems.length} ${t.menuCount} · ` : ""}
          {t.moreMenu}
        </p>
        {pageType === "home" && (
          <a className={styles.fullMenuLink} href={`${homePath}/menu`}>
            {t.menuAllLink}
            <FiArrowRight aria-hidden="true" />
          </a>
        )}
      </section>
      )}

      {pageType === "home" && (
      <section className={styles.celebrationSection} id="celebrations">
        <div className={styles.celebrationFrame}>
          <div className={styles.celebrationSeal} aria-hidden="true">
            <Image src="/images/logo.PNG" alt="" width={100} height={100} />
          </div>
          <span className={styles.sectionEyebrow}>{t.navBanquet}</span>
          <h2>{t.bannerTitle}</h2>
          <p>{t.bannerText}</p>
          <a href={`${homePath}/contacts#reserve`}>
            {t.banquetLink}
            <FiArrowRight aria-hidden="true" />
          </a>
          <span className={`${styles.corner} ${styles.cornerTop}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBottom}`} aria-hidden="true" />
        </div>
      </section>
      )}

      {pageType !== "menu" && (
      <section className={styles.reservationSection} id="reserve">
        <div className={styles.reservationIntro}>
          <span className={styles.sectionEyebrow}>{t.reserveLabel}</span>
          <h2>{t.reserveTitle}</h2>
          <p>{t.reserveText}</p>
          <a href={`tel:${phone}`}>
            <span className={styles.phoneIcon}>
              <FiArrowRight aria-hidden="true" />
            </span>
            <span>
              <small>{t.bookingPhone}</small>
              <strong>+998 94 455 73 13</strong>
            </span>
          </a>
        </div>
        <form className={styles.reservationForm} onSubmit={submitReservation}>
          <div className={styles.formRow}>
            <label>
              <span>{t.name}</span>
              <input name="name" autoComplete="name" required maxLength={80} />
            </label>
            <label>
              <span>{t.guestPhone}</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                maxLength={30}
                placeholder="+998"
              />
            </label>
          </div>
          <div className={styles.formRow}>
            <label>
              <span>{t.date}</span>
              <input name="date" type="date" required />
            </label>
            <label>
              <span>{t.time}</span>
              <input name="time" type="time" required />
            </label>
            <label>
              <span>{t.guests}</span>
              <select name="guests" defaultValue="" required>
                <option value="" disabled>
                  {t.guestsOption}
                </option>
                {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((number) => (
                  <option value={number} key={number}>
                    {number}+
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            <span>{t.note}</span>
            <textarea name="note" maxLength={500} placeholder={t.notePlaceholder} rows={2} />
          </label>
          <div className={styles.submitRow}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={bookingState === "sending"}
            >
              {bookingState === "sending" ? t.sending : t.sendBooking}
              <FiArrowRight aria-hidden="true" />
            </button>
            <span className={styles.formStatus} aria-live="polite">
              {bookingState === "success" && t.bookingSuccess}
              {bookingState === "error" &&
                (bookingError.includes("not configured")
                  ? t.serviceNotReady
                  : t.bookingError)}
            </span>
          </div>
        </form>
      </section>
      )}

      <footer className={styles.footer} id="contacts">
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <a className={styles.brand} href={`${homePath}#top`}>
              <Image
                className={styles.brandLogo}
                src="/images/logo.PNG"
                alt=""
                width={100}
                height={100}
              />
              <span className={styles.brandText}>
                <strong>SARAY CITY</strong>
                <small>RESTAURANT</small>
              </span>
            </a>
            <p>{t.heroText}</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>{t.address}</h3>
            <p>{t.addressValue}</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>{t.schedule}</h3>
            <p>10:00 – 03:00</p>
            <a href={`tel:${phone}`}>+998 94 455 73 13</a>
          </div>
          <div className={styles.footerColumn}>
            <h3>{t.follow}</h3>
            <a
              className={styles.instagramLink}
              href="https://www.instagram.com/saray_city_restaurant/"
              target="_blank"
              rel="noreferrer"
            >
              <FiInstagram aria-hidden="true" />
              saray_city_restaurant
            </a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 SARAY CITY. {t.rights}</span>
          <span>100% HALAL · SARAY CITY</span>
        </div>
      </footer>

      {cartOpen && (
        <div className={styles.cartOverlay} role="presentation">
          <button
            className={styles.cartBackdrop}
            type="button"
            aria-label={t.close}
            onClick={() => setCartOpen(false)}
          />
          <aside
            className={styles.cartPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className={styles.cartHeader}>
              <div>
                <span className={styles.sectionEyebrow}>SARAY CITY</span>
                <h2 id="cart-title">{t.cart}</h2>
              </div>
              <button
                type="button"
                className={styles.closeCart}
                onClick={() => setCartOpen(false)}
                aria-label={t.close}
              >
                <FiX aria-hidden="true" />
              </button>
            </div>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <FiShoppingBag aria-hidden="true" />
                <h3>{t.emptyCart}</h3>
                <p>{t.emptyCartHint}</p>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setCartOpen(false);
                    if (pageType === "menu") {
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      router.push(`${homePath}/menu`);
                    }
                  }}
                >
                  {t.navMenu}
                  <FiArrowRight aria-hidden="true" />
                </button>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cartItems.map((dish) => (
                    <div className={styles.cartItem} key={dish.id}>
                      <div>
                        <h3>{dish.name}</h3>
                        <span>
                          {dish.price === null ? t.priceUnavailable : formatPrice(dish.price)}
                        </span>
                      </div>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          aria-label={`${t.close} ${dish.name}`}
                          onClick={() => updateQuantity(dish.id, -1)}
                        >
                          <FiMinus aria-hidden="true" />
                        </button>
                        <span>{cart[dish.id]}</span>
                        <button
                          type="button"
                          aria-label={`${t.add} ${dish.name}`}
                          onClick={() => updateQuantity(dish.id, 1)}
                        >
                          <FiPlus aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.cartSummary}>
                  <div>
                    <span>{t.total}</span>
                    <strong>
                      {cartTotal === null ? t.priceUnavailable : formatPrice(cartTotal)}
                    </strong>
                  </div>
                  <p>{t.cartHint}</p>
                  <a className={styles.submitButton} href={`tel:${phone}`}>
                    {t.orderCall}
                    <FiArrowRight aria-hidden="true" />
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      {selectedDish && (
        <div className={styles.dishModalOverlay} role="presentation">
          <button
            className={styles.dishModalBackdrop}
            type="button"
            aria-label={t.close}
            onClick={() => setSelectedDish(null)}
          />
          <section
            className={styles.dishModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-modal-title"
          >
            <button
              type="button"
              className={styles.closeDishModal}
              onClick={() => setSelectedDish(null)}
              aria-label={t.close}
            >
              <FiX aria-hidden="true" />
            </button>
            <div className={styles.dishModalImage}>
              {selectedDish.image ? (
                <Image
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  width={900}
                  height={700}
                  sizes="(max-width: 700px) 90vw, 560px"
                />
              ) : (
                <div className={styles.plate} aria-hidden="true">
                  <span />
                </div>
              )}
            </div>
            <div className={styles.dishModalContent}>
              <span className={styles.sectionEyebrow}>
                {getCategoryLabel(selectedDish.category, language)}
              </span>
              <h2 id="dish-modal-title">{selectedDish.name}</h2>
              <p>{selectedDish.description || t.dishDescriptionMissing}</p>
              {selectedDish.weight !== null && selectedDish.weight !== undefined && (
                <span className={styles.dishModalWeight}>
                  {t.weight}: {selectedDish.weight} {selectedDish.weightUnit}
                </span>
              )}
              <div className={styles.dishModalOrder}>
                <strong>
                  {selectedDish.price === null
                    ? t.priceUnavailable
                    : formatPrice(selectedDish.price)}
                </strong>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={() => updateQuantity(selectedDish.id, 1)}
                >
                  <FiPlus aria-hidden="true" />
                  {t.add}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
      {notification && (
        <div
          className={`${styles.toast} ${notification.type === "error" ? styles.toastError : ""}`}
          role={notification.type === "error" ? "alert" : "status"}
          aria-live={notification.type === "error" ? "assertive" : "polite"}
        >
          {notification.type === "error" ? (
            <FiX aria-hidden="true" />
          ) : (
            <FiCheck aria-hidden="true" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </main>
  );
}
