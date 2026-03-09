import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommunityFieldsProps {
  formData: any;
  updateField: (key: string, value: any) => void;
}

const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Full-time", "Part-time", "On-call / As needed"];
const serviceLocationOptions = ["At Client's Location", "At My Location", "Online / Remote", "Flexible"];
const experienceLevels = ["Beginner", "Intermediate", "Experienced", "Expert / Professional"];
const languageOptions = ["Arabic", "English", "Urdu", "Hindi", "Tagalog"];

const maintenanceServices = ["Plumbing", "Electrical Work", "AC Repair", "Painting", "Carpentry", "Tiling / Flooring", "Cleaning", "Pest Control", "General Handyman", "Landscaping / Garden", "Swimming Pool", "CCTV / Smart Home", "Appliance Repair", "Waterproofing"];

const teachingModes = ["In-Person (at student's home)", "In-Person (at my location)", "Online (Zoom/Teams)", "Both Online & In-Person"];
const teachingLevels = ["Primary School", "Middle School", "High School", "University", "Adult / Professional"];
const sessionDurations = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours"];

const CommunityFields = ({ formData, updateField }: CommunityFieldsProps) => {
  const { lang } = useI18n();
  const sub = formData.subcategory || "";

  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  const toggleArrayField = (field: string, value: string) => {
    const current: string[] = formData[field] || [];
    updateField(field, current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value]);
  };

  return (
    <div className="space-y-5">
      {/* Service Direction */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "🤝 نوع الخدمة" : "🤝 Service Type"}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={formData.serviceDirection || "offering"} onValueChange={v => updateField("serviceDirection", v)} className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="offering" />
              <span className="text-sm font-medium">{lang === "ar" ? "أقدم خدمة" : "I am offering a service"}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="seeking" />
              <span className="text-sm font-medium">{lang === "ar" ? "أبحث عن خدمة" : "I am looking for a service"}</span>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "💰 التسعير" : "💰 Pricing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={formData.pricingType || "fixed"} onValueChange={v => updateField("pricingType", v)} className="space-y-2">
            {[
              { value: "fixed", label: lang === "ar" ? "سعر ثابت" : "Fixed Price" },
              { value: "hourly", label: lang === "ar" ? "بالساعة" : "Hourly Rate" },
              { value: "daily", label: lang === "ar" ? "يومي" : "Daily Rate" },
              { value: "custom", label: lang === "ar" ? "حسب المشروع" : "Custom Quote" },
              { value: "free", label: lang === "ar" ? "مجاني / تطوعي" : "Free / Volunteer" },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                <RadioGroupItem value={opt.value} />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
          {["fixed", "hourly", "daily"].includes(formData.pricingType || "fixed") && (
            <div>
              <Label>{lang === "ar" ? "المبلغ (ر.س)" : "Amount (SAR)"}</Label>
              <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)}
                placeholder={lang === "ar" ? "أدخل المبلغ" : "Enter amount"} className="mt-1.5 rounded-xl" />
            </div>
          )}
          {formData.pricingType === "custom" && (
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "السعر يناقش حسب المشروع" : "Price discussed per project"}</p>
          )}
        </CardContent>
      </Card>

      {/* Availability & Location */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📅 التوفر والموقع" : "📅 Availability & Location"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "الأوقات المتاحة" : "Availability"}</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {availabilityOptions.map(a => (
                <label key={a} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={(formData.serviceAvailability || []).includes(a)} onCheckedChange={() => toggleArrayField("serviceAvailability", a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>{lang === "ar" ? "مكان تقديم الخدمة" : "Service Location"}</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {serviceLocationOptions.map(l => (
                <label key={l} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={(formData.serviceLocationArr || []).includes(l)} onCheckedChange={() => toggleArrayField("serviceLocationArr", l)} />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience & Languages */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "⭐ الخبرة واللغات" : "⭐ Experience & Languages"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "مستوى الخبرة" : "Experience Level"}</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {experienceLevels.map(e => (
                <button key={e} type="button" onClick={() => updateField("experienceLevel", e)} className={chipCls(formData.experienceLevel === e)}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>{lang === "ar" ? "اللغات" : "Languages"}</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {languageOptions.map(l => (
                <label key={l} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={(formData.serviceLanguages || []).includes(l)} onCheckedChange={() => toggleArrayField("serviceLanguages", l)} />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Freelancers specific */}
      {sub === "freelancers" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "🎨 ملف العمل الحر" : "🎨 Freelancer Profile"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "التخصص" : "Specialization"}</Label>
              <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                placeholder="e.g. Graphic Designer, Web Developer" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "رابط المعرض" : "Portfolio Link"}</Label>
              <Input type="url" value={formData.portfolioUrl || ""} onChange={e => updateField("portfolioUrl", e.target.value)}
                placeholder="https://..." className="mt-1.5 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Home Maintenance specific */}
      {sub === "home-maintenance" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "🔧 خدمات الصيانة" : "🔧 Maintenance Services"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "نوع الخدمة" : "Service Type"}</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {maintenanceServices.map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={(formData.features || []).includes(s)} onCheckedChange={() => {
                      const current: string[] = formData.features || [];
                      updateField("features", current.includes(s) ? current.filter((v: string) => v !== s) : [...current, s]);
                    }} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "مرخص / معتمد؟" : "Licensed / Certified?"}</Label>
              <RadioGroup value={formData.hasWarranty ? "yes" : "no"} onValueChange={v => updateField("hasWarranty", v === "yes")} className="mt-1.5 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="yes" /><span className="text-sm">{lang === "ar" ? "نعم" : "Yes"}</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="no" /><span className="text-sm">{lang === "ar" ? "لا" : "No"}</span></label>
              </RadioGroup>
              {formData.hasWarranty && (
                <Input value={formData.warrantyType || ""} onChange={e => updateField("warrantyType", e.target.value)}
                  placeholder={lang === "ar" ? "نوع / رقم الرخصة" : "License type/number"} className="mt-2 rounded-xl" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tutors & Classes specific */}
      {sub === "tutors-classes" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "📚 تفاصيل التدريس" : "📚 Teaching Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "المادة / الموضوع" : "Subject / Topic"}</Label>
              <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                placeholder="e.g. Maths, Quran, Piano" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "طريقة التدريس" : "Teaching Mode"}</Label>
              <RadioGroup value={formData.itemType || ""} onValueChange={v => updateField("itemType", v)} className="mt-1.5 space-y-2">
                {teachingModes.map(m => (
                  <label key={m} className="flex items-center gap-3 cursor-pointer">
                    <RadioGroupItem value={m} /><span className="text-sm">{m}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label>{lang === "ar" ? "المستوى" : "Level"}</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {teachingLevels.map(l => (
                  <label key={l} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={(formData.accessoriesIncluded || []).includes(l)} onCheckedChange={() => {
                      const current: string[] = formData.accessoriesIncluded || [];
                      updateField("accessoriesIncluded", current.includes(l) ? current.filter((v: string) => v !== l) : [...current, l]);
                    }} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "مدة الحصة" : "Session Duration"}</Label>
              <Select value={formData.contractDuration || ""} onValueChange={v => updateField("contractDuration", v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{sessionDurations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>{lang === "ar" ? "تفضيل الجنس (الطلاب)" : "Student Gender Preference"}</Label>
              <RadioGroup value={formData.itemSize || ""} onValueChange={v => updateField("itemSize", v)} className="mt-1.5 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="male" /><span className="text-sm">{lang === "ar" ? "ذكور فقط" : "Male Students Only"}</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="female" /><span className="text-sm">{lang === "ar" ? "إناث فقط" : "Female Students Only"}</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="any" /><span className="text-sm">{lang === "ar" ? "بدون تفضيل" : "No Preference"}</span></label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityFields;
