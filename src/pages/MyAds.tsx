import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import ImageFallback from "@/components/ImageFallback";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Edit, Trash2, Plus, LogIn, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { saudiCities } from "@/lib/cities";
import { toast } from "@/components/ui/sonner";
import type { Listing } from "@/hooks/useListings";

const MyAds = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setListings((data as Listing[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete this ad?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (!error) {
      setListings(prev => prev.filter(l => l.id !== id));
      toast.success(lang === "ar" ? "تم حذف الإعلان" : "Ad deleted");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.profile" />
        <Header />
        <div className="container py-10 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
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
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <LogIn className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-xl font-bold">{lang === "ar" ? "سجل الدخول لعرض إعلاناتك" : "Sign in to view your ads"}</h2>
          <Button onClick={() => setShowAuth(true)} className="gap-2"><LogIn className="h-4 w-4" />{lang === "ar" ? "تسجيل الدخول" : "Sign In"}</Button>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.profile" />
      <Header />
      <div className="container py-10 pb-24 md:pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{lang === "ar" ? "إعلاناتي" : "My Ads"}</h1>
          <Button onClick={() => navigate("/post")} className="gap-2"><Plus className="h-4 w-4" />{lang === "ar" ? "أضف إعلان" : "Post Ad"}</Button>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center gap-4">
            <Plus className="h-12 w-12 text-muted-foreground/40" />
            <p className="font-semibold">{lang === "ar" ? "لم تنشر أي إعلانات بعد" : "You haven't posted any ads yet"}</p>
            <Button onClick={() => navigate("/post")} className="gap-2">
              <Plus className="h-4 w-4" />{lang === "ar" ? "أضف إعلانك الأول" : "Post Your First Ad"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing, i) => (
              <motion.article key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all">
                <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => navigate(`/listing/${listing.id}`)}>
                  <ImageFallback src={listing.images?.[0]} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute top-3 start-3">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${listing.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {listing.status === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معلق" : "Pending")}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
                  <p className="mt-1 text-lg font-bold text-primary">
                    {listing.contact_for_price ? t("listing.contactPrice") : `${Number(listing.price).toLocaleString()} ${t("listing.sar")}`}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{(listing.views || 0).toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs" onClick={() => navigate(`/listing/${listing.id}`)}>
                      <Edit className="h-3.5 w-3.5" />{lang === "ar" ? "تعديل" : "Edit"}
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(listing.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default MyAds;
