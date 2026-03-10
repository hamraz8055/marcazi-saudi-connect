import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useMyBiddingData } from "@/hooks/useAuctions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Trophy, Zap, FileText, Plus, Clock, Users, ArrowRight, Star } from "lucide-react";
import ImageFallback from "@/components/ImageFallback";

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; icon: string }> = {
    active: { bg: "bg-green-100 text-green-700", text: "🔴 LIVE", icon: "" },
    draft: { bg: "bg-muted text-muted-foreground", text: "Draft", icon: "" },
    ended: { bg: "bg-muted text-muted-foreground", text: "🏁 Ended", icon: "" },
    sold: { bg: "bg-gold-light text-gold", text: "🎉 Sold", icon: "" },
    no_sale: { bg: "bg-destructive/10 text-destructive", text: "No Sale", icon: "" },
    winning: { bg: "bg-green-100 text-green-700", text: "🏆 Winning", icon: "" },
    outbid: { bg: "bg-destructive/10 text-destructive", text: "⚡ Outbid", icon: "" },
    won: { bg: "bg-gold-light text-gold", text: "🎉 Won", icon: "" },
    lost: { bg: "bg-muted text-muted-foreground", text: "Lost", icon: "" },
  };
  const s = map[status] || map.active;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg}`}>{s.text}</span>;
};

const formatTimeLeft = (endsAt: string) => {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
};

const MyBids = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { myAuctions, myBids, myQuotations, mySubmittedQuotes, loading } = useMyBiddingData();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "سجل الدخول أولاً" : "Please sign in"}</p>
        </div>
        <Footer /><BottomTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="bidding.title" />
      <Header />
      <div className="container max-w-4xl py-6 pb-24 md:pb-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">{lang === "ar" ? "لوحة المزايدات" : "My Bidding Dashboard"}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <Tabs defaultValue="auctions" className="space-y-4">
            <TabsList className="w-full flex-wrap h-auto gap-1">
              <TabsTrigger value="auctions" className="gap-1 text-xs"><Gavel className="h-3.5 w-3.5" />{lang === "ar" ? "مزاداتي" : "My Auctions"} ({myAuctions.length})</TabsTrigger>
              <TabsTrigger value="bids" className="gap-1 text-xs"><Zap className="h-3.5 w-3.5" />{lang === "ar" ? "مزايداتي" : "My Bids"} ({myBids.length})</TabsTrigger>
              <TabsTrigger value="quotations" className="gap-1 text-xs"><FileText className="h-3.5 w-3.5" />{lang === "ar" ? "طلباتي" : "My RFQs"} ({myQuotations.length})</TabsTrigger>
              <TabsTrigger value="submitted" className="gap-1 text-xs"><Star className="h-3.5 w-3.5" />{lang === "ar" ? "عروضي" : "Submitted"} ({mySubmittedQuotes.length})</TabsTrigger>
              <TabsTrigger value="won" className="gap-1 text-xs"><Trophy className="h-3.5 w-3.5" />{lang === "ar" ? "فائز" : "Won"}</TabsTrigger>
            </TabsList>

            {/* MY AUCTIONS */}
            <TabsContent value="auctions">
              <div className="flex justify-end mb-4">
                <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => navigate("/bidding/create-auction")}>
                  <Plus className="h-4 w-4 me-1" />{lang === "ar" ? "إنشاء مزاد" : "Create Auction"}
                </Button>
              </div>
              {myAuctions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Gavel className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{lang === "ar" ? "لا توجد مزادات" : "No auctions yet"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myAuctions.map(a => (
                    <div key={a.id} className="rounded-2xl border border-border bg-card p-4 flex gap-4 cursor-pointer hover:shadow-card transition-all"
                      onClick={() => navigate(`/bidding/auction/${a.id}`)}>
                      {a.images?.[0] && (
                        <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0">
                          <ImageFallback src={a.images[0]} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {statusBadge(a.status || "active")}
                          {a.reference_no && <span className="text-xs font-mono text-muted-foreground">{a.reference_no}</span>}
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Current: <strong className="text-primary">{(Number(a.current_bid) || Number(a.starting_price)).toLocaleString()} SAR</strong></span>
                          <span>{a.total_bids || 0} bids</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTimeLeft(a.ends_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* MY BIDS */}
            <TabsContent value="bids">
              {myBids.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{lang === "ar" ? "لم تقدم مزايدات بعد" : "No bids placed yet"}</p>
                  <Button variant="outline" className="mt-3" onClick={() => navigate("/bidding")}>{lang === "ar" ? "تصفح المزادات" : "Browse Auctions"}</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBids.map(b => {
                    const auction = b.auction as any;
                    return (
                      <div key={b.id} className="rounded-2xl border border-border bg-card p-4 flex gap-4 cursor-pointer hover:shadow-card transition-all"
                        onClick={() => navigate(`/bidding/auction/${b.auction_id}`)}>
                        {auction?.images?.[0] && (
                          <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0">
                            <ImageFallback src={auction.images[0]} alt="" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {statusBadge(b.status || (b.is_winning ? "winning" : "outbid"))}
                          </div>
                          <h3 className="font-semibold text-foreground truncate">{auction?.title || "Auction"}</h3>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>My Bid: <strong className="text-foreground">{b.amount.toLocaleString()} SAR</strong></span>
                            {auction?.current_bid && <span>Current: <strong className="text-primary">{Number(auction.current_bid).toLocaleString()} SAR</strong></span>}
                            {auction?.ends_at && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTimeLeft(auction.ends_at)}</span>}
                          </div>
                          {b.is_auto_bid && b.max_auto_bid && (
                            <p className="text-xs text-primary mt-1 flex items-center gap-1">🤖 Auto-bid active (max {Number(b.max_auto_bid).toLocaleString()} SAR)</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* MY QUOTATIONS */}
            <TabsContent value="quotations">
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={() => navigate("/bidding/request-quote")}>
                  <Plus className="h-4 w-4 me-1" />{lang === "ar" ? "طلب تسعير" : "Request Quote"}
                </Button>
              </div>
              {myQuotations.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{lang === "ar" ? "لا توجد طلبات تسعير" : "No RFQs yet"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myQuotations.map(q => (
                    <div key={q.id} className="rounded-2xl border border-border bg-card p-4 cursor-pointer hover:shadow-card transition-all"
                      onClick={() => navigate(`/bidding/quotation/${q.id}`)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${q.status === "open" ? "bg-green-100 text-green-700" : q.status === "awarded" ? "bg-gold-light text-gold" : "bg-muted text-muted-foreground"}`}>
                          {q.status === "open" ? "🟢 Open" : q.status === "awarded" ? "🏆 Awarded" : q.status}
                        </span>
                        {q.reference_no && <span className="text-xs font-mono text-muted-foreground">{q.reference_no}</span>}
                      </div>
                      <h3 className="font-semibold text-foreground">{q.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>💬 {q.quotes_count || 0} Quotes</span>
                        {q.deadline && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.max(0, Math.ceil((new Date(q.deadline).getTime() - Date.now()) / 86400000))}d left</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* SUBMITTED QUOTES */}
            <TabsContent value="submitted">
              {mySubmittedQuotes.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{lang === "ar" ? "لم تقدم عروض بعد" : "No quotes submitted yet"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mySubmittedQuotes.map((q: any) => (
                    <div key={q.id} className="rounded-2xl border border-border bg-card p-4 cursor-pointer hover:shadow-card transition-all"
                      onClick={() => navigate(`/bidding/quotation/${q.quotation_id}`)}>
                      <h3 className="font-semibold text-foreground">{q.quotation?.title || "RFQ"}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>My Quote: <strong className="text-primary">{q.price_offer?.toLocaleString()} SAR</strong></span>
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* WON */}
            <TabsContent value="won">
              <div className="space-y-3">
                {myBids.filter(b => b.status === "won" || (b.is_winning && (b.auction as any)?.status === "sold")).length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">{lang === "ar" ? "لا توجد مزادات فائزة" : "No won auctions yet"}</p>
                  </div>
                ) : (
                  myBids.filter(b => b.status === "won").map(b => (
                    <div key={b.id} className="rounded-2xl border border-gold/30 bg-gold-light p-4 cursor-pointer" onClick={() => navigate(`/bidding/auction/${b.auction_id}`)}>
                      <p className="font-bold text-foreground">🎉 {(b.auction as any)?.title}</p>
                      <p className="text-sm text-gold font-bold mt-1">Winning Bid: {b.amount.toLocaleString()} SAR</p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer /><BottomTabBar />
    </div>
  );
};

export default MyBids;
