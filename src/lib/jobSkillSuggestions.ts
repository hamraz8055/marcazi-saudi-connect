export const skillSuggestionsBySubcategory: Record<string, string[]> = {
  "oil-gas": ["AutoCAD", "HSE / NEBOSH", "HAZOP", "Drilling Operations", "Wellbore Engineering", "Pipeline Integrity", "Permit to Work", "IADC Well Control", "Completions", "Production Chemistry", "SCADA", "Subsea Engineering", "Gas Processing", "LNG Operations", "Offshore Operations", "Rig Operations", "Geomechanics", "Corrosion Engineering", "Process Safety Management"],
  "construction": ["Civil Engineering", "Project Management", "MS Project", "Revit", "BIM", "Primavera P6", "Quantity Surveying", "Site Supervision", "AutoCAD Civil 3D", "Structural Analysis", "Concrete Works", "MEP Coordination", "Scaffolding", "Shuttering", "Rebar", "Cost Estimation", "Subcontractor Management"],
  "engineering": ["SolidWorks", "MATLAB", "PLC Programming", "SCADA", "Electrical Design", "Mechanical Design", "Instrumentation", "HVAC Design", "Piping & Instrumentation Diagrams (P&ID)", "Stress Analysis", "FEA", "SAP2000", "ETAP", "Commissioning", "Maintenance Planning", "Root Cause Analysis"],
  "accounting-finance": ["SAP", "Oracle Financials", "QuickBooks", "IFRS", "GAAP", "Auditing", "VAT Filing", "Financial Modeling", "Budgeting", "Cost Control", "Accounts Payable", "Accounts Receivable", "Treasury Management", "Payroll", "Zakat Filing", "Power BI", "Advanced Excel", "Financial Reporting"],
  "logistics": ["Fleet Management", "Supply Chain Management", "ERP Systems", "Inventory Management", "Customs Clearance", "Freight Forwarding", "Warehouse Management", "Incoterms", "SAP WM", "Last Mile Delivery", "Cold Chain Logistics", "Import/Export Documentation", "Vendor Management"],
  "sales-biz-dev": ["CRM", "Salesforce", "B2B Sales", "B2C Sales", "Negotiation", "Lead Generation", "Key Account Management", "Tender Preparation", "Business Proposals", "Market Research", "Cold Calling", "Customer Retention", "Sales Forecasting", "Contract Management"],
  "manufacturing": ["Lean Manufacturing", "ISO 9001", "Quality Control", "Six Sigma", "Production Planning"],
  "admin-office": ["Microsoft Office", "Data Entry", "Filing & Archiving", "Reception Management", "Calendar Management", "Travel Booking", "Meeting Coordination", "Report Writing", "Oracle", "SAP", "Typing Speed (Arabic/English)", "Document Control", "Correspondence Management", "ERP Systems"],
  "welder": ["SMAW", "MIG Welding", "TIG Welding", "FCAW", "GTAW", "Pipe Welding", "Structural Welding", "Underwater Welding", "AWS Certified", "ASME Certified", "Weld Inspection", "NDT Awareness", "Blueprint Reading", "Plasma Cutting"],
  "qa-qc-ndt": ["ISO 9001", "NDT Methods (UT, MT, PT, RT, VT)", "ASNT Level II", "CSWIP", "AWS CWI", "Weld Inspection", "Factory Acceptance Testing (FAT)", "ASME Standards", "API Standards", "Calibration", "Quality Auditing", "Material Testing", "Dimensional Inspection", "SAP QM"],
  "driver-housemaid": ["Valid Saudi License", "Heavy Vehicle License", "Light Vehicle License", "Defensive Driving", "Forklift License", "GPS Navigation", "Vehicle Maintenance Awareness", "House Cleaning", "Cooking (Basic)", "Child Care", "Elderly Care", "Laundry & Ironing", "First Aid"],
  "cook-chef": ["Arabic Cuisine", "Continental Cuisine", "Asian Cuisine", "Pastry & Bakery", "HACCP", "Food Safety Level 2", "Kitchen Management", "Menu Planning", "Catering Operations", "Grill & BBQ", "Seafood Preparation", "Pastry Arts", "Indian Cuisine", "Cost Control (Kitchen)"],
  "coordinator": ["Project Coordination", "Scheduling", "Stakeholder Management", "MS Project", "Primavera", "Meeting Facilitation", "Document Management", "Risk Tracking", "Budget Tracking", "Cross-functional Team Coordination", "Event Planning", "Vendor Coordination", "Status Reporting"],
  "hr-documentation": ["Recruitment", "HRIS Systems", "SAP HR", "Oracle HR", "Onboarding & Offboarding", "Labor Law (Saudi)", "Qiwa Platform", "Mudad", "Payroll Processing", "Employee Relations", "Policy Writing", "Performance Management", "Training & Development", "Document Control", "Archiving Systems", "Visas & Iqama"],
  "it-technology": ["Python", "JavaScript", "React", "Node.js", "SQL", "Network Administration", "Cybersecurity", "AWS", "Azure", "IT Support", "Help Desk", "ERP Implementation", "Linux", "Windows Server", "Virtualization", "ITIL", "Cisco Networking", "DevOps", "Mobile Development"],
  "safety-hse": ["NEBOSH", "IOSH", "OSHA", "Incident Investigation", "Risk Assessment", "PTW System", "Safety Auditing", "Emergency Response Planning", "HSE Training", "Process Safety", "Environmental Management", "ISO 45001", "Aramco Safety Standards", "SATR/SATAP Awareness"],
  "procurement": ["Oracle Procurement", "SAP MM", "Vendor Sourcing", "RFQ/RFP Preparation", "Contract Negotiation", "Supplier Evaluation", "Purchase Orders", "Cost Reduction Strategies", "Tender Management", "Aramco Vendor Registration", "Importation"],
  "marketing": ["Digital Marketing", "Social Media Management", "SEO/SEM", "Google Analytics", "Content Writing", "PR Strategy", "Brand Management", "Adobe Creative Suite", "Campaign Management", "Market Research", "Copywriting", "Email Marketing"],
  "medical-healthcare": ["Patient Care", "Clinical Assessment", "BLS/ACLS", "Wound Care", "IV Therapy", "Electronic Health Records", "DHA/SCFHS License", "Pharmacy Dispensing", "Operating Room Assist", "ICU Care", "Radiology"],
  "security-guard": ["Access Control", "CCTV Monitoring", "Patrol Operations", "Incident Reporting", "Emergency Response", "First Aid", "Crowd Management", "VIP Protection", "Loss Prevention", "Saudi Guard License", "Aramco Security Clearance"],
  "operator": ["Heavy Equipment Operation", "CAT Equipment", "Komatsu Equipment", "Excavator Operation", "Bulldozer Operation", "Crane Operation (Rigger)", "Forklift Operation", "Loader Operation", "Valid Operator License", "Preventive Maintenance Awareness"],
};

