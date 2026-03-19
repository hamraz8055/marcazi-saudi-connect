import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X, ImagePlus, Check, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";

const STEPS = ["post.step1", "post.step2", "post.step3", "post.step4"];

const PostAd = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    phone: "",
    images: [] as string[],
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const selectedCat = categories.find((c) => c.id === formData.category);

  const canProceed = () => {
    switch (step) {
      case 0: return !!formData.category;
      case 1: return !!formData.title && !!formData.city;
      case 2: return formData.contactForPrice || !!formData.price;
      case 3: return true;
      default: return false;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).slice(0, 10 - formData.images.length).map((f) => URL.createObjectURL(f));
    updateField("images", [...formData.images, ...newImages]);
  };

  const removeImage = (index: number) => {
    updateField("images", formData.images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // In a real app, this would post to the backend
    navigate("/");
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 3)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 0, 0)); };

  return (
    <div className="min-h-screen bg-page dark:bg-[#0D0D0D] flex flex-col">
      <Header />

      <div className="flex-1 max-w-[800px] w-full mx-auto px-5 md:px-7 py-8 pb-32 md:pb-12">
        {/* Header & Progress */}
        <div className="mb-8">
          <h1 className="text-[28px] md:text-[32px] font-bold font-fraunces text-[#1A1A1A] dark:text-white leading-none tracking-tight mb-2">{t("post.title")}</h1>
          <p className="text-[15px] text-text-muted font-medium mb-8">{t("post.subtitle")}</p>

          <div className="flex items-center gap-2 mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-start gap-2">
                <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                  i < step ? "bg-brand" : i === step ? "bg-brand w-full" : "bg-[#EBEBEB] dark:bg-white/10"
                }`} />
                <span className={`text-[12px] font-bold ${
                  i <= step ? "text-[#1A1A1A] dark:text-white" : "text-text-muted"
                }`}>
                  {t(s)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Container */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-[#EBEBEB] dark:border-white/6 p-6 md:p-8 shadow-sm">
          <div className="relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Step 0: Category */}
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-[20px] font-bold text-[#1A1A1A] dark:text-white leading-none">{t("post.selectCategory")}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = formData.category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => { updateField("category", cat.id); updateField("subcategory", ""); }}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all w-full ${
                              isActive
                                ? "border-brand bg-brand/5 shadow-sm"
                                : "border-[#EBEBEB] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#222] hover:border-brand/30"
                            }`}
                          >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#1A1A1A] shadow-sm ${isActive ? "text-brand" : "text-text-muted"}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-[14px] ${isActive ? "text-brand" : "text-[#1A1A1A] dark:text-white"}`}>{t(cat.key)}</span>
                            {isActive && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedCat && selectedCat.subcategories.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t border-[#EBEBEB] dark:border-white/6">
                        <h3 className="text-[15px] font-bold text-[#1A1A1A] dark:text-white mb-4">{t("post.selectSubcategory")}</h3>
                        <div className="flex flex-wrap gap-2.5">
                          {selectedCat.subcategories.map((sub) => {
                            const isSubActive = formData.subcategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => updateField("subcategory", sub.id)}
                                className={`rounded-full px-5 py-2 text-[14px] font-bold transition-all ${
                                  isSubActive
                                    ? "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] shadow-md"
                                    : "bg-[#FAFAFA] dark:bg-[#222] text-[#4B5563] dark:text-[#9CA3AF] border border-[#EBEBEB] dark:border-white/10 hover:border-gray-300"
                                }`}
                              >
                                {sub.name[lang]}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 1: Details */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block">{t("post.adTitle")}</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder={t("post.adTitlePlaceholder")}
                        className="mt-2 w-full rounded-2xl border border-[#EBEBEB] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#222] px-4 py-3.5 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors placeholder:text-[#9CA3AF]"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block">{t("post.description")}</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder={t("post.descriptionPlaceholder")}
                        rows={5}
                        className="mt-2 w-full rounded-2xl border border-[#EBEBEB] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#222] px-4 py-3.5 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors placeholder:text-[#9CA3AF] resize-none"
                      />
                    </div>

                    {/* Listing type - Sale/Rent pill */}
                    <div>
                      <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block mb-2">{t("post.listingType")}</label>
                      <div className="relative inline-flex items-center rounded-2xl bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 p-1 w-full max-w-sm">
                        <motion.div
                          className="absolute h-[calc(100%-8px)] rounded-xl bg-white dark:bg-[#333] shadow-sm"
                          layout
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          style={{
                            width: "50%",
                            left: formData.listingType === "sale" ? "4px" : "calc(50% - 4px)",
                          }}
                        />
                        <button
                          onClick={() => updateField("listingType", "sale")}
                          className={`relative z-10 w-1/2 py-2.5 text-[14px] font-bold rounded-xl transition-colors ${
                            formData.listingType === "sale" ? "text-brand" : "text-[#4B5563] dark:text-[#9CA3AF]"
                          }`}
                        >
                          {t("post.forSale")}
                        </button>
                        <button
                          onClick={() => updateField("listingType", "rent")}
                          className={`relative z-10 w-1/2 py-2.5 text-[14px] font-bold rounded-xl transition-colors ${
                            formData.listingType === "rent" ? "text-brand" : "text-[#4B5563] dark:text-[#9CA3AF]"
                          }`}
                        >
                          {t("post.forRent")}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* City */}
                      <div>
                        <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block">{t("post.city")}</label>
                        <select
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="mt-2 w-full rounded-2xl border border-[#EBEBEB] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#222] px-4 py-3.5 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors appearance-none"
                        >
                          <option value="">{t("browse.selectCity")}</option>
                          {regions.map((region) => (
                            <optgroup key={region} label={t(region)}>
                              {getCitiesByRegion(region).map((city) => (
                                <option key={city.id} value={city.id}>{city.name[lang]}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block">{t("post.phone")}</label>
                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#EBEBEB] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#222] px-4 py-3.5 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-colors">
                          <Phone className="h-5 w-5 text-[#9CA3AF] shrink-0" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder={t("post.phonePlaceholder")}
                            className="flex-1 bg-transparent text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none placeholder:text-[#9CA3AF]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Photos & Price */}
                {step === 2 && (
                  <div className="space-y-8">
                    {/* Image Upload */}
                    <div>
                      <h2 className="text-[20px] font-bold text-[#1A1A1A] dark:text-white">{t("post.uploadPhotos")}</h2>
                      <p className="text-[14px] text-text-muted mt-1 mb-5">{t("post.uploadDesc")}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-[#EBEBEB] dark:border-white/10 shadow-sm">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-500 shadow-md hover:scale-105 transition-transform"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {i === 0 && (
                              <span className="absolute bottom-2 left-2 rounded-lg bg-[#1A1A1A] px-2 py-1 text-[11px] font-bold text-white shadow-sm">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                        {formData.images.length < 10 && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-[#D1D5DB] dark:border-white/20 bg-[#FAFAFA] dark:bg-[#222] flex flex-col items-center justify-center gap-2 text-[#6B7280] dark:text-[#9CA3AF] hover:border-brand hover:text-brand transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#333] shadow-sm flex items-center justify-center mb-1">
                              <ImagePlus className="h-5 w-5" />
                            </div>
                            <span className="text-[13px] font-bold">{t("post.dragDrop")}</span>
                          </button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="border-t border-[#EBEBEB] dark:border-white/6 pt-6">
                      <h2 className="text-[20px] font-bold text-[#1A1A1A] dark:text-white mb-4">{t("post.price")}</h2>
                      <div>
                        <div className="mt-2 flex items-center bg-[#FAFAFA] dark:bg-[#222] rounded-2xl border border-[#EBEBEB] dark:border-white/10 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-colors overflow-hidden">
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => updateField("price", e.target.value)}
                            placeholder={t("post.pricePlaceholder")}
                            disabled={formData.contactForPrice}
                            className="flex-1 bg-transparent px-4 py-3.5 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none placeholder:text-[#9CA3AF] disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="px-4 text-[#4B5563] dark:text-[#9CA3AF] font-bold border-l border-[#EBEBEB] dark:border-white/10 bg-white dark:bg-[#1A1A1A] h-full flex items-center">
                            SAR
                          </div>
                        </div>

                        {/* Contact for price toggle */}
                        <label className="mt-5 flex items-center gap-3 cursor-pointer">
                          <div
                            onClick={() => updateField("contactForPrice", !formData.contactForPrice)}
                            className={`relative w-12 h-7 rounded-full transition-colors ${
                              formData.contactForPrice ? "bg-brand" : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <motion.div
                              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                              animate={{ left: formData.contactForPrice ? "calc(100% - 24px)" : "4px" }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                          <span className="text-[14px] font-bold text-[#1A1A1A] dark:text-white">{t("post.contactForPrice")}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-[20px] font-bold text-[#1A1A1A] dark:text-white">{t("post.review")}</h2>

                    <div className="rounded-3xl border border-[#EBEBEB] dark:border-white/6 bg-[#FAFAFA] dark:bg-[#1A1A1A] overflow-hidden shadow-sm">
                      {/* Preview image */}
                      {formData.images.length > 0 ? (
                        <div className="aspect-[21/9] overflow-hidden bg-black/5">
                          <img src={formData.images[0]} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-[21/9] flex items-center justify-center bg-gray-100 dark:bg-[#222]">
                          <ImagePlus className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}

                      <div className="p-6 md:p-8 space-y-4">
                        {/* Category & Pill */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                            formData.listingType === "sale" ? "bg-brand text-white" : "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A]"
                          }`}>
                            {t(`post.for${formData.listingType === "sale" ? "Sale" : "Rent"}`)}
                          </span>
                          {selectedCat && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#4B5563] dark:text-[#D1D5DB] px-2.5 py-1 text-[11px] font-bold">
                              <selectedCat.icon className="h-3.5 w-3.5" />
                              {t(selectedCat.key)}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-[22px] font-fraunces font-bold text-[#1A1A1A] dark:text-white leading-tight">
                          {formData.title || "Untitled Ad"}
                        </h3>

                        {/* Price */}
                        <p className="text-[24px] font-extrabold text-brand">
                          {formData.contactForPrice
                            ? t("listing.contactPrice")
                            : formData.price
                              ? `${Number(formData.price).toLocaleString()} `
                              : "—"}
                          {!formData.contactForPrice && formData.price && <span className="text-[14px] font-bold text-text-muted">{t("listing.sar")}</span>}
                        </p>

                        {/* Description */}
                        {formData.description && (
                          <p className="text-[14px] text-text-muted leading-relaxed whitespace-pre-wrap">{formData.description}</p>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-6 text-[13px] font-bold text-text-muted pt-6 border-t border-[#EBEBEB] dark:border-white/6">
                          {formData.city && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {saudiCities.find((c) => c.id === formData.city)?.name[lang]}
                            </span>
                          )}
                          {formData.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="h-4 w-4" />
                              {formData.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#EBEBEB] dark:border-white/6 border-dashed">
            {step === 0 ? (
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center h-12 px-6 rounded-full border border-[#EBEBEB] dark:border-white/10 text-[14px] font-bold text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#FAFAFA] dark:hover:bg-[#222] transition-colors"
              >
                <ArrowLeft className="h-4 w-4 me-2" />
                Cancel
              </button>
            ) : (
              <button
                onClick={goBack}
                className="flex items-center justify-center h-12 px-6 rounded-full border border-[#EBEBEB] dark:border-white/10 text-[14px] font-bold text-[#4B5563] dark:text-[#D1D5DB] hover:bg-[#FAFAFA] dark:hover:bg-[#222] transition-colors"
              >
                <ArrowLeft className="h-4 w-4 me-2" />
                {t("post.back")}
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center justify-center h-12 px-8 rounded-full bg-brand text-white font-bold text-[15px] shadow-sm hover:bg-[#E6501C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("post.next")}
                <ArrowRight className="h-4 w-4 ms-2" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                className="flex items-center justify-center h-12 px-8 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] font-bold text-[15px] shadow-sm hover:bg-black/80 dark:hover:bg-gray-100 transition-colors"
              >
                {t("post.submit")}
                <Check className="h-4 w-4 ms-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default PostAd;
