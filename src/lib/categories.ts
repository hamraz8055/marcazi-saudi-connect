import { Truck, Briefcase, Home, Car, TrendingUp, Wrench, Megaphone, type LucideIcon } from "lucide-react";

export interface Subcategory {
  id: string;
  name: { en: string; ar: string };
}

export interface Category {
  id: string;
  key: string;
  icon: LucideIcon;
  color: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "equipment",
    key: "cat.equipment",
    icon: Truck,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    subcategories: [
      { id: "construction", name: { en: "Construction", ar: "إنشاءات" } },
      { id: "cranes", name: { en: "Cranes", ar: "رافعات" } },
      { id: "generators", name: { en: "Generators", ar: "مولدات" } },
      { id: "pumps", name: { en: "Pumps", ar: "مضخات" } },
      { id: "mechanical", name: { en: "Mechanical", ar: "ميكانيكية" } },
      { id: "electrical-eq", name: { en: "Electrical", ar: "كهربائية" } },
      { id: "plumbing-eq", name: { en: "Plumbing", ar: "سباكة" } },
    ],
  },
  {
    id: "jobs",
    key: "cat.jobs",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    subcategories: [
      { id: "civil", name: { en: "Civil", ar: "مدني" } },
      { id: "mechanical-job", name: { en: "Mechanical", ar: "ميكانيكي" } },
      { id: "electrical-job", name: { en: "Electrical", ar: "كهربائي" } },
      { id: "labor", name: { en: "Labor", ar: "عمالة" } },
      { id: "engineering", name: { en: "Engineering", ar: "هندسة" } },
      { id: "admin", name: { en: "Administrative", ar: "إداري" } },
    ],
  },
  {
    id: "property",
    key: "cat.property",
    icon: Home,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    subcategories: [
      { id: "apartments", name: { en: "Apartments", ar: "شقق" } },
      { id: "villas", name: { en: "Villas", ar: "فلل" } },
      { id: "commercial", name: { en: "Commercial", ar: "تجاري" } },
      { id: "land", name: { en: "Land", ar: "أراضي" } },
    ],
  },
  {
    id: "vehicles",
    key: "cat.vehicles",
    icon: Car,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    subcategories: [
      { id: "suv", name: { en: "SUVs", ar: "دفع رباعي" } },
      { id: "sedan", name: { en: "Sedans", ar: "سيدان" } },
      { id: "trucks", name: { en: "Trucks", ar: "شاحنات" } },
      { id: "heavy", name: { en: "Heavy Vehicles", ar: "مركبات ثقيلة" } },
      { id: "parts", name: { en: "Parts", ar: "قطع غيار" } },
    ],
  },
  {
    id: "trading",
    key: "cat.trading",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    subcategories: [
      { id: "steel", name: { en: "Steel", ar: "حديد" } },
      { id: "cement", name: { en: "Cement", ar: "أسمنت" } },
      { id: "wood", name: { en: "Wood", ar: "أخشاب" } },
      { id: "electrical-parts", name: { en: "Electrical Parts", ar: "مواد كهربائية" } },
    ],
  },
  {
    id: "services",
    key: "cat.services",
    icon: Wrench,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    subcategories: [
      { id: "hvac", name: { en: "HVAC", ar: "تكييف" } },
      { id: "plumbing", name: { en: "Plumbing", ar: "سباكة" } },
      { id: "cleaning", name: { en: "Cleaning", ar: "تنظيف" } },
      { id: "security", name: { en: "Security", ar: "أمن" } },
    ],
  },
  {
    id: "classifieds",
    key: "cat.classifieds",
    icon: Megaphone,
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    subcategories: [
      { id: "general", name: { en: "General", ar: "عام" } },
      { id: "electronics", name: { en: "Electronics", ar: "إلكترونيات" } },
      { id: "furniture", name: { en: "Furniture", ar: "أثاث" } },
    ],
  },
];
