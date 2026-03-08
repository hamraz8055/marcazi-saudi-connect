import { useI18n } from "@/lib/i18n";
import { PenSquare, Search, MessageCircle } from "lucide-react";

const steps = [
  { icon: PenSquare, key: "howItWorks.post", descKey: "howItWorks.postDesc" },
  { icon: Search, key: "howItWorks.browse", descKey: "howItWorks.browseDesc" },
  { icon: MessageCircle, key: "howItWorks.connect", descKey: "howItWorks.connectDesc" },
];

const HowItWorks = () => {
  const { t } = useI18n();

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{t("howItWorks.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t(step.key)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
