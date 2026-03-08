import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import ImageFallback from "@/components/ImageFallback";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, LogIn, Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { saudiCities } from "@/lib/cities";
import type { Listing } from "@/hooks/useListings";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      const { data: favs } = await supabase.from("favorites").select("listing_id").eq("user_id", user.id);
      if (!favs?.length) { setListings([]); setLoading(false); return; }
      const ids = favs.map(f => f.listing_id);
      const { data } = await supabase.from("listings").select("*").in("id", ids);
      setListings((data as Listing[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const removeFav = async (listingId: string) => {
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);
    setListings(prev => prev.filter(l => l.id !== listingId));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.favorites" />
        <Header />
        <div className="container py-10 pb-24">
          <h1 className="text-2xl font-bold text-foreground mb-6">{lang === "ar" ? "المفضلة" : "Saved Listings"}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        </div>
        <BottomTabBar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.favorites" />
        <Header />
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-xl font-bold">{lang === "ar" ? "سجل الدخول لحفظ الإعلانات" : "Sign in to save listings"}</h2>
          <Button onClick={() => setShowAuth(true)} className="gap-2"><LogIn className="h-4 w-4" />{lang === "ar" ? "تسجيل الدخول" : "Sign In"}</Button>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.favorites" />
      <Header />
      <div className="container py-10 pb-24 md:pb-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">{lang === "ar" ? "المفضلة" : "Saved Listings"}</h1>
        {listings.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center gap-4">
            <Heart className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-semibold">{lang === "ar" ? "لا توجد إعلانات محفوظة" : "No saved listings yet"}</p>
            <Button variant="outline" onClick={() => navigate("/browse")} className="gap-2">
              <Search className="h-4 w-4" />{lang === "ar" ? "تصفح الإعلانات" : "Browse Listings"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing, i) => (
              <motion.article key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all"
                onClick={() => navigate(`/listing/${listing.id}`)}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageFallback src={listing.images?.[0]} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
                  <button onClick={(e) => { e.stopPropagation(); removeFav(listing.id); }}
                    className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-destructive" aria-label="Remove from favorites">
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {listing.contact_for_price ? t("listing.contactPrice") : `${Number(listing.price).toLocaleString()} ${t("listing.sar")}`}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Favorites;
