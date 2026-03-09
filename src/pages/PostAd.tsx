import { useState, useRef, useEffect } from "react";
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
import DocumentsInput from "@/components/post/DocumentsInput";
import CompanyLogoUpload from "@/components/post/CompanyLogoUpload";
import VehicleFields from "@/components/post/VehicleFields";
import ContactDetailsCard from "@/components/post/ContactDetailsCard";
import PropertyDetailsStep from "@/components/post/PropertyDetailsStep";
import ClassifiedsFields from "@/components/post/ClassifiedsFields";
import CommunityFields from "@/components/post/CommunityFields";
import BusinessIndustrialFields from "@/components/post/BusinessIndustrialFields";
import HomeAppliancesFields from "@/components/post/HomeAppliancesFields";
import FurnitureFields from "@/components/post/FurnitureFields";
import MobilesFields from "@/components/post/MobilesFields";
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
    requiredDocuments: [] as string[],
    companyLogoFile: null as File | null,
    companyLogoPreview: null as string | null,
    salaryType: "" as string,
    rentalRateTbd: false,
    rentalDurationType: "" as string,
    freelanceBudgetTbd: false,
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
    // Property fields
    pricePeriod: "yearly",
    paymentTerms: "",
    priceNegotiable: false,
    paymentPlan: false as boolean | null,
    downPaymentPct: "",
    installmentPeriod: "",
    handoverDate: "",
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    areaSqm: "",
    floorNumber: "",
    furnished: "",
    fitoutStatus: "",
    features: [] as string[],
    landType: "",
    capacity: "",
    district: "",
    street: "",
    posterType: "",
    agencyName: "",
    regaLicense: "",
    developerName: "",
    projectName: "",
    tour360Url: "",
    parkingSpaces: "",
    // New category fields
    condition: "",
    listingTypeItem: "sale",
    swapFor: "",
    quantity: "1",
    hasWarranty: false,
    warrantyExpiry: "",
    warrantyType: "",
    reasonSelling: "",
    brand: "",
    itemModel: "",
    itemColor: "",
    itemSize: "",
    itemMaterial: "",
    itemType: "",
    processor: "",
    ram: "",
    storageCapacity: "",
    storageType: "",
    gpu: "",
    screenSize: "",
    operatingSystem: "",
    batteryHealth: "",
    networkType: [] as string[],
    simType: "",
    unlocked: null as boolean | null,
    accessoriesIncluded: [] as string[],
    serviceDirection: "offering",
    pricingType: "fixed",
    serviceAvailability: [] as string[],
    serviceLocationArr: [] as string[],
    experienceLevel: "",
    serviceLanguages: [] as string[],
    portfolioUrl: "",
    businessType: "",
    annualRevenue: "",
    monthlyRent: "",
    leaseRemaining: "",
    employeeCount: "",
    yearsInOperation: "",
    businessIncludesArr: [] as string[],
    unitOfMeasurement: "",
    minOrderQuantity: "",
    deliveryAvailable: "",
    stockStatus: "",
    dimensionsW: "",
    dimensionsH: "",
    dimensionsD: "",
    assemblyRequired: "",
    itemSet: false,
    setPieces: "",
    energyRating: "",
    smartDevice: false,
    hasCertificate: "",
  });

  // Auto-fill contact info from profile/auth
  useEffect(() => {
    if (!user) return;
    if (user.email && !formData.contactEmail) {
      setFormData(prev => ({ ...prev, contactEmail: user.email || "" }));
    }
    supabase.from("profiles").select("phone, display_name").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data?.phone) {
          const phone = data.phone;
          if (phone.startsWith("+")) {
            const codes = ["+966", "+971", "+973", "+974", "+965", "+968", "+962", "+20", "+92", "+91", "+63"];
            const matchedCode = codes.find(c => phone.startsWith(c));
            if (matchedCode) {
              setFormData(prev => ({
                ...prev,
                phoneCountryCode: prev.phoneNumber ? prev.phoneCountryCode : matchedCode,
                phoneNumber: prev.phoneNumber || phone.slice(matchedCode.length),
              }));
            }
          }
        }
      });
  }, [user]);

  const isJobs = formData.category === "jobs";
  const isVehicle = formData.category === "heavy-equipment" || formData.category === "motors";
  const isProperty = formData.category === "property";
  const isClassifieds = formData.category === "classifieds";
  const isCommunity = formData.category === "community";
  const isBusinessIndustrial = formData.category === "business-industrial";
  const isHomeAppliances = formData.category === "home-appliances";
  const isFurniture = formData.category === "furniture-home-garden";
  const isMobiles = formData.category === "mobiles-tablets-laptops";
  const hasSpecificFields = isClassifieds || isCommunity || isBusinessIndustrial || isHomeAppliances || isFurniture || isMobiles;

  const getSteps = () => {
    if (isJobs) return ["post.step1", "post.jobStep2", "post.step2", "post.step4"];
    if (isProperty) return ["post.step1", "post.step2", "post.step3", "post.step4"];
    if (hasSpecificFields) return ["post.step1", "post.step2", "post.step3", "post.step4"];
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
        if (isProperty) return !!formData.title && !!formData.city;
        return !!formData.title && !!formData.city;
      case 2:
        if (isJobs) return !!formData.title && !!formData.city;
        if (isProperty) return formData.images.length > 0 || formData.contactForPrice || !!formData.price;
        if (hasSpecificFields) return true; // category fields already filled in step 1
        return formData.contactForPrice || !!formData.price || (isVehicle && formData.listingType === "rent" && !!formData.rentalRate);
      case 3: return true;
      default: return false;
    }
  };

  const getMaxImages = () => {
    if (isProperty) return 20;
    if (isBusinessIndustrial && formData.subcategory === "businesses-for-sale") return 15;
    if (isCommunity) return 5;
    if (isHomeAppliances) return 8;
    return 10;
  };
  const maxImages = getMaxImages();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, maxImages - formData.images.length);
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
        } else if (formData.employmentType === "freelance" && !formData.freelanceBudgetTbd && formData.price) {
          price = Number(formData.price);
        } else if (formData.employmentType === "freelance" && formData.freelanceBudgetTbd) {
          contactForPrice = true;
        } else if (formData.salaryType === "negotiable" || formData.contactForPrice) {
          contactForPrice = true;
        }
      } else if (isVehicle && formData.listingType === "rent") {
        price = null;
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
        listing_type: isJobs ? "sale" : isProperty ? (formData.subcategory?.startsWith("rent-") ? "rent" : "sale") : formData.listingType,
        city: formData.city,
        price,
        contact_for_price: contactForPrice,
        phone: fullPhone,
        phone_country_code: formData.phoneCountryCode,
        phone_number: formData.phoneNumber || null,
        show_phone: formData.showPhone,
        contact_email: formData.contactEmail || null,
        show_email: formData.showEmail,
        images: imageUrls,
      };

      if (isJobs) {
        insertData.employment_type = formData.employmentType || null;
        insertData.salary_min = formData.salaryMin ? Number(formData.salaryMin) : null;
        insertData.salary_max = formData.salaryMax ? Number(formData.salaryMax) : null;
        insertData.hourly_rate = formData.hourlyRate ? Number(formData.hourlyRate) : null;
        insertData.salary_negotiable = formData.salaryType === "negotiable" || formData.freelanceBudgetTbd || formData.contactForPrice;
        insertData.contract_duration = formData.contractDuration || null;
        insertData.required_skills = formData.requiredSkills.length > 0 ? formData.requiredSkills : null;
        insertData.required_documents = formData.requiredDocuments.length > 0 ? formData.requiredDocuments : null;
        insertData.company_logo_url = companyLogoUrl;
        insertData.rental_rate_tbd = formData.rentalRateTbd || false;
        insertData.rental_duration_type = formData.rentalDurationType || null;
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

      if (isProperty) {
        insertData.price_period = formData.pricePeriod || null;
        insertData.payment_terms = formData.paymentTerms || null;
        insertData.price_negotiable = formData.priceNegotiable || false;
        insertData.payment_plan = formData.paymentPlan || false;
        insertData.down_payment_pct = formData.downPaymentPct ? Number(formData.downPaymentPct) : null;
        insertData.installment_period = formData.installmentPeriod || null;
        insertData.handover_date = formData.handoverDate || null;
        insertData.bedrooms = formData.bedrooms;
        insertData.bathrooms = formData.bathrooms;
        insertData.area_sqm = formData.areaSqm ? Number(formData.areaSqm) : null;
        insertData.floor_number = formData.floorNumber || null;
        insertData.furnished = formData.furnished || null;
        insertData.fitout_status = formData.fitoutStatus || null;
        insertData.features = formData.features.length > 0 ? formData.features : null;
        insertData.land_type = formData.landType || null;
        insertData.capacity = formData.capacity ? Number(formData.capacity) : null;
        insertData.district = formData.district || null;
        insertData.street = formData.street || null;
        insertData.poster_type = formData.posterType || null;
        insertData.agency_name = formData.agencyName || null;
        insertData.rega_license = formData.regaLicense || null;
        insertData.developer_name = formData.developerName || null;
        insertData.project_name = formData.projectName || null;
        insertData.tour_360_url = formData.tour360Url || null;
        if (formData.areaSqm && formData.price) {
          insertData.price_per_sqm = Math.round(Number(formData.price) / Number(formData.areaSqm));
        }
      }

      // New category fields
      if (hasSpecificFields) {
        insertData.condition = formData.condition || null;
        insertData.listing_type_item = formData.listingTypeItem || null;
        insertData.swap_for = formData.swapFor || null;
        insertData.quantity = formData.quantity ? Number(formData.quantity) : 1;
        insertData.has_warranty = formData.hasWarranty || false;
        insertData.warranty_expiry = formData.warrantyExpiry || null;
        insertData.warranty_type = formData.warrantyType || null;
        insertData.reason_selling = formData.reasonSelling || null;
        insertData.brand = formData.brand || null;
        insertData.item_model = formData.itemModel || null;
        insertData.item_color = formData.itemColor || null;
        insertData.item_size = formData.itemSize || null;
        insertData.item_material = formData.itemMaterial || null;
        insertData.item_type = formData.itemType || null;
        insertData.price_negotiable = formData.priceNegotiable || false;
        
        // Handle listing type for items with sale/swap/free
        if (formData.listingTypeItem === "free") {
          insertData.price = 0;
          insertData.contact_for_price = false;
        }
      }

      if (isClassifieds || isMobiles) {
        insertData.processor = formData.processor || null;
        insertData.ram = formData.ram || null;
        insertData.storage_capacity = formData.storageCapacity || null;
        insertData.storage_type = formData.storageType || null;
        insertData.gpu = formData.gpu || null;
        insertData.screen_size = formData.screenSize || null;
        insertData.operating_system = formData.operatingSystem || null;
        insertData.battery_health = formData.batteryHealth || null;
        insertData.network_type = formData.networkType?.length > 0 ? formData.networkType : null;
        insertData.sim_type = formData.simType || null;
        insertData.unlocked = formData.unlocked;
        insertData.accessories_included = formData.accessoriesIncluded?.length > 0 ? formData.accessoriesIncluded : null;
      }

      if (isCommunity) {
        insertData.service_direction = formData.serviceDirection || null;
        insertData.pricing_type = formData.pricingType || null;
        insertData.availability = formData.serviceAvailability?.length > 0 ? formData.serviceAvailability : null;
        insertData.service_location = formData.serviceLocationArr?.length > 0 ? formData.serviceLocationArr : null;
        insertData.experience_level = formData.experienceLevel || null;
        insertData.service_languages = formData.serviceLanguages?.length > 0 ? formData.serviceLanguages : null;
        insertData.portfolio_url = formData.portfolioUrl || null;
        insertData.features = formData.features?.length > 0 ? formData.features : null;
      }

      if (isBusinessIndustrial) {
        insertData.business_type = formData.businessType || null;
        insertData.annual_revenue = formData.annualRevenue ? Number(formData.annualRevenue) : null;
        insertData.monthly_rent = formData.monthlyRent ? Number(formData.monthlyRent) : null;
        insertData.lease_remaining = formData.leaseRemaining || null;
        insertData.employee_count = formData.employeeCount || null;
        insertData.years_in_operation = formData.yearsInOperation || null;
        insertData.business_includes = formData.businessIncludesArr?.length > 0 ? formData.businessIncludesArr : null;
        insertData.unit_of_measurement = formData.unitOfMeasurement || null;
        insertData.min_order_quantity = formData.minOrderQuantity ? Number(formData.minOrderQuantity) : null;
        insertData.delivery_available = formData.deliveryAvailable || null;
        insertData.stock_status = formData.stockStatus || null;
      }

      if (isFurniture) {
        insertData.dimensions_w = formData.dimensionsW ? Number(formData.dimensionsW) : null;
        insertData.dimensions_h = formData.dimensionsH ? Number(formData.dimensionsH) : null;
        insertData.dimensions_d = formData.dimensionsD ? Number(formData.dimensionsD) : null;
        insertData.assembly_required = formData.assemblyRequired || null;
        insertData.item_set = formData.itemSet || false;
        insertData.set_pieces = formData.setPieces || null;
      }

      if (isHomeAppliances) {
        insertData.energy_rating = formData.energyRating || null;
        insertData.year = formData.year ? Number(formData.year) : null;
      }

      if (isMobiles) {
        insertData.year = formData.year ? Number(formData.year) : null;
      }

      const { data, error } = await (supabase.from("listings") as any).insert(insertData).select().single();
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
                      updateField("features", []);
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
                          {!isProperty && (
                            <SelectItem value="all">
                              {lang === "ar" ? `الكل في ${t(selectedCat.key)}` : `All in ${t(selectedCat.key)}`}
                            </SelectItem>
                          )}
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

              {/* Step 1: Employment Type (jobs) / Property Details / Generic Details */}
              {step === 1 && isJobs && (
                <div className="space-y-6">
                  <JobEmploymentStep employmentType={formData.employmentType} onSelect={(type) => updateField("employmentType", type)} />
                  <JobSalaryFields
                    employmentType={formData.employmentType}
                    salaryMin={formData.salaryMin} salaryMax={formData.salaryMax}
                    hourlyRate={formData.hourlyRate} contractDuration={formData.contractDuration}
                    paidInternship={formData.paidInternship} contactForPrice={formData.contactForPrice}
                    price={formData.price}
                    salaryType={formData.salaryType}
                    rentalRateTbd={formData.rentalRateTbd}
                    rentalDurationType={formData.rentalDurationType}
                    freelanceBudgetTbd={formData.freelanceBudgetTbd}
                    onUpdate={(field, value) => {
                      if (field === "salaryMin") updateField("salaryMin", value);
                      else if (field === "salaryMax") updateField("salaryMax", value);
                      else if (field === "hourlyRate") updateField("hourlyRate", value);
                      else if (field === "contractDuration") updateField("contractDuration", value);
                      else if (field === "paidInternship") updateField("paidInternship", value);
                      else if (field === "contactForPrice") updateField("contactForPrice", value);
                      else if (field === "price") updateField("price", value);
                      else if (field === "salaryType") updateField("salaryType", value);
                      else if (field === "rentalRateTbd") updateField("rentalRateTbd", value);
                      else if (field === "rentalDurationType") updateField("rentalDurationType", value);
                      else if (field === "freelanceBudgetTbd") updateField("freelanceBudgetTbd", value);
                    }}
                  />
                </div>
              )}

              {step === 1 && isProperty && (
                <PropertyDetailsStep formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />
              )}

              {step === 1 && !isJobs && !isProperty && (
                <div className="space-y-5">
                  <DetailsStep formData={formData} updateField={updateField} lang={lang} t={t} isVehicle={isVehicle} />
                  {isClassifieds && <ClassifiedsFields formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />}
                  {isCommunity && <CommunityFields formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />}
                  {isBusinessIndustrial && <BusinessIndustrialFields formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />}
                  {isHomeAppliances && <HomeAppliancesFields formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />}
                  {isFurniture && <FurnitureFields formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />}
                  {isMobiles && <MobilesFields formData={formData} updateField={(key: string, value: any) => updateField(key as any, value)} />}
                </div>
              )}

              {/* Step 2: Details (jobs) / Photos (property) / Photos & Price (non-jobs) */}
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
                  <ContactDetailsCard
                    phoneCountryCode={formData.phoneCountryCode}
                    phoneNumber={formData.phoneNumber}
                    showPhone={formData.showPhone}
                    contactEmail={formData.contactEmail}
                    showEmail={formData.showEmail}
                    onUpdate={(field, value) => updateField(field as any, value)}
                    helperText={lang === "ar" ? "تم ملؤه تلقائياً من ملفك الشخصي. غيّره إذا لزم الأمر." : "Pre-filled from your profile. Change if needed."}
                  />
                   <SkillsInput skills={formData.requiredSkills} onChange={(s) => updateField("requiredSkills", s)} subcategory={formData.subcategory} />
                   <DocumentsInput documents={formData.requiredDocuments} onChange={(d) => updateField("requiredDocuments", d)} />
                  <CompanyLogoUpload
                    logoFile={formData.companyLogoFile} logoPreview={formData.companyLogoPreview}
                    onUpload={(file) => { updateField("companyLogoFile", file); updateField("companyLogoPreview", URL.createObjectURL(file)); }}
                    onRemove={() => { if (formData.companyLogoPreview) URL.revokeObjectURL(formData.companyLogoPreview); updateField("companyLogoFile", null); updateField("companyLogoPreview", null); }}
                  />
                </div>
              )}

              {step === 2 && isProperty && (
                <PropertyPhotosStep formData={formData} updateField={updateField} fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload} removeImage={removeImage} lang={lang} t={t} maxImages={maxImages} />
              )}

              {step === 2 && !isJobs && !isProperty && (
                <PhotosPriceStep formData={formData} updateField={updateField} fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload} removeImage={removeImage} lang={lang} t={t} isVehicle={isVehicle} />
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("post.review")}</h2>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {formData.imagePreviewUrls.length > 0 && (
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
                        {isProperty && formData.subcategory && (
                          <span className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700">
                            {t(`subcategory.${formData.subcategory}`) !== `subcategory.${formData.subcategory}` ? t(`subcategory.${formData.subcategory}`) : formData.subcategory}
                          </span>
                        )}
                        {!isJobs && !isProperty && (
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${formData.listingType === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                            {t(`post.for${formData.listingType === "sale" ? "Sale" : "Rent"}`)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{formData.title || "—"}</h3>

                      {/* Property review */}
                      {isProperty && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {formData.price && !formData.contactForPrice && (
                            <p className="text-2xl font-bold text-primary">
                              {Number(formData.price).toLocaleString()} {t("listing.sar")}
                              {formData.pricePeriod && formData.subcategory?.startsWith("rent-") ? `/${formData.pricePeriod}` : ""}
                            </p>
                          )}
                          {formData.contactForPrice && <p className="text-lg font-bold text-primary">{t("listing.contactPrice")}</p>}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.bedrooms != null && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">🛏 {formData.bedrooms === 0 ? "Studio" : formData.bedrooms}</span>}
                            {formData.bathrooms && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">🚿 {formData.bathrooms}</span>}
                            {formData.areaSqm && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">📐 {formData.areaSqm} sqm</span>}
                            {formData.furnished && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">🪑 {formData.furnished}</span>}
                            {formData.posterType && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">👤 {formData.posterType}</span>}
                          </div>
                        </div>
                      )}

                      {isJobs && (
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
                      )}

                      {!isJobs && !isProperty && isVehicle && (
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
                      )}

                      {!isJobs && !isProperty && !isVehicle && (
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

// Details step for non-jobs, non-property
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
    <ContactDetailsCard
      phoneCountryCode={formData.phoneCountryCode}
      phoneNumber={formData.phoneNumber}
      showPhone={formData.showPhone}
      contactEmail={formData.contactEmail}
      showEmail={formData.showEmail}
      onUpdate={(field, value) => updateField(field as any, value)}
      helperText={lang === "ar" ? "تم ملؤه تلقائياً من ملفك الشخصي. غيّره إذا لزم الأمر." : "Pre-filled from your profile. Change if needed."}
    />
  </div>
);

// Photos & Price step for non-jobs, non-property
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

// Property photos step
const PropertyPhotosStep = ({ formData, updateField, fileInputRef, handleImageUpload, removeImage, lang, t, maxImages }: any) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">{lang === "ar" ? "📸 صور العقار" : "📸 Property Photos"}</h2>
      <p className="text-sm text-muted-foreground mt-1">
        {lang === "ar" ? `أضف حتى ${maxImages} صورة. الصورة الأولى ستكون الغلاف.` : `Add up to ${maxImages} photos. First photo is the cover.`}
      </p>
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
        {formData.images.length < maxImages && (
          <button onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            aria-label="Upload image">
            <ImagePlus className="h-6 w-6" />
            <span className="text-[10px] font-medium">{t("post.dragDrop")}</span>
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{formData.images.length} / {maxImages} {lang === "ar" ? "صور مضافة" : "photos added"}</p>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
    </div>

    {/* Photo tips */}
    <details className="text-xs text-muted-foreground">
      <summary className="cursor-pointer font-medium hover:text-foreground">📷 {lang === "ar" ? "نصائح لصور عقارية رائعة" : "Tips for great property photos"}</summary>
      <ul className="mt-2 space-y-1 ps-4 list-disc">
        <li>{lang === "ar" ? "التقط الصور في ضوء النهار" : "Take photos in daylight"}</li>
        <li>{lang === "ar" ? "صوّر جميع الغرف بما فيها الحمامات" : "Show all rooms including bathrooms"}</li>
        <li>{lang === "ar" ? "أضف صورة للمبنى من الخارج" : "Include exterior / building view"}</li>
        <li>{lang === "ar" ? "التقط المنظر من النوافذ والشرفة" : "Capture the view from windows/balcony"}</li>
      </ul>
    </details>
  </div>
);

export default PostAd;
