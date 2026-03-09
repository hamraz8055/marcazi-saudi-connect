import { motion } from "framer-motion";
import { MapPin, Heart, Bed, Bath, Maximize, RotateCw, Clock, Armchair, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { saudiCities } from "@/lib/cities";
import { isResidential, isCommercial, isLand } from "@/lib/propertyData";
import ImageFallback from "@/components/ImageFallback";

interface PropertyCardProps {
  listing: any;
  index?: number;
  isFavorite?: boolean;
  onFavorite?: (e: React.MouseEvent) => void;
}

const PropertyListingCard = ({ listing, index = 0, isFavorite = false, onFavorite }: PropertyCardProps) => {
  const { lang } = useI18n();
  const navigate = useNavigate();

  const cityName = saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city;
  const subcategory = listing.subcategory || "";
  const daysAgo = Math.floor((Date.now() - new Date(listing.created_at).getTime()) / 86400000);
  const postedLabel = daysAgo === 0 ? (lang === "ar" ? "اليوم" : "Today") :
    daysAgo === 1 ? (lang === "ar" ? "أمس" : "Yesterday") : `${daysAgo}${lang === "ar" ? " أيام" : "d ago"}`;

  const showBedsBaths = isResidential(subcategory) && !["rent-room", "rent-staff-accom", "sale-new-project", "sale-off-plan"].includes(subcategory);
  const isCommercialType = isCommercial(subcategory);
  const isLandType = isLand(subcategory);
  const has360Tour = !!listing.tour_360_url;

  // Format price with period
  const formatPrice = () => {
    if (listing.contact_for_price) {
      return lang === "ar" ? "اتصل للسعر" : "Contact for Price";
    }
    const price = listing.price ? listing.price.toLocaleString() : "0";
    if (listing.price_period) {
      const periodLabels: Record<string, { en: string; ar: string }> = {
        yearly: { en: "/year", ar: "/سنوي" },
        monthly: { en: "/month", ar: "/شهري" },
        weekly: { en: "/week", ar: "/أسبوعي" },
        daily: { en: "/day", ar: "/يومي" },
        per_sqm: { en: "/sqm/year", ar: "/م²/سنة" },
      };
      const periodLabel = periodLabels[listing.price_period] || { en: "", ar: "" };
      return `${price} SAR${periodLabel[lang]}`;
    }
    return `${price} SAR`;
  };

  // Furnished label
  const getFurnishedLabel = () => {
    if (!listing.furnished) return null;
    const labels: Record<string, { en: string; ar: string }> = {
      furnished: { en: "Furnished", ar: "مفروش" },
      semi: { en: "Semi-Furnished", ar: "شبه مفروش" },
      unfurnished: { en: "Unfurnished", ar: "غير مفروش" },
    };
    return labels[listing.furnished]?.[lang] || null;
  };

  // Land type label
  const getLandTypeLabel = () => {
    if (!listing.land_type) return null;
    const labels: Record<string, { en: string; ar: string }> = {
      residential: { en: "Residential Zone", ar: "منطقة سكنية" },
      commercial: { en: "Commercial Zone", ar: "منطقة تجارية" },
      agricultural: { en: "Agricultural", ar: "زراعي" },
      industrial: { en: "Industrial", ar: "صناعي" },
      mixed: { en: "Mixed Use", ar: "متعدد الاستخدام" },
    };
    return labels[listing.land_type]?.[lang] || null;
  };

  // Fitout label
  const getFitoutLabel = () => {
    if (!listing.fitout_status) return null;
    const labels: Record<string, { en: string; ar: string }> = {
      shell: { en: "Shell & Core", ar: "هيكل فقط" },
      fitted: { en: "Fitted Out", ar: "مجهز" },
      partial: { en: "Partially Fitted", ar: "مجهز جزئياً" },
    };
    return labels[listing.fitout_status]?.[lang] || null;
  };

  const coverImage = listing.images?.[0];
  const location = listing.district ? `${listing.district}, ${cityName}` : cityName;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {coverImage ? (
          <ImageFallback
            src={coverImage}
            alt={listing.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {has360Tour && (
            <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-lg text-xs font-medium">
              <RotateCw className="h-3 w-3" />
              360°
            </div>
          )}
          {onFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(e); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Save"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
            </button>
          )}
        </div>

        {/* Poster badge */}
        {listing.poster_type && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-lg text-[10px] font-medium capitalize">
              {listing.poster_type === 'agent' ? (lang === "ar" ? "وكيل" : "Agent") : 
               listing.poster_type === 'developer' ? (lang === "ar" ? "مطور" : "Developer") :
               (lang === "ar" ? "مالك" : "Owner")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-primary">
          {formatPrice()}
        </p>

        {/* Property stats */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          {/* Residential stats */}
          {showBedsBaths && (
            <>
              {listing.bedrooms !== null && listing.bedrooms !== undefined && (
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}
                </span>
              )}
              {listing.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {listing.bathrooms}
                </span>
              )}
            </>
          )}

          {/* Area */}
          {listing.area_sqm && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {listing.area_sqm} sqm
            </span>
          )}

          {/* Furnished for residential */}
          {showBedsBaths && getFurnishedLabel() && (
            <span className="flex items-center gap-1">
              <Armchair className="h-4 w-4" />
              {getFurnishedLabel()}
            </span>
          )}

          {/* Fitout for commercial */}
          {isCommercialType && getFitoutLabel() && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {getFitoutLabel()}
            </span>
          )}

          {/* Land type */}
          {isLandType && getLandTypeLabel() && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">
              {getLandTypeLabel()}
            </span>
          )}
        </div>

        {/* Location & time */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {location}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            {postedLabel}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default PropertyListingCard;