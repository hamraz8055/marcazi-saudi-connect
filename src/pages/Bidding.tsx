import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, ShoppingBag, Clock, Users, DollarSign, ArrowRight, Search, Shield, TrendingUp, FileText, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import ImageFallback from "@/components/ImageFallback";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { getAuctions, getQuotations, type MockListing } from "@/lib/mockListings";

const parseEndTime = (endsIn: string): number => {
  let totalSeconds = 0;
  const d = endsIn.match(/(\d+)d/); const h = endsIn.match(/(\d+)h/); const m = endsIn.match(/(\d+)m/);
  if (d) totalSeconds += parseInt(d[1]) * 86400;
  if (h) totalSeconds += parseInt(h[1]) * 3600;
  if (m) totalSeconds += parseInt(m[1]) * 60;
  return totalSeconds;
};

const formatCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "Ended";
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s.toString().padStart(2, "0")}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
};

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  startingPrice: number;
  totalBids: number;
  endsIn: string;
  sellerName: string;
  verified: boolean;
  source: "db" | "mock";
}

interface QuotationItem {
  id: string;
  title: string;
  budget: string;
  quotes: number;
  deadline: string;
  buyer: string;
  source: "db" | "mock";
}

const Bidding = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"auctions" | "quotations">("auctions");
  const [showAuth, setShowAuth] = useState(false);
  const [bidSearch, setBidSearch] = useState("");

  const [bidModal, setBidModal] = useState<{ open: boolean; auction: AuctionItem | null }>({ open: false, auction: null });
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);

  const [quoteModal, setQuoteModal] = useState<{ open: boolean; quotation: QuotationItem | null }>({ open: false, quotation: null });
  const [quoteForm, setQuoteForm] = useState({ priceOffer: "", deliveryTime: "", notes: "" });
  const [quoting, setQuoting] = useState(false);

  // Data state
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [quotations, setQuotations] = useState<QuotationItem[]>([]);

  // Fetch from Supabase, fallback to mock
  useEffect(() => {
    const fetchAuctions = async () => {
      const { data } = await supabase.from("auctions").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setAuctions(data.map(a => ({
          id: a.id,
          title: a.title,
          image: a.images?.[0] || "",
          currentBid: Number(a.current_bid) || Number(a.starting_price),
          startingPrice: Number(a.starting_price),
          totalBids: a.total_bids || 0,
          endsIn: "", // will use ends_at
          sellerName: "Seller",
          verified: false,
          source: "db" as const,
        })));
      } else {
        // Fallback to mock
        setAuctions(getAuctions().map(a => ({
          id: a.id,
          title: a.title,
          image: a.images[0] || "",
          currentBid: a.currentBid || 0,
          startingPrice: a.startingPrice || 0,
          totalBids: a.totalBids || 0,
          endsIn: a.endsIn || "1d",
          sellerName: a.seller.name,
          verified: a.seller.verified,
          source: "mock" as const,
        })));
      }
    };

    const fetchQuotations = async () => {
      const { data } = await supabase.from("quotations").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setQuotations(data.map(q => ({
          id: q.id,
          title: q.title,
          budget: q.budget_min && q.budget_max ? `${Number(q.budget_min).toLocaleString()} – ${Number(q.budget_max).toLocaleString()} SAR` : "Contact",
          quotes: q.quotes_count || 0,
          deadline: q.deadline ? `${Math.max(0, Math.ceil((new Date(q.deadline).getTime() - Date.now()) / 86400000))}d left` : "Open",
          buyer: "Buyer",
          source: "db" as const,
        })));
      } else {
        setQuotations(getQuotations().map(q => ({
          id: q.id,
          title: q.title,
          budget: q.budget || "",
          quotes: q.quotes || 0,
          deadline: q.deadline || "",
          buyer: q.buyer || q.seller.name,
          source: "mock" as const,
        })));
      }
    };

    fetchAuctions();
    fetchQuotations();
  }, []);

  // Countdown
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});

  useEffect(() => {
    const initial: Record<string, number> = {};
    auctions.forEach(a => {
      if (a.endsIn) initial[a.id] = parseEndTime(a.endsIn);
    });
    setCountdowns(initial);
  }, [auctions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const next: Record<string, number> = {};
        for (const [id, secs] of Object.entries(prev)) {
          next[id] = Math.max(0, (secs as number) - 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBid = (auction: AuctionItem) => {
    if (!user) { setShowAuth(true); return; }
    setBidModal({ open: true, auction });
    setBidAmount("");
  };

  const submitBid = async () => {
    if (!bidModal.auction || !user) return;
    const amount = Number(bidAmount);
    if (!amount || amount <= bidModal.auction.currentBid) {
      toast.error(lang === "ar" ? "المبلغ يجب أن يكون أعلى من المزايدة الحالية" : "Bid must be higher than current bid");
      return;
    }
    setBidding(true);
    if (bidModal.auction.source === "db") {
      await supabase.from("bids").insert({ auction_id: bidModal.auction.id, user_id: user.id, amount });
      await supabase.from("auctions").update({ current_bid: amount, total_bids: (bidModal.auction.totalBids || 0) + 1 }).eq("id", bidModal.auction.id);
    } else {
      await new Promise(r => setTimeout(r, 500));
    }
    toast.success(lang === "ar" ? "تم تقديم مزايدتك!" : "Your bid has been placed!");
    setBidModal({ open: false, auction: null });
    setBidding(false);
  };

  const handleSubmitQuote = (quotation: QuotationItem) => {
    if (!user) { setShowAuth(true); return; }
    setQuoteModal({ open: true, quotation });
    setQuoteForm({ priceOffer: "", deliveryTime: "", notes: "" });
  };

  const submitQuoteResponse = async () => {
    if (!quoteModal.quotation || !user) return;
    if (!quoteForm.priceOffer) {
      toast.error(lang === "ar" ? "أدخل عرض السعر" : "Enter price offer");
      return;
    }
    setQuoting(true);
    if (quoteModal.quotation.source === "db") {
      await supabase.from("quotes").insert({
        quotation_id: quoteModal.quotation.id,
        user_id: user.id,
        price: Number(quoteForm.priceOffer),
        delivery_time: quoteForm.deliveryTime || null,
        notes: quoteForm.notes || null,
        status: "submitted",
      });
    } else {
      await new Promise(r => setTimeout(r, 500));
    }
    toast.success(lang === "ar" ? "تم تقديم عرضك!" : "Your quote has been submitted!");
    setQuoteModal({ open: false, quotation: null });
    setQuoting(false);
  };

  const filteredAuctions = auctions.filter(a => {
    if (!bidSearch) return true;
    return a.title.toLowerCase().includes(bidSearch.toLowerCase());
  });

  const filteredQuotations = quotations.filter(q => {
    if (!bidSearch) return true;
    return q.title.toLowerCase().includes(bidSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="bidding.title" />
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bidding-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/60 to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container relative z-10 py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center rounded-2xl bg-card/90 backdrop-blur-sm p-1.5 shadow-elevated">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag className="h-4 w-4" />{t("tab.marketplace")}
            </button>
            <button className="flex items-center gap-2 rounded-xl bidding-gradient border-0 px-5 py-2.5 text-sm font-semibold text-white transition-all">
              <Gavel className="h-4 w-4" />{t("tab.bidding")}
            </button>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{t("bidding.title")}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-2 text-primary-foreground/75 max-w-lg">{t("bidding.subtitle")}</motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 flex gap-8">
            {[
              { icon: Gavel, value: "1,200+", label: t("bidding.activeAuctions") },
              { icon: Users, value: "15K+", label: t("bidding.activeBidders") },
              { icon: DollarSign, value: "50M+", label: t("bidding.totalTraded") },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon className="h-5 w-5 text-gold" />
                <div>
                  <div className="text-lg font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="relative inline-flex items-center rounded-full bg-muted p-1">
            <motion.div className="absolute h-[calc(100%-8px)] rounded-full bidding-gradient" layout transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ width: "50%", left: activeTab === "auctions" ? "4px" : "50%" }} />
            <button onClick={() => setActiveTab("auctions")} className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === "auctions" ? "text-primary-foreground" : "text-muted-foreground"}`}>
              <Gavel className="h-4 w-4" />{t("bidding.auctions")}
            </button>
            <button onClick={() => setActiveTab("quotations")} className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === "quotations" ? "text-primary-foreground" : "text-muted-foreground"}`}>
              <FileText className="h-4 w-4" />{t("bidding.quotations")}
            </button>
          </div>
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => navigate(activeTab === "auctions" ? "/bidding/create-auction" : "/bidding/request-quote")}>
            <Plus className="h-4 w-4 me-1" />
            {activeTab === "auctions" ? t("bidding.createAuction") : t("bidding.requestQuote")}
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 mb-6">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input type="text" value={bidSearch} onChange={e => setBidSearch(e.target.value)}
            placeholder={lang === "ar" ? "ابحث في المزادات وطلبات الأسعار..." : "Search auctions & quotations..."} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          {bidSearch && <button onClick={() => setBidSearch("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "auctions" ? (
            <motion.div key="auctions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Search, title: t("bidding.howFind"), desc: t("bidding.howFindDesc") },
                  { icon: Shield, title: t("bidding.howDeposit"), desc: t("bidding.howDepositDesc") },
                  { icon: TrendingUp, title: t("bidding.howWin"), desc: t("bidding.howWinDesc") },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-light text-gold"><step.icon className="h-5 w-5" /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredAuctions.map((auction, i) => {
                  const remaining = countdowns[auction.id] ?? 0;
                  const isUrgent = remaining < 86400;
                  return (
                    <motion.article key={auction.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all"
                      onClick={() => navigate(`/bidding/auction/${auction.id}`)}>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0">
                          <ImageFallback src={auction.image} alt={auction.title} className="h-full w-full object-cover" loading="lazy" />
                          <div className={`absolute top-3 start-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${isUrgent ? "bg-destructive/90 text-destructive-foreground animate-pulse" : "bg-destructive/90 text-destructive-foreground"}`}>
                            <Clock className="h-3 w-3" />{formatCountdown(remaining)}
                          </div>
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">{auction.sellerName}</span>
                            {auction.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gold-light text-gold px-2 py-0.5 text-[10px] font-bold">
                                <Shield className="h-2.5 w-2.5" />{t("bidding.verified")}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{auction.title}</h3>
                          <div className="mt-3 flex items-end gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("bidding.currentBid")}</p>
                              <p className="text-xl font-bold text-primary">{auction.currentBid.toLocaleString()} {t("listing.sar")}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />{auction.totalBids} {t("bidding.bids")}
                            </div>
                          </div>
                          <Button size="sm" className="mt-4 bg-gold text-gold-foreground hover:bg-gold/90"
                            onClick={e => { e.stopPropagation(); handlePlaceBid(auction); }}>
                            {t("bidding.placeBid")}<ArrowRight className="h-3.5 w-3.5 ms-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
                {filteredAuctions.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    {lang === "ar" ? "لا توجد مزادات مطابقة" : "No matching auctions found"}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="quotations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: FileText, title: t("bidding.qPost"), desc: t("bidding.qPostDesc") },
                  { icon: Users, title: t("bidding.qReceive"), desc: t("bidding.qReceiveDesc") },
                  { icon: Shield, title: t("bidding.qChoose"), desc: t("bidding.qChooseDesc") },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary"><step.icon className="h-5 w-5" /></div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {filteredQuotations.map((q, i) => (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-border bg-card p-5 hover:shadow-elevated transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{q.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{q.buyer}</p>
                        <p className="text-sm font-medium text-primary mt-2">{q.budget}</p>
                      </div>
                      <div className="text-end shrink-0 ms-4">
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary-light text-primary px-3 py-1 text-xs font-bold">
                          <Clock className="h-3 w-3" />{q.deadline}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{q.quotes} {t("bidding.quotesReceived")}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/bidding/quotation/${q.id}`)}>
                        {t("bidding.viewDetails")}
                      </Button>
                      <Button size="sm" className="text-xs bidding-gradient border-0 text-white" onClick={() => handleSubmitQuote(q)}>
                        {t("bidding.submitQuote")}<ArrowRight className="h-3 w-3 ms-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                {filteredQuotations.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {lang === "ar" ? "لا توجد طلبات أسعار مطابقة" : "No matching quotations found"}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bid Modal */}
      <Dialog open={bidModal.open} onOpenChange={open => setBidModal({ open, auction: open ? bidModal.auction : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{lang === "ar" ? "تقديم مزايدة" : "Place Your Bid"}</DialogTitle></DialogHeader>
          {bidModal.auction && (
            <div className="space-y-4">
              <p className="font-semibold text-foreground">{bidModal.auction.title}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("bidding.currentBid")}</span>
                <span className="font-bold text-primary">{bidModal.auction.currentBid.toLocaleString()} {t("listing.sar")}</span>
              </div>
              <div>
                <label className="text-sm font-medium">{lang === "ar" ? "مبلغ مزايدتك" : "Your Bid Amount"} ({t("listing.sar")})</label>
                <Input type="number" className="mt-1" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                  placeholder={`${lang === "ar" ? "أدخل مبلغ أعلى من" : "Enter amount higher than"} ${bidModal.auction.currentBid.toLocaleString()}`} />
              </div>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "سيتم خصم 5% كتأمين قابل للاسترداد" : "A 5% refundable deposit will be required"}</p>
              <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={submitBid} disabled={bidding}>
                {bidding ? "..." : lang === "ar" ? "تأكيد المزايدة" : "Confirm Bid"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Modal */}
      <Dialog open={quoteModal.open} onOpenChange={open => setQuoteModal({ open, quotation: open ? quoteModal.quotation : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{lang === "ar" ? "تقديم عرض سعر" : "Submit Quote"}</DialogTitle></DialogHeader>
          {quoteModal.quotation && (
            <div className="space-y-4">
              <p className="font-semibold text-foreground">{quoteModal.quotation.title}</p>
              <div>
                <label className="text-sm font-medium">{lang === "ar" ? "عرض السعر" : "Price Offer"} ({t("listing.sar")})</label>
                <Input type="number" className="mt-1" value={quoteForm.priceOffer} onChange={e => setQuoteForm(p => ({ ...p, priceOffer: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">{lang === "ar" ? "مدة التسليم" : "Delivery Time"}</label>
                <Input className="mt-1" value={quoteForm.deliveryTime} onChange={e => setQuoteForm(p => ({ ...p, deliveryTime: e.target.value }))}
                  placeholder={lang === "ar" ? "مثال: 2 أسابيع" : "e.g. 2 weeks"} />
              </div>
              <div>
                <label className="text-sm font-medium">{lang === "ar" ? "ملاحظات" : "Notes"}</label>
                <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] outline-none" value={quoteForm.notes} onChange={e => setQuoteForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <Button className="w-full bidding-gradient border-0 text-white" onClick={submitQuoteResponse} disabled={quoting}>
                {quoting ? "..." : lang === "ar" ? "تأكيد العرض" : "Submit Quote"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <BottomTabBar />
    </div>
  );
};

export default Bidding;
