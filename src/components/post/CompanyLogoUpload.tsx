import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { ImagePlus, X } from "lucide-react";

interface Props {
  logoFile: File | null;
  logoPreview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

const CompanyLogoUpload = ({ logoFile, logoPreview, onUpload, onRemove }: Props) => {
  const { lang } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(lang === "ar" ? "الحد الأقصى 2 ميجابايت" : "Max 2MB file size");
      return;
    }
    onUpload(file);
  };

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <p className="text-sm font-medium text-foreground mb-1">
        {lang === "ar" ? "شعار الشركة (اختياري)" : "Company Logo (Optional)"}
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        {lang === "ar" ? "صورة مربعة، الحد الأقصى 2 ميجابايت" : "Square image recommended, max 2MB"}
      </p>
      {logoPreview ? (
        <div className="relative inline-block">
          <img src={logoPreview} alt="" className="h-20 w-20 rounded-xl object-cover border border-border" />
          <button onClick={onRemove} className="absolute -top-2 -end-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[9px] font-medium">{lang === "ar" ? "شعار" : "Logo"}</span>
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
};

export default CompanyLogoUpload;
