import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassifiedsFieldsProps {
  formData: any;
  updateField: (key: string, value: any) => void;
}

const conditions = ["Brand New", "Like New", "Good", "Fair", "For Parts"];

const deviceTypes = ["Desktop", "Laptop", "Server", "Networking", "Accessories", "Other"];
const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB+"];
const storageOptions = ["128GB", "256GB", "512GB", "1TB", "2TB+"];
const osOptions = ["Windows 11", "macOS", "Linux", "No OS"];

const clothingCategories = ["Men's", "Women's", "Kids", "Unisex", "Accessories"];

const jewelryTypes = ["Watch", "Ring", "Necklace", "Bracelet", "Earrings", "Set", "Gold", "Silver", "Diamond", "Other"];

const ClassifiedsFields = ({ formData, updateField }: ClassifiedsFieldsProps) => {
  const { lang } = useI18n();
  const sub = formData.subcategory || "";

  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  return (
    <div className="space-y-5">
      {/* Condition */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📦 حالة المنتج" : "📦 Item Condition"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {conditions.map(c => (
              <button key={c} type="button" onClick={() => updateField("condition", c)} className={chipCls(formData.condition === c)}>{c}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listing Type */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "🏷️ نوع الإعلان" : "🏷️ Listing Type"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={formData.listingTypeItem || "sale"} onValueChange={v => updateField("listingTypeItem", v)} className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="sale" />
              <span className="text-sm font-medium">{lang === "ar" ? "للبيع" : "For Sale"}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="swap" />
              <div>
                <span className="text-sm font-medium">{lang === "ar" ? "للتبديل" : "For Swap/Exchange"}</span>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "أريد تبديل هذا المنتج" : "I want to swap this item"}</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="free" />
              <div>
                <span className="text-sm font-medium">{lang === "ar" ? "مجاناً" : "Free"}</span>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "تبرع بدون مقابل" : "Giving away for free"}</p>
              </div>
            </label>
          </RadioGroup>

          {(formData.listingTypeItem || "sale") !== "free" && (
            <div>
              <Label>{lang === "ar" ? "السعر (ر.س)" : "Price (SAR)"}</Label>
              <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)}
                placeholder={lang === "ar" ? "أدخل السعر" : "Enter price"} className="mt-1.5 rounded-xl"
                required={(formData.listingTypeItem || "sale") === "sale"} />
              <label className="mt-2 flex items-center gap-2 cursor-pointer">
                <Checkbox checked={formData.priceNegotiable || false} onCheckedChange={v => updateField("priceNegotiable", v)} />
                <span className="text-sm">{lang === "ar" ? "قابل للتفاوض" : "Price Negotiable"}</span>
              </label>
            </div>
          )}

          {formData.listingTypeItem === "swap" && (
            <div>
              <Label>{lang === "ar" ? "ماذا تريد مقابله؟" : "What would you like in exchange?"}</Label>
              <Input value={formData.swapFor || ""} onChange={e => updateField("swapFor", e.target.value)}
                placeholder={lang === "ar" ? "مثال: آيفون 15 أو بلايستيشن 5" : "e.g. iPhone 15 or PlayStation 5"} className="mt-1.5 rounded-xl" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quantity & Warranty */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📋 تفاصيل إضافية" : "📋 Additional Details"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "الكمية المتاحة" : "Quantity Available"}</Label>
            <Input type="number" value={formData.quantity || 1} onChange={e => updateField("quantity", e.target.value)}
              min={1} className="mt-1.5 rounded-xl w-24" />
          </div>
          <div>
            <Label>{lang === "ar" ? "الضمان" : "Warranty"}</Label>
            <RadioGroup value={formData.hasWarranty ? "yes" : "no"} onValueChange={v => updateField("hasWarranty", v === "yes")} className="mt-1.5 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <RadioGroupItem value="no" />
                <span className="text-sm">{lang === "ar" ? "بدون ضمان" : "No Warranty"}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <RadioGroupItem value="yes" />
                <span className="text-sm">{lang === "ar" ? "تحت الضمان" : "Under Warranty"}</span>
              </label>
            </RadioGroup>
            {formData.hasWarranty && (
              <div className="mt-2">
                <Label className="text-xs">{lang === "ar" ? "تاريخ انتهاء الضمان" : "Warranty Expiry Date"}</Label>
                <Input type="date" value={formData.warrantyExpiry || ""} onChange={e => updateField("warrantyExpiry", e.target.value)} className="mt-1 rounded-xl w-48" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subcategory-specific fields */}
      {sub === "electronics" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "🔌 تفاصيل الإلكترونيات" : "🔌 Electronics Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "الماركة" : "Brand"}</Label>
              <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                placeholder="e.g. Samsung, Sony, LG" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "الموديل" : "Model"}</Label>
              <Input value={formData.itemModel || ""} onChange={e => updateField("itemModel", e.target.value)}
                placeholder={`e.g. 65" QLED Q80B`} className="mt-1.5 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      )}

      {sub === "computers-networking" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "💻 تفاصيل الكمبيوتر" : "💻 Computer Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "نوع الجهاز" : "Device Type"}</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {deviceTypes.map(d => (
                  <button key={d} type="button" onClick={() => updateField("itemType", d)} className={chipCls(formData.itemType === d)}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "المعالج" : "Processor"}</Label>
              <Input value={formData.processor || ""} onChange={e => updateField("processor", e.target.value)}
                placeholder="e.g. Intel Core i7-12th Gen" className="mt-1.5 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>RAM</Label>
                <Select value={formData.ram || ""} onValueChange={v => updateField("ram", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{ramOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{lang === "ar" ? "التخزين" : "Storage"}</Label>
                <Select value={formData.storageCapacity || ""} onValueChange={v => updateField("storageCapacity", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{storageOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>GPU</Label>
              <Input value={formData.gpu || ""} onChange={e => updateField("gpu", e.target.value)}
                placeholder="e.g. NVIDIA RTX 4060" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "نظام التشغيل" : "Operating System"}</Label>
              <Select value={formData.operatingSystem || ""} onValueChange={v => updateField("operatingSystem", v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{osOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {sub === "clothing-accessories" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "👗 تفاصيل الملابس" : "👗 Clothing Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "الفئة" : "Category"}</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {clothingCategories.map(c => (
                  <button key={c} type="button" onClick={() => updateField("itemType", c)} className={chipCls(formData.itemType === c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "المقاس" : "Size"}</Label>
                <Input value={formData.itemSize || ""} onChange={e => updateField("itemSize", e.target.value)}
                  placeholder="e.g. M, L, XL, 42" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label>{lang === "ar" ? "الماركة" : "Brand"}</Label>
                <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                  placeholder="e.g. Zara, H&M" className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "اللون" : "Color"}</Label>
              <Input value={formData.itemColor || ""} onChange={e => updateField("itemColor", e.target.value)}
                placeholder="e.g. Navy Blue" className="mt-1.5 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      )}

      {sub === "jewelry-watches" && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "💎 تفاصيل المجوهرات" : "💎 Jewelry & Watch Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "النوع" : "Type"}</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {jewelryTypes.map(j => (
                  <button key={j} type="button" onClick={() => updateField("itemType", j)} className={chipCls(formData.itemType === j)}>{j}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "الماركة / المصمم" : "Brand / Designer"}</Label>
              <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                placeholder="e.g. Rolex, Cartier, Local" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "المادة" : "Material"}</Label>
              <Input value={formData.itemMaterial || ""} onChange={e => updateField("itemMaterial", e.target.value)}
                placeholder="e.g. 18K Gold, 925 Silver" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "الوزن (جرام)" : "Weight (grams)"}</Label>
              <Input type="number" value={formData.dimensionsW || ""} onChange={e => updateField("dimensionsW", e.target.value)}
                placeholder={lang === "ar" ? "اختياري" : "Optional"} className="mt-1.5 rounded-xl w-32" />
            </div>
            <div>
              <Label>{lang === "ar" ? "الشهادة / التوثيق" : "Certificate / Authentication"}</Label>
              <RadioGroup value={formData.hasCertificate || "no"} onValueChange={v => updateField("hasCertificate", v)} className="mt-1.5 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <RadioGroupItem value="no" />
                  <span className="text-sm">{lang === "ar" ? "بدون شهادة" : "No Certificate"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <RadioGroupItem value="yes" />
                  <span className="text-sm">{lang === "ar" ? "يوجد شهادة" : "Has Certificate"}</span>
                </label>
              </RadioGroup>
              {formData.hasCertificate === "yes" && (
                <Input value={formData.warrantyType || ""} onChange={e => updateField("warrantyType", e.target.value)}
                  placeholder="e.g. GIA, IGI, Store Certificate" className="mt-2 rounded-xl" />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassifiedsFields;
