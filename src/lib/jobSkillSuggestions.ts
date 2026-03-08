export const skillSuggestionsBySubcategory: Record<string, string[]> = {
  "oil-gas": ["AutoCAD", "HSE", "HAZOP", "Drilling Operations", "Wellbore Engineering", "Pipeline Integrity"],
  "construction": ["Civil Engineering", "Project Management", "MS Project", "Revit", "Quantity Surveying", "Site Supervision"],
  "engineering": ["SolidWorks", "MATLAB", "PLC Programming", "Electrical Design", "Mechanical Design"],
  "accounting-finance": ["SAP", "QuickBooks", "IFRS", "Auditing", "VAT Filing", "Financial Modeling"],
  "logistics": ["Fleet Management", "Supply Chain", "ERP Systems", "Inventory Management", "Customs Clearance"],
  "sales-biz-dev": ["CRM", "Salesforce", "B2B Sales", "Negotiation", "Lead Generation", "Key Account Management"],
  "manufacturing": ["Lean Manufacturing", "ISO 9001", "Quality Control", "Six Sigma", "Production Planning"],
};

export const defaultSkillSuggestions = [
  "Microsoft Office", "Communication", "Teamwork", "Problem Solving",
  "Leadership", "Time Management", "English", "Arabic",
];

export const employmentTypes = [
  { value: "full-time", labelEn: "Full-time Employment", labelAr: "دوام كامل" },
  { value: "part-time", labelEn: "Part-time Employment", labelAr: "دوام جزئي" },
  { value: "hourly", labelEn: "Rental Basis / Hourly", labelAr: "بالساعة / إيجار" },
  { value: "contract", labelEn: "Contract", labelAr: "عقد" },
  { value: "internship", labelEn: "Internship", labelAr: "تدريب" },
  { value: "freelance", labelEn: "Freelance", labelAr: "عمل حر" },
] as const;

export type EmploymentType = typeof employmentTypes[number]["value"];

export const getEmploymentBadgeStyle = (type: string) => {
  switch (type) {
    case "full-time": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "part-time": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "hourly": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "contract": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "internship": return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
    case "freelance": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
    default: return "bg-muted text-muted-foreground";
  }
};

export const getEmploymentLabel = (type: string, lang: "en" | "ar") => {
  const found = employmentTypes.find(e => e.value === type);
  return found ? (lang === "ar" ? found.labelAr : found.labelEn) : type;
};

export const formatJobSalary = (listing: any, lang: "en" | "ar") => {
  const sar = lang === "ar" ? "ر.س" : "SAR";
  if (listing.salary_negotiable || listing.contact_for_price) return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
  
  switch (listing.employment_type) {
    case "full-time":
    case "part-time":
      if (listing.salary_min && listing.salary_max)
        return `${Number(listing.salary_min).toLocaleString()} – ${Number(listing.salary_max).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      if (listing.salary_min) return `${Number(listing.salary_min).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    case "hourly":
      if (listing.hourly_rate) return `${Number(listing.hourly_rate).toLocaleString()} ${sar}/${lang === "ar" ? "ساعة" : "hr"}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    case "contract":
      if (listing.salary_min && listing.salary_max)
        return `${Number(listing.salary_min).toLocaleString()} – ${Number(listing.salary_max).toLocaleString()} ${sar}`;
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    case "internship":
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      return lang === "ar" ? "تدريب غير مدفوع" : "Unpaid Internship";
    case "freelance":
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    default:
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
  }
};
