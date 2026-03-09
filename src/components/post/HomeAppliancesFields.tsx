import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props { formData: any; updateField: (key: string, value: any) => void; }

const conditions = ["Brand New", "Like New", "Good", "Fair", "For Parts"];
const reasonsSelling = ["Upgrading", "Buying New", "Moving", "Gifted", "Duplicate Item", "No Longer Needed", "Other"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

const largeApplianceTypes = ["Washing Machine", "Dryer", "Refrigerator", "Freezer", "Dishwasher", "Air Conditioner", "Water Heater", "Vacuum Robot", "Other"];
const energyRatings = ["A+++", "A++", "A+", "A", "B", "C", "Not Specified"];

const kitchenApplianceTypes = ["Microwave", "Oven / Stove", "Coffee Machine", "Blender / Mixer", "Air Fryer", "Juicer", "Food Processor", "Toaster", "Rice Cooker", "Bread Maker", "Other"];
const outdoorApplianceTypes = ["BBQ Grill", "Patio Heater", "Garden Vacuum", "Pressure Washer", "Generator", "Solar Panel", "Water Pump", "Lawn Mower", "Other"];
const bathroomApplianceTypes = ["Water Heater", "Bidet", "Hair Dryer", "Electric Shaver", "Water Filter", "Scale", "Jacuzzi / Spa", "Other"];

const HomeAppliancesFields = ({ formData, updateField }: Props) => {
  const { lang } = useI18n();
  const sub = formData.subcategory || "";

  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  const getApplianceTypes = () => {
    if (sub === "large-appliances") return largeApplianceTypes;
    if (sub === "kitchen-appliances") return kitchenApplianceTypes;
    if (sub === "outdoor-appliances") return outdoorApplianceTypes;
    if (sub === "bathroom-appliances") return bathroomApplianceTypes;
    return [];
  };

  return (
    <div className="space-y-5">
      {/* Appliance Type */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "🔌 نوع الجهاز" : "🔌 Appliance Type"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getApplianceTypes().map(a => (
              <button key={a} type="button" onClick={() => updateField("itemType", a)} className={chipCls(formData.itemType === a)}>{a}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condition & Details */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📋 الحالة والتفاصيل" : "📋 Condition & Details"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "الحالة" : "Condition"}</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {conditions.map(c => (
                <button key={c} type="button" onClick={() => updateField("condition", c)} className={chipCls(formData.condition === c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{lang === "ar" ? "الماركة" : "Brand"}</Label>
              <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                placeholder="e.g. Samsung, LG, Bosch" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "الموديل" : "Model"}</Label>
              <Input value={formData.itemModel || ""} onChange={e => updateField("itemModel", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>{lang === "ar" ? "سنة الشراء" : "Year of Purchase"}</Label>
            <Select value={formData.year || ""} onValueChange={v => updateField("year", v)}>
              <SelectTrigger className="mt-1.5 rounded-xl w-32"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {/* Large appliances extras */}
          {sub === "large-appliances" && (
            <>
              <div>
                <Label>{lang === "ar" ? "السعة / الحجم" : "Capacity / Size"}</Label>
                <Input value={formData.itemSize || ""} onChange={e => updateField("itemSize", e.target.value)}
                  placeholder={`e.g. 7KG, 500L, 2.5 Ton`} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label>{lang === "ar" ? "تصنيف الطاقة" : "Energy Rating"}</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {energyRatings.map(e => (
                    <button key={e} type="button" onClick={() => updateField("energyRating", e)} className={chipCls(formData.energyRating === e)}>{e}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Listing Type & Price */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "💰 السعر" : "💰 Pricing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "نوع الإعلان" : "Listing Type"}</Label>
            <RadioGroup value={formData.listingTypeItem || "sale"} onValueChange={v => updateField("listingTypeItem", v)} className="mt-1.5 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="sale" /><span className="text-sm">{lang === "ar" ? "للبيع" : "For Sale"}</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="swap" /><span className="text-sm">{lang === "ar" ? "للتبديل" : "For Swap"}</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="free" /><span className="text-sm">{lang === "ar" ? "مجاناً" : "Free"}</span></label>
            </RadioGroup>
          </div>
          {(formData.listingTypeItem || "sale") !== "free" && (
            <div>
              <Label>{lang === "ar" ? "السعر (ر.س)" : "Price (SAR)"}</Label>
              <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)} className="mt-1.5 rounded-xl" />
              <label className="mt-2 flex items-center gap-2 cursor-pointer">
                <Checkbox checked={formData.priceNegotiable || false} onCheckedChange={v => updateField("priceNegotiable", v)} />
                <span className="text-sm">{lang === "ar" ? "قابل للتفاوض" : "Price Negotiable"}</span>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warranty & Reason */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "🛡️ الضمان" : "🛡️ Warranty & More"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "الضمان" : "Warranty"}</Label>
            <RadioGroup value={formData.warrantyType || "none"} onValueChange={v => { updateField("warrantyType", v); updateField("hasWarranty", v !== "none"); }} className="mt-1.5 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="none" /><span className="text-sm">{lang === "ar" ? "بدون ضمان" : "No Warranty"}</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="under" /><span className="text-sm">{lang === "ar" ? "تحت الضمان" : "Under Warranty"}</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="extended" /><span className="text-sm">{lang === "ar" ? "ضمان ممتد" : "Extended Warranty Available"}</span></label>
            </RadioGroup>
            {formData.warrantyType === "under" && (
              <Input type="date" value={formData.warrantyExpiry || ""} onChange={e => updateField("warrantyExpiry", e.target.value)} className="mt-2 rounded-xl w-48" />
            )}
            {formData.warrantyType === "extended" && (
              <Input value={formData.warrantyExpiry || ""} onChange={e => updateField("warrantyExpiry", e.target.value)}
                placeholder={lang === "ar" ? "تفاصيل الضمان الممتد" : "Extended warranty details"} className="mt-2 rounded-xl" />
            )}
          </div>
          <div>
            <Label>{lang === "ar" ? "سبب البيع" : "Reason for Selling"}</Label>
            <Select value={formData.reasonSelling || ""} onValueChange={v => updateField("reasonSelling", v)}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{reasonsSelling.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeAppliancesFields;
