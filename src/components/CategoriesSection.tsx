import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/categories";

const CategoriesSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Mapping specific colors based on the prompt instructions
  const categoryStyles: Record<string, { fg: string, bg: string }> = {
    jobs: { fg: '#4A90D9', bg: '#EEF4FC' },
    equipment: { fg: '#E67E22', bg: '#FEF3E9' },
    property: { fg: '#27AE60', bg: '#EAF7EE' },
    vehicles: { fg: '#E74C3C', bg: '#FDEDEC' },
    classifieds: { fg: '#9B59B6', bg: '#F5EEF8' },
    community: { fg: '#1ABC9C', bg: '#E8F8F5' },
    trading: { fg: '#64748B', bg: '#F1F5F9' },
    services: { fg: '#F39C12', bg: '#FEF9E7' },
  };

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      {/* Header */}
      <div className="px-5 flex justify-between items-end mb-4">
        <h2 className="font-fraunces text-[22px] font-bold text-[#1A1A1A] dark:text-white">
          {t("section.categories")}
        </h2>
        <button 
          onClick={() => navigate('/browse')}
          className="text-brand text-[13px] font-semibold hover:underline"
        >
          View All →
        </button>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const style = categoryStyles[cat.id] || { fg: '#64748B', bg: '#F1F5F9' }; // fallback
          
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/browse?category=${cat.id}`)}
              className="snap-start flex-shrink-0 w-[100px] h-[120px] bg-white dark:bg-[#1A1A1A] rounded-[20px] border border-[#EBEBEB] dark:border-white/6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] flex flex-col items-center gap-2.5 p-4 cursor-pointer hover:border-brand transition-all duration-200"
            >
              <div 
                className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center transition-transform hover:rotate-6 hover:scale-110"
                style={{ backgroundColor: style.bg, color: style.fg }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[12px] font-bold text-[#1A1A1A] dark:text-white text-center line-clamp-1 w-full mt-1">
                {t(cat.key)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
