import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useAuctionDetail, getBidIncrement } from "@/hooks/useAuctions";
import { getListingById } from "@/lib/mockListings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import ImageFallback from "@/components/ImageFallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Users, Shield, ArrowLeft, Gavel, Heart, Share2, Eye, Trophy, Zap, Bot, CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";

const formatCountdown = (seconds: number) => {
  if (seconds <= 0) return { text: "Ended", parts: [] as { value: string; label: string }[] };
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    text: d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`,
    parts: [
      { value: String(d).padStart(2, "0"), label: "days" },
      { value: String(h).padStart(2, "0"), label: "hours" },
      { value: String(m).padStart(2, "0"), label: "mins" },
      { value: String(s).padStart(2, "0"), label: "secs" },
    ],
  };
};

const maskName = (name: string) => name.charAt(0) + "****" + (name.length > 5 ? name.charAt(name.length - 1) : "");

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [bidModal, setBidModal] = useState<"deposit" | "bid" | "confirm" | "success" | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [autoBidMax, setAutoBidMax] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllBids, setShowAllBids] = useState(false);

  // Try DB auction first
  const { auction: dbAuction, bids: dbBids, loading, hasDeposit, isWatching, placeBid, payDeposit, toggleWatch } = useAuctionDetail(id);

  // Fallback to mock
  const mockAuction = !dbAuction ? getListingById(id || "") : null;
  const isMock = !dbAuction && mockAuction?.isAuction;

  // Unified auction data
  const auctionTitle = dbAuction?.title || mockAuction?.title || "";
  const auctionImages = dbAuction?.images || mockAuction?.images || [];
  const auctionDesc = dbAuction?.description || mockAuction?.description || "";
  const currentBidAmount = Number(dbAuction?.current_bid) || mockAuction?.currentBid || 0;
  const startingPrice = Number(dbAuction?.starting_price) || mockAuction?.startingPrice || 0;
  const totalBids = dbAuction?.total_bids || mockAuction?.totalBids || 0;
  const auctionStatus = dbAuction?.status || "active";
  const depositRequired = dbAuction?.deposit_required ?? true;
  const depositPct = Number(dbAuction?.deposit_pct) || 5;
  const refNo = dbAuction?.reference_no || "";
  const reservePrice = Number(dbAuction?.reserve_price) || 0;
  const reserveMet = reservePrice > 0 ? currentBidAmount >= reservePrice : true;

  // Countdown
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    const calcRemaining = () => {
      if (dbAuction?.ends_at) {
        return Math.max(0, Math.floor((new Date(dbAuction.ends_at).getTime() - Date.now()) / 1000));
      }
      if (mockAuction?.endsIn) {
        let total = 0;
        const d = mockAuction.endsIn.match(/(\d+)d/);
        const h = mockAuction.endsIn.match(/(\d+)h/);
        const m = mockAuction.endsIn.match(/(\d+)m/);
        if (d) total += parseInt(d[1]) * 86400;
        if (h) total += parseInt(h[1]) * 3600;
        if (m) total += parseInt(m[1]) * 60;
        return total;
      }
      return 0;
    };
    setCountdown(calcRemaining());
    const interval = setInterval(() => setCountdown(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [dbAuction, mockAuction]);

  const cd = formatCountdown(countdown);
  const isUrgent = countdown < 3600 && countdown > 0;
  const isEnded = countdown <= 0;
  const increment = getBidIncrement(currentBidAmount);
  const minBid = currentBidAmount + increment;
  const depositAmount = Math.ceil(startingPrice * depositPct / 100);

  const suggestedBids = useMemo(() => {
    const base = minBid;
    return [base, base + increment, base + increment * 3].map(v => v);
  }, [minBid, increment]);

  if (loading && !isMock) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <BottomTabBar />
      </div>
    );
  }

  if (!dbAuction && !isMock) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "المزاد غير موجود" : "Auction not found"}</p>
          <Button variant="outline" onClick={() => navigate("/bidding")} className="mt-4">
            {lang === "ar" ? "العودة" : "Back to Bidding"}
          </Button>
        </div>
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  const handlePlaceBid = () => {
    if (!user) { setShowAuth(true); return; }
    if (depositRequired && !hasDeposit && !isMock) {
      setBidModal("deposit");
    } else {
      setBidAmount(String(minBid));
      setAgreeTerms(false);
      setBidModal("bid");
    }
  };

  const handleDepositPay = async () => {
    setBidding(true);
    if (!isMock) await payDeposit();
    setBidding(false);
    setBidAmount(String(minBid));
    setAgreeTerms(false);
    setBidModal("bid");
    toast.success(lang === "ar" ? "تم دفع التأمين بنجاح" : "Deposit paid successfully");
  };

  const handleConfirmBid = () => {
    const amount = Number(bidAmount);
    if (!amount || amount < minBid) {
      toast.error(`${lang === "ar" ? "الحد الأدنى للمزايدة" : "Minimum bid is"} ${minBid.toLocaleString()} SAR`);
      return;
    }
    setBidModal("confirm");
  };

  const handleSubmitBid = async () => {
    setBidding(true);
    try {
      if (!isMock) {
        await placeBid(Number(bidAmount), autoBidEnabled ? Number(autoBidMax) : undefined);
      } else {
        await new Promise(r => setTimeout(r, 500));
      }
      setBidModal("success");
    } catch (err: any) {
      toast.error(err.message || "Failed to place bid");
    }
    setBidding(false);
  };

  // Build bid history from DB or mock
  const bidHistory = dbBids.length > 0
    ? dbBids.map(b => ({
        name: maskName(b.user_id.substring(0, 6)),
        amount: b.amount,
        time: new Date(b.created_at).toLocaleString(),
        isWinning: b.is_winning,
        isMe: b.user_id === user?.id,
      }))
    : [
        { name: "A****d", amount: currentBidAmount, time: "2 min ago", isWinning: true, isMe: false },
        { name: "S****i", amount: currentBidAmount - Math.floor(currentBidAmount * 0.03), time: "8 min ago", isWinning: false, isMe: false },
        { name: "M****d", amount: currentBidAmount - Math.floor(currentBidAmount * 0.06), time: "15 min ago", isWinning: false, isMe: false },
      ];

  const visibleBids = showAllBids ? bidHistory : bidHistory.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="bidding.title" />
      <Header />
      <div className="container max-w-5xl py-6 pb-24 md:pb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT — Item Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                <ImageFallback src={auctionImages[selectedImage] || auctionImages[0]} alt={auctionTitle} className="h-full w-full object-cover" />
                {/* Status badges */}
                <div className="absolute top-3 start-3 flex flex-col gap-2">
                  <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold ${isUrgent ? "bg-destructive/90 text-destructive-foreground animate-pulse" : isEnded ? "bg-muted text-muted-foreground" : "bg-destructive/90 text-destructive-foreground"}`}>
                    <Clock className="h-4 w-4" />{cd.text}
                  </div>
                  {!isEnded && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-primary/90 text-primary-foreground px-3 py-1 text-xs font-bold">
                      <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      {lang === "ar" ? "مزاد مباشر" : "LIVE"}
                    </div>
                  )}
                  {reservePrice > 0 && (
                    <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${reserveMet ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-white"}`}>
                      {reserveMet ? "✅ Reserve Met" : "⚠️ Reserve Not Met"}
                    </div>
                  )}
                </div>
                <div className="absolute top-3 end-3 text-xs bg-card/80 backdrop-blur-sm rounded-lg px-2 py-1 font-medium">
                  {selectedImage + 1}/{auctionImages.length} {lang === "ar" ? "صور" : "Photos"}
                </div>
              </div>
              {auctionImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {auctionImages.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <ImageFallback src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reference + actions */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              {refNo && <span className="text-xs text-muted-foreground font-mono">{refNo}</span>}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(lang === "ar" ? "تم نسخ الرابط" : "Link copied");
                }}>
                  <Share2 className="h-3.5 w-3.5" />{lang === "ar" ? "مشاركة" : "Share"}
                </Button>
                <Button size="sm" variant="outline" className={`gap-1.5 text-xs ${isWatching ? "text-destructive" : ""}`}
                  onClick={() => { if (!user) { setShowAuth(true); } else { toggleWatch(); } }}>
                  <Heart className={`h-3.5 w-3.5 ${isWatching ? "fill-current" : ""}`} />
                  {isWatching ? (lang === "ar" ? "متابَع" : "Watching") : (lang === "ar" ? "متابعة" : "Watch")}
                </Button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{auctionTitle}</h1>

            {/* Seller */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {(mockAuction?.seller?.name?.[0] || "S")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm">{mockAuction?.seller?.name || "Seller"}</p>
                  {(mockAuction?.seller?.verified) && <Shield className="h-3.5 w-3.5 text-gold" />}
                </div>
                <p className="text-xs text-muted-foreground">{lang === "ar" ? "عضو منذ" : "Member since"} {mockAuction?.seller?.memberSince || "2024"}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-foreground mb-2">{lang === "ar" ? "الوصف" : "Description"}</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{auctionDesc}</p>
            </div>

            {/* Bid History */}
            <div>
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                {lang === "ar" ? "سجل المزايدات" : "Bid History"}
                <span className="text-xs text-muted-foreground font-normal">({totalBids} {lang === "ar" ? "مزايدة" : "bids"})</span>
              </h2>
              <div className="space-y-2">
                {visibleBids.map((bid, i) => (
                  <motion.div key={i} initial={i === 0 ? { opacity: 0, y: -10 } : {}} animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-all ${bid.isWinning ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                    <div className="flex items-center gap-2">
                      {bid.isWinning && <Trophy className="h-4 w-4 text-gold" />}
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{bid.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{bid.name} {bid.isMe && <span className="text-xs text-primary">(You)</span>}</span>
                    </div>
                    <div className="text-end">
                      <p className={`text-sm font-bold ${bid.isWinning ? "text-primary" : "text-foreground"}`}>{bid.amount.toLocaleString()} SAR</p>
                      <p className="text-[10px] text-muted-foreground">{bid.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {bidHistory.length > 5 && !showAllBids && (
                <button onClick={() => setShowAllBids(true)} className="mt-2 text-sm text-primary font-medium hover:underline">
                  {lang === "ar" ? `عرض كل ${totalBids} مزايدة ▼` : `Show all ${totalBids} bids ▼`}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Bidding Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-20 space-y-5">
              {/* Live badge */}
              {!isEnded && (
                <div className="flex items-center gap-2 text-sm font-bold text-destructive">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
                  {lang === "ar" ? "مزاد مباشر" : "LIVE AUCTION"}
                </div>
              )}

              {/* Countdown */}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {isEnded ? (lang === "ar" ? "انتهى" : "Ended") : (lang === "ar" ? "ينتهي في" : "Ends in")}
                </p>
                {!isEnded && (
                  <div className="flex gap-2">
                    {cd.parts.map(p => (
                      <div key={p.label} className="flex-1 text-center">
                        <div className={`text-2xl font-bold rounded-lg py-2 ${isUrgent ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
                          {p.value}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{p.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Bid */}
              <div className="text-center py-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{lang === "ar" ? "المزايدة الحالية" : "Current Bid"}</p>
                <motion.p key={currentBidAmount} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                  className="text-3xl font-bold text-primary mt-1">
                  {currentBidAmount.toLocaleString()} SAR
                </motion.p>
                <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{totalBids} {lang === "ar" ? "مزايدة" : "bids"}</span>
                  {dbAuction?.watchers ? <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{dbAuction.watchers} {lang === "ar" ? "متابع" : "watchers"}</span> : null}
                </div>
              </div>

              {/* Place Bid Button */}
              {!isEnded && (
                <>
                  <Button className="w-full gap-2 bg-gold text-gold-foreground hover:bg-gold/90 h-12 text-base font-bold" onClick={handlePlaceBid}>
                    <Gavel className="h-5 w-5" />{lang === "ar" ? "قدم مزايدتك" : "Place Bid"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {lang === "ar" ? "بداية السعر:" : "Starting price:"} {startingPrice.toLocaleString()} SAR
                    {depositRequired && <><br /><CreditCard className="inline h-3 w-3" /> {lang === "ar" ? "يتطلب تأمين" : "Deposit required:"} {depositAmount.toLocaleString()} SAR</>}
                  </p>
                </>
              )}

              {isEnded && (
                <div className="text-center py-4">
                  <p className="text-lg font-bold text-muted-foreground">{lang === "ar" ? "انتهى المزاد" : "Auction Ended"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DEPOSIT MODAL */}
      <Dialog open={bidModal === "deposit"} onOpenChange={() => setBidModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />{lang === "ar" ? "دفع التأمين للمزايدة" : "Pay Deposit to Bid"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{lang === "ar" ? "تأمين قابل للاسترداد مطلوب لتقديم مزايدة." : "A refundable deposit is required to place bids."}</p>
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "مبلغ التأمين" : "Deposit Amount"}</p>
              <p className="text-2xl font-bold text-primary">{depositAmount.toLocaleString()} SAR</p>
              <p className="text-xs text-muted-foreground">{depositPct}% × {startingPrice.toLocaleString()} SAR</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">✅ {lang === "ar" ? "يُسترد بالكامل إن لم تفز" : "Fully refunded if you don't win"}</p>
              <p className="flex items-center gap-2">✅ {lang === "ar" ? "يُخصم من الشراء إن فزت" : "Applied to purchase if you win"}</p>
              <p className="flex items-center gap-2">✅ {lang === "ar" ? "يُصادر فقط عند عدم إتمام الشراء" : "Forfeited only if you win but don't pay"}</p>
            </div>
            <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={handleDepositPay} disabled={bidding}>
              {bidding ? "..." : `${lang === "ar" ? "دفع التأمين" : "Pay Deposit"} — ${depositAmount.toLocaleString()} SAR`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BID MODAL */}
      <Dialog open={bidModal === "bid"} onOpenChange={() => setBidModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{lang === "ar" ? "قدم مزايدتك" : "Place Your Bid"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{lang === "ar" ? "المزايدة الحالية" : "Current Bid"}</span>
              <span className="font-bold text-primary">{currentBidAmount.toLocaleString()} SAR</span>
            </div>
            <div>
              <label className="text-sm font-medium">{lang === "ar" ? "مبلغ مزايدتك" : "Your Bid"} (SAR)</label>
              <Input type="number" className="mt-1 text-lg font-bold" value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={`Min ${minBid.toLocaleString()}`} />
            </div>
            {/* Suggested bids */}
            <div className="flex gap-2">
              {suggestedBids.map(v => (
                <button key={v} onClick={() => setBidAmount(String(v))}
                  className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${Number(bidAmount) === v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {(v / 1000).toFixed(0)}K
                </button>
              ))}
            </div>
            {/* Auto-bid */}
            <div className="rounded-xl border border-border p-3 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={autoBidEnabled} onCheckedChange={v => setAutoBidEnabled(!!v)} />
                <span className="text-sm font-medium flex items-center gap-1.5"><Bot className="h-4 w-4" />{lang === "ar" ? "تفعيل المزايدة التلقائية" : "Set Auto-Bid (Max Amount)"}</span>
              </label>
              {autoBidEnabled && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{lang === "ar" ? "سنزايد نيابةً عنك حتى هذا الحد" : "We'll bid for you up to your max"}</p>
                  <Input type="number" value={autoBidMax} onChange={e => setAutoBidMax(e.target.value)} placeholder="Max amount" className="text-sm" />
                </div>
              )}
            </div>
            <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-bold" onClick={handleConfirmBid}>
              {lang === "ar" ? "متابعة" : "Continue"} — {Number(bidAmount).toLocaleString()} SAR
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRM MODAL */}
      <Dialog open={bidModal === "confirm"} onOpenChange={() => setBidModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{lang === "ar" ? "تأكيد المزايدة" : "Confirm Your Bid"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="font-semibold text-foreground">{auctionTitle}</p>
            {refNo && <p className="text-xs text-muted-foreground font-mono">{refNo}</p>}
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "مزايدتك" : "Your Bid"}</p>
              <p className="text-2xl font-bold text-primary">{Number(bidAmount).toLocaleString()} SAR</p>
              <p className="text-xs text-muted-foreground">↑ {(Number(bidAmount) - currentBidAmount).toLocaleString()} {lang === "ar" ? "فوق الحالية" : "above current"}</p>
            </div>
            {autoBidEnabled && autoBidMax && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-lg p-2">
                <Bot className="h-4 w-4" /> Auto-bid: max {Number(autoBidMax).toLocaleString()} SAR
              </div>
            )}
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
              <p>{lang === "ar" ? "بتقديم هذه المزايدة، أنت ملتزم بالشراء إذا فزت." : "By placing this bid you are entering a binding commitment to purchase if you win."}</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={agreeTerms} onCheckedChange={v => setAgreeTerms(!!v)} />
              <span className="text-sm">{lang === "ar" ? "أوافق على شروط وأحكام المزايدة" : "I agree to the Bidding Terms & Conditions"}</span>
            </label>
            <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={handleSubmitBid} disabled={bidding || !agreeTerms}>
              {bidding ? "..." : (lang === "ar" ? "تأكيد المزايدة" : "Confirm Bid")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SUCCESS MODAL */}
      <Dialog open={bidModal === "success"} onOpenChange={() => setBidModal(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{lang === "ar" ? "تم تقديم مزايدتك بنجاح!" : "Bid Placed Successfully!"}</h2>
            <p className="text-muted-foreground text-sm">
              {lang === "ar" ? `مزايدتك بمبلغ ${Number(bidAmount).toLocaleString()} ريال هي الأعلى حالياً.` : `Your bid of ${Number(bidAmount).toLocaleString()} SAR is now the highest bid.`}
            </p>
            <p className="text-primary font-bold flex items-center justify-center gap-2"><Trophy className="h-5 w-5 text-gold" />{lang === "ar" ? "أنت في المقدمة حالياً!" : "You are currently winning!"}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => { setBidModal(null); toggleWatch(); }}>
                <Heart className="h-4 w-4 me-1" />{lang === "ar" ? "تابع المزاد" : "Watch Auction"}
              </Button>
              <Button onClick={() => { setBidModal(null); navigate("/bidding/my-bids"); }}>
                {lang === "ar" ? "مزايداتي" : "View My Bids"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default AuctionDetail;
