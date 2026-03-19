import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, ShoppingBag, Clock, Users, DollarSign, ArrowRight, Search, Shield, TrendingUp, FileText, Plus, Heart, MapPin, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import ImageFallback from "@/components/ImageFallback";

// Parse "2d 14h" into total seconds for countdown
const parseEndTime = (endsIn: string): number => {
  let totalSeconds = 0;
  const dayMatch = endsIn.match(/(\d+)d/);
  const hourMatch = endsIn.match(/(\d+)h/);
  const minMatch = endsIn.match(/(\d+)m/);
  if (dayMatch) totalSeconds += parseInt(dayMatch[1]) * 86400;
  if (hourMatch) totalSeconds += parseInt(hourMatch[1]) * 3600;
  if (minMatch) totalSeconds += parseInt(minMatch[1]) * 60;
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
    category: "cat.vehicles",
    city: "riyadh",
    views: 1240,
    timeAgo: "2h ago",
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
    category: "cat.property",
    city: "riyadh",
    views: 3420,
    timeAgo: "5h ago",
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
    category: "cat.equipment",
    city: "jeddah",
    views: 890,
    timeAgo: "1d ago",
  },
  {
    id: 4,
    title: { en: "VIP Mobile Number 05X XXXX", ar: "رقم جوال مميز 05X XXXX" },
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
    currentBid: 85000,
    startingPrice: 50000,
    totalBids: 42,
    endsIn: "0d 12h 30m",
    seller: { en: "Premium Numbers", ar: "أرقام مميزة" },
    verified: true,
    category: "cat.trading",
    city: "dammam",
    views: 5610,
    timeAgo: "2d ago",
  },
];

const mockQuotations = [
  {
    id: 1,
    title: { en: "Steel Plates 10mm - 500 Tons", ar: "ألواح حديد 10مم - 500 طن" },
    budget: { en: "800,000 - 1,200,000 SAR", ar: "800,000 - 1,200,000 ر.س" },
    quotes: 7,
    deadline: "3d left",
    buyer: { en: "Al Rajhi Construction", ar: "الراجحي للمقاولات" },
    category: "cat.materials",
    city: "riyadh",
    views: 231,
    timeAgo: "5h ago",
  },
  {
    id: 2,
    title: { en: "HVAC System for Commercial Building", ar: "نظام تكييف لمبنى تجاري" },
    budget: { en: "150,000 - 250,000 SAR", ar: "150,000 - 250,000 ر.س" },
    quotes: 12,
    deadline: "5d left",
    buyer: { en: "Saudi Development Co", ar: "شركة التطوير السعودية" },
    category: "cat.services",
    city: "jeddah",
    views: 412,
    timeAgo: "1d ago",
  },
  {
    id: 3,
    title: { en: "Office Furniture - 200 Workstations", ar: "أثاث مكتبي - 200 محطة عمل" },
    budget: { en: "400,000 - 600,000 SAR", ar: "400,000 - 600,000 ر.س" },
    quotes: 5,
    deadline: "7d left",
    buyer: { en: "Vision Corp", ar: "شركة فيجن" },
    category: "cat.furniture",
    city: "dammam",
    views: 128,
    timeAgo: "2d ago",
  },
];

