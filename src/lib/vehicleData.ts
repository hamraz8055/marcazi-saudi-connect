// Heavy Equipment Makes & Models
export const heavyEquipmentMakes: Record<string, string[]> = {
  "Caterpillar (CAT)": ["320", "323", "330", "336", "349", "390", "950", "966", "D6", "D8", "D9", "725", "730", "740", "416", "420", "430", "450"],
  "Komatsu": ["PC200", "PC210", "PC240", "PC300", "PC360", "PC490", "WA380", "WA470", "D85", "D155", "HM400"],
  "Volvo": ["EC210", "EC250", "EC300", "EC380", "EC480", "A25G", "A30G", "A40G", "L90H", "L110H", "L150H"],
  "Liebherr": ["R914", "R918", "R922", "R926", "R936", "R945", "R950", "LTM1030", "LTM1050", "LTM1100", "LTM1200"],
  "Hitachi": ["ZX200", "ZX210", "ZX250", "ZX300", "ZX350", "ZX490"],
  "JCB": ["3CX", "4CX", "JS130", "JS200", "JS290", "457", "531-70"],
  "Hyundai": ["R140LC", "R210LC", "R290LC", "R380LC", "HL960"],
  "Bobcat": ["S450", "S510", "S550", "S570", "S590", "S630", "S650", "T595"],
  "Grove (Cranes)": ["GMK3060", "GMK4100", "GMK5130", "GMK6400", "RT760"],
  "Tadano (Cranes)": ["ATF60", "ATF80", "ATF100", "GR1000", "GR800"],
  "Toyota (Forklifts)": ["7FBE10", "8FBE15", "8FBE20", "8FBN25", "8FG30"],
  "Crown (Forklifts)": ["FC5200", "FC5245", "SC5700", "WP3000", "RR5020"],
  "Scania (Trucks)": ["R410", "R450", "R500", "R580", "G410", "G450", "P360"],
  "Mercedes-Benz (Trucks)": ["Actros 1845", "Actros 1848", "Axor 1833", "Atego 1018"],
  "MAN (Trucks)": ["TGX 18.400", "TGX 18.500", "TGS 18.360", "TGL 8.180"],
  "Volvo Trucks": ["FH16", "FH500", "FM410", "FMX460", "FL240"],
  "Other": [],
};

// Car Makes & Models
export const carMakes: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "Prado", "Hilux", "RAV4", "Fortuner", "Yaris", "Avalon", "Sequoia", "Tundra", "4Runner", "Hiace", "Innova", "Rush", "C-HR", "Vios"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "Creta", "Palisade", "Kona", "Ioniq 5", "Ioniq 6", "Staria"],
  "Kia": ["Sportage", "Sorento", "Carnival", "K5", "Picanto", "Cerato", "Telluride", "Stinger", "EV6", "Seltos", "Sonet"],
  "Nissan": ["Patrol", "Pathfinder", "Navara", "Altima", "Sentra", "Kicks", "Xterra", "Armada", "Sunny", "Tiida", "Murano", "Maxima"],
  "Ford": ["F-150", "Explorer", "Expedition", "Edge", "Mustang", "Ranger", "Bronco", "Escape", "EcoSport", "Transit"],
  "Chevrolet": ["Tahoe", "Suburban", "Silverado", "Blazer", "Traverse", "Malibu", "Equinox", "Captiva", "Trailblazer", "Colorado"],
  "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "X7", "M3", "M5", "i4", "iX", "2 Series", "4 Series", "6 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS", "G-Class", "A-Class", "CLA", "GLA", "GLB", "EQS", "EQE", "AMG GT"],
  "Lexus": ["LX", "GX", "RX", "NX", "ES", "IS", "LS", "UX", "RC", "LC"],
  "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS6", "TT"],
  "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Polo", "Arteon", "ID.4"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Odyssey", "HR-V", "Passport", "Ridgeline", "Jazz"],
  "Mitsubishi": ["Pajero", "Outlander", "Eclipse Cross", "L200", "ASX", "Galant", "Lancer"],
  "Land Rover": ["Range Rover", "Defender", "Discovery", "Freelander", "Evoque", "Sport"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator", "Renegade"],
  "GMC": ["Yukon", "Sierra", "Canyon", "Terrain", "Acadia", "Envoy"],
  "Infiniti": ["QX80", "QX60", "QX50", "QX55", "Q50", "Q60", "Q70"],
  "Porsche": ["Cayenne", "Macan", "Panamera", "911", "Taycan", "718 Boxster", "718 Cayman"],
  "Dodge": ["Ram 1500", "Durango", "Challenger", "Charger", "Journey"],
  "Genesis": ["G70", "G80", "G90", "GV70", "GV80", "GV90"],
  "BYD": ["Seal", "Atto 3", "Han", "Tang", "Dolphin", "Song Plus"],
  "MG": ["ZS", "RX5", "HS", "5", "6", "One", "Cyberster"],
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Partner"],
  "Renault": ["Duster", "Koleos", "Logan", "Symbol", "Megane", "Kadjar"],
  "Chery": ["Tiggo 4", "Tiggo 7", "Tiggo 8", "Arrizo 5", "Arrizo 6"],
  "Haval": ["H6", "H9", "Jolion", "F7", "Dargo"],
  "Other": [],
};

