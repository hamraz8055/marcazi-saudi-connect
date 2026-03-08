import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { X, Plus, FileText } from "lucide-react";
import { documentSuggestions } from "@/lib/jobSkillSuggestions";

interface Props {
  documents: string[];
  onChange: (docs: string[]) => void;
}

const DocumentsInput = ({ documents, onChange }: Props) => {
  const { lang } = useI18n();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addDoc = (doc: string) => {
    const trimmed = doc.trim();
    if (!trimmed || documents.includes(trimmed) || documents.length >= 10) return;
    onChange([...documents, trimmed]);
    setInput("");
  };

  const removeDoc = (doc: string) => {
    onChange(documents.filter(d => d !== doc));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addDoc(input);
    }
    if (e.key === "Backspace" && !input && documents.length > 0) {
      removeDoc(documents[documents.length - 1]);
    }
  };

  const groups = [
    { key: "general", label: lang === "ar" ? "مستندات عامة" : "GENERAL DOCUMENTS", items: documentSuggestions.general },
    { key: "saudi", label: lang === "ar" ? "خاصة بالسعودية" : "SAUDI SPECIFIC", items: documentSuggestions.saudiSpecific },
    { key: "certs", label: lang === "ar" ? "شهادات مهنية" : "CERTIFICATIONS", items: documentSuggestions.certifications },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {lang === "ar" ? "المستندات المطلوبة" : "Documents Required"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "ar" ? "أخبر المتقدمين بما يحتاجون للتقديم" : "Let applicants know what they need to apply"}
        </p>
      </div>

      {/* Document chips */}
      <div className="flex flex-wrap gap-2 min-h-[40px] rounded-xl border border-border bg-card p-3">
        {documents.map(doc => (
          <span key={doc} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 px-3 py-1.5 text-sm font-medium">
            📄 {doc}
            <button onClick={() => removeDoc(doc)} className="hover:text-destructive transition-colors">
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
          placeholder={documents.length === 0 ? (lang === "ar" ? "اكتب مستنداً واضغط Enter" : "Type a document and press Enter") : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={documents.length >= 10}
        />
      </div>
      <p className="text-xs text-muted-foreground">{documents.length}/10 {lang === "ar" ? "مستندات" : "documents"}</p>

      {/* Grouped suggestions */}
      <div className="space-y-3">
        {groups.map(group => {
          const available = group.items.filter(d => !documents.includes(d));
          if (available.length === 0) return null;
          return (
            <div key={group.key}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {available.map(doc => (
                  <button
                    key={doc}
                    onClick={() => addDoc(doc)}
                    disabled={documents.length >= 10}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />{doc}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentsInput;
