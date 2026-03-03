import { motion } from "framer-motion";
import { Truck, Briefcase, Home, Car, TrendingUp, Wrench, Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const categories = [
  { icon: Truck, key: "cat.equipment", count: "12,400+", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { icon: Briefcase, key: "cat.jobs", count: "8,200+", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { icon: Home, key: "cat.property", count: "15,800+", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { icon: Car, key: "cat.vehicles", count: "9,600+", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { icon: TrendingUp, key: "cat.trading", count: "5,100+", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { icon: Wrench, key: "cat.services", count: "7,300+", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { icon: Megaphone, key: "cat.classifieds", count: "3,900+", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
];

const CategoriesSection = () => {
  const { t } = useI18n();

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
                key={cat.key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-foreground">{t(cat.key)}</span>
                <span className="text-xs text-muted-foreground">{cat.count}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