export const fuelTypes = [
  { id: "petrol", label: { en: "Petrol", ar: "بنزين" }, emoji: "⛽" },
  { id: "diesel", label: { en: "Diesel", ar: "ديزل" }, emoji: "🛢️" },
  { id: "hybrid", label: { en: "Hybrid", ar: "هجين" }, emoji: "⚡" },
  { id: "electric", label: { en: "Electric", ar: "كهربائي" }, emoji: "🔋" },
];

export const bodyTypes = [
  { id: "sedan", label: { en: "Sedan", ar: "سيدان" }, emoji: "🚗" },
  { id: "suv", label: { en: "SUV", ar: "دفع رباعي" }, emoji: "🚙" },
  { id: "van", label: { en: "Van", ar: "فان" }, emoji: "🚐" },
  { id: "coupe", label: { en: "Coupe", ar: "كوبيه" }, emoji: "🏎️" },
  { id: "hatchback", label: { en: "Hatchback", ar: "هاتشباك" }, emoji: "🚌" },
  { id: "pickup", label: { en: "Pickup", ar: "بيك أب" }, emoji: "🛻" },
  { id: "crossover", label: { en: "Crossover", ar: "كروس أوفر" }, emoji: "🚕" },
  { id: "minivan", label: { en: "Minivan", ar: "ميني فان" }, emoji: "🚑" },
  { id: "convertible", label: { en: "Convertible", ar: "مكشوفة" }, emoji: "🚓" },
  { id: "other", label: { en: "Other", ar: "أخرى" }, emoji: "🚚" },
];

export const sellerTypes = [
  { id: "owner", label: { en: "Owner", ar: "المالك" } },
  { id: "dealer", label: { en: "Dealer", ar: "تاجر" } },
  { id: "certified-preowned", label: { en: "Certified Pre-owned", ar: "معتمد مستعمل" } },
];

export const rentalPeriods = [
  { id: "hour", label: { en: "Hour", ar: "ساعة" } },
  { id: "day", label: { en: "Day", ar: "يوم" } },
  { id: "week", label: { en: "Week", ar: "أسبوع" } },
  { id: "month", label: { en: "Month", ar: "شهر" } },
];

// Country codes for phone input
export interface CountryCode {
  code: string;
  name: { en: string; ar: string };
  dial: string;
  flag: string;
  placeholder: string;
}

export const pinnedCountries: CountryCode[] = [
  { code: "SA", name: { en: "Saudi Arabia", ar: "السعودية" }, dial: "+966", flag: "🇸🇦", placeholder: "5X XXX XXXX" },
  { code: "AE", name: { en: "UAE", ar: "الإمارات" }, dial: "+971", flag: "🇦🇪", placeholder: "5X XXX XXXX" },
  { code: "BH", name: { en: "Bahrain", ar: "البحرين" }, dial: "+973", flag: "🇧🇭", placeholder: "XXXX XXXX" },
  { code: "QA", name: { en: "Qatar", ar: "قطر" }, dial: "+974", flag: "🇶🇦", placeholder: "XXXX XXXX" },
  { code: "KW", name: { en: "Kuwait", ar: "الكويت" }, dial: "+965", flag: "🇰🇼", placeholder: "XXXX XXXX" },
  { code: "OM", name: { en: "Oman", ar: "عُمان" }, dial: "+968", flag: "🇴🇲", placeholder: "XXXX XXXX" },
  { code: "JO", name: { en: "Jordan", ar: "الأردن" }, dial: "+962", flag: "🇯🇴", placeholder: "7X XXX XXXX" },
  { code: "EG", name: { en: "Egypt", ar: "مصر" }, dial: "+20", flag: "🇪🇬", placeholder: "1XX XXX XXXX" },
  { code: "PK", name: { en: "Pakistan", ar: "باكستان" }, dial: "+92", flag: "🇵🇰", placeholder: "3XX XXXXXXX" },
  { code: "IN", name: { en: "India", ar: "الهند" }, dial: "+91", flag: "🇮🇳", placeholder: "XXXXX XXXXX" },
  { code: "PH", name: { en: "Philippines", ar: "الفلبين" }, dial: "+63", flag: "🇵🇭", placeholder: "9XX XXX XXXX" },
];

