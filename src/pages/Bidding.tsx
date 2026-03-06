import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, ShoppingBag, Clock, Users, DollarSign, ArrowRight, Search, Shield, TrendingUp, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";

const mockAuctions = [
  {
    id: 1,
    title: { en: "Toyota Land Cruiser 2024 - VIP Plate", ar: "تويوتا لاند كروزر 2024 - لوحة VIP" },
    image: "https://images.unsplash.com/photo-1625231334168-30dc1d1329cc?w=400&h=300&fit=crop",
    currentBid: 450000,
    startingPrice: 350000,
    totalBids: 23,
    endsIn: "2d 14h",
    seller: { en: "Ahmed Motors", ar: "أحمد للسيارات" },
    verified: true,
  },
  {
    id: 2,
    title: { en: "Luxury Penthouse - Riyadh", ar: "بنتهاوس فاخر - الرياض" },
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    currentBid: 3200000,
    startingPrice: 2800000,
    totalBids: 15,
    endsIn: "5d 8h",
    seller: { en: "KSA Properties", ar: "عقارات المملكة" },
    verified: true,
  },
  {
    id: 3,
    title: { en: "CAT 336 Excavator - Like New", ar: "حفارة كاتربيلر 336 - شبه جديدة" },
    image: "https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=400&h=300&fit=crop",
    currentBid: 520000,
    startingPrice: 400000,
    totalBids: 8,
    endsIn: "1d 6h",
    seller: { en: "Heavy Machinery Co", ar: "شركة المعدات الثقيلة" },
    verified: false,
  },
  {
    id: 4,
    title: { en: "VIP Mobile Number 05X XXXX", ar: "رقم جوال مميز 05X XXXX" },
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
    currentBid: 85000,
    startingPrice: 50000,
    totalBids: 42,
    endsIn: "12h 30m",
    seller: { en: "Premium Numbers", ar: "أرقام مميزة" },
    verified: true,
  },
];

const mockQuotations = [
  {
    id: 1,
    title: { en: "Steel Plates 10mm - 500 Tons", ar: "ألواح حديد 10مم - 500 طن" },
    budget: { en: "Budget: 800,000 - 1,200,000 SAR", ar: "الميزانية: 800,000 - 1,200,000 ر.س" },
    quotes: 7,
    deadline: "3d left",
    buyer: { en: "Al Rajhi Construction", ar: "الراجحي للمقاولات" },
  },
  {
    id: 2,
    title: { en: "HVAC System for Commercial Building", ar: "نظام تكييف لمبنى تجاري" },
    budget: { en: "Budget: 150,000 - 250,000 SAR", ar: "الميزانية: 150,000 - 250,000 ر.س" },
    quotes: 12,
    deadline: "5d left",
    buyer: { en: "Saudi Development Co", ar: "شركة التطوير السعودية" },
  },
  {
    id: 3,
    title: { en: "Office Furniture - 200 Workstations", ar: "أثاث مكتبي - 200 محطة عمل" },
    budget: { en: "Budget: 400,000 - 600,000 SAR", ar: "الميزانية: 400,000 - 600,000 ر.س" },
    quotes: 5,
    deadline: "7d left",
    buyer: { en: "Vision Corp", ar: "شركة فيجن" },
  },
];

