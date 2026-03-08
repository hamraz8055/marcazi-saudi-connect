import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

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
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground">{t("cta.title")}</h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">{t("cta.desc")}</p>
            <Button
              size="lg"
              className="mt-8 rounded-xl bg-card text-primary hover:bg-card/90 font-semibold"
              onClick={() => navigate("/post")}
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
