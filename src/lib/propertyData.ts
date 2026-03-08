// Property category groupings
export const RESIDENTIAL_RENT = [
  "rent-apartment", "rent-villa", "rent-townhouse", "rent-floor",
  "rent-building", "rent-room", "rent-staff-accom",
];
export const RESIDENTIAL_SALE = [
  "sale-apartment", "sale-villa", "sale-townhouse", "sale-floor",
  "sale-building", "sale-new-project", "sale-off-plan",
];
export const COMMERCIAL_RENT = ["rent-office", "rent-shop", "rent-warehouse"];
export const COMMERCIAL_SALE = ["sale-office", "sale-shop", "sale-warehouse"];
export const LAND = ["rent-land", "sale-land"];
export const OFF_PLAN = ["sale-new-project", "sale-off-plan"];
export const ROOM_TYPES = ["rent-room", "rent-staff-accom"];

export const isResidentialRent = (sub: string) => RESIDENTIAL_RENT.includes(sub);
export const isResidentialSale = (sub: string) => RESIDENTIAL_SALE.includes(sub);
export const isCommercialRent = (sub: string) => COMMERCIAL_RENT.includes(sub);
export const isCommercialSale = (sub: string) => COMMERCIAL_SALE.includes(sub);
export const isLand = (sub: string) => LAND.includes(sub);
export const isOffPlan = (sub: string) => OFF_PLAN.includes(sub);
export const isRoom = (sub: string) => ROOM_TYPES.includes(sub);
export const isResidential = (sub: string) => isResidentialRent(sub) || isResidentialSale(sub);
export const isCommercial = (sub: string) => isCommercialRent(sub) || isCommercialSale(sub);
export const isRent = (sub: string) => sub.startsWith("rent-");
export const isSale = (sub: string) => sub.startsWith("sale-");
export const needsBedsBaths = (sub: string) =>
  isResidential(sub) && !isRoom(sub) && !isOffPlan(sub);
export const needsFloor = (sub: string) =>
  ["rent-apartment", "sale-apartment", "rent-office", "sale-office", "rent-floor", "sale-floor"].includes(sub);

export const pricePeriods = [
  { id: "yearly", label: { en: "Yearly", ar: "سنوي" } },
  { id: "monthly", label: { en: "Monthly", ar: "شهري" } },
  { id: "weekly", label: { en: "Weekly", ar: "أسبوعي" } },
  { id: "daily", label: { en: "Daily", ar: "يومي" } },
];

export const commercialPricePeriods = [
  ...pricePeriods,
  { id: "per_sqm", label: { en: "Per Sqm/Year", ar: "لكل م²/سنة" } },
];

export const paymentTerms = [
  { id: "1_cheque", label: { en: "1 Cheque", ar: "شيك واحد" } },
  { id: "2_cheques", label: { en: "2 Cheques", ar: "شيكين" } },
  { id: "4_cheques", label: { en: "4 Cheques", ar: "4 شيكات" } },
  { id: "monthly", label: { en: "Monthly Direct", ar: "شهري مباشر" } },
  { id: "flexible", label: { en: "Flexible", ar: "مرن" } },
];

export const furnishedOptions = [
  { id: "furnished", label: { en: "Furnished", ar: "مفروش" }, desc: { en: "Fully furnished with furniture & appliances", ar: "مفروش بالكامل بالأثاث والأجهزة" } },
  { id: "semi", label: { en: "Semi-Furnished", ar: "شبه مفروش" }, desc: { en: "Partially furnished", ar: "مفروش جزئياً" } },
  { id: "unfurnished", label: { en: "Unfurnished", ar: "غير مفروش" }, desc: { en: "Empty, no furniture", ar: "فارغ بدون أثاث" } },
];

export const residentialFeatures = [
  "Parking / Garage", "Swimming Pool", "Central A/C", "Balcony / Terrace",
  "Maid's Room", "Driver's Room", "Security / CCTV", "Gym / Fitness Center",
  "Children's Play Area", "Mosque Nearby", "Elevator", "Intercom",
  "Private Garden", "Rooftop Access", "Smart Home", "Solar Panels",
  "Backup Generator", "Water Tank", "Sea View", "City View",
  "Garden View", "Corner Unit", "Near Metro / Bus", "Pet Friendly",
  "Shared Kitchen", "Private Bathroom",
];

export const commercialFeatures = [
  "24/7 Access", "Loading Bay", "Reception Area", "Meeting Rooms",
  "Server Room", "Open Plan", "Private Offices", "Pantry / Kitchen",
  "Central A/C", "Backup Power", "Fire Suppression", "CCTV Security",
  "High Ceiling", "Mezzanine Floor", "Street Facing", "Near Main Road",
];