const Bidding = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"auctions" | "quotations">("auctions");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/60 to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container relative z-10 py-10 md:py-16">
          {/* Navigation toggle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center rounded-2xl bg-card/90 backdrop-blur-sm p-1.5 shadow-elevated"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("tab.marketplace")}
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all">
              <Gavel className="h-4 w-4" />
              {t("tab.bidding")}
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-primary-foreground"
          >
            {t("bidding.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-primary-foreground/75 max-w-lg"
          >
            {t("bidding.subtitle")}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex gap-8"
          >
            {[
              { icon: Gavel, value: "1,200+", label: t("bidding.activeAuctions") },
              { icon: Users, value: "15K+", label: t("bidding.activeBidders") },
              { icon: DollarSign, value: "50M+", label: t("bidding.totalTraded") },
            ].map((stat) => (
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
        {/* Tab switcher */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative inline-flex items-center rounded-full bg-muted p-1">
            <motion.div
              className="absolute h-[calc(100%-8px)] rounded-full bg-primary"
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                width: "50%",
                left: activeTab === "auctions" ? "4px" : "50%",
              }}
            />
            <button
              onClick={() => setActiveTab("auctions")}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTab === "auctions" ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Gavel className="h-4 w-4" />
              {t("bidding.auctions")}
            </button>
            <button
              onClick={() => setActiveTab("quotations")}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTab === "quotations" ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              {t("bidding.quotations")}
            </button>
          </div>

          <Button
            className="bg-gold text-gold-foreground hover:bg-gold/90"
            onClick={() => navigate(activeTab === "auctions" ? "/bidding/create-auction" : "/bidding/request-quote")}
          >
            <Plus className="h-4 w-4 me-1" />
            {activeTab === "auctions" ? t("bidding.createAuction") : t("bidding.requestQuote")}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "auctions" ? (
            <motion.div
              key="auctions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* How it works */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Search, title: t("bidding.howFind"), desc: t("bidding.howFindDesc") },
                  { icon: Shield, title: t("bidding.howDeposit"), desc: t("bidding.howDepositDesc") },
                  { icon: TrendingUp, title: t("bidding.howWin"), desc: t("bidding.howWinDesc") },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-light text-gold">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Auction Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                {mockAuctions.map((auction, i) => (
                  <motion.article
                    key={auction.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0">
                        <img src={auction.image} alt={auction.title[lang]} className="h-full w-full object-cover" loading="lazy" />
                        <div className="absolute top-3 start-3 flex items-center gap-1.5 rounded-lg bg-destructive/90 text-destructive-foreground px-2.5 py-1 text-xs font-bold">
                          <Clock className="h-3 w-3" />
                          {auction.endsIn}
                        </div>
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">{auction.seller[lang]}</span>
                          {auction.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold-light text-gold px-2 py-0.5 text-[10px] font-bold">
                              <Shield className="h-2.5 w-2.5" />
                              {t("bidding.verified")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {auction.title[lang]}
                        </h3>
                        <div className="mt-3 flex items-end gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("bidding.currentBid")}</p>
                            <p className="text-xl font-bold text-primary">{auction.currentBid.toLocaleString()} {t("listing.sar")}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {auction.totalBids} {t("bidding.bids")}
                          </div>
                        </div>
                        <Button size="sm" className="mt-4 bg-gold text-gold-foreground hover:bg-gold/90">
                          {t("bidding.placeBid")}
                          <ArrowRight className="h-3.5 w-3.5 ms-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quotations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* How quotations work */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: FileText, title: t("bidding.qPost"), desc: t("bidding.qPostDesc") },
                  { icon: Users, title: t("bidding.qReceive"), desc: t("bidding.qReceiveDesc") },
                  { icon: Shield, title: t("bidding.qChoose"), desc: t("bidding.qChooseDesc") },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quotation cards */}
              <div className="space-y-4">
                {mockQuotations.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-border bg-card p-5 hover:shadow-elevated transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{q.title[lang]}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{q.buyer[lang]}</p>
                        <p className="text-sm font-medium text-primary mt-2">{q.budget[lang]}</p>
                      </div>
                      <div className="text-end shrink-0 ms-4">
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary-light text-primary px-3 py-1 text-xs font-bold">
                          <Clock className="h-3 w-3" />
                          {q.deadline}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {q.quotes} {t("bidding.quotesReceived")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        {t("bidding.viewDetails")}
                      </Button>
                      <Button size="sm" className="text-xs bg-primary text-primary-foreground">
                        {t("bidding.submitQuote")}
                        <ArrowRight className="h-3 w-3 ms-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default Bidding;
