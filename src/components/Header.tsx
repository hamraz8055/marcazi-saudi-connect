import { useState } from "react";
import { Globe, ChevronDown, MapPin, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AuthDialog from "@/components/AuthDialog";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBidding = location.pathname.startsWith("/bidding");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const currentCity = majorCities.find(c => c.id === selectedCity) || majorCities[0];

  const navLinks = [
    { label: lang === "ar" ? "تصفح" : "Browse", path: "/browse" },
    { label: lang === "ar" ? "أضف إعلان" : "Post Ad", path: "/post" },
    { label: lang === "ar" ? "المزايدات" : "Bidding", path: "/bidding" },
    { label: lang === "ar" ? "الرسائل" : "Messages", path: "/messages" },
    { label: lang === "ar" ? "الإشعارات" : "Notifications", path: "/notifications" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-xl safe-top">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Go to homepage">
            <img src="/logo.png" alt="Marcazi" className="h-11 w-auto object-contain shrink-0" />
            <span className="text-xl font-bold text-foreground tracking-tight">Marcazi</span>
          </Link>

          {/* City Selector */}
          <div className="relative hidden md:block">
            <button onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-2.5 py-2 hover:bg-muted"
              aria-label="Select city" aria-expanded={showCityDropdown}>
              <MapPin className="h-4 w-4" />{currentCity[lang]}<ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {showCityDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full mt-2 start-0 z-50 w-52 rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
                    {majorCities.map(city => (
                      <button key={city.id} onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); }}
                        className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${selectedCity === city.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}>
                        {city[lang]}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleLang}
              className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}>
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === "en" ? "العربية" : "English"}</span>
            </button>

            <Button size="sm"
              className={`hidden sm:flex ${isBidding ? 'bidding-gradient border-0' : ''}`}
              onClick={() => navigate(isBidding ? "/bidding/create-auction" : "/post")}>
              {isBidding ? t("bidding.postAuction") : t("nav.postAd")}
            </Button>

            {!user && (
              <Button size="sm" variant="outline" className="hidden sm:flex" onClick={() => setShowAuth(true)}>
                {lang === "ar" ? "دخول" : "Sign In"}
              </Button>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu">
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile side drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowMobileMenu(false)} />
            <motion.div initial={{ x: lang === "ar" ? -300 : 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: lang === "ar" ? -300 : 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 end-0 z-50 h-full w-72 bg-card border-s border-border shadow-elevated p-6 safe-top overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-foreground text-lg">Marcazi</span>
                <button onClick={() => setShowMobileMenu(false)} aria-label="Close menu"><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>

              {/* Mobile city selector */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{lang === "ar" ? "المدينة" : "City"}</p>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {majorCities.map(city => (
                    <option key={city.id} value={city.id}>{city[lang]}</option>
                  ))}
                </select>
              </div>

              <nav className="space-y-1">
                {navLinks.map(link => (
                  <button key={link.path} onClick={() => { navigate(link.path); setShowMobileMenu(false); }}
                    className={`w-full text-start px-3 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                    {link.label}
                  </button>
                ))}
                {user && (
                  <>
                    <button onClick={() => { navigate("/favorites"); setShowMobileMenu(false); }} className="w-full text-start px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                      {lang === "ar" ? "المفضلة" : "Favorites"}
                    </button>
                    <button onClick={() => { navigate("/profile"); setShowMobileMenu(false); }} className="w-full text-start px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                      {lang === "ar" ? "حسابي" : "My Profile"}
                    </button>
                  </>
                )}
              </nav>

              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <Button className="w-full" onClick={() => { navigate("/post"); setShowMobileMenu(false); }}>
                  {t("nav.postAd")}
                </Button>
                {!user && (
                  <Button variant="outline" className="w-full" onClick={() => { setShowAuth(true); setShowMobileMenu(false); }}>
                    {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </>
  );
};

export default Header;
