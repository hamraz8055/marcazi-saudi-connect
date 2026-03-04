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

  // Browse page
  "browse.title": { en: "Browse Listings", ar: "تصفح الإعلانات" },
  "browse.subtitle": { en: "Explore thousands of listings across Saudi Arabia", ar: "استكشف آلاف الإعلانات في المملكة" },
  "browse.allCategories": { en: "All Categories", ar: "جميع الفئات" },
  "browse.sale": { en: "Sale", ar: "بيع" },
  "browse.rent": { en: "Rent", ar: "إيجار" },
  "browse.results": { en: "Results", ar: "نتيجة" },
  "browse.noResults": { en: "No listings found", ar: "لا توجد إعلانات" },
  "browse.noResultsDesc": { en: "Try adjusting your filters or search query", ar: "حاول تعديل الفلاتر أو كلمة البحث" },
  "browse.searchCity": { en: "Search city...", ar: "ابحث عن مدينة..." },
  "browse.selectCity": { en: "Select City", ar: "اختر مدينة" },
  "browse.allCities": { en: "All Cities", ar: "جميع المدن" },

  // Post Ad page
  "post.title": { en: "Post Your Ad", ar: "أضف إعلانك" },
  "post.subtitle": { en: "Reach thousands of buyers across Saudi Arabia", ar: "وصل إعلانك لآلاف المشترين في المملكة" },
  "post.step1": { en: "Category", ar: "الفئة" },
  "post.step2": { en: "Details", ar: "التفاصيل" },
  "post.step3": { en: "Photos & Price", ar: "الصور والسعر" },
  "post.step4": { en: "Review", ar: "المراجعة" },
  "post.selectCategory": { en: "Select a category", ar: "اختر فئة" },
  "post.selectSubcategory": { en: "Select subcategory", ar: "اختر فئة فرعية" },
  "post.adTitle": { en: "Ad Title", ar: "عنوان الإعلان" },
  "post.adTitlePlaceholder": { en: "e.g. CAT 320 Excavator for Sale", ar: "مثال: حفارة كاتربيلر 320 للبيع" },
  "post.description": { en: "Description", ar: "الوصف" },
  "post.descriptionPlaceholder": { en: "Describe your item in detail...", ar: "صف المنتج بالتفصيل..." },
  "post.listingType": { en: "Listing Type", ar: "نوع الإعلان" },
  "post.forSale": { en: "For Sale", ar: "للبيع" },
  "post.forRent": { en: "For Rent", ar: "للإيجار" },
  "post.city": { en: "City", ar: "المدينة" },
  "post.price": { en: "Price (SAR)", ar: "السعر (ر.س)" },
  "post.pricePlaceholder": { en: "Enter price", ar: "أدخل السعر" },
  "post.contactForPrice": { en: "Contact for Price", ar: "اتصل للسعر" },
  "post.uploadPhotos": { en: "Upload Photos", ar: "رفع الصور" },
  "post.uploadDesc": { en: "Add up to 10 photos. First photo will be the cover.", ar: "أضف حتى 10 صور. الصورة الأولى ستكون الغلاف." },
  "post.dragDrop": { en: "Drag & drop or click to upload", ar: "اسحب وأفلت أو انقر للرفع" },
  "post.next": { en: "Next", ar: "التالي" },
  "post.back": { en: "Back", ar: "رجوع" },
  "post.submit": { en: "Submit Ad", ar: "نشر الإعلان" },
  "post.review": { en: "Review Your Ad", ar: "راجع إعلانك" },
  "post.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "post.phonePlaceholder": { en: "+966 5XX XXX XXXX", ar: "+966 5XX XXX XXXX" },

  // Regions
  "region.central": { en: "Central Region", ar: "المنطقة الوسطى" },
  "region.western": { en: "Western Region", ar: "المنطقة الغربية" },
  "region.eastern": { en: "Eastern Region", ar: "المنطقة الشرقية" },
  "region.southern": { en: "Southern Region", ar: "المنطقة الجنوبية" },
  "region.northern": { en: "Northern Region", ar: "المنطقة الشمالية" },
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
