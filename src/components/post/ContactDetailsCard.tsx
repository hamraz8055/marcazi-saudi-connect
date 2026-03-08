import { useI18n } from "@/lib/i18n";
import PhoneInput from "@/components/PhoneInput";
import { Lock, Mail } from "lucide-react";

interface ContactDetailsCardProps {
  phoneCountryCode: string;
  phoneNumber: string;
  showPhone: boolean;
  contactEmail: string;
  showEmail: boolean;
  onUpdate: (field: string, value: any) => void;
  helperText?: string;
}

const ContactDetailsCard = ({
  phoneCountryCode, phoneNumber, showPhone,
  contactEmail, showEmail, onUpdate, helperText,
}: ContactDetailsCardProps) => {
  const { lang } = useI18n();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          📬 {lang === "ar" ? "بيانات التواصل" : "Contact Details"}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {lang === "ar" ? "كيف يمكن للمشترين التواصل معك؟" : "How should buyers reach you?"}
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
        </label>
        <PhoneInput
          countryCode={phoneCountryCode}
          phoneNumber={phoneNumber}
          onCountryCodeChange={(c) => onUpdate("phoneCountryCode", c)}
          onPhoneNumberChange={(n) => onUpdate("phoneNumber", n)}
        />
        {helperText && (
          <p className="text-[10px] text-muted-foreground">{helperText}</p>
        )}

        <div className="rounded-xl border border-border p-3 space-y-2">
          <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
            📞 {lang === "ar" ? "إظهار رقم الهاتف في هذا الإعلان؟" : "Show phone number on this ad?"}
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="radio" name="showPhone" checked={!showPhone}
              onChange={() => onUpdate("showPhone", false)}
              className="mt-1 accent-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {lang === "ar" ? "إخفاء رقمي (مُوصى به)" : "Hide my number (recommended)"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {lang === "ar" ? "المشترون يتواصلون عبر محادثة مركزي فقط" : "Buyers contact you through Marcazi chat only"}
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="radio" name="showPhone" checked={showPhone}
              onChange={() => onUpdate("showPhone", true)}
              className="mt-1 accent-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {lang === "ar" ? "إظهار رقمي" : "Show number publicly"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {lang === "ar" ? "المشترون يمكنهم الاتصال بك مباشرة" : "Buyers can call and WhatsApp you directly"}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Email */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "البريد الإلكتروني" : "Contact Email"}
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="email"
            value={contactEmail}
            onChange={e => onUpdate("contactEmail", e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          {lang === "ar"
            ? "تم ملؤه تلقائياً من حسابك. غيّره إن أردت إرسال الردود لبريد آخر."
            : "Pre-filled from your account. Change if you want replies sent to a different email."}
        </p>

        <div className="rounded-xl border border-border p-3 space-y-2">
          <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
            ✉️ {lang === "ar" ? "إظهار البريد في هذا الإعلان؟" : "Show email address on this ad?"}
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="radio" name="showEmail" checked={!showEmail}
              onChange={() => onUpdate("showEmail", false)}
              className="mt-1 accent-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {lang === "ar" ? "إخفاء بريدي (مُوصى به)" : "Hide my email (recommended)"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {lang === "ar" ? "المشترون يتواصلون عبر محادثة مركزي فقط" : "Buyers contact you through Marcazi chat only"}
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="radio" name="showEmail" checked={showEmail}
              onChange={() => onUpdate("showEmail", true)}
              className="mt-1 accent-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {lang === "ar" ? "إظهار بريدي" : "Show email publicly"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {lang === "ar" ? "المشترون يمكنهم مراسلتك مباشرة" : "Buyers can email you directly"}
              </p>
            </div>
          </label>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
        <Lock className="h-3 w-3" />
        {lang === "ar"
          ? "بيانات التواصل الخاصة بك تُشارَك فقط حسب اختياراتك أعلاه."
          : "Your contact info is only shared based on your choices above."}
      </p>
    </div>
  );
};

export default ContactDetailsCard;
