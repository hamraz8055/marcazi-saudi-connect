import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import { Bell } from "lucide-react";

const Notifications = () => {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.notifications" />
      <Header />
      <div className="container py-10 pb-24 md:pb-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">{lang === "ar" ? "الإشعارات" : "Notifications"}</h1>
        <div className="flex flex-col items-center py-20 text-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="font-semibold text-foreground">{lang === "ar" ? "لا توجد إشعارات" : "No notifications yet"}</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {lang === "ar"
              ? "ستظهر هنا الإشعارات عند وجود رسائل جديدة أو تحديثات على إعلاناتك"
              : "Notifications will appear here when you receive new messages or updates on your listings"}
          </p>
        </div>
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Notifications;
