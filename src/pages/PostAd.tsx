import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X, ImagePlus, Check, MapPin, Phone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import PhoneInput from "@/components/PhoneInput";
import { toast } from "@/components/ui/sonner";
import JobEmploymentStep from "@/components/post/JobEmploymentStep";
import JobSalaryFields from "@/components/post/JobSalaryFields";
import SkillsInput from "@/components/post/SkillsInput";
import CompanyLogoUpload from "@/components/post/CompanyLogoUpload";
import VehicleFields from "@/components/post/VehicleFields";
import type { EmploymentType } from "@/lib/jobSkillSuggestions";

const PostAd = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    listingType: "sale" as "sale" | "rent",
    city: "",
    price: "",
    contactForPrice: false,
    phoneCountryCode: "+966",
    phoneNumber: "",
    showPhone: false,
    contactEmail: "",
    showEmail: false,
    images: [] as File[],
    imagePreviewUrls: [] as string[],
    // Job-specific fields
    employmentType: "" as string,
    salaryMin: "",
    salaryMax: "",
    hourlyRate: "",
    contractDuration: "",
    paidInternship: true,
    salaryNegotiable: false,
    requiredSkills: [] as string[],
    companyLogoFile: null as File | null,
    companyLogoPreview: null as string | null,
    // Vehicle fields
    year: "",
    kilometers: "",
    fuelType: "",
    sellerType: "",
    make: "",
    model: "",
    bodyType: "",
    rentalRate: "",
    rentalPeriod: "day",
  });

  const isJobs = formData.category === "jobs";
  const isVehicle = formData.category === "heavy-equipment" || formData.category === "motors";

  const getSteps = () => {
    if (isJobs) return ["post.step1", "post.jobStep2", "post.step2", "post.step4"];
    return ["post.step1", "post.step2", "post.step3", "post.step4"];
  };
  const STEPS = getSteps();

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectedCat = categories.find(c => c.id === formData.category);

  const canProceed = () => {
    switch (step) {
      case 0: return !!formData.category && !!formData.subcategory;
      case 1:
        if (isJobs) return !!formData.employmentType;
        return !!formData.title && !!formData.city;
      case 2:
        if (isJobs) return !!formData.title && !!formData.city;
        return formData.contactForPrice || !!formData.price || (isVehicle && formData.listingType === "rent" && !!formData.rentalRate);
      case 3: return true;
      default: return false;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - formData.images.length);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    updateField("images", [...formData.images, ...newFiles]);
    updateField("imagePreviewUrls", [...formData.imagePreviewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(formData.imagePreviewUrls[index]);
    updateField("images", formData.images.filter((_, i) => i !== index));
    updateField("imagePreviewUrls", formData.imagePreviewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) { setShowAuth(true); return; }

    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (const file of formData.images) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, file);
        if (!error) {
          const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
          imageUrls.push(urlData.publicUrl);
        }
      }

      let companyLogoUrl: string | null = null;
      if (isJobs && formData.companyLogoFile) {
        const ext = formData.companyLogoFile.name.split(".").pop();
        const path = `${user.id}/logo-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, formData.companyLogoFile);
        if (!error) {
          const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
          companyLogoUrl = urlData.publicUrl;
        }
      }

      let price: number | null = null;
      let contactForPrice = formData.contactForPrice;
      if (isJobs) {
        if (formData.employmentType === "internship" && formData.paidInternship && formData.price) {
          price = Number(formData.price);
        } else if (formData.employmentType === "freelance" && formData.price) {
          price = Number(formData.price);
        } else if (formData.salaryNegotiable || formData.contactForPrice) {
          contactForPrice = true;
        }
      } else if (isVehicle && formData.listingType === "rent") {
        price = null; // rental uses rental_rate instead
      } else {
        price = contactForPrice ? null : Number(formData.price) || null;
      }

      const fullPhone = formData.phoneNumber ? `${formData.phoneCountryCode}${formData.phoneNumber}` : null;

      const insertData: any = {
        user_id: user.id,
        category: formData.category,
        subcategory: formData.subcategory === "all" ? null : formData.subcategory || null,
        title: formData.title,
        description: formData.description || null,
        listing_type: isJobs ? "sale" : formData.listingType,
        city: formData.city,
        price,
        contact_for_price: contactForPrice,
        phone: fullPhone,
        phone_country_code: formData.phoneCountryCode,
        phone_number: formData.phoneNumber || null,
        show_phone: formData.showPhone,
        images: imageUrls,
      };

      if (isJobs) {
        insertData.employment_type = formData.employmentType || null;
        insertData.salary_min = formData.salaryMin ? Number(formData.salaryMin) : null;
        insertData.salary_max = formData.salaryMax ? Number(formData.salaryMax) : null;
        insertData.hourly_rate = formData.hourlyRate ? Number(formData.hourlyRate) : null;
        insertData.salary_negotiable = formData.salaryNegotiable || formData.contactForPrice;
        insertData.contract_duration = formData.contractDuration || null;
        insertData.required_skills = formData.requiredSkills.length > 0 ? formData.requiredSkills : null;
        insertData.company_logo_url = companyLogoUrl;
      }

      if (isVehicle) {
        insertData.year = formData.year ? Number(formData.year) : null;
        insertData.kilometers = formData.kilometers ? Number(formData.kilometers) : null;
        insertData.fuel_type = formData.fuelType || null;
        insertData.seller_type = formData.sellerType || null;
        insertData.make = formData.make || null;
        insertData.model = formData.model || null;
        if (formData.category === "motors") insertData.body_type = formData.bodyType || null;
        if (formData.listingType === "rent") {
          insertData.rental_rate = formData.rentalRate ? Number(formData.rentalRate) : null;
          insertData.rental_period = formData.rentalPeriod || null;
        }
      }

      const { data, error } = await supabase.from("listings").insert(insertData).select().single();
      if (error) throw error;
      toast.success(lang === "ar" ? "تم نشر إعلانك بنجاح!" : "Your ad has been posted successfully!");
      navigate(`/listing/${data.id}`);
    } catch (err: any) {
      toast.error(err.message || (lang === "ar" ? "حدث خطأ" : "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);
  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  if (!user && step > 0) {
    setStep(0);
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="post.title" />
      <Header />
      <div className="container max-w-2xl py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("post.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("post.subtitle")}</p>
        </div>

        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
              <span className={`text-[10px] font-medium ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{t(s)}</span>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              {/* Step 0: Category */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">{t("post.selectCategory")}</h2>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("post.selectCategory")}</label>
                    <Select value={formData.category} onValueChange={(val) => {
                      updateField("category", val);
                      updateField("subcategory", "");
                      updateField("employmentType", "");
                      updateField("requiredSkills", []);
                      updateField("fuelType", "");
                      updateField("bodyType", "");
                      updateField("make", "");
                      updateField("model", "");
                    }}>
                      <SelectTrigger className="rounded-xl border-border bg-card py-3 px-4">
                        <SelectValue placeholder={t("post.selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => {
                          const Icon = cat.icon;
                          return (
                            <SelectItem key={cat.id} value={cat.id}>
                              <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{t(cat.key)}</span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCat && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t("post.selectSubcategory")}</label>
                      <Select value={formData.subcategory} onValueChange={(val) => updateField("subcategory", val)}>
                        <SelectTrigger className="rounded-xl border-border bg-card py-3 px-4">
                          <SelectValue placeholder={t("post.selectSubcategory")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {lang === "ar" ? `الكل في ${t(selectedCat.key)}` : `All in ${t(selectedCat.key)}`}
                          </SelectItem>
                          {selectedCat.subcategories.map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {t(`subcategory.${sub.id}`) !== `subcategory.${sub.id}` ? t(`subcategory.${sub.id}`) : sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Employment Type (jobs) or Details (non-jobs) */}
              {step === 1 && isJobs && (
                <div className="space-y-6">
                  <JobEmploymentStep employmentType={formData.employmentType} onSelect={(type) => updateField("employmentType", type)} />
                  <JobSalaryFields
                    employmentType={formData.employmentType}
                    salaryMin={formData.salaryMin} salaryMax={formData.salaryMax}
                    hourlyRate={formData.hourlyRate} contractDuration={formData.contractDuration}
                    paidInternship={formData.paidInternship} contactForPrice={formData.contactForPrice}
                    price={formData.price}
                    onUpdate={(field, value) => {
                      if (field === "salaryMin") updateField("salaryMin", value);
                      else if (field === "salaryMax") updateField("salaryMax", value);
                      else if (field === "hourlyRate") updateField("hourlyRate", value);
                      else if (field === "contractDuration") updateField("contractDuration", value);
                      else if (field === "paidInternship") updateField("paidInternship", value);
                      else if (field === "contactForPrice") updateField("contactForPrice", value);
                      else if (field === "price") updateField("price", value);
                    }}
                  />
                </div>
              )}

              {step === 1 && !isJobs && (
                <DetailsStep formData={formData} updateField={updateField} lang={lang} t={t} isVehicle={isVehicle} />
              )}

              {/* Step 2: Details (jobs) or Photos & Price (non-jobs) */}
              {step === 2 && isJobs && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground">{lang === "ar" ? "عنوان الوظيفة" : "Job Title"}</label>
                    <input type="text" value={formData.title} onChange={e => updateField("title", e.target.value)}
                      placeholder={lang === "ar" ? "مثال: مهندس ميكانيكي أول" : "e.g. Senior Mechanical Engineer"}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.description")}</label>
                    <textarea value={formData.description} onChange={e => updateField("description", e.target.value)}
                      placeholder={lang === "ar" ? "صف المسؤوليات والمتطلبات..." : "Describe responsibilities and requirements..."}
                      rows={4}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.city")}</label>
                    <select value={formData.city} onChange={e => updateField("city", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                      <option value="">{t("browse.selectCity")}</option>
                      {regions.map(region => (
                        <optgroup key={region} label={t(region)}>
                          {getCitiesByRegion(region).map(city => (<option key={city.id} value={city.id}>{city.name[lang]}</option>))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.phone")}</label>
                    <div className="mt-1.5">
                      <PhoneInput
                        countryCode={formData.phoneCountryCode}
                        phoneNumber={formData.phoneNumber}
                        onCountryCodeChange={(c) => updateField("phoneCountryCode", c)}
                        onPhoneNumberChange={(n) => updateField("phoneNumber", n)}
                      />
                    </div>
                  </div>
                  <SkillsInput skills={formData.requiredSkills} onChange={(s) => updateField("requiredSkills", s)} subcategory={formData.subcategory} />
                  <CompanyLogoUpload
                    logoFile={formData.companyLogoFile} logoPreview={formData.companyLogoPreview}
                    onUpload={(file) => { updateField("companyLogoFile", file); updateField("companyLogoPreview", URL.createObjectURL(file)); }}
                    onRemove={() => { if (formData.companyLogoPreview) URL.revokeObjectURL(formData.companyLogoPreview); updateField("companyLogoFile", null); updateField("companyLogoPreview", null); }}
                  />
                </div>
              )}

              {step === 2 && !isJobs && (
                <PhotosPriceStep formData={formData} updateField={updateField} fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload} removeImage={removeImage} lang={lang} t={t} isVehicle={isVehicle} />
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("post.review")}</h2>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {!isJobs && formData.imagePreviewUrls.length > 0 && (
                      <div className="aspect-video overflow-hidden">
                        <img src={formData.imagePreviewUrls[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedCat && (
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${selectedCat.color}`}>
                            <selectedCat.icon className="h-3.5 w-3.5" />{t(selectedCat.key)}
                          </span>
                        )}
                        {isJobs && formData.employmentType && (
                          <span className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700">{formData.employmentType}</span>
                        )}
                        {!isJobs && (
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${formData.listingType === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                            {t(`post.for${formData.listingType === "sale" ? "Sale" : "Rent"}`)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{formData.title || "—"}</h3>
                      {isJobs ? (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {formData.salaryMin && formData.salaryMax && (
                            <p>💰 {Number(formData.salaryMin).toLocaleString()} – {Number(formData.salaryMax).toLocaleString()} {t("listing.sar")}</p>
                          )}
                          {formData.hourlyRate && <p>💰 {Number(formData.hourlyRate).toLocaleString()} {t("listing.sar")}/{lang === "ar" ? "ساعة" : "hr"}</p>}
                          {formData.contactForPrice && <p>💰 {lang === "ar" ? "قابل للتفاوض" : "Negotiable"}</p>}
                          {formData.requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {formData.requiredSkills.map(s => (<span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs">{s}</span>))}
                            </div>
                          )}
                        </div>
                      ) : isVehicle ? (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {formData.listingType === "rent" && formData.rentalRate && (
                            <p>💰 {Number(formData.rentalRate).toLocaleString()} {t("listing.sar")}/{formData.rentalPeriod}</p>
                          )}
                          {formData.listingType === "sale" && formData.price && (
                            <p className="text-2xl font-bold text-primary">{Number(formData.price).toLocaleString()} {t("listing.sar")}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.year && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">📅 {formData.year}</span>}
                            {formData.kilometers && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">🛣️ {Number(formData.kilometers).toLocaleString()} km</span>}
                            {formData.fuelType && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">⛽ {formData.fuelType}</span>}
                            {formData.make && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">🏢 {formData.make} {formData.model}</span>}
                          </div>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-primary">
                          {formData.contactForPrice ? t("listing.contactPrice") : formData.price ? `${Number(formData.price).toLocaleString()} ${t("listing.sar")}` : "—"}
                        </p>
                      )}
                      {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                        {formData.city && (
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{saudiCities.find(c => c.id === formData.city)?.name[lang]}</span>
                        )}
                        {formData.phoneNumber && (
                          <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{formData.phoneCountryCode}{formData.phoneNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
          <Button variant="outline" onClick={step === 0 ? () => navigate("/") : goBack} className="rounded-xl">
            <ArrowLeft className="h-4 w-4 me-2" />
            {step === 0 ? t("bottom.home") : t("post.back")}
          </Button>
          {step < 3 ? (
            <Button onClick={() => { if (!user) { setShowAuth(true); return; } goNext(); }} disabled={!canProceed()} className="rounded-xl">
              {t("post.next")}<ArrowRight className="h-4 w-4 ms-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="rounded-xl" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Check className="h-4 w-4 me-2" />}
              {t("post.submit")}
            </Button>
          )}
        </div>
      </div>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <BottomTabBar />
    </div>
  );
};

// Details step for non-jobs
const DetailsStep = ({ formData, updateField, lang, t, isVehicle }: any) => (
  <div className="space-y-5">
    <div>
      <label className="text-sm font-medium text-foreground">{t("post.adTitle")}</label>
      <input type="text" value={formData.title} onChange={(e: any) => updateField("title", e.target.value)} placeholder={t("post.adTitlePlaceholder")}
        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground" />
    </div>
    <div>
      <label className="text-sm font-medium text-foreground">{t("post.description")}</label>
      <textarea value={formData.description} onChange={(e: any) => updateField("description", e.target.value)} placeholder={t("post.descriptionPlaceholder")} rows={4}
        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground resize-none" />
    </div>
    <div>
      <label className="text-sm font-medium text-foreground">{t("post.listingType")}</label>
      <div className="mt-1.5 relative inline-flex items-center rounded-full bg-muted p-1">
        <motion.div className="absolute h-[calc(100%-8px)] rounded-full bg-primary" layout transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ width: "50%", left: formData.listingType === "sale" ? "4px" : "50%" }} />
        <button onClick={() => updateField("listingType", "sale")}
          className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors ${formData.listingType === "sale" ? "text-primary-foreground" : "text-muted-foreground"}`}>
          {t("post.forSale")}
        </button>
        <button onClick={() => updateField("listingType", "rent")}
          className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors ${formData.listingType === "rent" ? "text-primary-foreground" : "text-muted-foreground"}`}>
          {t("post.forRent")}
        </button>
      </div>
    </div>

    {/* Vehicle-specific fields */}
    {isVehicle && (
      <VehicleFields
        category={formData.category}
        listingType={formData.listingType}
        year={formData.year}
        kilometers={formData.kilometers}
        fuelType={formData.fuelType}
        sellerType={formData.sellerType}
        make={formData.make}
        model={formData.model}
        bodyType={formData.bodyType}
        rentalRate={formData.rentalRate}
        rentalPeriod={formData.rentalPeriod}
        onUpdate={(field, value) => updateField(field as any, value)}
      />
    )}

    <div>
      <label className="text-sm font-medium text-foreground">{t("post.city")}</label>
      <select value={formData.city} onChange={(e: any) => updateField("city", e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
        <option value="">{t("browse.selectCity")}</option>
        {regions.map((region: string) => (
          <optgroup key={region} label={t(region)}>
            {getCitiesByRegion(region).map((city: any) => (<option key={city.id} value={city.id}>{city.name[lang]}</option>))}
          </optgroup>
        ))}
      </select>
    </div>
    <div>
      <label className="text-sm font-medium text-foreground">{t("post.phone")}</label>
      <div className="mt-1.5">
        <PhoneInput
          countryCode={formData.phoneCountryCode}
          phoneNumber={formData.phoneNumber}
          onCountryCodeChange={(c: string) => updateField("phoneCountryCode", c)}
          onPhoneNumberChange={(n: string) => updateField("phoneNumber", n)}
        />
      </div>
    </div>

    {/* Phone visibility toggle */}
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <p className="text-sm font-medium text-foreground flex items-center gap-2">
        📞 {lang === "ar" ? "ظهور رقم الهاتف" : "Phone Number Visibility"}
      </p>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="radio" name="showPhone" checked={formData.showPhone === true}
          onChange={() => updateField("showPhone", true)}
          className="mt-1 accent-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">{lang === "ar" ? "إظهار رقمي" : "Show my number publicly"}</p>
          <p className="text-xs text-muted-foreground">{lang === "ar" ? "يمكن للمشترين رؤية رقمك والاتصال/واتساب مباشرة" : "Buyers can see and call/WhatsApp you directly"}</p>
        </div>
      </label>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="radio" name="showPhone" checked={formData.showPhone === false}
          onChange={() => updateField("showPhone", false)}
          className="mt-1 accent-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">{lang === "ar" ? "إخفاء رقمي" : "Hide my number"}</p>
          <p className="text-xs text-muted-foreground">{lang === "ar" ? "يجب على المشترين التواصل عبر محادثة مركزي" : "Buyers must message you through Marcazi chat"}</p>
        </div>
      </label>
    </div>
  </div>
);

// Photos & Price step for non-jobs
const PhotosPriceStep = ({ formData, updateField, fileInputRef, handleImageUpload, removeImage, lang, t, isVehicle }: any) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">{t("post.uploadPhotos")}</h2>
      <p className="text-sm text-muted-foreground mt-1">{t("post.uploadDesc")}</p>
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
        {formData.imagePreviewUrls.map((img: string, i: number) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
            <img src={img} alt="" className="h-full w-full object-cover" />
            <button onClick={() => removeImage(i)} className="absolute top-1.5 end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground" aria-label="Remove image">
              <X className="h-3.5 w-3.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 start-1.5 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">{t("post.cover")}</span>
            )}
          </div>
        ))}
        {formData.images.length < 10 && (
          <button onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            aria-label="Upload image">
            <ImagePlus className="h-6 w-6" />
            <span className="text-[10px] font-medium">{t("post.dragDrop")}</span>
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
    </div>

    {/* Price section — skip for vehicle rentals (handled in VehicleFields) */}
    {!(isVehicle && formData.listingType === "rent") && (
      <div>
        <label className="text-sm font-medium text-foreground">{t("post.price")}</label>
        <div className="mt-1.5">
          <input type="number" value={formData.price} onChange={(e: any) => updateField("price", e.target.value)} placeholder={t("post.pricePlaceholder")} disabled={formData.contactForPrice}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
        <label className="mt-3 flex items-center gap-3 cursor-pointer">
          <div onClick={() => updateField("contactForPrice", !formData.contactForPrice)}
            className={`relative w-11 h-6 rounded-full transition-colors ${formData.contactForPrice ? "bg-primary" : "bg-muted"}`}>
            <motion.div className="absolute top-1 h-4 w-4 rounded-full bg-primary-foreground shadow-sm"
              animate={{ left: formData.contactForPrice ? "calc(100% - 20px)" : "4px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }} />
          </div>
          <span className="text-sm text-foreground">{t("post.contactForPrice")}</span>
        </label>
      </div>
    )}
  </div>
);

export default PostAd;
