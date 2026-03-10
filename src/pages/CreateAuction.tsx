import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ImagePlus, X, Check, Clock, Gavel, Shield, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/lib/categories";
import { regions, getCitiesByRegion } from "@/lib/cities";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import AuthDialog from "@/components/AuthDialog";
import { toast } from "@/components/ui/sonner";

const STEPS = ["auction.step1", "auction.step2", "auction.step3", "auction.step4"];
const DURATIONS = [
  { days: 3, label: "3 Days" },
  { days: 5, label: "5 Days" },
  { days: 7, label: "7 Days" },
  { days: 10, label: "10 Days" },
  { days: 14, label: "14 Days" },
];
const BID_INCREMENTS = [
  { value: "auto", label: "Auto (recommended)" },
  { value: "500", label: "500 SAR" },
  { value: "1000", label: "1,000 SAR" },
  { value: "2500", label: "2,500 SAR" },
  { value: "5000", label: "5,000 SAR" },
  { value: "10000", label: "10,000 SAR" },
  { value: "25000", label: "25,000 SAR" },
];

const CreateAuction = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    city: "",
    startingPrice: "",
    reservePrice: "",
    hasReserve: false,
    bidIncrement: "auto",
    depositRequired: true,
    duration: 7,
    customEndDate: "",
    autoExtend: true,
    images: [] as string[],
    imageFiles: [] as File[],
    condition: "used" as string,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectedCat = categories.find(c => c.id === formData.category);
  const depositAmount = formData.startingPrice ? Math.ceil(Number(formData.startingPrice) * 0.05) : 0;

  const canProceed = () => {
    switch (step) {
      case 0: return !!formData.category;
      case 1: return !!formData.title && formData.title.length <= 100 && !!formData.city && formData.description.length >= 50;
      case 2: return !!formData.startingPrice && formData.images.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 15 - formData.images.length);
    const newImages = newFiles.map(f => URL.createObjectURL(f));
    updateField("images", [...formData.images, ...newImages]);
    setFormData(prev => ({ ...prev, imageFiles: [...prev.imageFiles, ...newFiles] }));
  };

  const removeImage = (index: number) => {
    updateField("images", formData.images.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, imageFiles: prev.imageFiles.filter((_, i) => i !== index) }));
  };

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const handlePublish = async (isDraft = false) => {
    if (!user) { setShowAuth(true); return; }
    setPublishing(true);
    try {
      // Upload images
      const uploadedUrls: string[] = [];
      for (const file of formData.imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `auctions/${user.id}/${Date.now()}-${Math.random().toString(36).substr(2)}.${ext}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, file);
        if (!error) {
          const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + formData.duration);

      const calcIncrement = formData.bidIncrement === "auto" ? null : Number(formData.bidIncrement);

      const { error } = await supabase.from("auctions").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || null,
        city: formData.city,
        images: uploadedUrls.length > 0 ? uploadedUrls : formData.images,
        starting_price: Number(formData.startingPrice),
        reserve_price: formData.hasReserve && formData.reservePrice ? Number(formData.reservePrice) : null,
        current_bid: null,
        bid_increment: calcIncrement,
        ends_at: endDate.toISOString(),
        status: isDraft ? "draft" : "active",
        deposit_required: formData.depositRequired,
        auto_extend_minutes: formData.autoExtend ? 5 : 0,
        condition: formData.condition,
        duration_days: formData.duration,
      });

      if (error) throw error;
      toast.success(isDraft ? "Saved as draft" : (lang === "ar" ? "تم نشر المزاد بنجاح!" : "Auction published!"));
      navigate("/bidding");
    } catch (err: any) {
      toast.error(err.message || "Failed to publish");
    }
    setPublishing(false);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-6 pb-24 md:pb-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate("/bidding")} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("auction.createTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("auction.createSubtitle")}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-muted"}`} />
              <span className={`text-[10px] font-medium ${i <= step ? "text-gold" : "text-muted-foreground"}`}>{t(s)}</span>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

              {/* Step 0: Category */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">{t("auction.selectCategory")}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button key={cat.id} onClick={() => { updateField("category", cat.id); updateField("subcategory", ""); }}
                          className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${formData.category === cat.id ? "border-gold bg-gold-light" : "border-border bg-card hover:border-gold/30"}`}>
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color}`}><Icon className="h-5 w-5" /></div>
                          <span className="font-medium text-foreground text-sm">{t(cat.key)}</span>
                          {formData.category === cat.id && <Check className="ms-auto h-5 w-5 text-gold" />}
                        </button>
                      );
                    })}
                  </div>
                  {selectedCat && selectedCat.subcategories.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("post.selectSubcategory")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCat.subcategories.map(sub => (
                          <button key={sub.id} onClick={() => updateField("subcategory", sub.id)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${formData.subcategory === sub.id ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Item Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("auction.itemTitle")} <span className="text-muted-foreground">({formData.title.length}/100)</span></label>
                    <input type="text" maxLength={100} value={formData.title} onChange={e => updateField("title", e.target.value)}
                      placeholder={t("auction.itemTitlePlaceholder")}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.description")} <span className="text-muted-foreground">(min 50 chars — {formData.description.length})</span></label>
                    <textarea value={formData.description} onChange={e => updateField("description", e.target.value)} placeholder={t("auction.descPlaceholder")} rows={4}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors placeholder:text-muted-foreground resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("auction.condition")}</label>
                    <div className="mt-1.5 flex gap-2">
                      {["new", "used", "refurbished"].map(c => (
                        <button key={c} onClick={() => updateField("condition", c)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${formData.condition === c ? "bidding-gradient border-0 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                          {t(`auction.${c}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.city")}</label>
                    <select value={formData.city} onChange={e => updateField("city", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors">
                      <option value="">{t("browse.selectCity")}</option>
                      {regions.map(region => (
                        <optgroup key={region} label={t(region)}>
                          {getCitiesByRegion(region).map(city => (
                            <option key={city.id} value={city.id}>{city.name[lang]}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Photos & Pricing */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Images */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("post.uploadPhotos")}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Max 15 photos. First photo = cover.</p>
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button onClick={() => removeImage(i)} className="absolute top-1.5 end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                            <X className="h-3.5 w-3.5" />
                          </button>
                          {i === 0 && <span className="absolute bottom-1.5 start-1.5 rounded-md bg-gold px-2 py-0.5 text-[10px] font-semibold text-gold-foreground">Cover</span>}
                        </div>
                      ))}
                      {formData.images.length < 15 && (
                        <button onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-gold hover:text-gold transition-colors">
                          <ImagePlus className="h-6 w-6" /><span className="text-[10px] font-medium">Add Photo</span>
                        </button>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </div>

                  {/* Starting Price */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("auction.startingPrice")}</label>
                    <p className="text-xs text-muted-foreground">This is the opening bid amount</p>
                    <div className="mt-1.5 relative">
                      <input type="number" value={formData.startingPrice} onChange={e => updateField("startingPrice", e.target.value)}
                        placeholder="0" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                      <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">SAR</span>
                    </div>
                  </div>

                  {/* Reserve Price */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <Checkbox checked={formData.hasReserve} onCheckedChange={v => updateField("hasReserve", !!v)} />
                      <span className="text-sm font-medium">{t("auction.reservePrice")}</span>
                    </label>
                    {formData.hasReserve && (
                      <>
                        <p className="text-xs text-muted-foreground mb-1.5">Hidden minimum — item won't sell below this. Shown as "Reserve not met" to bidders.</p>
                        <div className="relative">
                          <input type="number" value={formData.reservePrice} onChange={e => updateField("reservePrice", e.target.value)}
                            placeholder="0" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                          <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">SAR</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bid Increment */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Bid Increment</label>
                    <select value={formData.bidIncrement} onChange={e => updateField("bidIncrement", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors">
                      {BID_INCREMENTS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                  </div>

                  {/* Deposit */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Deposit Required</label>
                    <div className="mt-1.5 flex gap-2">
                      <button onClick={() => updateField("depositRequired", true)}
                        className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${formData.depositRequired ? "border-gold bg-gold-light" : "border-border"}`}>
                        ✅ Yes — 5% deposit
                      </button>
                      <button onClick={() => updateField("depositRequired", false)}
                        className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${!formData.depositRequired ? "border-gold bg-gold-light" : "border-border"}`}>
                        No deposit
                      </button>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("auction.duration")}</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {DURATIONS.map(d => (
                        <button key={d.days} onClick={() => updateField("duration", d.days)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${formData.duration === d.days ? "border-gold bg-gold-light text-foreground" : "border-border bg-card text-muted-foreground hover:border-gold/30"}`}>
                          <Calendar className="h-3.5 w-3.5" />{d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto-extend */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={formData.autoExtend} onCheckedChange={v => updateField("autoExtend", !!v)} />
                    <div>
                      <span className="text-sm font-medium">Auto-extend by 5 minutes</span>
                      <p className="text-xs text-muted-foreground">Prevents last-second sniping</p>
                    </div>
                  </label>

                  {/* Deposit info */}
                  {depositAmount > 0 && formData.depositRequired && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-gold/30 bg-gold-light p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{t("auction.depositInfo")}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{t("auction.depositDesc")}</p>
                          <p className="text-lg font-bold text-gold mt-2">{depositAmount.toLocaleString()} SAR</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("auction.reviewTitle")}</h2>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {formData.images.length > 0 && (
                      <div className="aspect-video overflow-hidden">
                        <img src={formData.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedCat && (
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${selectedCat.color}`}>
                            <selectedCat.icon className="h-3.5 w-3.5" />{t(selectedCat.key)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-lg bg-gold-light text-gold px-2.5 py-1 text-xs font-semibold">
                          <Gavel className="h-3 w-3" />{t("tab.bidding")}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{formData.title || "—"}</h3>
                      {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("auction.startingPrice")}</p>
                          <p className="text-lg font-bold text-bidding">{formData.startingPrice ? `${Number(formData.startingPrice).toLocaleString()} SAR` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("auction.duration")}</p>
                          <p className="text-lg font-bold text-foreground flex items-center gap-1"><Clock className="h-4 w-4 text-muted-foreground" />{formData.duration} Days</p>
                        </div>
                      </div>
                      {/* Checklist */}
                      <div className="rounded-lg bg-muted p-3 space-y-1">
                        <p className="text-xs font-semibold text-foreground mb-2">Checklist</p>
                        {[
                          { ok: formData.images.length > 0, text: "Photos uploaded" },
                          { ok: !!formData.startingPrice, text: "Starting price set" },
                          { ok: true, text: "End date confirmed" },
                          { ok: true, text: "Contact details set" },
                        ].map((item, i) => (
                          <p key={i} className="text-xs flex items-center gap-1.5">
                            <span className={item.ok ? "text-green-600" : "text-muted-foreground"}>{item.ok ? "✅" : "⬜"}</span>
                            {item.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={goBack} className="rounded-xl">
              <ArrowLeft className="h-4 w-4 me-1" />{t("post.back")}
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button onClick={goNext} disabled={!canProceed()} className="rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">
              {t("post.next")}<ArrowRight className="h-4 w-4 ms-1" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handlePublish(true)} disabled={publishing} className="rounded-xl">
                {lang === "ar" ? "حفظ كمسودة" : "Save Draft"}
              </Button>
              <Button onClick={() => handlePublish(false)} disabled={publishing} className="rounded-xl bidding-gradient border-0 text-white hover:opacity-90">
                <Gavel className="h-4 w-4 me-1" />{publishing ? "..." : (lang === "ar" ? "نشر المزاد" : "Publish Auction")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <BottomTabBar />
    </div>
  );
};

export default CreateAuction;
