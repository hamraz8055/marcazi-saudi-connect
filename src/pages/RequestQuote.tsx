import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Calendar, DollarSign, Package, ClipboardList, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import AuthDialog from "@/components/AuthDialog";
import { toast } from "@/components/ui/sonner";

const STEPS = ["quote.step1", "quote.step2", "quote.step3"];
const URGENCY = [
  { key: "quote.urgent", value: "urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { key: "quote.standard", value: "standard", color: "bg-gold-light text-gold border-gold/20" },
  { key: "quote.flexible", value: "flexible", color: "bg-primary-light text-primary border-primary/20" },
];
const REQ_DOCS = [
  "Commercial Registration (CR)", "VAT Certificate (ZATCA)", "ISO Certification",
  "Company Profile", "Product Catalogue", "Sample / Test Report",
  "Previous Project References", "ARAMCO/SABIC Vendor Code",
];

const RequestQuote = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    specifications: "",
    quantity: "",
    unit: "pieces",
    budgetType: "range" as "range" | "tbd" | "fixed",
    budgetMin: "",
    budgetMax: "",
    fixedBudget: "",
    deadline: "",
    urgency: "standard",
    city: "",
    deliveryRequired: false,
    requiredDocs: [] as string[],
    visibility: "public" as "public" | "invite",
    verifiedOnly: false,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleDoc = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: prev.requiredDocs.includes(doc) ? prev.requiredDocs.filter(d => d !== doc) : [...prev.requiredDocs, doc],
    }));
  };

  const selectedCat = categories.find(c => c.id === formData.category);

  const canProceed = () => {
    switch (step) {
      case 0: return !!formData.category && !!formData.title && formData.description.length >= 20;
      case 1: return !!formData.quantity && !!formData.deadline && (formData.budgetType === "tbd" || !!formData.budgetMin || !!formData.budgetMax || !!formData.fixedBudget);
      case 2: return true;
      default: return false;
    }
  };

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 2)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const handlePublish = async (isDraft = false) => {
    if (!user) { setShowAuth(true); return; }
    setPublishing(true);
    try {
      const budgetMin = formData.budgetType === "range" ? Number(formData.budgetMin) || null : formData.budgetType === "fixed" ? Number(formData.fixedBudget) || null : null;
      const budgetMax = formData.budgetType === "range" ? Number(formData.budgetMax) || null : formData.budgetType === "fixed" ? Number(formData.fixedBudget) || null : null;

      const { error } = await supabase.from("quotations").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        specifications: formData.specifications || null,
        category: formData.category,
        subcategory: formData.subcategory || null,
        quantity: Number(formData.quantity) || null,
        unit: formData.unit,
        budget_min: budgetMin,
        budget_max: budgetMax,
        budget_tbd: formData.budgetType === "tbd",
        deadline: formData.deadline || null,
        urgency: formData.urgency,
        delivery_city: formData.city || null,
        delivery_required: formData.deliveryRequired,
        required_documents: formData.requiredDocs.length > 0 ? formData.requiredDocs : null,
        status: isDraft ? "draft" : "open",
      });

      if (error) throw error;
      toast.success(isDraft ? "Saved as draft" : (lang === "ar" ? "تم نشر طلب التسعير!" : "RFQ posted!"));
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
            <h1 className="text-2xl font-bold text-foreground">{t("quote.createTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("quote.createSubtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-colors ${i <= step ? "bidding-gradient" : "bg-muted"}`} />
              <span className={`text-[10px] font-medium ${i <= step ? "text-bidding" : "text-muted-foreground"}`}>{t(s)}</span>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

              {/* Step 0 */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("quote.whatNeed")}</h2>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.step1")}</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <button key={cat.id} onClick={() => updateField("category", cat.id)}
                            className={`flex items-center gap-2 rounded-xl border-2 p-3 transition-all text-sm ${formData.category === cat.id ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" : "border-border bg-card hover:border-violet-500/30"}`}>
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="font-medium text-foreground">{t(cat.key)}</span>
                            {formData.category === cat.id && <Check className="ms-auto h-4 w-4 text-violet-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("quote.requestTitle")}</label>
                    <input type="text" value={formData.title} onChange={e => updateField("title", e.target.value)} placeholder={t("quote.titlePlaceholder")}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("post.description")}</label>
                    <textarea value={formData.description} onChange={e => updateField("description", e.target.value)} placeholder={t("quote.descPlaceholder")} rows={3}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("quote.specifications")}</label>
                    <textarea value={formData.specifications} onChange={e => updateField("specifications", e.target.value)} placeholder={t("quote.specPlaceholder")} rows={3}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground resize-none" />
                  </div>
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("quote.budgetDetails")}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("quote.quantity")}</label>
                      <input type="number" value={formData.quantity} onChange={e => updateField("quantity", e.target.value)} placeholder="e.g. 500"
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("quote.unit")}</label>
                      <select value={formData.unit} onChange={e => updateField("unit", e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                        {["pieces", "tons", "kg", "meters", "sqm", "units", "sets", "lots", "bags", "rolls", "liters"].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget type */}
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("quote.budgetRange")}</label>
                    <div className="mt-1.5 flex gap-2">
                      {[{ v: "range", l: "Set Range" }, { v: "tbd", l: "To Be Discussed" }, { v: "fixed", l: "Fixed Budget" }].map(b => (
                        <button key={b.v} onClick={() => updateField("budgetType", b.v as any)}
                          className={`flex-1 rounded-xl border-2 py-2 text-xs font-medium transition-all ${formData.budgetType === b.v ? "border-primary bg-primary/5" : "border-border"}`}>
                          {b.l}
                        </button>
                      ))}
                    </div>
                    {formData.budgetType === "range" && (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input type="number" value={formData.budgetMin} onChange={e => updateField("budgetMin", e.target.value)} placeholder="Min"
                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">SAR</span>
                        </div>
                        <div className="relative">
                          <input type="number" value={formData.budgetMax} onChange={e => updateField("budgetMax", e.target.value)} placeholder="Max"
                            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">SAR</span>
                        </div>
                      </div>
                    )}
                    {formData.budgetType === "fixed" && (
                      <div className="mt-2 relative">
                        <input type="number" value={formData.fixedBudget} onChange={e => updateField("fixedBudget", e.target.value)} placeholder="Amount"
                          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">SAR</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">{t("quote.deadline")}</label>
                    <input type="date" value={formData.deadline} onChange={e => updateField("deadline", e.target.value)}
                      min={new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">{t("quote.urgency")}</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {URGENCY.map(u => (
                        <button key={u.value} onClick={() => updateField("urgency", u.value)}
                          className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${formData.urgency === u.value ? u.color : "border-border bg-card text-muted-foreground"}`}>
                          {t(u.key)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">{t("quote.deliveryCity")}</label>
                    <select value={formData.city} onChange={e => updateField("city", e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
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

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={formData.deliveryRequired} onCheckedChange={v => updateField("deliveryRequired", !!v)} />
                    <span className="text-sm text-foreground">{t("quote.deliveryRequired")}</span>
                  </label>

                  {/* Required docs */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Required Documents from Suppliers</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {REQ_DOCS.map(doc => (
                        <button key={doc} onClick={() => toggleDoc(doc)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${formData.requiredDocs.includes(doc) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                          {doc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Review */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">{t("quote.reviewTitle")}</h2>
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedCat && (
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${selectedCat.color}`}>
                          <selectedCat.icon className="h-3.5 w-3.5" />{t(selectedCat.key)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary-light text-primary px-2.5 py-1 text-xs font-semibold">
                        <FileText className="h-3 w-3" />{t("bidding.quotations")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{formData.title || "—"}</h3>
                    {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("quote.quantity")}</p>
                        <p className="text-lg font-bold text-foreground flex items-center gap-1"><Package className="h-4 w-4 text-muted-foreground" />{formData.quantity || "—"} {formData.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("quote.budgetRange")}</p>
                        <p className="text-lg font-bold text-bidding flex items-center gap-1"><DollarSign className="h-4 w-4" />
                          {formData.budgetType === "tbd" ? "TBD" : formData.budgetType === "fixed" ? `${Number(formData.fixedBudget).toLocaleString()} SAR` : `${formData.budgetMin ? Number(formData.budgetMin).toLocaleString() : "0"} - ${formData.budgetMax ? Number(formData.budgetMax).toLocaleString() : "∞"} SAR`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("quote.deadline")}</p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1"><Calendar className="h-4 w-4 text-muted-foreground" />{formData.deadline || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("quote.deliveryCity")}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formData.city ? saudiCities.find(c => c.id === formData.city)?.name[lang] : "—"}
                        </p>
                      </div>
                    </div>
                    {formData.requiredDocs.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Required Documents</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.requiredDocs.map(d => (
                            <span key={d} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={goBack} className="rounded-xl">
              <ArrowLeft className="h-4 w-4 me-1" />{t("post.back")}
            </Button>
          ) : <div />}

          {step < 2 ? (
            <Button onClick={goNext} disabled={!canProceed()} className="rounded-xl">
              {t("post.next")}<ArrowRight className="h-4 w-4 ms-1" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handlePublish(true)} disabled={publishing} className="rounded-xl">
                {lang === "ar" ? "حفظ كمسودة" : "Save Draft"}
              </Button>
              <Button onClick={() => handlePublish(false)} disabled={publishing} className="rounded-xl bidding-gradient border-0 text-white">
                <ClipboardList className="h-4 w-4 me-1" />{publishing ? "..." : (lang === "ar" ? "نشر الطلب" : "Post Request")}
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

export default RequestQuote;