export const landFeatures = [
  "Corner Plot", "Road Access (2+ sides)", "Near Main Road", "Utilities Connected",
  "Walled / Fenced", "Existing Structure", "Near Mosque", "Inside Compound",
  "Near Schools", "Near Highway",
];

export const landTypes = [
  { id: "residential", label: { en: "Residential", ar: "سكني" } },
  { id: "commercial", label: { en: "Commercial", ar: "تجاري" } },
  { id: "agricultural", label: { en: "Agricultural", ar: "زراعي" } },
  { id: "industrial", label: { en: "Industrial", ar: "صناعي" } },
  { id: "mixed", label: { en: "Mixed Use", ar: "متعدد الاستخدام" } },
  { id: "unspecified", label: { en: "Not Specified", ar: "غير محدد" } },
];

export const fitoutOptions = [
  { id: "shell", label: { en: "Shell & Core", ar: "هيكل فقط" }, desc: { en: "Empty space, no fit-out", ar: "مساحة فارغة بدون تجهيز" } },
  { id: "fitted", label: { en: "Fitted Out", ar: "مجهز" }, desc: { en: "Ready to move in", ar: "جاهز للانتقال" } },
  { id: "partial", label: { en: "Partially Fitted", ar: "مجهز جزئياً" } },
];

export const posterTypes = [
  { id: "owner", label: { en: "Property Owner", ar: "مالك العقار" }, desc: { en: "I own this property", ar: "أنا مالك هذا العقار" } },
  { id: "agent", label: { en: "Real Estate Agent", ar: "وكيل عقاري" }, desc: { en: "I represent the owner", ar: "أمثل المالك" } },
  { id: "developer", label: { en: "Developer", ar: "مطور عقاري" }, desc: { en: "I am the developer/project company", ar: "أنا المطور / شركة المشروع" } },
];

export const tour360Providers = [
  "my.matterport.com", "kuula.co", "app.cloudpano.com", "tour.getlookaround.com",
  "360.espace.ae", "orbix360.com", "360.visengine.com", "vieweet.com",
  "momento360.com", "realeyez360.com", "www.bhomes.com", "yapidurealestate.com",
  "www.360cities.net", "spec.co", "www.nodalview.com", "everything360.co",
  "h4l.me", "h4l.site", "vt.plushglobalmedia.com", "s.insta360.com",
  "storage.net-fs.com", "www.geepastower.com", "www.nwmea.com",
  "www.alamy.com", "360emirates.com", "muraba.ae", "district1.com",
  "www.yasacres.com", "providentestates.com",
];

export const validateTourUrl = (url: string): "valid" | "warning" | "empty" => {
  if (!url.trim()) return "empty";
  try {
    const hostname = new URL(url).hostname;
    return tour360Providers.some(p => hostname.includes(p)) ? "valid" : "warning";
  } catch {
    return "warning";
  }
};

export const getPropertyTitlePlaceholder = (sub: string, lang: "en" | "ar"): string => {
  const map: Record<string, { en: string; ar: string }> = {
    "rent-apartment": { en: "e.g. Spacious 3BR Apartment in Al Olaya", ar: "مثال: شقة 3 غرف واسعة في العليا" },
    "sale-apartment": { en: "e.g. Spacious 3BR Apartment in Al Olaya", ar: "مثال: شقة 3 غرف واسعة في العليا" },
    "rent-villa": { en: "e.g. 5BR Villa with Private Pool - Al Nakheel", ar: "مثال: فيلا 5 غرف مع مسبح خاص - النخيل" },
    "sale-villa": { en: "e.g. 5BR Villa with Private Pool - Al Nakheel", ar: "مثال: فيلا 5 غرف مع مسبح خاص - النخيل" },
    "rent-office": { en: "e.g. Premium Office Space - King Fahad Road", ar: "مثال: مكتب مميز - طريق الملك فهد" },
    "sale-office": { en: "e.g. Premium Office Space - King Fahad Road", ar: "مثال: مكتب مميز - طريق الملك فهد" },
    "rent-land": { en: "e.g. Commercial Land for Lease - Industrial Area", ar: "مثال: أرض تجارية للإيجار - المنطقة الصناعية" },
    "sale-land": { en: "e.g. Residential Plot for Sale - Al Yasmin", ar: "مثال: أرض سكنية للبيع - الياسمين" },
  };
  return map[sub]?.[lang] || (lang === "ar" ? "مثال: عنوان العقار" : "e.g. Property listing title");
};

export const floorOptions = [
  "Ground", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
  "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th",
  "21st", "22nd", "23rd", "24th", "25th", "30th", "35th", "40th", "45th", "50th", "Penthouse",
];
