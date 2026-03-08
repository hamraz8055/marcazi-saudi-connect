import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, MapPin, Menu, X, User, FileText, Shield, MessageCircle, Heart, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBidding = location.pathname.startsWith("/bidding");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; verification_status: string | null } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentCity = majorCities.find(c => c.id === selectedCity) || majorCities[0];

  // Fetch user profile for display name & verification
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase.from("profiles").select("display_name, verification_status").eq("user_id", user.id).single()
      .then(({ data }) => setProfile(data as any));
  }, [user]);

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUserMenu]);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "";
  const firstLetter = displayName?.[0]?.toUpperCase() || "U";
  const isVerified = profile?.verification_status === "verified";

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { label: lang === "ar" ? "تصفح" : "Browse", path: "/browse" },
    { label: lang === "ar" ? "أضف إعلان" : "Post Ad", path: "/post" },
    { label: lang === "ar" ? "المزايدات" : "Bidding", path: "/bidding" },
    { label: lang === "ar" ? "الرسائل" : "Messages", path: "/messages" },
    { label: lang === "ar" ? "الإشعارات" : "Notifications", path: "/notifications" },
  ];

  const userMenuItems = [
    { icon: User, label: lang === "ar" ? "حسابي" : "My Profile", path: "/profile" },
    { icon: FileText, label: lang === "ar" ? "إعلاناتي" : "My Ads", path: "/my-ads" },
    { icon: Shield, label: lang === "ar" ? "التوثيق" : "Get Verified", path: "/profile#verify", badge: isVerified },
    { icon: MessageCircle, label: lang === "ar" ? "المحادثات" : "Chats", path: "/messages" },
    { icon: Heart, label: lang === "ar" ? "المفضلة" : "Favourites", path: "/favorites" },
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

            {/* User menu or Sign In */}
            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
                  aria-label="User menu" aria-expanded={showUserMenu}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{firstLetter}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-2 end-0 z-50 w-56 rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
                      {userMenuItems.map(item => (
                        <button key={item.path} onClick={() => { setShowUserMenu(false); navigate(item.path); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 text-start">{item.label}</span>
                          {item.badge && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">✓</span>}
                        </button>
                      ))}
                      <div className="border-t border-border">
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors">
                          <LogOut className="h-4 w-4" />
                          <span>{lang === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
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

              {/* Mobile user info */}
              {user && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{firstLetter}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}

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
                    <button onClick={() => { navigate("/my-ads"); setShowMobileMenu(false); }} className="w-full text-start px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted">
                      {lang === "ar" ? "إعلاناتي" : "My Ads"}
                    </button>
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
                {!user ? (
                  <Button variant="outline" className="w-full" onClick={() => { setShowAuth(true); setShowMobileMenu(false); }}>
                    {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2" onClick={() => { handleSignOut(); setShowMobileMenu(false); }}>
                    <LogOut className="h-4 w-4" />{lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
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
