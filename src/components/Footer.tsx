import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card py-8 pb-24 md:pb-8">
      <div className="container flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            M
          </div>
          <span className="text-lg font-bold text-foreground">Marcazi</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Marcazi. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
