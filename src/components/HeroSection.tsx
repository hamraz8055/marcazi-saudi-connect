import { useState } from "react";
import { Search, ArrowRight, ShoppingBag, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/browse");
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container relative z-10 py-16 md:py-28 text-center">
        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="mx-auto mb-10 inline-flex items-center rounded-2xl bg-card/90 backdrop-blur-sm p-1.5 shadow-elevated">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all"
            aria-label="Marketplace tab active">
            <ShoppingBag className="h-4 w-4" />{t("tab.marketplace")}
          </button>
          <button onClick={() => navigate("/bidding")}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Switch to bidding">
            <Gavel className="h-4 w-4" />{t("tab.bidding")}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-card/90 backdrop-blur-sm shadow-elevated text-2xl" aria-hidden="true">
          🇸🇦
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight tracking-tight">
          {t("hero.title")}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto mt-4 text-lg md:text-xl font-semibold text-primary-foreground/90">
          {t("hero.subtitle")}
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-primary-foreground/70">
          {t("hero.description")}
        </motion.p>

        {/* Functional Search Bar */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-8 max-w-xl">
          <div className="flex items-center gap-2 rounded-2xl bg-card/95 backdrop-blur-sm px-5 py-3.5 shadow-elevated" role="search" aria-label="Search listings">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
              placeholder={t("nav.search")}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
            />
            <button onClick={handleSearch} className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" aria-label="Search">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="lg"
            className="rounded-xl border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => navigate("/browse")}>
            {t("hero.explore")}<ArrowRight className="ms-2 h-4 w-4" />
          </Button>
          <Button size="lg" className="rounded-xl bg-card text-primary hover:bg-card/90 font-semibold" onClick={() => navigate("/post")}>
            {t("hero.postAd")}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 flex items-center justify-center gap-8 md:gap-16">
          {[
            { value: "50K+", label: t("stats.listings") },
            { value: "30+", label: t("stats.cities") },
            { value: "100K+", label: t("stats.users") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-primary-foreground">{stat.value}</div>
              <div className="mt-1 text-xs md:text-sm text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
