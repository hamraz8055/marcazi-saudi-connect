import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, ChevronDown, ChevronRight, Eye, Heart, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import JobListingCard from "@/components/JobListingCard";
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
import { Badge } from "@/components/ui/badge";
import { getRegularListings } from "@/lib/mockListings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const mockListings = getRegularListings().map(l => ({
  id: l.id, user_id: "", title: l.title, category: l.category, price: l.price, city: l.city,
  views: l.views, listing_type: l.listing_type, images: l.images, description: l.description,
  subcategory: l.subcategory, contact_for_price: l.contactForPrice, phone: l.phone,
  status: "active" as const, created_at: l.postedAt, updated_at: l.postedAt,
}));

const Browse = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(searchParams.get("subcategory"));
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
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

  const allListings = dbListings.length > 0 ? dbListings : mockListings;

  const filteredListings = useMemo(() => {
    if (dbListings.length > 0) {
      if (selectedSubcategory) return dbListings.filter(l => l.subcategory === selectedSubcategory);
      return dbListings;
    }
    return allListings.filter(l => {
      if (selectedCategory && l.category !== selectedCategory) return false;
      if (selectedSubcategory && l.subcategory !== selectedSubcategory) return false;
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
  }, [dbListings, allListings, selectedCategory, selectedSubcategory, listingType, selectedCity, search, priceMin, priceMax]);

  const displayedListings = filteredListings.slice(0, displayCount);

  useEffect(() => {
    const cat = searchParams.get("category");
    const sub = searchParams.get("subcategory");
    const q = searchParams.get("q");
    if (cat && categories.some(c => c.id === cat)) setSelectedCategory(cat);
    if (sub) setSelectedSubcategory(sub);
    if (q) setSearch(q);
  }, [searchParams]);

  const updateParams = (catId: string | null, subId: string | null) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(subId);
    const params: Record<string, string> = {};
    if (catId) params.category = catId;
    if (subId) params.subcategory = subId;
    if (search) params.q = search;
    setSearchParams(params);
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

  const selectedCat = selectedCategory ? categories.find(c => c.id === selectedCategory) : null;
  const selectedSub = selectedCat?.subcategories.find(s => s.id === selectedSubcategory);

  // Sidebar content (shared between desktop and mobile drawer)
  const SidebarContent = () => (
    <div className="rounded-xl border border-border bg-card p-3 space-y-1">
      <button onClick={() => updateParams(null, null)}
        className={`w-full text-start px-3 py-2.5 text-sm rounded-lg transition-colors mb-1 ${!selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"}`}>
        {t("browse.allCategories")}
      </button>
      <Accordion type="single" collapsible value={selectedCategory || undefined} onValueChange={(val) => {
        if (val) updateParams(val, null);
      }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <AccordionItem key={cat.id} value={cat.id} className="border-none">
              <AccordionTrigger className={`px-3 py-2.5 text-sm rounded-lg hover:no-underline hover:bg-muted transition-colors ${selectedCategory === cat.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"}`}>
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  {t(cat.key)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-0">
                <div className="ms-6 space-y-0.5">
                  <button
                    onClick={() => updateParams(cat.id, null)}
                    className={`w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${selectedCategory === cat.id && !selectedSubcategory ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    {lang === "ar" ? `الكل في ${t(cat.key)}` : `All in ${t(cat.key)}`}
                  </button>
                  {cat.subcategories.map(sub => (
                    <button key={sub.id}
                      onClick={() => updateParams(cat.id, sub.id)}
                      className={`w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${selectedSubcategory === sub.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                      {t(`subcategory.${sub.id}`) !== `subcategory.${sub.id}` ? t(`subcategory.${sub.id}`) : sub.name}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="browse.title" descriptionKey="browse.subtitle" />
      <Header />
      <div className="container py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("browse.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("browse.subtitle")}</p>
        </div>

        {/* Active filter chip */}
        {(selectedCat || selectedSub) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive/10"
              onClick={() => updateParams(null, null)}>
              {selectedCat && <selectedCat.icon className="h-3.5 w-3.5" />}
              <span>
                {lang === "ar" ? "تصفح: " : "Browsing: "}
                {selectedCat && t(selectedCat.key)}
                {selectedSub && ` › ${t(`subcategory.${selectedSub.id}`) !== `subcategory.${selectedSub.id}` ? t(`subcategory.${selectedSub.id}`) : selectedSub.name}`}
              </span>
              <X className="h-3.5 w-3.5" />
            </Badge>
          </div>
        )}

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

            {/* Mobile filter drawer trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm md:hidden" aria-label="Toggle filters">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4 overflow-y-auto">
                <h3 className="font-semibold text-foreground mb-4">{lang === "ar" ? "الفلاتر" : "Filters"}</h3>
                <SidebarContent />
                {/* Price Range */}
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
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="shrink-0 hidden md:block w-56">
            <SidebarContent />
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
