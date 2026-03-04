export interface City {
  id: string;
  name: { en: string; ar: string };
  region: string;
}

export const saudiCities: City[] = [
  // Central Region
  { id: "riyadh", name: { en: "Riyadh", ar: "الرياض" }, region: "region.central" },
  { id: "kharj", name: { en: "Al Kharj", ar: "الخرج" }, region: "region.central" },
  { id: "qassim", name: { en: "Qassim", ar: "القصيم" }, region: "region.central" },
  { id: "buraidah", name: { en: "Buraidah", ar: "بريدة" }, region: "region.central" },
  { id: "hail", name: { en: "Ha'il", ar: "حائل" }, region: "region.central" },
  { id: "dawadmi", name: { en: "Dawadmi", ar: "الدوادمي" }, region: "region.central" },
  { id: "majmaah", name: { en: "Al Majma'ah", ar: "المجمعة" }, region: "region.central" },

  // Western Region
  { id: "jeddah", name: { en: "Jeddah", ar: "جدة" }, region: "region.western" },
  { id: "makkah", name: { en: "Makkah", ar: "مكة المكرمة" }, region: "region.western" },
  { id: "madinah", name: { en: "Madinah", ar: "المدينة المنورة" }, region: "region.western" },
  { id: "taif", name: { en: "Taif", ar: "الطائف" }, region: "region.western" },
  { id: "yanbu", name: { en: "Yanbu", ar: "ينبع" }, region: "region.western" },
  { id: "rabigh", name: { en: "Rabigh", ar: "رابغ" }, region: "region.western" },

  // Eastern Region
  { id: "dammam", name: { en: "Dammam", ar: "الدمام" }, region: "region.eastern" },
  { id: "khobar", name: { en: "Al Khobar", ar: "الخبر" }, region: "region.eastern" },
  { id: "dhahran", name: { en: "Dhahran", ar: "الظهران" }, region: "region.eastern" },
  { id: "jubail", name: { en: "Jubail", ar: "الجبيل" }, region: "region.eastern" },
  { id: "hofuf", name: { en: "Al Hofuf", ar: "الهفوف" }, region: "region.eastern" },
  { id: "qatif", name: { en: "Al Qatif", ar: "القطيف" }, region: "region.eastern" },
  { id: "ras-tanura", name: { en: "Ras Tanura", ar: "رأس تنورة" }, region: "region.eastern" },

  // Southern Region
  { id: "abha", name: { en: "Abha", ar: "أبها" }, region: "region.southern" },
  { id: "khamis-mushait", name: { en: "Khamis Mushait", ar: "خميس مشيط" }, region: "region.southern" },
  { id: "jizan", name: { en: "Jizan", ar: "جازان" }, region: "region.southern" },
  { id: "najran", name: { en: "Najran", ar: "نجران" }, region: "region.southern" },
  { id: "baha", name: { en: "Al Baha", ar: "الباحة" }, region: "region.southern" },
  { id: "bisha", name: { en: "Bisha", ar: "بيشة" }, region: "region.southern" },

  // Northern Region
  { id: "tabuk", name: { en: "Tabuk", ar: "تبوك" }, region: "region.northern" },
  { id: "arar", name: { en: "Arar", ar: "عرعر" }, region: "region.northern" },
  { id: "sakaka", name: { en: "Sakaka", ar: "سكاكا" }, region: "region.northern" },
  { id: "aljouf", name: { en: "Al Jouf", ar: "الجوف" }, region: "region.northern" },
  { id: "rafha", name: { en: "Rafha", ar: "رفحاء" }, region: "region.northern" },
  { id: "wejh", name: { en: "Al Wejh", ar: "الوجه" }, region: "region.northern" },
];

export const regions = [
  "region.central",
  "region.western",
  "region.eastern",
  "region.southern",
  "region.northern",
] as const;

export const getCitiesByRegion = (region: string) =>
  saudiCities.filter((c) => c.region === region);
