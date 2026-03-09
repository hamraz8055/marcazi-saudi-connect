import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props { formData: any; updateField: (key: string, value: any) => void; }

const conditions = ["Brand New — Sealed", "Brand New — Open Box", "Excellent", "Good", "Fair", "For Parts"];

const phoneBrands = ["Apple", "Samsung", "Huawei", "Xiaomi", "OnePlus", "Google", "Oppo", "Vivo", "Nokia", "Other"];
const tabletBrands = ["Apple iPad", "Samsung", "Huawei", "Xiaomi", "Lenovo", "Microsoft Surface", "Other"];
const laptopBrands = ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Razer", "Microsoft Surface", "Other"];

const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const ramOptions = ["4GB", "6GB", "8GB", "12GB", "16GB"];
const laptopRamOptions = ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB+"];
const laptopStorageOptions = ["128GB", "256GB", "512GB", "1TB", "2TB", "4TB+"];
const batteryHealthOptions = ["100%", "95-99%", "90-94%", "85-89%", "Below 85%", "Unknown"];
const screenSizes = ["7\"", "8\"", "10\"", "11\"", "12\"", "13\"", "Other"];
const laptopScreenSizes = ["11\"", "13\"", "14\"", "15\"", "16\"", "17\"+"];
const osOptions = ["Windows 11", "Windows 10", "macOS", "Linux", "No OS"];

const accessoryTypes = ["Phone Case", "Screen Protector", "Charger", "Power Bank", "Earphones / AirPods", "Headphones", "Cable", "Adapter", "Watch / Band", "Camera Lens", "Ring Light", "Tripod", "Memory Card", "USB Hub", "Keyboard / Mouse", "Wireless Charger", "Other"];
const deviceTypes = ["Laptop", "Desktop Tower", "All-in-One", "Mac", "Gaming PC", "Mini PC", "Workstation"];

const phoneAccessories = ["Original Box", "Charger", "Earphones", "Case / Cover", "Screen Protector", "Cable Only"];
const tabletAccessories = ["Original Box", "Charger", "Keyboard", "Apple Pencil / Stylus", "Case", "Cable Only"];
const laptopConditionDetails = ["Battery holds good charge", "Keyboard fully working", "Screen no scratches / dead pixels", "All ports working", "Cooling / fans normal", "Charger included", "Original box included"];

const currentYear = new Date().getFullYear();

