import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, ChevronDown, Eye, Heart, SlidersHorizontal, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSearchParams } from "react-router-dom";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import ImageFallback from "@/components/ImageFallback";

const allListings = [
  { id: 1, title: { en: "CAT 320 Excavator", ar: "حفارة كاتربيلر 320" }, category: "cat.equipment", categoryColor: "#E67E22", price: 285000, city: "riyadh", views: 1240, type: "sale" as const, image: "https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=400&h=300&fit=crop", timeAgo: "2h ago" },
  { id: 2, title: { en: "Modern Villa - Al Nakheel", ar: "فيلا حديثة - النخيل" }, category: "cat.property", categoryColor: "#27AE60", price: 2500000, city: "jeddah", views: 3420, type: "sale" as const, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop", timeAgo: "5h ago" },
  { id: 3, title: { en: "Toyota Land Cruiser 2024", ar: "تويوتا لاند كروزر 2024" }, category: "cat.vehicles", categoryColor: "#E74C3C", price: 320000, city: "dammam", views: 5610, type: "sale" as const, image: "https://images.unsplash.com/photo-1625231334168-30dc1d1329cc?w=400&h=300&fit=crop", timeAgo: "1d ago" },
  { id: 4, title: { en: "HVAC Maintenance Service", ar: "خدمة صيانة التكييف" }, category: "cat.services", categoryColor: "#F39C12", price: 0, city: "riyadh", views: 890, type: "rent" as const, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", timeAgo: "2d ago" },
  { id: 5, title: { en: "Steel Rebar - Bulk Supply", ar: "حديد تسليح - توريد بالجملة" }, category: "cat.trading", categoryColor: "#64748B", price: 4500, city: "jubail", views: 2100, type: "sale" as const, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", timeAgo: "3d ago" },
  { id: 6, title: { en: "Electrical Engineer Needed", ar: "مطلوب مهندس كهربائي" }, category: "cat.jobs", categoryColor: "#4A90D9", price: 15000, city: "khobar", views: 1750, type: "rent" as const, image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop", timeAgo: "4d ago" },
  { id: 7, title: { en: "Luxury Apartment - Olaya", ar: "شقة فاخرة - العليا" }, category: "cat.property", categoryColor: "#27AE60", price: 850000, city: "riyadh", views: 4200, type: "sale" as const, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop", timeAgo: "5d ago" },
  { id: 8, title: { en: "Generator 500KVA", ar: "مولد 500 كيلو فولت" }, category: "cat.equipment", categoryColor: "#E67E22", price: 75000, city: "jeddah", views: 980, type: "rent" as const, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop", timeAgo: "1w ago" },
  { id: 9, title: { en: "Cement Bulk - 1000 Bags", ar: "أسمنت بالجملة - 1000 كيس" }, category: "cat.trading", categoryColor: "#64748B", price: 32000, city: "dammam", views: 1560, type: "sale" as const, image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=300&fit=crop", timeAgo: "1w ago" },
  { id: 10, title: { en: "Nissan Patrol 2023", ar: "نيسان باترول 2023" }, category: "cat.vehicles", categoryColor: "#E74C3C", price: 245000, city: "tabuk", views: 3890, type: "sale" as const, image: "https://images.unsplash.com/photo-1606611013016-969c19ba92e8?w=400&h=300&fit=crop", timeAgo: "1w ago" },
  { id: 11, title: { en: "Office Space for Rent", ar: "مكتب للإيجار" }, category: "cat.property", categoryColor: "#27AE60", price: 5000, city: "riyadh", views: 2310, type: "rent" as const, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", timeAgo: "2w ago" },
  { id: 12, title: { en: "Plumber Available", ar: "سباك متاح" }, category: "cat.services", categoryColor: "#F39C12", price: 0, city: "makkah", views: 670, type: "rent" as const, image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop", timeAgo: "2w ago" },
];

const Browse = () => {
  const { t, lang } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.some((c) => c.id === cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catId: string | null) => {
    setSelectedCategory(catId);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
    setShowFilters(false);
  };

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // Map 'cat.equipment' to URL 'equipment' logic for matching
      const urlCat = listing.category.replace('cat.', '');
      if (selectedCategory && urlCat !== selectedCategory && listing.category !== selectedCategory) return false;
      if (listingType !== "all" && listing.type !== listingType) return false;
      if (selectedCity && listing.city !== selectedCity) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = listing.title.en.toLowerCase().includes(q) || listing.title.ar.includes(q);
        if (!matchesTitle) return false;
      }
      return true;
    });
  }, [selectedCategory, listingType, selectedCity, search]);

  const filteredCities = useMemo(() => {
    if (!citySearch) return saudiCities;
    const q = citySearch.toLowerCase();
    return saudiCities.filter(
      (c) => c.name.en.toLowerCase().includes(q) || c.name.ar.includes(q)
    );
  }, [citySearch]);

  const formatPrice = (price: number) =>
    price === 0
      ? <span className="text-text-muted text-sm">{t("listing.contactPrice")}</span>
      : <>{price.toLocaleString()} <span className="text-[12px] font-medium text-text-muted">{t("listing.sar")}</span></>;

  const selectedCityName = selectedCity
    ? saudiCities.find((c) => c.id === selectedCity)?.name[lang]
    : t("browse.allCities");

  return (
    <div className="min-h-screen bg-page dark:bg-[#0D0D0D]">
      <Header />

      <div className="max-w-[1320px] mx-auto px-5 md:px-7 py-8 pb-24 md:pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold font-fraunces text-[#1A1A1A] dark:text-white leading-none tracking-tight">{t("browse.title")}</h1>
            <p className="mt-2 text-[14px] text-text-muted font-medium">{t("browse.subtitle")}</p>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center gap-2 rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#EBEBEB] dark:border-white/6 px-4 py-2 text-[13px] font-bold text-[#1A1A1A] dark:text-white shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {/* Search Bar (Mobile Only - Desktop has header search) */}
        <div className="md:hidden flex items-center gap-2 rounded-xl border border-[#D1D5DB] dark:border-white/8 bg-white dark:bg-[#1A1A1A] px-4 py-3 mb-6 focus-within:border-brand transition-colors">
          <Search className="h-5 w-5 text-text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("nav.search") || "Search"}
            className="flex-1 bg-transparent text-[14px] outline-none text-[#1A1A1A] dark:text-white placeholder:text-text-muted"
          />
          {search && (
            <button aria-label="Clear search" onClick={() => setSearch("")} className="text-text-muted">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-7 mt-6">
          {/* Left Sidebar (desktop) */}
          <aside className="hidden md:block w-[260px] shrink-0 sticky top-[100px] h-fit">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-[#EBEBEB] dark:border-white/6 py-2">
              <div className="px-5 py-3 border-b border-[#EBEBEB] dark:border-white/6 mb-2">
                <h3 className="font-bold text-[15px] text-[#1A1A1A] dark:text-white">Categories</h3>
              </div>
              <div className="flex flex-col px-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full text-start px-3 py-2.5 text-[14px] rounded-xl transition-colors mb-1 flex items-center gap-2.5 ${!selectedCategory ? "bg-[#FFF9F6] text-brand font-bold dark:bg-brand/10" : "text-[#4B5563] dark:text-[#9CA3AF] font-medium hover:bg-[#F9F9F9] dark:hover:bg-[#222]"
                    }`}
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800"><Search className="w-3.5 h-3.5"/></div>
                  {t("browse.allCategories")}
                </button>
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-start px-3 py-2.5 text-[14px] rounded-xl transition-colors mb-0.5 flex items-center gap-2.5 ${isActive ? "bg-[#FFF9F6] text-brand font-bold dark:bg-brand/10" : "text-[#4B5563] dark:text-[#9CA3AF] font-medium hover:bg-[#F9F9F9] dark:hover:bg-[#222]"
                        }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${isActive ? "bg-brand/20" : "bg-gray-100 dark:bg-gray-800"}`}><Icon className="w-3.5 h-3.5"/></div>
                      {t(cat.key)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-[#EBEBEB] dark:border-white/6 p-5">
              <h3 className="font-bold text-[15px] text-[#1A1A1A] dark:text-white mb-4">Location</h3>
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full flex justify-between items-center rounded-xl border border-[#D1D5DB] dark:border-white/10 bg-[#FAFAFA] dark:bg-[#222] px-4 py-3 text-[14px] text-[#1A1A1A] dark:text-white font-medium"
                >
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> {selectedCityName}</span>
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                </button>
                
                <AnimatePresence>
                {showCityDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-2 start-0 w-full z-50 max-h-64 overflow-auto rounded-xl border border-[#EBEBEB] dark:border-white/10 bg-white dark:bg-[#1A1A1A] shadow-xl"
                    >
                      <button
                        onClick={() => { setSelectedCity(null); setShowCityDropdown(false); }}
                        className={`w-full text-start px-4 py-2.5 text-[13px] font-medium ${!selectedCity ? "bg-brand/10 text-brand" : "text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]"}`}
                      >
                        {t("browse.allCities")}
                      </button>
                      {saudiCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); }}
                          className={`w-full text-start px-4 py-2.5 text-[13px] font-medium ${selectedCity === city.id ? "bg-brand/10 text-brand" : "text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F9] dark:hover:bg-[#222]"}`}
                        >
                          {city.name[lang]}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="mt-5 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-[#EBEBEB] dark:border-white/6 p-5">
              <h3 className="font-bold text-[15px] text-[#1A1A1A] dark:text-white mb-4">Listing Type</h3>
              <div className="flex flex-col gap-2">
                {(["all", "sale", "rent"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setListingType(type)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[14px] font-medium transition-colors ${listingType === type ? "bg-[#FFF9F6] dark:bg-brand/10 text-brand" : "text-[#4B5563] dark:text-[#9CA3AF] hover:bg-[#F9F9F9] dark:hover:bg-[#222]"}`}
                  >
                    {type === "all" ? t("browse.allCategories").split(" ")[0] : t(`browse.${type}`)}
                    {listingType === type && <div className="w-2 h-2 rounded-full bg-brand"/>}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filters Bottom Sheet */}
          <AnimatePresence>
            {showFilters && (
              <>
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setShowFilters(false)} />
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#111] rounded-t-[32px] border-t border-[#EBEBEB] dark:border-white/6 p-6 max-h-[85vh] overflow-y-auto md:hidden shadow-[0_-8px_32px_rgba(0,0,0,0.15)]"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-fraunces text-[20px] font-bold text-[#1A1A1A] dark:text-white leading-none">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[#1A1A1A] dark:text-white"><X className="w-4 h-4 "/></button>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-muted mb-3">Category</h4>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleCategoryChange(null)} className={`text-start px-4 py-3 rounded-xl text-[14px] font-bold ${!selectedCategory ? "bg-[#FFF9F6] text-brand" : "bg-[#F9F9F9] dark:bg-[#222] text-[#4B5563] dark:text-white"}`}>All Categories</button>
                      {categories.map((cat) => (
                        <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`text-start px-4 py-3 rounded-xl text-[14px] font-bold ${selectedCategory === cat.id ? "bg-[#FFF9F6] text-brand" : "bg-[#F9F9F9] dark:bg-[#222] text-[#4B5563] dark:text-white"}`}>{t(cat.key)}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-muted mb-3">Listing Type</h4>
                    <div className="flex gap-2">
                       {(["all", "sale", "rent"] as const).map((type) => (
                        <button key={type} onClick={() => setListingType(type)} className={`flex-1 py-3 rounded-xl text-[14px] font-bold text-center ${listingType === type ? "bg-[#FFF9F6] text-brand" : "bg-[#F9F9F9] dark:bg-[#222] text-[#4B5563] dark:text-white"}`}>
                          {type === "all" ? t("browse.allCategories").split(" ")[0] : t(`browse.${type}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => setShowFilters(false)} className="w-full bg-brand text-white font-bold h-12 rounded-full text-[15px] mt-4 shadow-md">
                    Apply Filters
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 text-[13px] font-semibold text-text-muted px-1">
              {filteredListings.length} {t("browse.results")} {search && `for "${search}"`}
            </div>

            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-text-muted" />
                </div>
                <p className="font-bold text-[18px] text-[#1A1A1A] dark:text-white">{t("browse.noResults")}</p>
                <p className="text-[14px] text-text-muted mt-1.5">{t("browse.noResultsDesc")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredListings.map((listing, i) => (
                  <motion.article
                    key={listing.id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group cursor-pointer rounded-3xl border border-black/4 bg-white dark:bg-[#1A1A1A] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-[160px] overflow-hidden">
                      <ImageFallback
                        src={listing.image}
                        alt={listing.title[lang]}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5 pointer-events-none">
                        <span className="bg-black/55 backdrop-blur text-white text-[10px] rounded-full px-2 py-1 shadow-sm">
                          {t(`listing.${listing.type}`)}
                        </span>
                      </div>
                      <button
                        className="absolute top-2.5 right-2.5 bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 z-10 transition-colors"
                        aria-label={`Save ${listing.title[lang]} to favorites`}
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3.5 flex flex-col h-[140px] justify-between">
                      <div>
                        <span 
                          className="inline-block text-[10.5px] font-bold rounded-full px-2 py-0.5 mb-1.5"
                          style={{ backgroundColor: `${listing.categoryColor || '#4A90D9'}1F`, color: listing.categoryColor || '#4A90D9' }}
                        >
                          {t(listing.category)}
                        </span>
                        <h3 className="text-[14px] font-bold text-[#1A1A1A] dark:text-white line-clamp-2 leading-[1.4] group-hover:text-brand transition-colors">
                          {listing.title[lang]}
                        </h3>
                      </div>
                      
                      <div>
                        <p className="text-[18px] font-extrabold text-brand mt-1 truncate">
                          {formatPrice(listing.price)}
                        </p>
                        <div className="flex items-center gap-2.5 mt-2 text-[11px] text-text-muted">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3"/> {saudiCities.find((c) => c.id === listing.city)?.name[lang] || listing.city}</span>
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3"/> {listing.views.toLocaleString()}</span>
                          <span>· {listing.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default Browse;
