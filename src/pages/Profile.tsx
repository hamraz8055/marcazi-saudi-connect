import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import BasicInfoSection from "@/components/profile/BasicInfoSection";
import JobProfileSection from "@/components/profile/JobProfileSection";
import AddressesSection from "@/components/profile/AddressesSection";
import PhoneNumbersSection from "@/components/profile/PhoneNumbersSection";
import SecuritySection from "@/components/profile/SecuritySection";
import DeactivateSection from "@/components/profile/DeactivateSection";
import VerificationSection from "@/components/profile/VerificationSection";
import MyApplicationsSection from "@/components/profile/MyApplicationsSection";
import { useSearchParams } from "react-router-dom";

export type ProfileSection = "basic-info" | "job-profile" | "addresses" | "phone-numbers" | "security" | "deactivate" | "verify" | "my-applications";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useI18n();
  const [showAuth, setShowAuth] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<ProfileSection>("basic-info");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "verify") setActiveSection("verify");
    const section = searchParams.get("section");
    if (section) setActiveSection(section as ProfileSection);
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <BottomTabBar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.profile" />
        <Header />
        <div className="flex flex-col items-center justify-center py-32 gap-4 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {lang === "ar" ? "سجل الدخول لعرض حسابك" : "Sign in to view your profile"}
          </h2>
          <Button onClick={() => setShowAuth(true)} className="gap-2">
            <LogIn className="h-4 w-4" />{lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </Button>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "basic-info": return <BasicInfoSection />;
      case "job-profile": return <JobProfileSection />;
      case "addresses": return <AddressesSection />;
      case "phone-numbers": return <PhoneNumbersSection />;
      case "security": return <SecuritySection />;
      case "deactivate": return <DeactivateSection />;
      case "verify": return <VerificationSection />;
      case "my-applications": return <MyApplicationsSection />;
      default: return <BasicInfoSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.profile" />
      <Header />
      <div className="container max-w-6xl py-6 pb-24 md:pb-10">
        {/* Top links */}
        <div className="flex items-center gap-4 mb-6 text-sm">
          <button onClick={() => setActiveSection("job-profile")} className="text-primary hover:underline font-medium">
            {lang === "ar" ? "الملف الوظيفي" : "Go to Job Profile"}
          </button>
          <span className="text-muted-foreground">|</span>
          <a href={`/user/${user.id}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            {lang === "ar" ? "الملف العام" : "Public Profile"}
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {renderSection()}
          </div>
        </div>
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Profile;
