import { useI18n } from "@/lib/i18n";
import { employmentTypes, type EmploymentType } from "@/lib/jobSkillSuggestions";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface Props {
  employmentType: string;
  onSelect: (type: EmploymentType) => void;
}

const JobEmploymentStep = ({ employmentType, onSelect }: Props) => {
  const { lang } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        {lang === "ar" ? "نوع التوظيف" : "Employment Type"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {employmentTypes.map((type) => (
          <motion.button
            key={type.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(type.value)}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-start transition-colors ${
              employmentType === type.value
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <Briefcase className={`h-5 w-5 shrink-0 ${employmentType === type.value ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${employmentType === type.value ? "text-primary" : "text-foreground"}`}>
              {lang === "ar" ? type.labelAr : type.labelEn}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default JobEmploymentStep;
