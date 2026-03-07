import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/categories";

const categoryCounts: Record<string, string> = {
  equipment: "12,400+",
  jobs: "8,200+",
  property: "15,800+",
  vehicles: "9,600+",
  trading: "5,100+",
  services: "7,300+",
  classifieds: "3,900+",
};

const CategoriesSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("section.categories")}</h2>
          <p className="mt-2 text-muted-foreground">{t("section.categoriesDesc")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/browse?category=${cat.id}`)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300"
                aria-label={`Browse ${t(cat.key)} category`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-foreground">{t(cat.key)}</span>
                <span className="text-xs text-muted-foreground">{categoryCounts[cat.id] || "—"}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
