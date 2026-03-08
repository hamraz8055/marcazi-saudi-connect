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
  salaryType: string;
  rentalRateTbd: boolean;
  rentalDurationType: string;
  freelanceBudgetTbd: boolean;
  onUpdate: (field: string, value: any) => void;
}

const JobSalaryFields = ({
  employmentType, salaryMin, salaryMax, hourlyRate,
  contractDuration, paidInternship, contactForPrice, price,
  salaryType, rentalRateTbd, rentalDurationType, freelanceBudgetTbd,
  onUpdate,
}: Props) => {
  const { lang } = useI18n();

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed";

  const ChipOption = ({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        selected ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-foreground hover:border-primary/30"
      }`}
    >
      {label}
    </button>
  );

  // FULL-TIME: salary range / fixed / negotiable
  if (employmentType === "full-time") {
    return (
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "كيف يتم تحديد الراتب؟" : "How is the salary structured?"}
        </label>
        <div className="flex flex-wrap gap-2">
          <ChipOption selected={salaryType === "range"} label={lang === "ar" ? "نطاق الراتب" : "Salary Range"} onClick={() => onUpdate("salaryType", "range")} />
          <ChipOption selected={salaryType === "fixed"} label={lang === "ar" ? "راتب ثابت" : "Fixed Salary"} onClick={() => onUpdate("salaryType", "fixed")} />
          <ChipOption selected={salaryType === "negotiable"} label={lang === "ar" ? "قابل للتفاوض" : "Negotiable"} onClick={() => onUpdate("salaryType", "negotiable")} />
        </div>

        {salaryType === "range" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === "ar" ? "نطاق الراتب الشهري (ر.س)" : "Monthly Salary Range (SAR)"}
            </label>
            <div className="flex items-center gap-3">
              <input type="number" value={salaryMin} onChange={e => onUpdate("salaryMin", e.target.value)}
                placeholder={lang === "ar" ? "مثال: 5,000" : "e.g. 5,000"} className={inputClass} />
              <span className="text-muted-foreground font-medium">—</span>
              <input type="number" value={salaryMax} onChange={e => onUpdate("salaryMax", e.target.value)}
                placeholder={lang === "ar" ? "مثال: 10,000" : "e.g. 10,000"} className={inputClass} />
            </div>
          </div>
        )}

        {salaryType === "fixed" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === "ar" ? "الراتب الشهري (ر.س)" : "Monthly Salary (SAR)"}
            </label>
            <input type="number" value={salaryMin} onChange={e => { onUpdate("salaryMin", e.target.value); onUpdate("salaryMax", e.target.value); }}
              placeholder={lang === "ar" ? "مثال: 8,000" : "e.g. 8,000"} className={inputClass} />
          </div>
        )}

        {salaryType === "negotiable" && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            {lang === "ar" ? "سيتم مناقشة الراتب أثناء المقابلة" : "Salary will be discussed during the interview"}
          </p>
        )}
      </div>
    );
  }

  // HOURLY / RENTAL BASIS
  if (employmentType === "hourly") {
    return (
      <div className="space-y-4">
        {/* Rate status toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "أجر الساعة" : "Hourly Rate"}
          </label>
          <div className="flex flex-wrap gap-2">
            <ChipOption selected={!rentalRateTbd} label={lang === "ar" ? "أدخل الأجر" : "Enter Rate"} onClick={() => onUpdate("rentalRateTbd", false)} />
            <ChipOption selected={rentalRateTbd} label={lang === "ar" ? "يُحدد بعد المقابلة" : "Rate decided after interview"} onClick={() => onUpdate("rentalRateTbd", true)} />
          </div>
        </div>

        {!rentalRateTbd && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === "ar" ? "أجر الساعة (ر.س/ساعة)" : "Hourly Rate (SAR/hr)"}
            </label>
            <input type="number" value={hourlyRate} onChange={e => onUpdate("hourlyRate", e.target.value)}
              placeholder={lang === "ar" ? "مثال: 75" : "e.g. 75"} className="max-w-[80px] rounded-xl border border-border bg-card px-3 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground" />
          </div>
        )}

        {rentalRateTbd && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            {lang === "ar" ? "سيتم مناقشة الأجر والاتفاق عليه" : "The rate will be discussed and agreed upon"}
          </p>
        )}

        {/* Duration Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "مدة التكليف" : "Assignment Duration"}
          </label>
          <div className="flex flex-wrap gap-2">
            <ChipOption selected={rentalDurationType === "short"} label={lang === "ar" ? "قصير المدى (1–6 أشهر)" : "Short Term (1–6 months)"} onClick={() => onUpdate("rentalDurationType", "short")} />
            <ChipOption selected={rentalDurationType === "long"} label={lang === "ar" ? "طويل المدى (6+ أشهر)" : "Long Term (6+ months)"} onClick={() => onUpdate("rentalDurationType", "long")} />
            <ChipOption selected={rentalDurationType === "unspecified"} label={lang === "ar" ? "غير محدد" : "Not Specified"} onClick={() => onUpdate("rentalDurationType", "unspecified")} />
          </div>
        </div>
      </div>
    );
  }

  // INTERNSHIP — no changes
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

  // FREELANCE
  if (employmentType === "freelance") {
    return (
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "ميزانية المشروع" : "Project Budget"}
        </label>
        <div className="flex flex-wrap gap-2">
          <ChipOption selected={!freelanceBudgetTbd} label={lang === "ar" ? "ميزانية ثابتة" : "Fixed Budget"} onClick={() => onUpdate("freelanceBudgetTbd", false)} />
          <ChipOption selected={freelanceBudgetTbd} label={lang === "ar" ? "يُناقش لاحقاً" : "Budget to be Discussed"} onClick={() => onUpdate("freelanceBudgetTbd", true)} />
        </div>

        {!freelanceBudgetTbd && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === "ar" ? "ميزانية المشروع (ر.س)" : "Project Budget (SAR)"}
            </label>
            <input type="number" value={price} onChange={e => onUpdate("price", e.target.value)}
              placeholder={lang === "ar" ? "مثال: 5,000" : "e.g. 5,000"} className={inputClass} />
          </div>
        )}

        {freelanceBudgetTbd && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            {lang === "ar" ? "سيتم الاتفاق على الميزانية بناءً على نطاق العمل" : "Budget will be agreed upon based on scope of work"}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default JobSalaryFields;
