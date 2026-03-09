import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  formData: any;
  updateField: (key: string, value: any) => void;
}

const businessTypes = ["Restaurant", "Café", "Retail Shop", "Salon / Spa", "Laundry", "Gym", "Clinic", "Trading Co.", "Contracting", "E-commerce", "Other"];
const employeeCounts = ["1-5", "6-20", "21-50", "50+"];
const yearsOptions = ["Less than 1", "1-3", "3-5", "5-10", "10+"];
const sellingReasons = ["Relocating", "Personal Reasons", "Upgrading to Bigger", "Partnership Dispute", "Retirement", "Other"];
const businessIncludes = ["Trade License (CR)", "Equipment & Machinery", "Existing Staff", "Customer Database", "Website / Social Media", "Inventory / Stock", "Franchise Rights", "Training & Handover"];

const unitOptions = ["Tons", "KG", "Meters", "Sqm", "Pieces", "Bags", "Rolls", "Liters", "Sets", "Other"];
const stockStatuses = ["In Stock — Ready to Ship", "Available on Order", "Clearance / Surplus Stock"];
const industrialConditions = ["New / Unused", "Surplus / Overstocked", "Refurbished", "Used — Good Condition"];

const kitchenEquipmentTypes = ["Commercial Oven", "Fridge / Freezer", "Fryer", "Grill / Griddle", "Dishwasher", "Hood / Exhaust", "Food Processor", "Mixer / Blender", "Display Cabinet", "Coffee Machine", "POS System", "Other"];
const kitchenConditions = ["Brand New", "Like New", "Good", "Fair", "For Parts"];

const currentYear = new Date().getFullYear();

