import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { X, Plus } from "lucide-react";
import { skillSuggestionsBySubcategory, defaultSkillSuggestions } from "@/lib/jobSkillSuggestions";

interface Props {
  skills: string[];
  onChange: (skills: string[]) => void;
  subcategory: string;
}

const SkillsInput = ({ skills, onChange, subcategory }: Props) => {
  const { lang } = useI18n();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = skillSuggestionsBySubcategory[subcategory] || defaultSkillSuggestions;
  const availableSuggestions = suggestions.filter(s => !skills.includes(s));

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 15) return;
    onChange([...skills, trimmed]);
    setInput("");
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === "Backspace" && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {lang === "ar" ? "المهارات المطلوبة" : "Required Skills"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "ar" ? "ساعد المرشحين في العثور على وظيفتك بشكل أسرع" : "Help candidates find your job faster"}
        </p>
      </div>

      {/* Skills chips */}
      <div className="flex flex-wrap gap-2 min-h-[40px] rounded-xl border border-border bg-card p-3">
        {skills.map(skill => (
          <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? (lang === "ar" ? "اكتب مهارة واضغط Enter" : "Type a skill and press Enter") : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={skills.length >= 15}
        />
      </div>
      <p className="text-xs text-muted-foreground">{skills.length}/15 {lang === "ar" ? "مهارات" : "skills"}</p>

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {lang === "ar" ? "اقتراحات:" : "Suggestions:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                disabled={skills.length >= 15}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />{skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsInput;
