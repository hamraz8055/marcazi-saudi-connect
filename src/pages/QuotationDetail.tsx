import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getListingById } from "@/lib/mockListings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Users, Shield, FileText, Star, Trophy, X, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface QuoteResponse {
  id: string;
  supplier_id: string;
  price_offer: number;
  delivery_time: string | null;
  delivery_date: string | null;
  notes: string | null;
  status: string | null;
  submitted_at: string;
}

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ priceOffer: "", deliveryTime: "", deliveryDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [dbQuotation, setDbQuotation] = useState<any>(null);
  const [awardModal, setAwardModal] = useState<QuoteResponse | null>(null);

  // Try DB first
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase.from("quotations").select("*").eq("id", id).maybeSingle();
      if (data) {
        setDbQuotation(data);
        // Fetch quotes
        const { data: qr } = await supabase.from("quotes")
          .select("*").eq("quotation_id", id).order("created_at", { ascending: false });
        setQuotes((qr || []) as any);
      }
    };
    fetch();
  }, [id]);

  // Fallback to mock
  const mockQuotation = !dbQuotation ? getListingById(id || "") : null;
  const isQuotation = dbQuotation || mockQuotation?.isQuotation;
  const isOwner = dbQuotation?.user_id === user?.id;

  if (!isQuotation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "طلب التسعير غير موجود" : "Quotation not found"}</p>
          <Button variant="outline" onClick={() => navigate("/bidding")} className="mt-4">{lang === "ar" ? "العودة" : "Back"}</Button>
        </div>
        <Footer /><BottomTabBar />
      </div>
    );
  }

  const title = dbQuotation?.title || mockQuotation?.title || "";
  const description = dbQuotation?.description || mockQuotation?.description || "";
  const budget = dbQuotation
    ? (dbQuotation.budget_tbd ? "TBD" : `${Number(dbQuotation.budget_min || 0).toLocaleString()} – ${Number(dbQuotation.budget_max || 0).toLocaleString()} SAR`)
    : mockQuotation?.budget || "";
  const deadline = dbQuotation?.deadline
    ? `${Math.max(0, Math.ceil((new Date(dbQuotation.deadline).getTime() - Date.now()) / 86400000))}d left`
    : mockQuotation?.deadline || "";
  const totalQuotes = dbQuotation?.quotes_count || quotes.length || mockQuotation?.quotes || 0;
  const refNo = dbQuotation?.reference_no || "";
  const status = dbQuotation?.status || "open";

  const handleSubmitQuote = async () => {
    if (!user) { setShowAuth(true); return; }
    if (!quoteForm.priceOffer) { toast.error(lang === "ar" ? "أدخل عرض السعر" : "Enter price offer"); return; }
    setSubmitting(true);
    try {
      if (dbQuotation) {
        const { error } = await supabase.from("quote_responses").insert({
          quotation_id: dbQuotation.id,
          user_id: user.id,
          price_offer: Number(quoteForm.priceOffer),
          delivery_time: quoteForm.deliveryTime || null,
          notes: quoteForm.notes || null,
        });
        if (error) throw error;
        // Update count
        await supabase.from("quotations").update({ quotes_count: totalQuotes + 1 }).eq("id", dbQuotation.id);
      } else {
        await new Promise(r => setTimeout(r, 500));
      }
      toast.success(lang === "ar" ? "تم تقديم عرضك بنجاح!" : "Quote submitted successfully!");
      setQuoteForm({ priceOffer: "", deliveryTime: "", deliveryDate: "", notes: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
    setSubmitting(false);
  };

  const handleAward = async (quote: QuoteResponse) => {
    try {
      await supabase.from("quotations").update({
        status: "awarded",
        awarded_to: quote.supplier_id,
        awarded_quote_id: quote.id,
      }).eq("id", dbQuotation.id);
      // Note: quote_responses table doesn't have a status column in the current schema
      // The award is tracked on the quotations table via awarded_to and awarded_quote_id
      toast.success(lang === "ar" ? "تم ترسية العقد!" : "Contract awarded!");
      setAwardModal(null);
      navigate("/bidding");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="bidding.title" />
      <Header />
      <div className="container max-w-4xl py-6 pb-24 md:pb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع" : "Back"}
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Request for Quote</span>
            {refNo && <span className="text-xs font-mono text-muted-foreground">· {refNo}</span>}
            <span className={`ms-auto rounded-full px-3 py-0.5 text-xs font-bold ${status === "open" ? "bg-green-100 text-green-700" : status === "awarded" ? "bg-gold-light text-gold" : "bg-muted text-muted-foreground"}`}>
              {status === "open" ? "🟢 Open" : status === "awarded" ? "🏆 Awarded" : status.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "الميزانية" : "Budget"}</p>
              <p className="font-bold text-primary text-sm mt-1">{budget}</p>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "الموعد النهائي" : "Deadline"}</p>
              <p className="font-bold text-foreground text-sm mt-1 flex items-center justify-center gap-1"><Clock className="h-3.5 w-3.5" />{deadline}</p>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "عروض مقدمة" : "Quotes"}</p>
              <p className="font-bold text-foreground text-sm mt-1 flex items-center justify-center gap-1"><Users className="h-3.5 w-3.5" />{totalQuotes}</p>
            </div>
          </div>
        </div>

        {/* Tabs for owner, or submit form for suppliers */}
        {isOwner && quotes.length > 0 ? (
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">📋 {lang === "ar" ? "التفاصيل" : "Details"}</TabsTrigger>
              <TabsTrigger value="quotes" className="flex-1">💬 {lang === "ar" ? "العروض" : "Quotes"} ({quotes.length})</TabsTrigger>
              <TabsTrigger value="compare" className="flex-1">📊 {lang === "ar" ? "مقارنة" : "Compare"}</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground mb-2">{lang === "ar" ? "التفاصيل" : "Details"}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
                {dbQuotation?.specifications && (
                  <div className="mt-4 rounded-lg bg-muted p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Specifications</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{dbQuotation.specifications}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="quotes">
              <div className="space-y-4">
                {quotes.map((q, i) => (
                  <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-bold">S{i + 1}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-semibold text-sm">Supplier #{i + 1}</p>
                          <p className="text-xs text-muted-foreground">{new Date(q.submitted_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${q.status === "awarded" ? "bg-gold-light text-gold" : q.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                        {q.status === "awarded" ? "🏆 Awarded" : q.status === "rejected" ? "❌ Rejected" : "Submitted"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">💰 Price Offer</p>
                        <p className="font-bold text-primary">{q.price_offer.toLocaleString()} SAR</p>
                      </div>
                      {q.delivery_time && (
                        <div>
                          <p className="text-xs text-muted-foreground">🚚 Delivery</p>
                          <p className="font-semibold text-sm">{q.delivery_time}</p>
                        </div>
                      )}
                    </div>
                    {q.notes && <p className="mt-3 text-sm text-muted-foreground italic">"{q.notes}"</p>}
                    {status === "open" && (
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs gap-1"><Star className="h-3.5 w-3.5" />Shortlist</Button>
                        <Button size="sm" className="text-xs gap-1 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => setAwardModal(q)}>
                          <Trophy className="h-3.5 w-3.5" />Award Contract
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compare">
              <div className="rounded-2xl border border-border bg-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start p-3 text-muted-foreground font-medium">Criteria</th>
                      {quotes.map((_, i) => <th key={i} className="text-center p-3 font-semibold">Supplier #{i + 1}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">Price</td>
                      {quotes.map(q => <td key={q.id} className="text-center p-3 font-bold text-primary">{q.price_offer.toLocaleString()}</td>)}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3 text-muted-foreground">Delivery</td>
                      {quotes.map(q => <td key={q.id} className="text-center p-3">{q.delivery_time || "—"}</td>)}
                    </tr>
                    <tr>
                      <td className="p-3 text-muted-foreground">Action</td>
                      {quotes.map(q => (
                        <td key={q.id} className="text-center p-3">
                          {status === "open" && (
                            <Button size="sm" className="text-xs bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => setAwardModal(q)}>Award</Button>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Details */}
            <div className="rounded-2xl border border-border bg-card p-6 mb-6">
              <h2 className="font-semibold text-foreground mb-2">{lang === "ar" ? "التفاصيل" : "Details"}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Submit Quote Form */}
            {!isOwner && status === "open" && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-bold text-foreground mb-4">{lang === "ar" ? "قدم عرضك" : "Submit Your Quote"}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "عرض السعر" : "Your Price Offer"} (SAR)</label>
                    <Input type="number" className="mt-1" value={quoteForm.priceOffer} onChange={e => setQuoteForm(p => ({ ...p, priceOffer: e.target.value }))} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "مدة التسليم" : "Delivery Timeline"}</label>
                    <Input className="mt-1" value={quoteForm.deliveryTime} onChange={e => setQuoteForm(p => ({ ...p, deliveryTime: e.target.value }))} placeholder="e.g. 2 weeks" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "ملاحظات" : "Notes / Message"}</label>
                    <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] outline-none focus-visible:ring-2 focus-visible:ring-ring" value={quoteForm.notes} onChange={e => setQuoteForm(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                  <Button className="w-full" onClick={handleSubmitQuote} disabled={submitting}>
                    {submitting ? "..." : (lang === "ar" ? "تأكيد العرض" : "Submit Quote")}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Award Modal */}
      <Dialog open={!!awardModal} onOpenChange={() => setAwardModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-gold" />Award Contract</DialogTitle></DialogHeader>
          {awardModal && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">You are awarding this contract for:</p>
              <p className="text-xl font-bold text-primary">{awardModal.price_offer.toLocaleString()} SAR</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" />Notify the winning supplier</p>
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" />Close the RFQ to new quotes</p>
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" />Notify other suppliers</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setAwardModal(null)}>Cancel</Button>
                <Button className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => handleAward(awardModal)}>Confirm Award</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default QuotationDetail;
