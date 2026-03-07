import { motion } from "framer-motion";
import { Eye, MapPin, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ImageFallback from "@/components/ImageFallback";

const listings = [
  {
    id: 1,
    title: { en: "CAT 320 Excavator", ar: "حفارة كاتربيلر 320" },
    category: "cat.equipment",
    price: 285000,
    city: { en: "Riyadh", ar: "الرياض" },
    views: 1240,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: { en: "Modern Villa - Al Nakheel", ar: "فيلا حديثة - النخيل" },
    category: "cat.property",
    price: 2500000,
    city: { en: "Jeddah", ar: "جدة" },
    views: 3420,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: { en: "Toyota Land Cruiser 2024", ar: "تويوتا لاند كروزر 2024" },
    category: "cat.vehicles",
    price: 320000,
    city: { en: "Dammam", ar: "الدمام" },
    views: 5610,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1625231334168-30dc1d1329cc?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: { en: "HVAC Maintenance Service", ar: "خدمة صيانة التكييف" },
    category: "cat.services",
    price: 0,
    city: { en: "Riyadh", ar: "الرياض" },
    views: 890,
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: { en: "Steel Rebar - Bulk Supply", ar: "حديد تسليح - توريد بالجملة" },
    category: "cat.trading",
    price: 4500,
    city: { en: "Jubail", ar: "الجبيل" },
    views: 2100,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: { en: "Electrical Engineer Needed", ar: "مطلوب مهندس كهربائي" },
    category: "cat.jobs",
    price: 15000,
    city: { en: "Khobar", ar: "الخبر" },
    views: 1750,
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
  },
];

const FeaturedListings = () => {
  const { t, lang } = useI18n();

  const formatPrice = (price: number) =>
    price === 0
      ? t("listing.contactPrice")
      : `${price.toLocaleString()} ${t("listing.sar")}`;

  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("section.featured")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing, i) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
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
                  <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${listing.type === "sale"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
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
                <p className="mt-2 text-lg font-bold text-primary">
                  {formatPrice(listing.price)}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {listing.city[lang]}
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
      </div>
    </section>
  );
};

export default FeaturedListings;
