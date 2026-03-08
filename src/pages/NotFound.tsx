import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { lang } = useI18n();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.notFound" />
      <Header />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {lang === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {lang === "ar"
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها"
            : "Sorry, the page you're looking for doesn't exist or has been moved"}
        </p>
        <Button asChild className="gap-2">
          <Link to="/"><Home className="h-4 w-4" />{lang === "ar" ? "العودة للرئيسية" : "Return Home"}</Link>
        </Button>
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default NotFound;
