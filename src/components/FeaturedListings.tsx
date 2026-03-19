import { motion } from "framer-motion";
import { Eye, MapPin, Heart, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ImageFallback from "@/components/ImageFallback";

const listings = [
  {
    id: 1,
    title: { en: "CAT 320 Excavator", ar: "حفارة كاتربيلر 320" },
    category: "cat.equipment",
    categoryColor: "#E67E22",
    price: 285000,
    city: { en: "Riyadh", ar: "الرياض" },
    views: 1240,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1580901368919-7738efb0f228?w=400&h=300&fit=crop",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    title: { en: "Modern Villa - Al Nakheel", ar: "فيلا حديثة - النخيل" },
    category: "cat.property",
    categoryColor: "#27AE60",
    price: 2500000,
    city: { en: "Jeddah", ar: "جدة" },
    views: 3420,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    timeAgo: "5h ago",
  },
  {
    id: 3,
    title: { en: "Toyota Land Cruiser 2024", ar: "تويوتا لاند كروزر 2024" },
    category: "cat.vehicles",
    categoryColor: "#E74C3C",
    price: 320000,
    city: { en: "Dammam", ar: "الدمام" },
    views: 5610,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1625231334168-30dc1d1329cc?w=400&h=300&fit=crop",
    timeAgo: "1d ago",
  },
  {
    id: 4,
    title: { en: "HVAC Maintenance Service", ar: "خدمة صيانة التكييف" },
    category: "cat.services",
    categoryColor: "#F39C12",
    price: 0,
    city: { en: "Riyadh", ar: "الرياض" },
    views: 890,
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
    timeAgo: "2d ago",
  },
  {
    id: 5,
    title: { en: "Steel Rebar - Bulk Supply", ar: "حديد تسليح - توريد بالجملة" },
    category: "cat.trading",
    categoryColor: "#64748B",
    price: 4500,
    city: { en: "Jubail", ar: "الجبيل" },
    views: 2100,
    type: "sale" as const,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
    timeAgo: "3d ago",
  },
  {
    id: 6,
    title: { en: "Electrical Engineer Needed", ar: "مطلوب مهندس كهربائي" },
    category: "cat.jobs",
    categoryColor: "#4A90D9",
    price: 15000,
    city: { en: "Khobar", ar: "الخبر" },
    views: 1750,
    type: "rent" as const,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    timeAgo: "4d ago",
  },
];

const FeaturedListings = () => {
  const { t, lang } = useI18n();

  const formatPrice = (price: number) =>
    price === 0
      ? <span className="text-text-muted text-sm">{t("listing.contactPrice")}</span>
      : <>{price.toLocaleString()} <span className="text-[12px] font-medium text-text-muted">{t("listing.sar")}</span></>;

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      {/* Header */}
      <div className="px-5 mb-5 flex justify-between items-end">
        <div>
          <p className="text-[10px] tracking-[2.5px] text-text-muted uppercase mb-1">
            HANDPICKED FOR YOU
          </p>
          <h2 className="font-fraunces text-[22px] font-bold text-[#1A1A1A] dark:text-white leading-none">
            {t("section.featured")}
          </h2>
        </div>
        <button className="text-brand text-[13px] font-semibold hover:underline">
          See All →
        </button>
      </div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-3.5 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
        {listings.map((listing, i) => (
          <motion.article
            key={listing.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
            className="snap-start flex-shrink-0 w-[220px] bg-white dark:bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/4 cursor-pointer"
          >
            {/* Photo & Badges */}
            <div className="relative h-[160px] overflow-hidden group">
              <ImageFallback
                src={listing.image}
                alt={listing.title[lang]}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 flex gap-1.5 pointer-events-none">
                <span className="bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Zap className="w-3 h-3 fill-white" /> Featured
                </span>
                <span className="bg-black/55 backdrop-blur text-white text-[10px] rounded-full px-2 py-1 shadow-sm">
                  {t(`listing.${listing.type}`)}
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute top-2.5 right-2.5 bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 z-10"
                aria-label={`Save ${listing.title[lang]} to favorites`}
                onClick={(e) => { e.stopPropagation(); }} /* Keep existing save logic */
              >
                <Heart className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-3.5 flex flex-col h-[140px] justify-between">
              <div>
                <span 
                  className="inline-block text-[10.5px] font-bold rounded-full px-2 py-0.5 mb-1.5"
                  style={{ backgroundColor: `${listing.categoryColor}1F`, color: listing.categoryColor }}
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
                <div className="flex gap-2.5 mt-2 text-[11px] text-text-muted items-center">
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3"/> {listing.city[lang]}</span>
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3"/> {listing.views.toLocaleString()}</span>
                  <span>· {listing.timeAgo}</span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
