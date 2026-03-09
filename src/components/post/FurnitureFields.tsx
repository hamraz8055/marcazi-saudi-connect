import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props { formData: any; updateField: (key: string, value: any) => void; }

const conditions = ["Brand New", "Like New", "Good", "Fair", "For Parts/Repair"];
const materials = ["Wood", "Metal", "Fabric", "Leather", "Glass", "Plastic", "Rattan", "Marble", "Mixed", "Other"];
const reasonsSelling = ["Upgrading", "Moving", "Redecorating", "No Longer Needed", "Duplicate", "Other"];

const furnitureTypes = ["Sofa / Sectional", "Bed Frame", "Mattress", "Wardrobe", "Dining Table", "Dining Chairs", "Office Desk", "Office Chair", "Bookshelf", "TV Unit", "Coffee Table", "Kids Furniture", "Outdoor Furniture", "Storage / Shelf", "Other"];
const homeAccessoryTypes = ["Curtains / Blinds", "Rugs / Carpets", "Wall Art", "Mirrors", "Clocks", "Vases", "Photo Frames", "Cushions / Throws", "Candles / Decor", "Kitchen Accessories", "Bathroom Decor", "Other"];
const gardenTypes = ["Garden Furniture", "Plant Pots / Planters", "Plants", "Garden Tools", "Fencing / Panels", "Decking", "Outdoor Lighting", "Water Features", "BBQ / Grill", "Artificial Grass", "Garden Sheds", "Other"];
const lightingTypes = ["Ceiling Light", "Chandelier", "Floor Lamp", "Wall Light", "Desk Lamp", "Outdoor Light", "Ceiling Fan", "Stand Fan", "Exhaust Fan", "LED Strip", "Smart Lighting", "Other"];

const FurnitureFields = ({ formData, updateField }: Props) => {
  const { lang } = useI18n();
  const sub = formData.subcategory || "";

  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  const getItemTypes = () => {
    if (sub === "furniture") return furnitureTypes;
    if (sub === "home-accessories") return homeAccessoryTypes;
    if (sub === "garden-outdoor") return gardenTypes;
    if (sub === "lighting-fans") return lightingTypes;
    return [];
  };

  return (
    <div className="space-y-5">
      {/* Item Type */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "🪑 نوع المنتج" : "🪑 Item Type"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {getItemTypes().map(t => (
              <button key={t} type="button" onClick={() => updateField("itemType", t)} className={chipCls(formData.itemType === t)}>{t}</button>
            ))}
          </div>
          {sub === "furniture" && (
            <div className="mt-4 space-y-3">
              <Label>{lang === "ar" ? "طقم أم قطعة فردية؟" : "Set or Individual?"}</Label>
              <RadioGroup value={formData.itemSet ? "set" : "individual"} onValueChange={v => updateField("itemSet", v === "set")} className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="set" /><span className="text-sm">{lang === "ar" ? "طقم كامل" : "Complete Set"}</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="individual" /><span className="text-sm">{lang === "ar" ? "قطعة فردية" : "Individual Piece"}</span></label>
              </RadioGroup>
              {formData.itemSet && (
                <Input value={formData.setPieces || ""} onChange={e => updateField("setPieces", e.target.value)}
                  placeholder={lang === "ar" ? "عدد القطع" : "Number of pieces"} className="rounded-xl w-32" />
              )}
            </div>
          )}
          {sub === "garden-outdoor" && formData.itemType === "Plants" && (
            <div className="mt-4 space-y-3">
              <div>
                <Label>{lang === "ar" ? "نوع النبات" : "Plant Type"}</Label>
                <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)}
                  placeholder="e.g. Cactus, Palm, Jasmine" className="mt-1.5 rounded-xl" />
              </div>
              <Label>{lang === "ar" ? "يشمل الأصيص؟" : "Pot Included?"}</Label>
              <RadioGroup value={formData.smartDevice ? "yes" : "no"} onValueChange={v => updateField("smartDevice", v === "yes")} className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /><span className="text-sm">{lang === "ar" ? "نعم" : "Yes"}</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /><span className="text-sm">{lang === "ar" ? "لا" : "No"}</span></label>
              </RadioGroup>
            </div>
          )}
          {sub === "lighting-fans" && (
            <div className="mt-4 space-y-3">
              <div>
                <Label>{lang === "ar" ? "مصدر الطاقة" : "Power Type"}</Label>
                <RadioGroup value={formData.storageType || ""} onValueChange={v => updateField("storageType", v)} className="flex flex-wrap gap-3">
                  {["Electric (wired)", "Battery", "Solar", "Rechargeable"].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value={p} /><span className="text-sm">{p}</span></label>
                  ))}
                </RadioGroup>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={formData.hasWarranty || false} onCheckedChange={v => updateField("hasWarranty", v)} />
                  {lang === "ar" ? "لمبة مضمنة" : "Bulb Included"}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={formData.smartDevice || false} onCheckedChange={v => updateField("smartDevice", v)} />
                  {lang === "ar" ? "ذكي / تحكم بالتطبيق" : "Smart / App Controlled"}
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Condition & Material */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📋 الحالة والمواد" : "📋 Condition & Material"}</CardTitle>
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
          <div>
            <Label>{lang === "ar" ? "المادة" : "Material"}</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {materials.map(m => (
                <button key={m} type="button" onClick={() => updateField("itemMaterial", m)} className={chipCls(formData.itemMaterial === m)}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>{lang === "ar" ? "اللون / التشطيب" : "Color / Finish"}</Label>
            <Input value={formData.itemColor || ""} onChange={e => updateField("itemColor", e.target.value)}
              placeholder="e.g. White, Walnut Brown, Grey" className="mt-1.5 rounded-xl" />
          </div>
        </CardContent>
      </Card>

      {/* Dimensions */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📐 الأبعاد" : "📐 Dimensions (cm)"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>{lang === "ar" ? "العرض" : "Width"}</Label>
              <Input type="number" value={formData.dimensionsW || ""} onChange={e => updateField("dimensionsW", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "الارتفاع" : "Height"}</Label>
              <Input type="number" value={formData.dimensionsH || ""} onChange={e => updateField("dimensionsH", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "العمق" : "Depth"}</Label>
              <Input type="number" value={formData.dimensionsD || ""} onChange={e => updateField("dimensionsD", e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>{lang === "ar" ? "التجميع" : "Assembly"}</Label>
            <RadioGroup value={formData.assemblyRequired || ""} onValueChange={v => updateField("assemblyRequired", v)} className="mt-1.5 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="assembled" /><span className="text-sm">{lang === "ar" ? "مجمع جاهز" : "Comes assembled"}</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="requires" /><span className="text-sm">{lang === "ar" ? "يحتاج تجميع" : "Requires assembly"}</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="disassembled" /><span className="text-sm">{lang === "ar" ? "مفكك للنقل" : "Disassembled for transport"}</span></label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
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

export default FurnitureFields;
