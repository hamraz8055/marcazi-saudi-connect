import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { getListingById } from "@/lib/mockListings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Clock, Users, Shield, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ priceOffer: "", deliveryTime: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const quotation = getListingById(id || "");

  if (!quotation || !quotation.isQuotation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "طلب التسعير غير موجود" : "Quotation not found"}</p>
          <Button variant="outline" onClick={() => navigate("/bidding")} className="mt-4">{lang === "ar" ? "العودة" : "Back to Bidding"}</Button>
        </div>
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  const handleSubmitQuote = async () => {
    if (!user) { setShowAuth(true); return; }
    if (!quoteForm.priceOffer) { toast.error(lang === "ar" ? "أدخل عرض السعر" : "Enter price offer"); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success(lang === "ar" ? "تم تقديم عرضك بنجاح!" : "Quote submitted successfully!");
    setQuoteForm({ priceOffer: "", deliveryTime: "", notes: "" });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="bidding.title" />
      <Header />
      <div className="container max-w-3xl py-6 pb-24 md:pb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{lang === "ar" ? "طلب تسعير" : "Request for Quote"}</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">{quotation.title}</h1>
          
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{quotation.buyer?.[0] || "?"}</AvatarFallback></Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm">{quotation.buyer}</p>
                {quotation.seller.verified && <Shield className="h-3.5 w-3.5 text-gold" />}
              </div>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "مشتري" : "Buyer"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "الميزانية" : "Budget"}</p>
              <p className="font-bold text-primary text-sm mt-1">{quotation.budget}</p>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "الموعد النهائي" : "Deadline"}</p>
              <p className="font-bold text-foreground text-sm mt-1 flex items-center justify-center gap-1"><Clock className="h-3.5 w-3.5" />{quotation.deadline}</p>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "عروض مقدمة" : "Quotes"}</p>
              <p className="font-bold text-foreground text-sm mt-1 flex items-center justify-center gap-1"><Users className="h-3.5 w-3.5" />{quotation.quotes}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-foreground mb-2">{lang === "ar" ? "التفاصيل" : "Details"}</h2>
            <p className="text-muted-foreground">{quotation.description}</p>
          </div>
        </div>

        {/* Submit Quote Form */}
        <div className="rounded-2xl border border-border bg-card p-6 mt-6">
          <h2 className="font-bold text-foreground mb-4">{lang === "ar" ? "قدم عرضك" : "Submit Your Quote"}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{lang === "ar" ? "عرض السعر" : "Your Price Offer"} (SAR)</label>
              <Input type="number" className="mt-1" value={quoteForm.priceOffer} onChange={e => setQuoteForm(p => ({ ...p, priceOffer: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium">{lang === "ar" ? "مدة التسليم" : "Delivery Timeline"}</label>
              <Input className="mt-1" value={quoteForm.deliveryTime} onChange={e => setQuoteForm(p => ({ ...p, deliveryTime: e.target.value }))} placeholder={lang === "ar" ? "مثال: 2 أسابيع" : "e.g. 2 weeks"} />
            </div>
            <div>
              <label className="text-sm font-medium">{lang === "ar" ? "ملاحظات" : "Notes / Message"}</label>
              <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] outline-none focus-visible:ring-2 focus-visible:ring-ring" value={quoteForm.notes} onChange={e => setQuoteForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <Button className="w-full" onClick={handleSubmitQuote} disabled={submitting}>
              {submitting ? "..." : lang === "ar" ? "تأكيد العرض" : "Submit Quote"}
            </Button>
          </div>
        </div>
      </div>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default QuotationDetail;