const BusinessIndustrialFields = ({ formData, updateField }: Props) => {
  const { lang } = useI18n();
  const sub = formData.subcategory || "";
  const isBusinessForSale = sub === "businesses-for-sale";
  const isIndustrialOrConstruction = sub === "industrial-supplies" || sub === "construction-materials";
  const isKitchenEquipment = sub === "kitchen-equipment";

  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  const toggleArrayField = (field: string, value: string) => {
    const current: string[] = formData[field] || [];
    updateField(field, current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value]);
  };

  return (
    <div className="space-y-5">
      {isBusinessForSale && (
        <>
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "🏢 نوع النشاط" : "🏢 Business Type"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {businessTypes.map(b => (
                  <button key={b} type="button" onClick={() => updateField("businessType", b)} className={chipCls(formData.businessType === b)}>{b}</button>
                ))}
              </div>
              {formData.businessType === "Other" && (
                <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                  placeholder={lang === "ar" ? "حدد نوع النشاط" : "Specify business type"} className="rounded-xl" />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "💰 التفاصيل المالية" : "💰 Financial Details"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{lang === "ar" ? "السعر المطلوب (ر.س)" : "Asking Price (SAR)"}</Label>
                <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)} className="mt-1.5 rounded-xl" />
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={(formData.features || []).includes("Includes Inventory")} onCheckedChange={() => toggleArrayField("features", "Includes Inventory")} />
                    {lang === "ar" ? "يشمل المخزون" : "Includes Inventory"}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={formData.priceNegotiable || false} onCheckedChange={v => updateField("priceNegotiable", v)} />
                    {lang === "ar" ? "قابل للتفاوض" : "Price Negotiable"}
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{lang === "ar" ? "الإيراد السنوي (ر.س)" : "Annual Revenue (SAR)"}</Label>
                  <Input type="number" value={formData.annualRevenue || ""} onChange={e => updateField("annualRevenue", e.target.value)} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label>{lang === "ar" ? "الإيجار الشهري (ر.س)" : "Monthly Rent (SAR)"}</Label>
                  <Input type="number" value={formData.monthlyRent || ""} onChange={e => updateField("monthlyRent", e.target.value)} className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>{lang === "ar" ? "المتبقي من عقد الإيجار" : "Lease Remaining"}</Label>
                <Input value={formData.leaseRemaining || ""} onChange={e => updateField("leaseRemaining", e.target.value)}
                  placeholder="e.g. 2 years remaining" className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{lang === "ar" ? "عدد الموظفين" : "Employees"}</Label>
                  <Select value={formData.employeeCount || ""} onValueChange={v => updateField("employeeCount", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{employeeCounts.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "سنوات العمل" : "Years in Operation"}</Label>
                  <Select value={formData.yearsInOperation || ""} onValueChange={v => updateField("yearsInOperation", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{yearsOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>{lang === "ar" ? "سبب البيع" : "Reason for Selling"}</Label>
                <Select value={formData.reasonSelling || ""} onValueChange={v => updateField("reasonSelling", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{sellingReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "📦 يشمل" : "📦 Includes"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {businessIncludes.map(b => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={(formData.businessIncludesArr || []).includes(b)} onCheckedChange={() => toggleArrayField("businessIncludesArr", b)} />
                    {b}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {isIndustrialOrConstruction && (
        <>
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "📦 تفاصيل المنتج" : "📦 Product Details"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{lang === "ar" ? "اسم المنتج / المادة" : "Product / Material Name"}</Label>
                <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>{lang === "ar" ? "الكمية" : "Quantity"}</Label>
                  <Input type="number" value={formData.quantity || ""} onChange={e => updateField("quantity", e.target.value)} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label>{lang === "ar" ? "الوحدة" : "Unit"}</Label>
                  <Select value={formData.unitOfMeasurement || ""} onValueChange={v => updateField("unitOfMeasurement", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{unitOptions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "الحد الأدنى للطلب" : "Min Order Qty"}</Label>
                  <Input type="number" value={formData.minOrderQuantity || ""} onChange={e => updateField("minOrderQuantity", e.target.value)} className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>{lang === "ar" ? "سعر الوحدة (ر.س)" : "Price Per Unit (SAR)"}</Label>
                <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "📋 التوفر والتوصيل" : "📋 Availability & Delivery"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{lang === "ar" ? "التوفر" : "Availability"}</Label>
                <RadioGroup value={formData.stockStatus || ""} onValueChange={v => updateField("stockStatus", v)} className="mt-1.5 space-y-2">
                  {stockStatuses.map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value={s} /><span className="text-sm">{s}</span></label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label>{lang === "ar" ? "التوصيل" : "Delivery"}</Label>
                <RadioGroup value={formData.deliveryAvailable || ""} onValueChange={v => updateField("deliveryAvailable", v)} className="mt-1.5 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="yes-buyer-pays" /><span className="text-sm">{lang === "ar" ? "نعم (المشتري يدفع)" : "Yes (buyer pays delivery)"}</span></label>
                  <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="yes-free" /><span className="text-sm">{lang === "ar" ? "نعم (مجاني)" : "Yes (free delivery)"}</span></label>
                  <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="no" /><span className="text-sm">{lang === "ar" ? "لا - الاستلام فقط" : "No — Collection only"}</span></label>
                </RadioGroup>
              </div>
              <div>
                <Label>{lang === "ar" ? "الحالة" : "Condition"}</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {industrialConditions.map(c => (
                    <button key={c} type="button" onClick={() => updateField("condition", c)} className={chipCls(formData.condition === c)}>{c}</button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {isKitchenEquipment && (
        <>
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{lang === "ar" ? "🍳 نوع المعدات" : "🍳 Equipment Type"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {kitchenEquipmentTypes.map(k => (
                  <button key={k} type="button" onClick={() => updateField("itemType", k)} className={chipCls(formData.itemType === k)}>{k}</button>
                ))}
              </div>
              <div>
                <Label>{lang === "ar" ? "الحالة" : "Condition"}</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {kitchenConditions.map(c => (
                    <button key={c} type="button" onClick={() => updateField("condition", c)} className={chipCls(formData.condition === c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{lang === "ar" ? "الماركة" : "Brand"}</Label>
                  <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)} placeholder="e.g. Rational, Hobart" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label>{lang === "ar" ? "الموديل" : "Model"}</Label>
                  <Input value={formData.itemModel || ""} onChange={e => updateField("itemModel", e.target.value)} className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>{lang === "ar" ? "سنة الصنع" : "Year"}</Label>
                <Select value={formData.year || ""} onValueChange={v => updateField("year", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl w-32"><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>{Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i).map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{lang === "ar" ? "السعر (ر.س)" : "Price (SAR)"}</Label>
                <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الضمان" : "Warranty"}</Label>
                <RadioGroup value={formData.hasWarranty ? "yes" : "no"} onValueChange={v => updateField("hasWarranty", v === "yes")} className="mt-1.5 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="no" /><span className="text-sm">{lang === "ar" ? "بدون ضمان" : "No Warranty"}</span></label>
                  <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="yes" /><span className="text-sm">{lang === "ar" ? "تحت الضمان" : "Under Warranty"}</span></label>
                </RadioGroup>
                {formData.hasWarranty && (
                  <Input type="date" value={formData.warrantyExpiry || ""} onChange={e => updateField("warrantyExpiry", e.target.value)} className="mt-2 rounded-xl w-48" />
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BusinessIndustrialFields;
