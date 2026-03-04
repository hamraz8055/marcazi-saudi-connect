import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X, ImagePlus, Check, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import { Button } from "@/components/ui/button";
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
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 3)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-2xl py-6 pb-24 md:pb-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("post.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("post.subtitle")}</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`} />
              <span className={`text-[10px] font-medium ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}>
                {t(s)}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {/* Step 0: Category */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">{t("post.selectCategory")}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { updateField("category", cat.id); updateField("subcategory", ""); }}
                          className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                            formData.category === cat.id
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card hover:border-primary/30"
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-foreground text-sm">{t(cat.key)}</span>
                          {formData.category === cat.id && (
                            <Check className="ms-auto h-5 w-5 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedCat && selectedCat.subcategories.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("post.selectSubcategory")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => updateField("subcategory", sub.id)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                              formData.subcategory === sub.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {sub.name[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.adTitle")}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder={t("post.adTitlePlaceholder")}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.description")}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder={t("post.descriptionPlaceholder")}
                      rows={4}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground resize-none"
                    />
                  </div>

                  {/* Listing type - Sale/Rent pill */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.listingType")}</label>
                    <div className="mt-1.5 relative inline-flex items-center rounded-full bg-muted p-1">
                      <motion.div
                        className="absolute h-[calc(100%-8px)] rounded-full bg-primary"
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                          width: "50%",
                          left: formData.listingType === "sale" ? "4px" : "50%",
                        }}
                      />
                      <button
                        onClick={() => updateField("listingType", "sale")}
                        className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                          formData.listingType === "sale" ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {t("post.forSale")}
                      </button>
                      <button
                        onClick={() => updateField("listingType", "rent")}
                        className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
                          formData.listingType === "rent" ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {t("post.forRent")}
                      </button>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.city")}</label>
                    <select
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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
                    <label className="text-sm font-medium text-foreground">{t("post.phone")}</label>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder={t("post.phonePlaceholder")}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Photos & Price */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("post.uploadPhotos")}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t("post.uploadDesc")}</p>

                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1.5 end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1.5 start-1.5 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                      {formData.images.length < 10 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <ImagePlus className="h-6 w-6" />
                          <span className="text-[10px] font-medium">{t("post.dragDrop")}</span>
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

                  {/* Price */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.price")}</label>
                    <div className="mt-1.5">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateField("price", e.target.value)}
                        placeholder={t("post.pricePlaceholder")}
                        disabled={formData.contactForPrice}
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Contact for price toggle */}
                    <label className="mt-3 flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => updateField("contactForPrice", !formData.contactForPrice)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          formData.contactForPrice ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 h-4 w-4 rounded-full bg-primary-foreground shadow-sm"
                          animate={{ left: formData.contactForPrice ? "calc(100% - 20px)" : "4px" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                      <span className="text-sm text-foreground">{t("post.contactForPrice")}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("post.review")}</h2>

                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* Preview image */}
                    {formData.images.length > 0 && (
                      <div className="aspect-video overflow-hidden">
                        <img src={formData.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                      {/* Category */}
                      <div className="flex items-center gap-2">
                        {selectedCat && (
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${selectedCat.color}`}>
                            <selectedCat.icon className="h-3.5 w-3.5" />
                            {t(selectedCat.key)}
                          </span>
                        )}
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          formData.listingType === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                        }`}>
                          {t(`post.for${formData.listingType === "sale" ? "Sale" : "Rent"}`)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground">{formData.title || "—"}</h3>

                      {/* Price */}
                      <p className="text-2xl font-bold text-primary">
                        {formData.contactForPrice
                          ? t("listing.contactPrice")
                          : formData.price
                            ? `${Number(formData.price).toLocaleString()} ${t("listing.sar")}`
                            : "—"}
                      </p>

                      {/* Description */}
                      {formData.description && (
                        <p className="text-sm text-muted-foreground">{formData.description}</p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                        {formData.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {saudiCities.find((c) => c.id === formData.city)?.name[lang]}
                          </span>
                        )}
                        {formData.phone && (
                          <span className="flex items-center gap-1">
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
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={step === 0 ? () => navigate("/") : goBack}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 me-2" />
            {step === 0 ? t("bottom.home") : t("post.back")}
          </Button>

          {step < 3 ? (
            <Button
              onClick={goNext}
              disabled={!canProceed()}
              className="rounded-xl"
            >
              {t("post.next")}
              <ArrowRight className="h-4 w-4 ms-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="rounded-xl">
              <Check className="h-4 w-4 me-2" />
              {t("post.submit")}
            </Button>
          )}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default PostAd;
