import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

interface Props {
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  hourlyRate: string;
  contractDuration: string;
  paidInternship: boolean;
  contactForPrice: boolean;
  price: string;
  onUpdate: (field: string, value: any) => void;
}

const JobSalaryFields = ({
  employmentType, salaryMin, salaryMax, hourlyRate,
  contractDuration, paidInternship, contactForPrice, price, onUpdate,
}: Props) => {
  const { lang } = useI18n();

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed";

  const renderNegotiableToggle = () => (
    <label className="mt-3 flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onUpdate("contactForPrice", !contactForPrice)}
        className={`relative w-11 h-6 rounded-full transition-colors ${contactForPrice ? "bg-primary" : "bg-muted"}`}
      >
        <motion.div
          className="absolute top-1 h-4 w-4 rounded-full bg-primary-foreground shadow-sm"
          animate={{ left: contactForPrice ? "calc(100% - 20px)" : "4px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      <span className="text-sm text-foreground">
        {lang === "ar" ? "قابل للتفاوض" : "Negotiable"}
      </span>
    </label>
  );

  if (employmentType === "full-time" || employmentType === "part-time") {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "نطاق الراتب الشهري (ر.س)" : "Monthly Salary Range (SAR)"}
        </label>
        {!contactForPrice && (
          <div className="flex gap-3">
            <input type="number" value={salaryMin} onChange={e => onUpdate("salaryMin", e.target.value)}
              placeholder={lang === "ar" ? "مثال: 5,000" : "e.g. 5,000"} className={inputClass} />
            <input type="number" value={salaryMax} onChange={e => onUpdate("salaryMax", e.target.value)}
              placeholder={lang === "ar" ? "مثال: 10,000" : "e.g. 10,000"} className={inputClass} />
          </div>
        )}
        {renderNegotiableToggle()}
      </div>
    );
  }

  if (employmentType === "hourly") {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "أجر الساعة (ر.س/ساعة)" : "Hourly Rate (SAR/hr)"}
        </label>
        <input type="number" value={hourlyRate} onChange={e => onUpdate("hourlyRate", e.target.value)}
          placeholder={lang === "ar" ? "مثال: 50" : "e.g. 50"} className={inputClass} />
      </div>
    );
  }

  if (employmentType === "contract") {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "الراتب (ر.س)" : "Salary (SAR)"}
          </label>
          <div className="flex gap-3">
            <input type="number" value={salaryMin} onChange={e => onUpdate("salaryMin", e.target.value)}
              placeholder={lang === "ar" ? "الحد الأدنى" : "Min"} className={inputClass} />
            <input type="number" value={salaryMax} onChange={e => onUpdate("salaryMax", e.target.value)}
              placeholder={lang === "ar" ? "الحد الأقصى" : "Max"} className={inputClass} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "مدة العقد" : "Contract Duration"}
          </label>
          <input type="text" value={contractDuration} onChange={e => onUpdate("contractDuration", e.target.value)}
            placeholder={lang === "ar" ? "مثال: 3 أشهر، سنة واحدة" : "e.g. 3 months, 1 year"} className={inputClass} />
        </div>
      </div>
    );
  }

  if (employmentType === "internship") {
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => onUpdate("paidInternship", !paidInternship)}
            className={`relative w-11 h-6 rounded-full transition-colors ${paidInternship ? "bg-primary" : "bg-muted"}`}
          >
            <motion.div
              className="absolute top-1 h-4 w-4 rounded-full bg-primary-foreground shadow-sm"
              animate={{ left: paidInternship ? "calc(100% - 20px)" : "4px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {lang === "ar" ? "تدريب مدفوع" : "Paid Internship"}
          </span>
        </label>
        {paidInternship ? (
          <div>
            <label className="text-sm font-medium text-foreground">
              {lang === "ar" ? "المكافأة الشهرية (ر.س)" : "Monthly Stipend (SAR)"}
            </label>
            <input type="number" value={price} onChange={e => onUpdate("price", e.target.value)}
              placeholder={lang === "ar" ? "مثال: 3,000" : "e.g. 3,000"} className={`mt-1.5 ${inputClass}`} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            {lang === "ar" ? "تدريب غير مدفوع — بدون راتب" : "Unpaid internship — no salary"}
          </p>
        )}
      </div>
    );
  }

  if (employmentType === "freelance") {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "ميزانية المشروع (ر.س)" : "Project Budget (SAR)"}
        </label>
        <input type="number" value={price} onChange={e => onUpdate("price", e.target.value)}
          placeholder={lang === "ar" ? "مثال: 15,000" : "e.g. 15,000"} className={inputClass} />
      </div>
    );
  }

  return null;
};

export default JobSalaryFields;
