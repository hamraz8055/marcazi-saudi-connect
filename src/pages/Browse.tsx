import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, ChevronDown, Eye, Heart, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSearchParams } from "react-router-dom";
import { categories } from "@/lib/categories";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import ImageFallback from "@/components/ImageFallback";

const allListings = [
  { id: 1, title: { en: "CAT 320 Excavator", ar: "حفارة كاتربيلر 320" }, category: "equipment", price: 285000, city: "riyadh", views: 1240, type: "sale" as const, image: "https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=400&h=300&fit=crop" },
  { id: 2, title: { en: "Modern Villa - Al Nakheel", ar: "فيلا حديثة - النخيل" }, category: "property", price: 2500000, city: "jeddah", views: 3420, type: "sale" as const, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop" },
  { id: 3, title: { en: "Toyota Land Cruiser 2024", ar: "تويوتا لاند كروزر 2024" }, category: "vehicles", price: 320000, city: "dammam", views: 5610, type: "sale" as const, image: "https://images.unsplash.com/photo-1625231334168-30dc1d1329cc?w=400&h=300&fit=crop" },
  { id: 4, title: { en: "HVAC Maintenance Service", ar: "خدمة صيانة التكييف" }, category: "services", price: 0, city: "riyadh", views: 890, type: "rent" as const, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop" },
  { id: 5, title: { en: "Steel Rebar - Bulk Supply", ar: "حديد تسليح - توريد بالجملة" }, category: "trading", price: 4500, city: "jubail", views: 2100, type: "sale" as const, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop" },
  { id: 6, title: { en: "Electrical Engineer Needed", ar: "مطلوب مهندس كهربائي" }, category: "jobs", price: 15000, city: "khobar", views: 1750, type: "rent" as const, image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop" },
  { id: 7, title: { en: "Luxury Apartment - Olaya", ar: "شقة فاخرة - العليا" }, category: "property", price: 850000, city: "riyadh", views: 4200, type: "sale" as const, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop" },
  { id: 8, title: { en: "Generator 500KVA", ar: "مولد 500 كيلو فولت" }, category: "equipment", price: 75000, city: "jeddah", views: 980, type: "rent" as const, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop" },
  { id: 9, title: { en: "Cement Bulk - 1000 Bags", ar: "أسمنت بالجملة - 1000 كيس" }, category: "trading", price: 32000, city: "dammam", views: 1560, type: "sale" as const, image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=300&fit=crop" },
  { id: 10, title: { en: "Nissan Patrol 2023", ar: "نيسان باترول 2023" }, category: "vehicles", price: 245000, city: "tabuk", views: 3890, type: "sale" as const, image: "https://images.unsplash.com/photo-1606611013016-969c19ba92e8?w=400&h=300&fit=crop" },
  { id: 11, title: { en: "Office Space for Rent", ar: "مكتب للإيجار" }, category: "property", price: 5000, city: "riyadh", views: 2310, type: "rent" as const, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
  { id: 12, title: { en: "Plumber Available", ar: "سباك متاح" }, category: "services", price: 0, city: "makkah", views: 670, type: "rent" as const, image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop" },
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
      if (selectedCategory && listing.category !== selectedCategory) return false;
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
    price === 0 ? t("listing.contactPrice") : `${price.toLocaleString()} ${t("listing.sar")}`;

  const selectedCityName = selectedCity
    ? saudiCities.find((c) => c.id === selectedCity)?.name[lang]
    : t("browse.allCities");

  return (
    <div className="min-h-screen bg-background">
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
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("nav.search")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search listings"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative inline-flex items-center rounded-full bg-muted p-1">
              <motion.div
                className="absolute h-[calc(100%-8px)] rounded-full bg-primary"
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  width: "33.33%",
                  left: listingType === "all" ? "4px" : listingType === "sale" ? "33.33%" : "66.66%",
                }}
              />
              {(["all", "sale", "rent"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setListingType(type)}
                  className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    listingType === type ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {type === "all" ? t("browse.allCategories").split(" ")[0] : t(`browse.${type}`)}
                </button>
              ))}
            </div>

            {/* City selector */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                aria-label="Filter by city"
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{selectedCityName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {showCityDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-2 start-0 z-50 w-72 max-h-80 overflow-auto rounded-xl border border-border bg-card shadow-elevated"
                    >
                      <div className="sticky top-0 bg-card p-2 border-b border-border">
                        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            placeholder={t("browse.searchCity")}
                            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                            aria-label="Search cities"
                          />
                        </div>
                      </div>

                      <div className="p-1">
                        <button
                          onClick={() => { setSelectedCity(null); setShowCityDropdown(false); }}
                          className={`w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${
                            !selectedCity ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {t("browse.allCities")}
                        </button>

                        {regions.map((region) => {
                          const cities = getCitiesByRegion(region).filter((c) =>
                            !citySearch ||
                            c.name.en.toLowerCase().includes(citySearch.toLowerCase()) ||
                            c.name.ar.includes(citySearch)
                          );
                          if (cities.length === 0) return null;
                          return (
                            <div key={region}>
                              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {t(region)}
                              </div>
                              {cities.map((city) => (
                                <button
                                  key={city.id}
                                  onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); setCitySearch(""); }}
                                  className={`w-full text-start px-3 py-2 text-sm rounded-lg transition-colors ${
                                    selectedCity === city.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                                  }`}
                                >
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm md:hidden"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={`shrink-0 ${showFilters ? "block" : "hidden"} md:block w-full md:w-56`}>
            <div className="rounded-xl border border-border bg-card p-3">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`w-full text-start px-3 py-2.5 text-sm rounded-lg transition-colors mb-1 ${
                  !selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
                }`}
              >
                {t("browse.allCategories")}
              </button>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full flex items-center gap-2.5 text-start px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      selectedCategory === cat.id ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {t(cat.key)}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredListings.length} {t("browse.results")}
            </div>

            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="font-semibold text-foreground">{t("browse.noResults")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("browse.noResultsDesc")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing, i) => (
                  <motion.article
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageFallback
                        src={listing.image}
                        alt={listing.title[lang]}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 start-3">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          listing.type === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                        }`}>
                          {t(`listing.${listing.type}`)}
                        </span>
                      </div>
                      <button
                        className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Save ${listing.title[lang]} to favorites`}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.title[lang]}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-primary">{formatPrice(listing.price)}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {saudiCities.find((c) => c.id === listing.city)?.name[lang]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {listing.views.toLocaleString()}
                        </span>
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
