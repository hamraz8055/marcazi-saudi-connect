import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, ChevronDown, Eye, Heart, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSearchParams, useNavigate } from "react-router-dom";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useListings } from "@/hooks/useListings";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import ImageFallback from "@/components/ImageFallback";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Fallback mock data if no DB listings
const mockListings = [
  { id: "mock-1", user_id: "", title: "CAT 320 Excavator", category: "equipment", price: 285000, city: "riyadh", views: 1240, listing_type: "sale", images: ["https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-2", user_id: "", title: "Modern Villa - Al Nakheel", category: "property", price: 2500000, city: "jeddah", views: 3420, listing_type: "sale", images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-3", user_id: "", title: "Toyota Land Cruiser 2024", category: "vehicles", price: 320000, city: "dammam", views: 5610, listing_type: "sale", images: ["https://images.unsplash.com/photo-1625231334168-30dc1d1329cc?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-4", user_id: "", title: "HVAC Maintenance Service", category: "services", price: 0, city: "riyadh", views: 890, listing_type: "rent", images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: true, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-5", user_id: "", title: "Steel Rebar - Bulk Supply", category: "trading", price: 4500, city: "jubail", views: 2100, listing_type: "sale", images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-6", user_id: "", title: "Electrical Engineer Needed", category: "jobs", price: 15000, city: "khobar", views: 1750, listing_type: "rent", images: ["https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-7", user_id: "", title: "Luxury Apartment - Olaya", category: "property", price: 850000, city: "riyadh", views: 4200, listing_type: "sale", images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-8", user_id: "", title: "Generator 500KVA", category: "equipment", price: 75000, city: "jeddah", views: 980, listing_type: "rent", images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-9", user_id: "", title: "Cement Bulk - 1000 Bags", category: "trading", price: 32000, city: "dammam", views: 1560, listing_type: "sale", images: ["https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-10", user_id: "", title: "Nissan Patrol 2023", category: "vehicles", price: 245000, city: "tabuk", views: 3890, listing_type: "sale", images: ["https://images.unsplash.com/photo-1606611013016-969c19ba92e8?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-11", user_id: "", title: "Office Space for Rent", category: "property", price: 5000, city: "riyadh", views: 2310, listing_type: "rent", images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: false, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-12", user_id: "", title: "Plumber Available", category: "services", price: 0, city: "makkah", views: 670, listing_type: "rent", images: ["https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop"], description: null, subcategory: null, contact_for_price: true, phone: null, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const Browse = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const { isFavorite, toggleFavorite } = useFavorites();

  const { listings: dbListings, loading } = useListings({
    category: selectedCategory,
    city: selectedCity,
    search: search || undefined,
    listingType,
    sortBy: sortBy === "price_asc" ? "price_asc" : sortBy === "price_desc" ? "price_desc" : sortBy === "views" ? "views" : undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    limit: 100,
  });

  // Use DB listings or fallback to mock
  const allListings = dbListings.length > 0 ? dbListings : mockListings;

  // Client-side filter for mock data
  const filteredListings = useMemo(() => {
    if (dbListings.length > 0) return dbListings; // Already filtered server-side
    return allListings.filter(l => {
      if (selectedCategory && l.category !== selectedCategory) return false;
      if (listingType !== "all" && l.listing_type !== listingType) return false;
      if (selectedCity && l.city !== selectedCity) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!l.title.toLowerCase().includes(q)) return false;
      }
      if (priceMin && (l.price || 0) < Number(priceMin)) return false;
      if (priceMax && (l.price || 0) > Number(priceMax)) return false;
      return true;
    });
  }, [dbListings, allListings, selectedCategory, listingType, selectedCity, search, priceMin, priceMax]);

  const displayedListings = filteredListings.slice(0, displayCount);

  useEffect(() => {
    const cat = searchParams.get("category");
    const q = searchParams.get("q");
    if (cat && categories.some(c => c.id === cat)) setSelectedCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  const handleCategoryChange = (catId: string | null) => {
    setSelectedCategory(catId);
    const params: Record<string, string> = {};
    if (catId) params.category = catId;
    if (search) params.q = search;
    setSearchParams(params);
    setShowFilters(false);
  };

  const handleFav = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    await toggleFavorite(listingId);
  };

  const filteredCities = useMemo(() => {
    if (!citySearch) return saudiCities;
    const q = citySearch.toLowerCase();
    return saudiCities.filter(c => c.name.en.toLowerCase().includes(q) || c.name.ar.includes(q));
  }, [citySearch]);

  const formatPrice = (price: number | null, contactForPrice: boolean | null) =>
    contactForPrice ? t("listing.contactPrice") : price ? `${price.toLocaleString()} ${t("listing.sar")}` : t("listing.contactPrice");

  const selectedCityName = selectedCity
    ? saudiCities.find(c => c.id === selectedCity)?.name[lang]
    : t("browse.allCities");

  const sortOptions = [
    { value: "newest", label: lang === "ar" ? "الأحدث" : "Newest" },
    { value: "price_asc", label: lang === "ar" ? "السعر: من الأقل" : "Price: Low to High" },
    { value: "price_desc", label: lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low" },
    { value: "views", label: lang === "ar" ? "الأكثر مشاهدة" : "Most Viewed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="browse.title" descriptionKey="browse.subtitle" />
      <Header />
      <div className="container py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("browse.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("browse.subtitle")}</p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { const params: Record<string, string> = {}; if (search) params.q = search; if (selectedCategory) params.category = selectedCategory; setSearchParams(params); } }}
              placeholder={t("nav.search")} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" aria-label="Search listings" />
            {search && (
              <button aria-label="Clear search" onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Type toggle */}
            <div className="relative inline-flex items-center rounded-full bg-muted p-1">
              <motion.div className="absolute h-[calc(100%-8px)] rounded-full bg-primary" layout transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ width: "33.33%", left: listingType === "all" ? "4px" : listingType === "sale" ? "33.33%" : "66.66%" }} />
              {(["all", "sale", "rent"] as const).map(type => (
                <button key={type} onClick={() => setListingType(type)}
                  className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${listingType === type ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {type === "all" ? t("browse.allCategories").split(" ")[0] : t(`browse.${type}`)}
                </button>
              ))}
            </div>

            {/* City selector */}
            <div className="relative">
              <button onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm" aria-label="Filter by city">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{selectedCityName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {showCityDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-2 start-0 z-50 w-72 max-h-80 overflow-auto rounded-xl border border-border bg-card shadow-elevated">
                      <div className="sticky top-0 bg-card p-2 border-b border-border">
                        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
                            placeholder={t("browse.searchCity")} className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" aria-label="Search cities" />
                        </div>
                      </div>
                      <div className="p-1">
                        <button onClick={() => { setSelectedCity(null); setShowCityDropdown(false); }}
                          className={`w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${!selectedCity ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}>
                          {t("browse.allCities")}
                        </button>
                        {regions.map(region => {
                          const cities = getCitiesByRegion(region).filter(c => !citySearch || c.name.en.toLowerCase().includes(citySearch.toLowerCase()) || c.name.ar.includes(citySearch));
                          if (cities.length === 0) return null;
                          return (
                            <div key={region}>
                              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t(region)}</div>
                              {cities.map(city => (
                                <button key={city.id} onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); setCitySearch(""); }}
                                  className={`w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${selectedCity === city.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}>
                                  {city.name[lang]}
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm" aria-label="Sort listings">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline text-foreground">{sortOptions.find(s => s.value === sortBy)?.label}</span>
              </button>
              <AnimatePresence>
                {showSort && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-2 end-0 z-50 w-48 rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
                      {sortOptions.map(opt => (
                        <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                          className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${sortBy === opt.value ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm md:hidden" aria-label="Toggle filters">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={`shrink-0 ${showFilters ? "block" : "hidden"} md:block w-full md:w-56`}>
            <div className="rounded-xl border border-border bg-card p-3 space-y-1">
              <button onClick={() => handleCategoryChange(null)}
                className={`w-full text-start px-3 py-2.5 text-sm rounded-lg transition-colors mb-1 ${!selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}>
                {t("browse.allCategories")}
              </button>
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full flex items-center gap-2.5 text-start px-3 py-2.5 text-sm rounded-lg transition-colors ${selectedCategory === cat.id ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {t(cat.key)}
                  </button>
                );
              })}
            </div>

            {/* Price Range Filter */}
            <div className="mt-4 rounded-xl border border-border bg-card p-3">
              <p className="text-sm font-semibold text-foreground mb-2">{lang === "ar" ? "نطاق السعر" : "Price Range"}</p>
              <div className="flex items-center gap-2">
                <input type="number" placeholder={lang === "ar" ? "من" : "Min"} value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary" />
                <span className="text-muted-foreground text-xs">–</span>
                <input type="number" placeholder={lang === "ar" ? "إلى" : "Max"} value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary" />
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredListings.length} {t("browse.results")}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
              </div>
            ) : displayedListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="font-semibold text-foreground">{t("browse.noResults")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("browse.noResultsDesc")}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedListings.map((listing, i) => (
                    <motion.article key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <ImageFallback src={listing.images?.[0]} alt={listing.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute top-3 start-3">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${listing.listing_type === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                            {t(`listing.${listing.listing_type}`)}
                          </span>
                        </div>
                        <button onClick={e => handleFav(e, listing.id)}
                          className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Save ${listing.title} to favorites`}>
                          <Heart className={`h-4 w-4 ${isFavorite(listing.id) ? "fill-destructive text-destructive" : ""}`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
                        <p className="mt-2 text-lg font-bold text-primary">{formatPrice(listing.price, listing.contact_for_price)}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {(listing.views || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
                {displayCount < filteredListings.length && (
                  <div className="mt-8 text-center">
                    <Button variant="outline" onClick={() => setDisplayCount(c => c + 12)}>
                      {lang === "ar" ? "تحميل المزيد" : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <BottomTabBar />
    </div>
  );
};

export default Browse;
