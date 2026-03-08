import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Info, Lock, RotateCw } from "lucide-react";
import { regions, getCitiesByRegion } from "@/lib/cities";
import ContactDetailsCard from "@/components/post/ContactDetailsCard";
import {
  isResidential, isCommercial, isLand, isRent, isSale, isOffPlan, isRoom,
  needsBedsBaths, needsFloor,
  pricePeriods, commercialPricePeriods, paymentTerms,
  furnishedOptions, residentialFeatures, commercialFeatures, landFeatures,
  landTypes, fitoutOptions, posterTypes, floorOptions,
  getPropertyTitlePlaceholder, validateTourUrl,
} from "@/lib/propertyData";

interface PropertyDetailsStepProps {
  formData: any;
  updateField: (key: string, value: any) => void;
}

const PropertyDetailsStep = ({ formData, updateField }: PropertyDetailsStepProps) => {
  const { t, lang } = useI18n();
  const sub = formData.subcategory || "";
  const [tourStatus, setTourStatus] = useState<"valid" | "warning" | "empty">("empty");

  const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground";
  const chipCls = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium border cursor-pointer transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`;

  const toggleFeature = (f: string) => {
    const current: string[] = formData.features || [];
    updateField("features", current.includes(f) ? current.filter((x: string) => x !== f) : [...current, f]);
  };

  return (
    <div className="space-y-5">
      {/* A - BASIC INFO */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📝 المعلومات الأساسية" : "📝 Basic Info"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "عنوان الإعلان" : "Listing Title"}</Label>
            <Input value={formData.title} onChange={e => updateField("title", e.target.value)}
              placeholder={getPropertyTitlePlaceholder(sub, lang)} maxLength={100} className="mt-1.5 rounded-xl" />
            <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/100</p>
          </div>
          <div>
            <Label>{lang === "ar" ? "وصف العقار" : "Property Description"}</Label>
            <Textarea value={formData.description} onChange={e => updateField("description", e.target.value)}
              placeholder={lang === "ar" ? "صف العقار، مميزاته، المعالم القريبة..." : "Describe the property, its features, nearby landmarks..."}
              maxLength={2000} rows={4} className="mt-1.5 rounded-xl resize-none" />
            <p className="text-xs text-muted-foreground mt-1">{(formData.description || "").length}/2000</p>
          </div>
        </CardContent>
      </Card>

      {/* B - PRICING */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "💰 التسعير" : "💰 Pricing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!formData.contactForPrice && (
            <>
              {/* Rent pricing */}
              {isRent(sub) && !isLand(sub) && (
                <>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label>{lang === "ar" ? "السعر (ر.س)" : isRoom(sub) ? "Price per Person (SAR)" : "Price (SAR)"}</Label>
                      <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)}
                        placeholder={lang === "ar" ? "أدخل السعر" : "Enter price"} className="mt-1.5 rounded-xl" />
                    </div>
                    <div className="w-36">
                      <Label>{lang === "ar" ? "لكل" : "per"}</Label>
                      <Select value={formData.pricePeriod || "yearly"} onValueChange={v => updateField("pricePeriod", v)}>
                        <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(isCommercial(sub) ? commercialPricePeriods : pricePeriods).map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.label[lang]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {formData.pricePeriod === "yearly" && !isRoom(sub) && (
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? "عادة يُدفع على 1 أو 2 أو 4 شيكات" : "Usually paid as 1, 2, or 4 cheques"}</p>
                  )}
                  {!isRoom(sub) && (
                    <div>
                      <Label className="text-xs">{lang === "ar" ? "شروط الدفع" : "Payment Terms"}</Label>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {paymentTerms.map(pt => (
                          <button key={pt.id} type="button" onClick={() => updateField("paymentTerms", pt.id)}
                            className={chipCls(formData.paymentTerms === pt.id)}>{pt.label[lang]}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {isRoom(sub) && (
                    <div>
                      <Label>{lang === "ar" ? "السعة (أشخاص)" : "Capacity (people)"}</Label>
                      <Input type="number" value={formData.capacity || ""} onChange={e => updateField("capacity", e.target.value)}
                        placeholder="e.g. 4" className="mt-1.5 rounded-xl w-24" />
                    </div>
                  )}
                </>
              )}

              {/* Sale pricing */}
              {isSale(sub) && !isOffPlan(sub) && !isLand(sub) && (
                <div>
                  <Label>{lang === "ar" ? "السعر المطلوب (ر.س)" : "Asking Price (SAR)"}</Label>
                  <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)}
                    placeholder={lang === "ar" ? "أدخل السعر" : "Enter asking price"} className="mt-1.5 rounded-xl" />
                  <label className="mt-2 flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={formData.priceNegotiable || false} onCheckedChange={v => updateField("priceNegotiable", v)} />
                    <span className="text-sm">{lang === "ar" ? "قابل للتفاوض" : "Negotiable"}</span>
                  </label>
                </div>
              )}

              {/* Off-plan pricing */}
              {isOffPlan(sub) && (
                <div className="space-y-3">
                  <div>
                    <Label>{lang === "ar" ? "السعر يبدأ من (ر.س)" : "Starting Price From (SAR)"}</Label>
                    <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)} className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-xs">{lang === "ar" ? "خطة دفع متاحة؟" : "Payment Plan Available?"}</Label>
                    <div className="flex gap-3 mt-1.5">
                      <button type="button" onClick={() => updateField("paymentPlan", true)} className={chipCls(formData.paymentPlan === true)}>{lang === "ar" ? "نعم" : "Yes"}</button>
                      <button type="button" onClick={() => updateField("paymentPlan", false)} className={chipCls(formData.paymentPlan === false)}>{lang === "ar" ? "لا" : "No"}</button>
                    </div>
                  </div>
                  {formData.paymentPlan && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">{lang === "ar" ? "الدفعة المقدمة %" : "Down Payment %"}</Label>
                        <Input type="number" value={formData.downPaymentPct || ""} onChange={e => updateField("downPaymentPct", e.target.value)} placeholder="20" className="mt-1 rounded-xl" />
                      </div>
                      <div>
                        <Label className="text-xs">{lang === "ar" ? "فترة الأقساط" : "Installment Period"}</Label>
                        <Input value={formData.installmentPeriod || ""} onChange={e => updateField("installmentPeriod", e.target.value)} placeholder="5 years" className="mt-1 rounded-xl" />
                      </div>
                      <div>
                        <Label className="text-xs">{lang === "ar" ? "تاريخ التسليم" : "Handover Date"}</Label>
                        <Input type="month" value={formData.handoverDate || ""} onChange={e => updateField("handoverDate", e.target.value)} className="mt-1 rounded-xl" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Land pricing */}
              {isLand(sub) && (
                <div className="space-y-3">
                  <div>
                    <Label>{lang === "ar" ? "السعر (ر.س)" : "Price (SAR)"}</Label>
                    <Input type="number" value={formData.price} onChange={e => updateField("price", e.target.value)} className="mt-1.5 rounded-xl" />
                  </div>
                  {formData.areaSqm && formData.price && (
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "سعر المتر المربع:" : "Price per sqm:"} {Math.round(Number(formData.price) / Number(formData.areaSqm)).toLocaleString()} {t("listing.sar")}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Contact for price toggle */}
          <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-border">
            <Checkbox checked={formData.contactForPrice} onCheckedChange={v => updateField("contactForPrice", !!v)} />
            <div>
              <span className="text-sm font-medium">{lang === "ar" ? "اتصل للسعر" : "Contact for Price"}</span>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "إخفاء السعر والسماح للمشترين بالاستفسار مباشرة" : "Hide price and let buyers inquire directly"}</p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* C - PROPERTY DETAILS */}
      {(isResidential(sub) || isCommercial(sub) || isLand(sub)) && (
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{lang === "ar" ? "🏠 تفاصيل العقار" : "🏠 Property Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bedrooms */}
            {needsBedsBaths(sub) && (
              <>
                <div>
                  <Label>{lang === "ar" ? "غرف النوم" : "Bedrooms"}</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {["Studio", "1", "2", "3", "4", "5", "6", "7+"].map(b => (
                      <button key={b} type="button"
                        onClick={() => updateField("bedrooms", b === "Studio" ? 0 : b === "7+" ? 7 : Number(b))}
                        className={chipCls(formData.bedrooms === (b === "Studio" ? 0 : b === "7+" ? 7 : Number(b)))}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{lang === "ar" ? "دورات المياه" : "Bathrooms"}</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {["1", "2", "3", "4", "5", "6+"].map(b => (
                      <button key={b} type="button"
                        onClick={() => updateField("bathrooms", b === "6+" ? 6 : Number(b))}
                        className={chipCls(formData.bathrooms === (b === "6+" ? 6 : Number(b)))}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Furnished */}
            {isResidential(sub) && !isOffPlan(sub) && (
              <div>
                <Label>{lang === "ar" ? "التأثيث" : "Furnishing"}</Label>
                <RadioGroup value={formData.furnished || ""} onValueChange={v => updateField("furnished", v)} className="mt-1.5 space-y-2">
                  {furnishedOptions.map(f => (
                    <label key={f.id} className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value={f.id} className="mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">{f.label[lang]}</span>
                        <p className="text-xs text-muted-foreground">{f.desc[lang]}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Area */}
            <div>
              <Label>{isLand(sub) ? (lang === "ar" ? "مساحة الأرض" : "Land Area") : (lang === "ar" ? "المساحة" : "Area Size")}</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input type="number" value={formData.areaSqm || ""} onChange={e => updateField("areaSqm", e.target.value)}
                  placeholder="e.g. 120" className="rounded-xl w-32" />
                <span className="text-sm text-muted-foreground">sqm</span>
              </div>
            </div>

            {/* Floor */}
            {needsFloor(sub) && (
              <div>
                <Label>{lang === "ar" ? "رقم الطابق" : "Floor Number"}</Label>
                <Select value={formData.floorNumber || ""} onValueChange={v => updateField("floorNumber", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl w-40"><SelectValue placeholder={lang === "ar" ? "اختر الطابق" : "Select floor"} /></SelectTrigger>
                  <SelectContent>
                    {floorOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Fitout (commercial) */}
            {isCommercial(sub) && (
              <>
                <div>
                  <Label>{lang === "ar" ? "حالة التجهيز" : "Fit-out Status"}</Label>
                  <RadioGroup value={formData.fitoutStatus || ""} onValueChange={v => updateField("fitoutStatus", v)} className="mt-1.5 space-y-2">
                    {fitoutOptions.map(f => (
                      <label key={f.id} className="flex items-start gap-3 cursor-pointer">
                        <RadioGroupItem value={f.id} className="mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">{f.label[lang]}</span>
                          {f.desc && <p className="text-xs text-muted-foreground">{f.desc[lang]}</p>}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label>{lang === "ar" ? "مواقف السيارات" : "Parking Spaces"}</Label>
                  <Input type="number" value={formData.parkingSpaces || ""} onChange={e => updateField("parkingSpaces", e.target.value)}
                    placeholder="0" className="mt-1.5 rounded-xl w-24" />
                </div>
              </>
            )}

            {/* Land type */}
            {isLand(sub) && (
              <div>
                <Label>{lang === "ar" ? "تصنيف الأرض" : "Land Zoning"}</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {landTypes.map(lt => (
                    <button key={lt.id} type="button" onClick={() => updateField("landType", lt.id)}
                      className={chipCls(formData.landType === lt.id)}>{lt.label[lang]}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <Label>{lang === "ar" ? "✦ المميزات والمرافق" : "✦ Features & Amenities"}</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(isLand(sub) ? landFeatures : isCommercial(sub) ? commercialFeatures : residentialFeatures).map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={(formData.features || []).includes(f)} onCheckedChange={() => toggleFeature(f)} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* D - LOCATION */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "📍 الموقع" : "📍 Location"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("post.city")}</Label>
            <select value={formData.city} onChange={e => updateField("city", e.target.value)}
              className={`mt-1.5 ${inputCls}`}>
              <option value="">{t("browse.selectCity")}</option>
              {regions.map(region => (
                <optgroup key={region} label={t(region)}>
                  {getCitiesByRegion(region).map(city => (<option key={city.id} value={city.id}>{city.name[lang]}</option>))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{lang === "ar" ? "الحي" : "District"}</Label>
              <Input value={formData.district || ""} onChange={e => updateField("district", e.target.value)}
                placeholder={lang === "ar" ? "مثال: العليا" : "e.g. Al Olaya"} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>{lang === "ar" ? "الشارع (اختياري)" : "Street (Optional)"}</Label>
              <Input value={formData.street || ""} onChange={e => updateField("street", e.target.value)}
                placeholder={lang === "ar" ? "اسم الشارع" : "Street name"} className="mt-1.5 rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E - SELLER/AGENT INFO */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{lang === "ar" ? "👤 نوع المعلن" : "👤 Posted By"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={formData.posterType || ""} onValueChange={v => updateField("posterType", v)} className="space-y-2">
            {posterTypes.map(pt => (
              <label key={pt.id} className="flex items-start gap-3 cursor-pointer">
                <RadioGroupItem value={pt.id} className="mt-0.5" />
                <div>
                  <span className="text-sm font-medium">{pt.label[lang]}</span>
                  <p className="text-xs text-muted-foreground">{pt.desc[lang]}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
          {formData.posterType === "agent" && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label>{lang === "ar" ? "اسم الوكالة" : "Agency Name"}</Label>
                <Input value={formData.agencyName || ""} onChange={e => updateField("agencyName", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label>{lang === "ar" ? "رقم ترخيص REGA" : "REGA License #"}</Label>
                <Input value={formData.regaLicense || ""} onChange={e => updateField("regaLicense", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </div>
          )}
          {formData.posterType === "developer" && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label>{lang === "ar" ? "اسم المطور" : "Developer Name"}</Label>
                <Input value={formData.developerName || ""} onChange={e => updateField("developerName", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label>{lang === "ar" ? "اسم المشروع" : "Project Name"}</Label>
                <Input value={formData.projectName || ""} onChange={e => updateField("projectName", e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* F - 360 TOUR */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <RotateCw className="h-4 w-4" />{lang === "ar" ? "جولة 360° افتراضية" : "360° Virtual Tour"}
            <span className="text-xs text-muted-foreground font-normal">({lang === "ar" ? "اختياري" : "Optional"})</span>
          </CardTitle>
          <CardDescription>{lang === "ar" ? "امنح المشترين جولة تفاعلية في عقارك" : "Give buyers an immersive virtual walkthrough"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={formData.tour360Url || ""} onChange={e => {
            updateField("tour360Url", e.target.value);
            setTourStatus(validateTourUrl(e.target.value));
          }} onBlur={e => setTourStatus(validateTourUrl(e.target.value))}
            placeholder="https://..." className="rounded-xl" />
          {tourStatus === "valid" && <p className="text-xs text-green-600">✅ {lang === "ar" ? "رابط جولة صالح" : "Valid tour link"}</p>}
          {tourStatus === "warning" && <p className="text-xs text-amber-600">⚠️ {lang === "ar" ? "هذا المزود قد لا يكون مدعوماً" : "This provider may not be supported"}</p>}

          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Info className="h-3 w-3" />{lang === "ar" ? "المزودون المقبولون" : "Accepted providers"}<ChevronDown className="h-3 w-3" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] text-muted-foreground">
                {["my.matterport.com", "kuula.co", "app.cloudpano.com", "momento360.com", "orbix360.com", "360.espace.ae", "www.360cities.net", "www.nodalview.com"].map(p => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* CONTACT DETAILS */}
      <ContactDetailsCard
        phoneCountryCode={formData.phoneCountryCode}
        phoneNumber={formData.phoneNumber}
        showPhone={formData.showPhone}
        contactEmail={formData.contactEmail}
        showEmail={formData.showEmail}
        onUpdate={(field, value) => updateField(field, value)}
        helperText={lang === "ar" ? "تم ملؤه تلقائياً من ملفك الشخصي. غيّره إذا لزم الأمر." : "Pre-filled from your profile. Change if needed."}
      />
    </div>
  );
};

export default PropertyDetailsStep;
