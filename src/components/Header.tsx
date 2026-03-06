import { Search, Globe, Moon, Sun, Camera, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { t, toggleLang, lang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl safe-top">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            M
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Marcazi</span>
        </button>

        {/* City Selector - hidden on mobile */}
        <button className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          {t("nav.allCities")}
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Search Bar - hidden on mobile */}
        <div
          onClick={() => navigate("/browse")}
          className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 cursor-pointer"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm text-muted-foreground">{t("nav.search")}</span>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
          <Button
            size="sm"
            className="hidden sm:flex bg-gold text-gold-foreground hover:bg-gold/90"
            onClick={() => navigate("/post")}
          >
            {t("nav.postAd")}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
