import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/categories";

const CategoriesSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <section className="py-6 bg-muted/40 border-b border-border">
      <div className="container">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-7 md:gap-4 md:overflow-visible md:pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/browse?category=${cat.id}`)}
                className="group flex flex-col items-center gap-2 shrink-0 min-w-[72px] px-2 py-3 rounded-xl transition-colors hover:bg-primary/5"
                aria-label={`Browse ${t(cat.key)} category`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{t(cat.key)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