const Bidding = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"auctions" | "quotations">("auctions");

  // Countdown timer state
  const [countdowns, setCountdowns] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    mockAuctions.forEach((a) => { initial[a.id] = parseEndTime(a.endsIn); });
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const next: Record<number, number> = {};
        for (const [id, secs] of Object.entries(prev)) {
          next[Number(id)] = Math.max(0, (secs as number) - 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-page dark:bg-[#0D0D0D]">
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-[1320px] mx-auto px-5 md:px-7 py-10 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center rounded-2xl bg-white/10 backdrop-blur-md p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-white/20"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Go to Marketplace"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("tab.marketplace")}
            </button>
            <button
              className="flex items-center gap-2 rounded-xl bg-white text-[#7c3aed] px-5 py-2.5 text-sm font-bold shadow-sm transition-all"
              aria-label="Bidding section active"
            >
              <Gavel className="h-4 w-4" />
              {t("tab.bidding")}
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-[40px] font-fraunces font-bold text-white leading-tight tracking-tight max-w-2xl"
          >
            {t("bidding.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-4 text-[15px] font-medium text-white/80 max-w-xl leading-relaxed"
          >
            {t("bidding.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-8"
          >
            {[
              { icon: Gavel, value: "1,200+", label: t("bidding.activeAuctions") },
              { icon: Users, value: "15K+", label: t("bidding.activeBidders") },
              { icon: DollarSign, value: "50M+", label: t("bidding.totalTraded") },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[20px] font-bold text-white leading-none mb-1">{stat.value}</div>
                  <div className="text-[12px] font-bold uppercase tracking-wider text-white/70">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-5 md:px-7 py-8 pb-24 md:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setActiveTab("auctions")}
              className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold transition-all ${activeTab === "auctions" ? "bg-[#7c3aed] text-white shadow-md" : "bg-white dark:bg-[#1A1A1A] text-[#4B5563] dark:text-[#9CA3AF] border border-[#EBEBEB] dark:border-white/6 hover:bg-[#F9F9F9] dark:hover:bg-[#222]"}`}
            >
              <Gavel className="h-4 w-4" />
              {t("bidding.auctions")}
            </button>
            <button
              onClick={() => setActiveTab("quotations")}
              className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold transition-all ${activeTab === "quotations" ? "bg-[#7c3aed] text-white shadow-md" : "bg-white dark:bg-[#1A1A1A] text-[#4B5563] dark:text-[#9CA3AF] border border-[#EBEBEB] dark:border-white/6 hover:bg-[#F9F9F9] dark:hover:bg-[#222]"}`}
            >
              <FileText className="h-4 w-4" />
              {t("bidding.quotations")}
            </button>
          </div>

          <button
            onClick={() => navigate(activeTab === "auctions" ? "/bidding/create-auction" : "/bidding/request-quote")}
            className="flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] font-bold text-[14px] hover:bg-black/80 dark:hover:bg-gray-100 transition-colors shadow-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            {activeTab === "auctions" ? t("bidding.createAuction") : t("bidding.requestQuote")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "auctions" ? (
            <motion.div
              key="auctions"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Search, title: t("bidding.howFind"), desc: t("bidding.howFindDesc") },
                  { icon: Shield, title: t("bidding.howDeposit"), desc: t("bidding.howDepositDesc") },
                  { icon: TrendingUp, title: t("bidding.howWin"), desc: t("bidding.howWinDesc") },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl border border-[#EBEBEB] dark:border-white/6 bg-white dark:bg-[#1A1A1A] p-5 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed]/10 text-[#7c3aed]">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#1A1A1A] dark:text-white">{step.title}</h4>
                      <p className="text-[13px] text-text-muted mt-1.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {mockAuctions.map((auction, i) => {
                  const remaining = countdowns[auction.id] ?? 0;
                  const isUrgent = remaining < 86400; // less than 1 day
                  return (
                    <motion.article
                      key={auction.id}
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="group cursor-pointer rounded-3xl border border-black/4 bg-white dark:bg-[#1A1A1A] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative h-[160px] overflow-hidden">
                        <ImageFallback
                          src={auction.image}
                          alt={auction.title[lang]}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${isUrgent ? "bg-red-500 text-white animate-pulse" : "bg-white text-[#7c3aed]"}`}>
                            <Clock className="h-3 w-3" />
                            {formatCountdown(remaining)}
                          </span>
                        </div>
                        <button
                          className="absolute top-2.5 right-2.5 bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 z-10 transition-colors"
                          aria-label={`Save to favorites`}
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3.5 flex flex-col h-[150px] justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span 
                              className="inline-block text-[10.5px] font-bold rounded-full px-2 py-0.5"
                              style={{ backgroundColor: `rgba(124, 58, 237, 0.1)`, color: '#7c3aed' }}
                            >
                              {t(auction.category)}
                            </span>
                            {auction.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">
                                <Shield className="h-2.5 w-2.5" /> Verified
                              </span>
                            )}
                          </div>
                          <h3 className="text-[14px] font-bold text-[#1A1A1A] dark:text-white line-clamp-2 leading-[1.4] group-hover:text-[#7c3aed] transition-colors">
                            {auction.title[lang]}
                          </h3>
                        </div>
                        
                        <div>
                          <div className="flex items-end justify-between mb-2">
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Current Bid</p>
                                <p className="text-[18px] font-extrabold text-[#7c3aed] truncate">
                                  {auction.currentBid.toLocaleString()} <span className="text-[12px] font-medium text-text-muted">{t("listing.sar")}</span>
                                </p>
                             </div>
                             <div className="text-[12px] font-bold text-[#1A1A1A] dark:text-white bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                                {auction.totalBids} Bids
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-2.5 mt-2 text-[11px] text-text-muted">
                            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3"/> {auction.city}</span>
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3"/> {auction.views.toLocaleString()}</span>
                            <span>· {auction.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quotations"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: FileText, title: t("bidding.qPost"), desc: t("bidding.qPostDesc") },
                  { icon: Users, title: t("bidding.qReceive"), desc: t("bidding.qReceiveDesc") },
                  { icon: Shield, title: t("bidding.qChoose"), desc: t("bidding.qChooseDesc") },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl border border-[#EBEBEB] dark:border-white/6 bg-white dark:bg-[#1A1A1A] p-5 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed]/10 text-[#7c3aed]">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#1A1A1A] dark:text-white">{step.title}</h4>
                      <p className="text-[13px] text-text-muted mt-1.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockQuotations.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="rounded-3xl border border-black/4 bg-white dark:bg-[#1A1A1A] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span 
                          className="inline-block text-[10.5px] font-bold rounded-full px-2 py-0.5"
                          style={{ backgroundColor: `rgba(124, 58, 237, 0.1)`, color: '#7c3aed' }}
                        >
                          {t(q.category)}
                        </span>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] px-2.5 py-1 text-[11px] font-bold">
                          <Clock className="h-3 w-3" />
                          {q.deadline}
                        </div>
                      </div>
                      
                      <h3 className="text-[16px] font-bold text-[#1A1A1A] dark:text-white leading-[1.4] mb-1">{q.title[lang]}</h3>
                      <p className="text-[13px] text-text-muted">{q.buyer[lang]}</p>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-[#EBEBEB] dark:border-white/6">
                       <div className="flex items-end justify-between mb-4">
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Budget</p>
                             <p className="text-[15px] font-extrabold text-[#7c3aed]">{q.budget[lang]}</p>
                          </div>
                          <div className="text-[12px] font-bold text-[#1A1A1A] dark:text-white bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                             {q.quotes} Quotes
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                         <button className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-[#1A1A1A] dark:text-white font-bold h-10 text-[13px] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                           View Details
                         </button>
                         <button className="flex-1 rounded-xl bg-[#7c3aed] text-white font-bold h-10 text-[13px] shadow-sm hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-1.5">
                           Submit Quote <ArrowRight className="w-3.5 h-3.5"/>
                         </button>
                       </div>
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