export const otherCountries: CountryCode[] = [
  { code: "AF", name: { en: "Afghanistan", ar: "أفغانستان" }, dial: "+93", flag: "🇦🇫", placeholder: "7X XXX XXXX" },
  { code: "AL", name: { en: "Albania", ar: "ألبانيا" }, dial: "+355", flag: "🇦🇱", placeholder: "6X XXX XXXX" },
  { code: "DZ", name: { en: "Algeria", ar: "الجزائر" }, dial: "+213", flag: "🇩🇿", placeholder: "5XX XX XX XX" },
  { code: "BD", name: { en: "Bangladesh", ar: "بنغلاديش" }, dial: "+880", flag: "🇧🇩", placeholder: "1XXX XXXXXX" },
  { code: "BR", name: { en: "Brazil", ar: "البرازيل" }, dial: "+55", flag: "🇧🇷", placeholder: "XX XXXXX XXXX" },
  { code: "CA", name: { en: "Canada", ar: "كندا" }, dial: "+1", flag: "🇨🇦", placeholder: "XXX XXX XXXX" },
  { code: "CN", name: { en: "China", ar: "الصين" }, dial: "+86", flag: "🇨🇳", placeholder: "1XX XXXX XXXX" },
  { code: "ET", name: { en: "Ethiopia", ar: "إثيوبيا" }, dial: "+251", flag: "🇪🇹", placeholder: "9X XXX XXXX" },
  { code: "FR", name: { en: "France", ar: "فرنسا" }, dial: "+33", flag: "🇫🇷", placeholder: "6 XX XX XX XX" },
  { code: "DE", name: { en: "Germany", ar: "ألمانيا" }, dial: "+49", flag: "🇩🇪", placeholder: "1XX XXXXXXXX" },
  { code: "ID", name: { en: "Indonesia", ar: "إندونيسيا" }, dial: "+62", flag: "🇮🇩", placeholder: "8XX XXXX XXXX" },
  { code: "IQ", name: { en: "Iraq", ar: "العراق" }, dial: "+964", flag: "🇮🇶", placeholder: "7XX XXX XXXX" },
  { code: "IR", name: { en: "Iran", ar: "إيران" }, dial: "+98", flag: "🇮🇷", placeholder: "9XX XXX XXXX" },
  { code: "IT", name: { en: "Italy", ar: "إيطاليا" }, dial: "+39", flag: "🇮🇹", placeholder: "3XX XXX XXXX" },
  { code: "JP", name: { en: "Japan", ar: "اليابان" }, dial: "+81", flag: "🇯🇵", placeholder: "90 XXXX XXXX" },
  { code: "KE", name: { en: "Kenya", ar: "كينيا" }, dial: "+254", flag: "🇰🇪", placeholder: "7XX XXXXXX" },
  { code: "KR", name: { en: "South Korea", ar: "كوريا الجنوبية" }, dial: "+82", flag: "🇰🇷", placeholder: "10 XXXX XXXX" },
  { code: "LB", name: { en: "Lebanon", ar: "لبنان" }, dial: "+961", flag: "🇱🇧", placeholder: "XX XXX XXX" },
  { code: "LK", name: { en: "Sri Lanka", ar: "سريلانكا" }, dial: "+94", flag: "🇱🇰", placeholder: "7X XXX XXXX" },
  { code: "MY", name: { en: "Malaysia", ar: "ماليزيا" }, dial: "+60", flag: "🇲🇾", placeholder: "1X XXX XXXX" },
  { code: "MX", name: { en: "Mexico", ar: "المكسيك" }, dial: "+52", flag: "🇲🇽", placeholder: "XX XXXX XXXX" },
  { code: "MA", name: { en: "Morocco", ar: "المغرب" }, dial: "+212", flag: "🇲🇦", placeholder: "6XX XXXXXX" },
  { code: "MM", name: { en: "Myanmar", ar: "ميانمار" }, dial: "+95", flag: "🇲🇲", placeholder: "9 XXX XXXX" },
  { code: "NP", name: { en: "Nepal", ar: "نيبال" }, dial: "+977", flag: "🇳🇵", placeholder: "98XX XXXXXX" },
  { code: "NG", name: { en: "Nigeria", ar: "نيجيريا" }, dial: "+234", flag: "🇳🇬", placeholder: "8XX XXX XXXX" },
  { code: "PS", name: { en: "Palestine", ar: "فلسطين" }, dial: "+970", flag: "🇵🇸", placeholder: "5X XXX XXXX" },
  { code: "RU", name: { en: "Russia", ar: "روسيا" }, dial: "+7", flag: "🇷🇺", placeholder: "9XX XXX XX XX" },
  { code: "SD", name: { en: "Sudan", ar: "السودان" }, dial: "+249", flag: "🇸🇩", placeholder: "9X XXX XXXX" },
  { code: "SY", name: { en: "Syria", ar: "سوريا" }, dial: "+963", flag: "🇸🇾", placeholder: "9XX XXX XXX" },
  { code: "TN", name: { en: "Tunisia", ar: "تونس" }, dial: "+216", flag: "🇹🇳", placeholder: "XX XXX XXX" },
  { code: "TR", name: { en: "Turkey", ar: "تركيا" }, dial: "+90", flag: "🇹🇷", placeholder: "5XX XXX XXXX" },
  { code: "GB", name: { en: "United Kingdom", ar: "المملكة المتحدة" }, dial: "+44", flag: "🇬🇧", placeholder: "7XXX XXXXXX" },
  { code: "US", name: { en: "United States", ar: "الولايات المتحدة" }, dial: "+1", flag: "🇺🇸", placeholder: "XXX XXX XXXX" },
  { code: "YE", name: { en: "Yemen", ar: "اليمن" }, dial: "+967", flag: "🇾🇪", placeholder: "7XX XXX XXX" },
];

export const allCountries = [...pinnedCountries, ...otherCountries];
