import { motion } from "framer-motion";
import { Eye, MapPin, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useListings } from "@/hooks/useListings";
import { getFeaturedListings, type MockListing } from "@/lib/mockListings";
import { saudiCities } from "@/lib/cities";
import ImageFallback from "@/components/ImageFallback";
import AuthDialog from "@/components/AuthDialog";
import { useState } from "react";

const FeaturedListings = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { listings: dbListings } = useListings({ limit: 6 });
  const [showAuth, setShowAuth] = useState(false);

  const formatPrice = (listing: any) => {
    if (listing.contactForPrice || listing.price === 0) return t("listing.contactPrice");
    const price = `${listing.price.toLocaleString()} ${t("listing.sar")}`;
    if (listing.category === "property" && listing.price_period && listing.listing_type === "rent") {
      return `${price}/${listing.price_period}`;
    }
    return price;
  };

  const handleFav = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    await toggleFavorite(id);
  };

  // Use DB listings if available, else mock featured
  const mockFeatured = getFeaturedListings();
  const useDb = dbListings.length > 0;
  const items = useDb
    ? dbListings.map(l => ({
        id: l.id,
        title: l.title,
        category: l.category,
        subcategory: l.subcategory,
        price: l.price || 0,
        contactForPrice: l.contact_for_price || false,
        city: l.city,
        views: l.views || 0,
        listing_type: l.listing_type,
        image: l.images?.[0] || "",
        verified: false,
        show_phone: l.show_phone,
        show_email: l.show_email,
        // Property fields
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        area_sqm: l.area_sqm,
        furnished: l.furnished,
        price_period: l.price_period,
        tour_360_url: l.tour_360_url,
      }))
    : mockFeatured.map(l => ({
        id: l.id,
        title: l.title,
        category: l.category,
        subcategory: l.subcategory,
        price: l.price,
        contactForPrice: l.contactForPrice,
        city: l.city,
        views: l.views,
        listing_type: l.listing_type,
        image: l.images[0] || "",
        verified: l.seller.verified,
        show_phone: false,
        show_email: false,
        bedrooms: null,
        bathrooms: null,
        area_sqm: null,
        furnished: null,
        price_period: null,
        tour_360_url: null,
      }));

  const getCityName = (cityId: string) => saudiCities.find(c => c.id === cityId)?.name[lang] || cityId;

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("section.featured")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((listing, i) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => navigate(`/listing/${listing.id}`)}
              className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ImageFallback
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 start-3 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${listing.listing_type === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                    {t(`listing.${listing.listing_type}`)}
                  </span>
                  {listing.verified && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-gold/90 text-gold-foreground px-2 py-1 text-[10px] font-bold">
                      <Shield className="h-2.5 w-2.5" />{lang === "ar" ? "موثق" : "Verified"}
                    </span>
                  )}
                </div>
                <button onClick={e => handleFav(e, listing.id)}
                  className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Save ${listing.title} to favorites`}>
                  <Heart className={`h-4 w-4 ${isFavorite(listing.id) ? "fill-destructive text-destructive" : ""}`} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {listing.title}
                </h3>
                <p className="mt-2 text-lg font-bold text-primary">
                  {formatPrice(listing.price, listing.contactForPrice)}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{getCityName(listing.city)}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{listing.views.toLocaleString()}</span>
                </div>
                {/* Contact indicators */}
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs" title={lang === "ar" ? "محادثة متاحة" : "Chat available"}>💬</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </section>
  );
};

export default FeaturedListings;
