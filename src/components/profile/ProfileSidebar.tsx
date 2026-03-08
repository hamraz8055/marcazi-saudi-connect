import { useI18n } from "@/lib/i18n";
import { User, Briefcase, MapPin, Phone, Shield, AlertTriangle, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProfileSection } from "@/pages/Profile";

interface Props {
  activeSection: ProfileSection;
  onSectionChange: (s: ProfileSection) => void;
}

const ProfileSidebar = ({ activeSection, onSectionChange }: Props) => {
  const { lang } = useI18n();
  const [profileOpen, setProfileOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);

  const isActive = (s: ProfileSection) => activeSection === s;
  const itemClass = (s: ProfileSection) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${
      isActive(s) ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
    }`;

  return (
    <div className="rounded-2xl border border-border bg-card p-3 md:sticky md:top-24 space-y-1">
      <Collapsible open={profileOpen} onOpenChange={setProfileOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted rounded-lg">
          <span className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {lang === "ar" ? "الملف الشخصي" : "Profile"}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-3 space-y-0.5">
          <div className={itemClass("basic-info")} onClick={() => onSectionChange("basic-info")}>
            <User className="h-4 w-4" />
            {lang === "ar" ? "المعلومات الأساسية" : "Basic Info"}
          </div>
          <div className={itemClass("job-profile")} onClick={() => onSectionChange("job-profile")}>
            <Briefcase className="h-4 w-4" />
            {lang === "ar" ? "الملف الوظيفي" : "Job Profile"}
          </div>
          <div className={itemClass("addresses")} onClick={() => onSectionChange("addresses")}>
            <MapPin className="h-4 w-4" />
            {lang === "ar" ? "العناوين" : "My Addresses"}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={accountOpen} onOpenChange={setAccountOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted rounded-lg">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {lang === "ar" ? "الحساب" : "Account"}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-3 space-y-0.5">
          <div className={itemClass("phone-numbers")} onClick={() => onSectionChange("phone-numbers")}>
            <Phone className="h-4 w-4" />
            {lang === "ar" ? "أرقام الهاتف" : "Phone Numbers"}
          </div>
          <div className={itemClass("security")} onClick={() => onSectionChange("security")}>
            <Shield className="h-4 w-4" />
            {lang === "ar" ? "الأمان" : "Security"}
          </div>
          <div className={itemClass("verify")} onClick={() => onSectionChange("verify")}>
            <Shield className="h-4 w-4 text-primary" />
            {lang === "ar" ? "التوثيق" : "Get Verified"}
          </div>
          <div className={itemClass("deactivate")} onClick={() => onSectionChange("deactivate")}>
            <AlertTriangle className="h-4 w-4 text-destructive" />
            {lang === "ar" ? "تعطيل الحساب" : "Deactivate Account"}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ProfileSidebar;
