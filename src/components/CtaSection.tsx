import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  const { t } = useI18n();

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/50 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground">{t("cta.title")}</h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">{t("cta.desc")}</p>
            <Button
              size="lg"
              className="mt-8 rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              {t("cta.start")}
              <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