const MobilesFields = ({ formData, updateField }: Props) => {
  const { lang } = useI18n();
  const sub = formData.subcategory || "";
  const isPhone = sub === "mobile-phones";
  const isTablet = sub === "tablets";
  const isAccessory = sub === "mobile-accessories";
  const isLaptop = sub === "desktop-laptop";

  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  const toggleArrayField = (field: string, value: string) => {
    const current: string[] = formData[field] || [];
    updateField(field, current.includes(value) ? current.filter((v: string) => v !== value) : [...current, value]);
  };

  const getBrands = () => {
    if (isPhone) return phoneBrands;
    if (isTablet) return tabletBrands;
    if (isLaptop) return laptopBrands;
    return [];
  };

  return (
    <div className="space-y-5">
      {/* Condition */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📱 الحالة" : "📱 Condition"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {conditions.map(c => (
              <button key={c} type="button" onClick={() => updateField("condition", c)} className={chipCls(formData.condition === c)}>{c}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "💰 السعر" : "💰 Pricing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={formData.listingTypeItem || "sale"} onValueChange={v => updateField("listingTypeItem", v)} className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="sale" /><span className="text-sm">{lang === "ar" ? "للبيع" : "For Sale"}</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="swap" /><span className="text-sm">{lang === "ar" ? "للتبديل" : "For Swap"}</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="free" /><span className="text-sm">{lang === "ar" ? "مجاناً" : "Free"}</span></label>
          </RadioGroup>
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

      {/* Warranty */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "🛡️ الضمان" : "🛡️ Warranty"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup value={formData.hasWarranty ? "yes" : "no"} onValueChange={v => updateField("hasWarranty", v === "yes")} className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="no" /><span className="text-sm">{lang === "ar" ? "بدون ضمان" : "No Warranty"}</span></label>
            <label className="flex items-center gap-3 cursor-pointer"><RadioGroupItem value="yes" /><span className="text-sm">{lang === "ar" ? "تحت الضمان" : "Under Warranty"}</span></label>
          </RadioGroup>
          {formData.hasWarranty && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{lang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</Label>
                <Input type="date" value={formData.warrantyExpiry || ""} onChange={e => updateField("warrantyExpiry", e.target.value)} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">{lang === "ar" ? "نوع الضمان" : "Warranty Type"}</Label>
                <Select value={formData.warrantyType || ""} onValueChange={v => updateField("warrantyType", v)}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="Extended">Extended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone / Tablet / Laptop specific */}
      {(isPhone || isTablet || isLaptop) && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "📋 المواصفات" : "📋 Specifications"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Brand */}
            <div>
              <Label>{lang === "ar" ? "الماركة" : "Brand"}</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {getBrands().map(b => (
                  <button key={b} type="button" onClick={() => updateField("brand", b)} className={chipCls(formData.brand === b)}>{b}</button>
                ))}
              </div>
              {formData.brand === "Other" && (
                <Input value={formData.itemModel || ""} onChange={e => updateField("brand", e.target.value)}
                  placeholder={lang === "ar" ? "أدخل الماركة" : "Enter brand"} className="mt-2 rounded-xl" />
              )}
            </div>

            {/* Model */}
            <div>
              <Label>{lang === "ar" ? "الموديل" : "Model"}</Label>
              <Input value={formData.itemModel || ""} onChange={e => updateField("itemModel", e.target.value)}
                placeholder={isPhone ? "e.g. iPhone 15 Pro Max" : isTablet ? "e.g. iPad Pro 12.9\" M2" : "e.g. MacBook Pro 16\" M3"} className="mt-1.5 rounded-xl" />
            </div>

            {/* Storage & RAM */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "التخزين" : "Storage"}</Label>
                <Select value={formData.storageCapacity || ""} onValueChange={v => updateField("storageCapacity", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{(isLaptop ? laptopStorageOptions : storageOptions).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>RAM</Label>
                <Select value={formData.ram || ""} onValueChange={v => updateField("ram", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{(isLaptop ? laptopRamOptions : ramOptions).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Color */}
            <div>
              <Label>{lang === "ar" ? "اللون" : "Color"}</Label>
              <Input value={formData.itemColor || ""} onChange={e => updateField("itemColor", e.target.value)}
                placeholder="e.g. Titanium Black" className="mt-1.5 rounded-xl" />
            </div>

            {/* Phone-specific */}
            {isPhone && (
              <>
                <div>
                  <Label>{lang === "ar" ? "الشبكة" : "Network"}</Label>
                  <div className="flex gap-3 mt-1.5">
                    {["5G", "4G LTE", "3G"].map(n => (
                      <label key={n} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={(formData.networkType || []).includes(n)} onCheckedChange={() => toggleArrayField("networkType", n)} />
                        {n}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{lang === "ar" ? "نوع الشريحة" : "SIM Type"}</Label>
                  <RadioGroup value={formData.simType || ""} onValueChange={v => updateField("simType", v)} className="mt-1.5 flex flex-wrap gap-3">
                    {["Single SIM", "Dual SIM", "eSIM", "Dual SIM + eSIM"].map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value={s} /><span className="text-sm">{s}</span></label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label>{lang === "ar" ? "صحة البطارية" : "Battery Health"}</Label>
                  <Select value={formData.batteryHealth || ""} onValueChange={v => updateField("batteryHealth", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{batteryHealthOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "مفتوح؟" : "Unlocked?"}</Label>
                  <RadioGroup value={formData.unlocked === true ? "yes" : formData.unlocked === false ? "no" : ""} onValueChange={v => updateField("unlocked", v === "yes")} className="mt-1.5 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yes" /><span className="text-sm">{lang === "ar" ? "مفتوح" : "Unlocked"}</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="no" /><span className="text-sm">{lang === "ar" ? "مقفل" : "Locked"}</span></label>
                  </RadioGroup>
                </div>
                <div>
                  <Label>{lang === "ar" ? "الملحقات" : "Accessories Included"}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {phoneAccessories.map(a => (
                      <label key={a} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={(formData.accessoriesIncluded || []).includes(a)} onCheckedChange={() => toggleArrayField("accessoriesIncluded", a)} />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tablet-specific */}
            {isTablet && (
              <>
                <div>
                  <Label>{lang === "ar" ? "حجم الشاشة" : "Screen Size"}</Label>
                  <Select value={formData.screenSize || ""} onValueChange={v => updateField("screenSize", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{screenSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "الاتصال" : "Connectivity"}</Label>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {["WiFi Only", "WiFi + Cellular", "5G"].map(c => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={(formData.networkType || []).includes(c)} onCheckedChange={() => toggleArrayField("networkType", c)} />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{lang === "ar" ? "الملحقات" : "Accessories Included"}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {tabletAccessories.map(a => (
                      <label key={a} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={(formData.accessoriesIncluded || []).includes(a)} onCheckedChange={() => toggleArrayField("accessoriesIncluded", a)} />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Laptop-specific */}
            {isLaptop && (
              <>
                <div>
                  <Label>{lang === "ar" ? "نوع الجهاز" : "Device Type"}</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {deviceTypes.map(d => (
                      <button key={d} type="button" onClick={() => updateField("itemType", d)} className={chipCls(formData.itemType === d)}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{lang === "ar" ? "سنة الصنع" : "Year"}</Label>
                  <Select value={formData.year || ""} onValueChange={v => updateField("year", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl w-32"><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>{Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i).map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "المعالج" : "Processor"}</Label>
                  <Input value={formData.processor || ""} onChange={e => updateField("processor", e.target.value)}
                    placeholder="e.g. Intel i7 13th Gen, Apple M3 Pro" className="mt-1.5 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{lang === "ar" ? "نوع التخزين" : "Storage Type"}</Label>
                    <Select value={formData.storageType || ""} onValueChange={v => updateField("storageType", v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SSD">SSD</SelectItem>
                        <SelectItem value="HDD">HDD</SelectItem>
                        <SelectItem value="SSD + HDD">SSD + HDD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>GPU</Label>
                    <Input value={formData.gpu || ""} onChange={e => updateField("gpu", e.target.value)}
                      placeholder="e.g. NVIDIA RTX 4070" className="mt-1.5 rounded-xl" />
                  </div>
                </div>
                <div>
                  <Label>{lang === "ar" ? "حجم الشاشة" : "Screen Size"}</Label>
                  <Select value={formData.screenSize || ""} onValueChange={v => updateField("screenSize", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{laptopScreenSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "نظام التشغيل" : "Operating System"}</Label>
                  <Select value={formData.operatingSystem || ""} onValueChange={v => updateField("operatingSystem", v)}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{osOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === "ar" ? "تفاصيل الحالة" : "Condition Details"}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {laptopConditionDetails.map(d => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox checked={(formData.accessoriesIncluded || []).includes(d)} onCheckedChange={() => toggleArrayField("accessoriesIncluded", d)} />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Accessories specific */}
      {isAccessory && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "🎧 تفاصيل الإكسسوار" : "🎧 Accessory Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{lang === "ar" ? "نوع الإكسسوار" : "Accessory Type"}</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {accessoryTypes.map(a => (
                  <button key={a} type="button" onClick={() => updateField("itemType", a)} className={chipCls(formData.itemType === a)}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "متوافق مع" : "Compatible With"}</Label>
              <Input value={formData.itemModel || ""} onChange={e => updateField("itemModel", e.target.value)}
                placeholder="e.g. iPhone 15, Samsung S24, Universal" className="mt-1.5 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "الماركة" : "Brand"}</Label>
                <Input value={formData.brand || ""} onChange={e => updateField("brand", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label>{lang === "ar" ? "اللون" : "Color"}</Label>
                <Input value={formData.itemColor || ""} onChange={e => updateField("itemColor", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobilesFields;
