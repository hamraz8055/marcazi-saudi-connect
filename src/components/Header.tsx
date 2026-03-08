import { useState } from "react";
import { Search, Globe, Camera, ChevronDown, MapPin, Menu, X, Bell, Heart, User } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const currentCity = majorCities.find(c => c.id === selectedCity) || majorCities[0];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/browse");
    }
  };

  const navLinks = [
    { label: lang === "ar" ? "تصفح" : "Browse", path: "/browse" },
    { label: lang === "ar" ? "أضف إعلان" : "Post Ad", path: "/post" },
    { label: lang === "ar" ? "المزايدات" : "Bidding", path: "/bidding" },
    { label: lang === "ar" ? "الرسائل" : "Messages", path: "/messages" },
    { label: lang === "ar" ? "الإشعارات" : "Notifications", path: "/notifications" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl safe-top">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Go to homepage">
            <img src="/logo.png" alt="Marcazi - Saudi Premier Resource Marketplace" className="h-8 md:h-10 w-auto object-contain shrink-0" />
            <span className="text-xl font-bold text-foreground tracking-tight">Marcazi</span>
          </Link>

          {/* City Selector */}
          <div className="relative hidden md:block">
            <button onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-2 py-1.5 hover:bg-muted"
              aria-label="Select city" aria-expanded={showCityDropdown}>
              <MapPin className="h-3.5 w-3.5" />{currentCity[lang]}<ChevronDown className="h-4 w-4" />
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

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5" role="search" aria-label="Search listings">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
              placeholder={t("nav.search")} className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" />
            <button onClick={handleSearch} aria-label="Submit search"><Camera className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" /></button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleLang}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}>
              <Globe className="h-4.5 w-4.5" />
            </button>

            {user && (
              <>
                <button onClick={() => navigate("/notifications")} className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Notifications">
                  <Bell className="h-4.5 w-4.5" />
                </button>
                <button onClick={() => navigate("/favorites")} className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Favorites">
                  <Heart className="h-4.5 w-4.5" />
                </button>
                <button onClick={() => navigate("/profile")} className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Profile">
                  <User className="h-4.5 w-4.5" />
                </button>
              </>
            )}

            <Button size="sm"
              className={`hidden sm:flex ${isBidding ? 'bidding-gradient border-0' : 'bg-gold text-gold-foreground hover:bg-gold/90'}`}
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

              {/* Mobile search */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2.5 mb-6">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { handleSearch(); setShowMobileMenu(false); } }}
                  placeholder={t("nav.search")} className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" />
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

              <div className="mt-6 pt-4 border-t border-border">
                {!user && (
                  <Button className="w-full" onClick={() => { setShowAuth(true); setShowMobileMenu(false); }}>
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
