import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type Lang = "en" | "ar";

interface I18nContextType {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  toggleLang: () => void;
}

const translations: Record<string, Record<Lang, string>> = {
  "nav.allCities": { en: "All Cities", ar: "جميع المدن" },
  "nav.search": { en: "Search Marcazi...", ar: "ابحث في مركزي..." },
  "nav.postAd": { en: "Post Your Ad", ar: "أضف إعلانك" },
  "hero.title": { en: "Saudi Arabia's Premier Marketplace", ar: "السوق الأول في المملكة العربية السعودية" },
  "hero.subtitle": { en: "Buy, Sell & Trade Anything", ar: "اشترِ، بِع وتاجر بأي شيء" },
  "hero.description": { en: "Connect with thousands of buyers and sellers across Saudi Arabia — equipment, jobs, property, services, and more.", ar: "تواصل مع آلاف المشترين والبائعين في جميع أنحاء المملكة — معدات، وظائف، عقارات، خدمات، والمزيد." },
  "hero.explore": { en: "Explore Now", ar: "استكشف الآن" },
  "hero.postAd": { en: "Post Your Ad", ar: "أضف إعلانك" },
  "tab.marketplace": { en: "Marketplace", ar: "السوق" },
  "tab.bidding": { en: "Bidding", ar: "المزايدات" },
  "stats.listings": { en: "Active Listings", ar: "إعلانات نشطة" },
  "stats.cities": { en: "Cities", ar: "مدينة" },
  "stats.users": { en: "Users", ar: "مستخدم" },
  "cat.equipment": { en: "Equipment", ar: "معدات" },
  "cat.jobs": { en: "Jobs", ar: "وظائف" },
  "cat.property": { en: "Property", ar: "عقارات" },
  "cat.vehicles": { en: "Vehicles", ar: "مركبات" },
  "cat.trading": { en: "Trading", ar: "تجارة" },
  "cat.services": { en: "Services", ar: "خدمات" },
  "cat.classifieds": { en: "Classifieds", ar: "إعلانات" },
  "section.categories": { en: "Browse Categories", ar: "تصفح الفئات" },
  "section.featured": { en: "Featured Listings", ar: "إعلانات مميزة" },
  "section.categoriesDesc": { en: "Find what you need across all categories", ar: "ابحث عما تحتاجه في جميع الفئات" },
  "listing.sar": { en: "SAR", ar: "ر.س" },
  "listing.contactPrice": { en: "Contact for Price", ar: "اتصل للسعر" },
  "listing.sale": { en: "Sale", ar: "بيع" },
  "listing.rent": { en: "Rent", ar: "إيجار" },
  "bottom.home": { en: "Home", ar: "الرئيسية" },
  "bottom.browse": { en: "Browse", ar: "تصفح" },
  "bottom.post": { en: "Post", ar: "أضف" },
  "bottom.messages": { en: "Messages", ar: "الرسائل" },
  "bottom.account": { en: "Account", ar: "حسابي" },
  "filter.saleRent": { en: "Sale / Rent", ar: "بيع / إيجار" },
  "cta.title": { en: "Ready to Start Trading?", ar: "مستعد للبدء بالتجارة؟" },
  "cta.desc": { en: "Join thousands of buyers and sellers across Saudi Arabia", ar: "انضم لآلاف المشترين والبائعين في المملكة" },
  "cta.start": { en: "Get Started Free", ar: "ابدأ مجاناً" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, dir]);

  const t = useCallback((key: string) => translations[key]?.[lang] || key, [lang]);
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);

  return <I18nContext.Provider value={{ lang, dir, t, toggleLang }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
