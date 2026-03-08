import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, LogOut, Mail, Phone, Package, Heart, Shield, ShieldCheck, Upload, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; phone: string | null; avatar_url: string | null; verification_status?: string } | null>(null);
  const [listingsCount, setListingsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("display_name, phone, avatar_url, verification_status").eq("user_id", user.id).single();
      setProfile(data as any);
      const { count } = await supabase.from("listings").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      setListingsCount(count || 0);
    };
    fetchProfile();
  }, [user]);

  const handleSubmitVerification = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("profiles").update({ verification_status: "pending" } as any).eq("user_id", user.id);
    if (!error) {
      setProfile(prev => prev ? { ...prev, verification_status: "pending" } : prev);
      toast.success(lang === "ar" ? "تم إرسال طلب التوثيق" : "Verification request submitted");
    }
    setSubmitting(false);
  };

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

  const verificationStatus = (profile as any)?.verification_status || "unverified";

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.profile" />
      <Header />
      <div className="container max-w-2xl py-10 pb-24 md:pb-10 space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{profile?.display_name || user.email?.split("@")[0]}</h1>
                {verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold" />{t("verify.verified")}
                  </span>
                )}
                {verificationStatus === "pending" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />{t("verify.pending")}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user.email}</p>
              {profile?.phone && <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {profile.phone}</p>}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted p-4 text-center">
              <Package className="h-6 w-6 mx-auto text-primary" />
              <p className="mt-2 text-2xl font-bold text-foreground">{listingsCount}</p>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "إعلانات منشورة" : "Listings Posted"}</p>
            </div>
            <button onClick={() => navigate("/favorites")} className="rounded-xl bg-muted p-4 text-center hover:bg-muted/80 transition-colors">
              <Heart className="h-6 w-6 mx-auto text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{lang === "ar" ? "المفضلة" : "Favorites"}</p>
            </button>
          </div>

          <Button variant="outline" onClick={signOut} className="mt-6 w-full gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />{lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
          </Button>
        </div>

        {/* Verification Card */}
        {verificationStatus === "unverified" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">{t("verify.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("verify.desc")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">1</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{t("verify.step1")}</p>
                </div>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">2</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{t("verify.step2")}</p>
                </div>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Button className="mt-4 w-full gap-2" onClick={handleSubmitVerification} disabled={submitting}>
              <ShieldCheck className="h-4 w-4" />{t("verify.submit")}
            </Button>
          </div>
        )}
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Profile;