export const defaultSkillSuggestions = [
  "Microsoft Office", "Communication", "Teamwork", "Problem Solving",
  "Leadership", "Time Management", "English", "Arabic",
];

export const employmentTypes = [
  { value: "full-time", labelEn: "Full-time Employment", labelAr: "دوام كامل" },
  { value: "hourly", labelEn: "Rental Basis / Hourly", labelAr: "بالساعة / إيجار" },
  { value: "internship", labelEn: "Internship", labelAr: "تدريب" },
  { value: "freelance", labelEn: "Freelance", labelAr: "عمل حر" },
] as const;

export type EmploymentType = typeof employmentTypes[number]["value"];

export const getEmploymentBadgeStyle = (type: string) => {
  switch (type) {
    case "full-time": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "hourly": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
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
      if (listing.salary_min && listing.salary_max && listing.salary_min !== listing.salary_max)
        return `${Number(listing.salary_min).toLocaleString()} – ${Number(listing.salary_max).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      if (listing.salary_min)
        return `${Number(listing.salary_min).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    case "hourly":
      if (listing.rental_rate_tbd) return lang === "ar" ? "يُحدد بعد المقابلة" : "Rate: Decided After Interview";
      if (listing.hourly_rate) return `${Number(listing.hourly_rate).toLocaleString()} ${sar}/${lang === "ar" ? "ساعة" : "hr"}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    case "internship":
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}/${lang === "ar" ? "شهر" : "month"}`;
      return lang === "ar" ? "تدريب غير مدفوع" : "Unpaid Internship";
    case "freelance":
      if (listing.salary_negotiable) return lang === "ar" ? "الميزانية: قابلة للنقاش" : "Budget: Open to Discussion";
      if (listing.salary_min) return `${Number(listing.salary_min).toLocaleString()} ${sar}`;
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
    default:
      if (listing.price) return `${Number(listing.price).toLocaleString()} ${sar}`;
      return lang === "ar" ? "قابل للتفاوض" : "Negotiable";
  }
};

// Document suggestions grouped
export const documentSuggestions = {
  general: [
    "CV / Resume", "Valid Iqama", "Transferable Iqama",
    "Passport Copy", "Saudi National ID", "Photo (Passport Size)",
    "Valid Saudi Driving License", "Experience Certificate",
    "Educational Certificate", "Reference Letter",
  ],
  saudiSpecific: [
    "Chamber of Commerce (CR)", "Commercial Registration (CR)",
    "Aramco Vendor Code", "SABIC Vendor Code", "SEC Vendor Code",
    "NEOM Vendor Code", "Ajeer Registration", "Qiwa Profile",
    "GOSI Certificate", "Zakat Certificate (ZATCA)",
    "Muqeem Registered", "Absher Verified",
  ],
  certifications: [
    "NEBOSH Certificate", "IOSH Certificate", "OSHA Certificate",
    "ASNT Level II Certificate", "AWS / CSWIP Weld Certificate",
    "DHA License", "SCFHS License", "Saudi Engineer License (SEC)",
    "PMI / PMP Certificate", "ISO Lead Auditor Certificate",
    "IELTS / TOEFL Score", "Saudi Driving License (Heavy)",
    "NIC / NICET Certificate",
  ],
};
