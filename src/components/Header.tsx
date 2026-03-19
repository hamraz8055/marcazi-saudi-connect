import { useState } from "react";
import { Search, Globe, ChevronDown, MapPin, Menu, X, User, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/categories";

const majorCities = [
  { id: "all", en: "All Cities", ar: "جميع المدن" },
  { id: "riyadh", en: "Riyadh", ar: "الرياض" },
  { id: "jeddah", en: "Jeddah", ar: "جدة" },
  { id: "dammam", en: "Dammam", ar: "الدمام" },
  { id: "makkah", en: "Makkah", ar: "مكة المكرمة" },
  { id: "madinah", en: "Madinah", ar: "المدينة المنورة" },
  { id: "tabuk", en: "Tabuk", ar: "تبوك" },
  { id: "abha", en: "Abha", ar: "أبها" },
];

const Header = () => {
  const { t, toggleLang, lang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedCity, setSelectedCity] = useState("all");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const currentCity = majorCities.find((c) => c.id === selectedCity) || majorCities[0];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/92 dark:bg-[#111]/92 backdrop-blur-md border-b border-[#EBEBEB] dark:border-white/6 safe-top transition-colors duration-300">
        <div className="max-w-[1320px] mx-auto h-[70px] flex items-center justify-between gap-4 px-5 md:px-7">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="md:hidden" onClick={() => setIsDrawerOpen(true)}>
              <Menu className="w-6 h-6 text-[#1A1A1A] dark:text-white" />
            </button>
            <Link to="/" className="flex flex-col justify-center" aria-label="Go to homepage">
              <span className="hidden md:block text-[9px] tracking-[3px] text-text-muted font-semibold uppercase leading-tight mb-0.5">MARKETPLACE</span>
              <div className="flex items-end gap-0.5 mt-[-2px] md:mt-0">
                <span className="text-[21px] font-extrabold text-[#1A1A1A] dark:text-white font-fraunces leading-none tracking-tight">Marcazi</span>
                <span className="text-brand text-[24px] leading-none mb-0.5">.</span>
              </div>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-[640px] bg-white dark:bg-[#1A1A1A] border border-[#D1D5DB] dark:border-white/8 rounded-xl h-11 items-center focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(232,102,61,0.1)] transition-all">
            <Search className="w-5 h-5 text-text-muted px-3 box-content" />
            <input 
              className="flex-1 bg-transparent text-[14px] outline-none text-[#1A1A1A] dark:text-white placeholder-text-muted" 
              placeholder={t("nav.search") || "What are you looking for?"} 
              onFocus={() => location.pathname !== '/browse' && navigate('/browse')}
            />
            <div className="h-6 w-px bg-[#E5E7EB] dark:bg-white/10" />
            
            {/* City Selector */}
            <div className="relative h-full">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="h-full flex items-center gap-1.5 text-[13px] text-[#4B5563] dark:text-[#9CA3AF] px-3 font-medium hover:text-brand transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {currentCity[lang]}
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              <AnimatePresence>
                {showCityDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-2 right-0 z-50 w-52 rounded-xl border border-[#EBEBEB] dark:border-white/10 bg-white dark:bg-[#1A1A1A] shadow-xl overflow-hidden py-1"
                    >
                      {majorCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); }}
                          className={`w-full text-start px-4 py-2.5 text-[13.5px] font-medium transition-colors ${selectedCity === city.id ? "bg-brand/10 text-brand" : "text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]"}`}
                        >
                          {city[lang]}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={() => navigate('/browse')} className="bg-brand text-white text-[13.5px] font-bold px-5 h-full rounded-r-xl hover:bg-brand-dark transition-colors">
              Search
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => user ? setIsAccountOpen(!isAccountOpen) : navigate('/account')}
                className="w-[38px] h-[38px] rounded-full bg-brand/10 text-brand flex items-center justify-center text-[14px] font-bold border border-brand/20 hover:bg-brand/20 transition-colors"
              >
                {user ? user.email?.[0].toUpperCase() : <User className="w-5 h-5" />}
              </button>
              
              <AnimatePresence>
                {isAccountOpen && user && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsAccountOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-[48px] right-0 z-50 w-48 rounded-2xl border border-[#EBEBEB] dark:border-white/10 bg-white dark:bg-[#1A1A1A] shadow-xl overflow-hidden py-1"
                    >
                      <button onClick={() => navigate('/account')} className="w-full text-start px-4 py-2.5 text-[14px] font-medium text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]">My Profile</button>
                      <button onClick={() => navigate('/messages')} className="w-full text-start px-4 py-2.5 text-[14px] font-medium text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]">Messages</button>
                      <div className="h-px w-full bg-[#EBEBEB] dark:bg-white/10 my-1" />
                      <button className="w-full text-start px-4 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">Sign Out</button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => navigate("/post")}
              className="hidden sm:flex bg-brand hover:bg-brand-dark text-white rounded-full px-5 py-2.5 text-[14px] font-bold transition-all shadow-md"
            >
              Post Your Ad
            </button>
          </div>
        </div>

        {/* Subnav (Desktop) */}
        <div className="hidden md:flex border-t border-[#EBEBEB] dark:border-white/6 px-7 h-12 items-center gap-7">
          <Link to="/" className={`text-[13px] font-semibold transition-colors ${location.pathname === '/' ? 'text-brand' : 'text-text-muted hover:text-[#1A1A1A] dark:hover:text-white'}`}>Home</Link>
          
          <div className="relative group/nav h-full flex items-center cursor-pointer">
            <span className={`text-[13px] font-semibold transition-colors flex items-center gap-1 ${location.pathname.includes('/browse') ? 'text-brand' : 'text-text-muted hover:text-[#1A1A1A] dark:hover:text-white'}`}>
              Categories <ChevronDown className="w-3 h-3" />
            </span>
            {/* Mega menu */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all z-50">
              <div className="w-[600px] bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-[#EBEBEB] dark:border-white/6 p-5 grid grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => navigate('/browse?category=' + cat.id)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F9F9F9] dark:hover:bg-[#222] cursor-pointer transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1A1A1A] dark:text-white">{t(cat.key)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <Link to="/" className="text-[13px] font-semibold text-text-muted hover:text-[#1A1A1A] dark:hover:text-white transition-colors">About</Link>
          <Link to="/" className="text-[13px] font-semibold text-text-muted hover:text-[#1A1A1A] dark:hover:text-white transition-colors">Contact</Link>
          <Link to="/" className="text-[13px] font-semibold text-text-muted hover:text-[#1A1A1A] dark:hover:text-white transition-colors">Support</Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-[300px] bg-white dark:bg-[#111] shadow-[-8px_0_32px_rgba(0,0,0,0.15)] z-[60] flex flex-col md:hidden"
            >
              <div className="px-5 py-5 border-b border-[#EBEBEB] dark:border-white/10 flex justify-between items-center">
                <div className="flex items-end gap-0.5">
                  <span className="text-[22px] font-extrabold text-[#1A1A1A] dark:text-white font-fraunces leading-none tracking-tight">Marcazi</span>
                  <span className="text-brand text-[24px] leading-none mb-0.5">.</span>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pb-6">
                <nav className="flex flex-col">
                  <button onClick={() => { navigate('/'); setIsDrawerOpen(false); }} className="h-14 flex items-center justify-start px-5 text-[15px] font-semibold text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]">Home</button>
                  <button onClick={() => { navigate('/bidding'); setIsDrawerOpen(false); }} className="h-14 flex items-center justify-start px-5 text-[15px] font-semibold text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]">Bidding</button>
                  <button onClick={() => { navigate('/account'); setIsDrawerOpen(false); }} className="h-14 flex items-center justify-start px-5 text-[15px] font-semibold text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]">Account</button>
                </nav>

                <div className="text-[10px] tracking-[2px] font-bold uppercase text-text-muted px-5 py-3 mt-2">
                  MARKETPLACE CATEGORIES
                </div>
                <div className="flex flex-col">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button 
                        key={cat.id}
                        onClick={() => { navigate('/browse?category=' + cat.id); setIsDrawerOpen(false); }}
                        className="h-12 flex items-center justify-start gap-2.5 px-5 text-[14px] font-medium text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]"
                      >
                        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        {t(cat.key)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-[#EBEBEB] dark:border-white/10 px-5 py-4 flex flex-col gap-3 shrink-0 bg-white dark:bg-[#111]">
                <div className="flex gap-2">
                  <button onClick={toggleTheme} className="flex-1 py-2.5 rounded-xl border border-[#EBEBEB] dark:border-white/10 text-[13px] font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-center gap-1.5">
                    {(theme as string) === 'dark' ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4" />} Theme
                  </button>
                  <button onClick={toggleLang} className="flex-1 py-2.5 rounded-xl border border-[#EBEBEB] dark:border-white/10 text-[13px] font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-center gap-1.5">
                    <Globe className="w-4 h-4" /> {lang === 'en' ? 'عربي' : 'EN'}
                  </button>
                </div>
                {!user ? (
                  <button onClick={() => { navigate('/auth'); setIsDrawerOpen(false); }} className="w-full bg-brand text-white font-bold py-3 rounded-xl text-[14px]">
                    Sign In / Get Started
                  </button>
                ) : (
                  <button onClick={() => { navigate('/post'); setIsDrawerOpen(false); }} className="w-full bg-brand text-white font-bold py-3 rounded-xl text-[14px]">
                    Post Your Ad
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
