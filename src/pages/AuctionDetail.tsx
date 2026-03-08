import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { getListingById, getAuctions } from "@/lib/mockListings";
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
import { Clock, Users, Shield, ArrowLeft, Gavel } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const parseEndTime = (endsIn: string): number => {
  let totalSeconds = 0;
  const d = endsIn.match(/(\d+)d/); const h = endsIn.match(/(\d+)h/); const m = endsIn.match(/(\d+)m/);
  if (d) totalSeconds += parseInt(d[1]) * 86400;
  if (h) totalSeconds += parseInt(h[1]) * 3600;
  if (m) totalSeconds += parseInt(m[1]) * 60;
  return totalSeconds;
};

const formatCountdown = (s: number) => {
  if (s <= 0) return "Ended";
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec.toString().padStart(2, "0")}s`;
  return `${m}m ${sec.toString().padStart(2, "0")}s`;
};

const sampleBids = [
  { name: "Mohammed A.", amount: 0, time: "2 hours ago" },
  { name: "Khalid S.", amount: 0, time: "5 hours ago" },
  { name: "Faisal R.", amount: 0, time: "1 day ago" },
];

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [bidModal, setBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);

  const auction = getListingById(id || "");
  const [countdown, setCountdown] = useState(() => auction?.endsIn ? parseEndTime(auction.endsIn) : 0);
  const [currentBid, setCurrentBid] = useState(auction?.currentBid || 0);
  const [totalBids, setTotalBids] = useState(auction?.totalBids || 0);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!auction || !auction.isAuction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "المزاد غير موجود" : "Auction not found"}</p>
          <Button variant="outline" onClick={() => navigate("/bidding")} className="mt-4">{lang === "ar" ? "العودة للمزادات" : "Back to Bidding"}</Button>
        </div>
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  const handlePlaceBid = () => {
    if (!user) { setShowAuth(true); return; }
    setBidModal(true);
    setBidAmount("");
  };

  const submitBid = async () => {
    const amount = Number(bidAmount);
    if (!amount || amount <= currentBid) {
      toast.error(lang === "ar" ? "المبلغ يجب أن يكون أعلى من المزايدة الحالية" : "Bid must be higher than current bid");
      return;
    }
    setBidding(true);
    await new Promise(r => setTimeout(r, 500));
    setCurrentBid(amount);
    setTotalBids(prev => prev + 1);
    toast.success(lang === "ar" ? "تم تقديم مزايدتك!" : "Your bid has been placed!");
    setBidModal(false);
    setBidding(false);
  };

  const bids = sampleBids.map((b, i) => ({
    ...b,
    amount: currentBid - (i * Math.floor(currentBid * 0.03)),
  }));

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="bidding.title" />
      <Header />
      <div className="container max-w-4xl py-6 pb-24 md:pb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              <ImageFallback src={auction.images[0]} alt={auction.title} className="h-full w-full object-cover" />
              <div className="absolute top-3 start-3 flex items-center gap-1.5 rounded-lg bg-destructive/90 text-destructive-foreground px-3 py-1.5 text-sm font-bold">
                <Clock className="h-4 w-4" />{formatCountdown(countdown)}
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{auction.title}</h1>
              <p className="mt-4 text-muted-foreground">{auction.description}</p>

              <div className="mt-6">
                <h2 className="font-semibold text-foreground mb-3">{lang === "ar" ? "سجل المزايدات" : "Bid History"}</h2>
                <div className="space-y-2">
                  {bids.map((bid, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{bid.name[0]}</AvatarFallback></Avatar>
                        <span className="text-sm font-medium">{bid.name}</span>
                      </div>
                      <div className="text-end">
                        <p className="text-sm font-bold text-primary">{bid.amount.toLocaleString()} SAR</p>
                        <p className="text-[10px] text-muted-foreground">{bid.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-20">
              <div className="text-center mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{lang === "ar" ? "المزايدة الحالية" : "Current Bid"}</p>
                <p className="text-3xl font-bold text-primary mt-1">{currentBid.toLocaleString()} SAR</p>
                <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{totalBids} {lang === "ar" ? "مزايدة" : "bids"}</span>
                </div>
              </div>

              <Button className="w-full gap-2 bg-gold text-gold-foreground hover:bg-gold/90" onClick={handlePlaceBid}>
                <Gavel className="h-4 w-4" />{lang === "ar" ? "قدم مزايدتك" : "Place Bid"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-2">{lang === "ar" ? "بداية السعر:" : "Starting price:"} {auction.startingPrice?.toLocaleString()} SAR</p>

              {/* Seller */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{auction.seller.name[0]}</AvatarFallback></Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm">{auction.seller.name}</p>
                    {auction.seller.verified && <Shield className="h-3.5 w-3.5 text-gold" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "عضو منذ" : "Member since"} {auction.seller.memberSince}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={bidModal} onOpenChange={setBidModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{lang === "ar" ? "تقديم مزايدة" : "Place Your Bid"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{lang === "ar" ? "المزايدة الحالية" : "Current Bid"}</span>
              <span className="font-bold text-primary">{currentBid.toLocaleString()} SAR</span>
            </div>
            <div>
              <label className="text-sm font-medium">{lang === "ar" ? "مبلغ مزايدتك" : "Your Bid Amount"} (SAR)</label>
              <Input type="number" className="mt-1" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                placeholder={`${lang === "ar" ? "أدخل مبلغ أعلى من" : "Enter amount higher than"} ${currentBid.toLocaleString()}`} />
            </div>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "سيتم خصم 5% كتأمين قابل للاسترداد" : "A 5% refundable deposit will be required"}</p>
            <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={submitBid} disabled={bidding}>
              {bidding ? "..." : lang === "ar" ? "تأكيد المزايدة" : "Confirm Bid"}
            </Button>
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
