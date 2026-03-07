import { useState } from "react";
import { Search, Globe, Camera, ChevronDown, MapPin, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const majorCities = [
  { id: "all", en: "All Cities", ar: "جميع المدن" },
  { id: "riyadh", en: "Riyadh", ar: "الرياض" },
  { id: "jeddah", en: "Jeddah", ar: "جدة" },
  { id: "dammam", en: "Dammam", ar: "الدمام" },
  { id: "makkah", en: "Makkah", ar: "مكة المكرمة" },
  { id: "madinah", en: "Madinah", ar: "المدينة المنورة" },
  { id: "neom", en: "NEOM", ar: "نيوم" },
  { id: "tabuk", en: "Tabuk", ar: "تبوك" },
  { id: "abha", en: "Abha", ar: "أبها" },
];

const Header = () => {
  const { t, toggleLang, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isBidding = location.pathname.startsWith("/bidding");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const currentCity = majorCities.find((c) => c.id === selectedCity) || majorCities[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl safe-top">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Go to homepage">
          <img
            src="/logo.png"
            alt="Marcazi - Saudi Premier Resource Marketplace"
            className="h-8 md:h-10 w-auto object-contain shrink-0"
          />
          <span className="text-xl font-bold text-foreground tracking-tight">Marcazi</span>
        </Link>

        {/* City Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-2 py-1.5 hover:bg-muted"
            aria-label="Select city"
            aria-expanded={showCityDropdown}
          >
            <MapPin className="h-3.5 w-3.5" />
            {currentCity[lang]}
            <ChevronDown className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {showCityDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full mt-2 start-0 z-50 w-52 rounded-xl border border-border bg-card shadow-elevated overflow-hidden"
                >
                  {majorCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); }}
                      className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${selectedCity === city.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                        }`}
                    >
                      {city[lang]}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar */}
        <div
          onClick={() => navigate("/browse")}
          className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 cursor-pointer"
          role="search"
          aria-label="Search listings"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm text-muted-foreground">{t("nav.search")}</span>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="h-4.5 w-4.5" />
          </button>
          <Button
            size="sm"
            className={`hidden sm:flex ${isBidding ? 'bidding-gradient border-0' : 'bg-gold text-gold-foreground hover:bg-gold/90'}`}
            onClick={() => navigate(isBidding ? "/bidding/create-auction" : "/post")}
          >
            {isBidding ? t("bidding.postAuction") : t("nav.postAd")}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
