import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Package, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ALL_LISTINGS } from "@/lib/mockListings";

const PublicProfile = () => {
  const { id } = useParams();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Try Supabase first
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, verification_status, created_at")
        .eq("user_id", id!)
        .single();

      if (data) {
        setProfile(data);
        // Get listings count
        const { data: userListings } = await supabase
          .from("listings")
          .select("id, title, price, city, images, category")
          .eq("user_id", id!)
          .eq("status", "active");
        setListings(userListings || []);
      }
      setLoading(false);
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex justify-center py-32"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      <BottomTabBar />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-xl font-bold">{lang === "ar" ? "الملف غير موجود" : "Profile not found"}</h2>
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );

  const joined = new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isVerified = profile.verification_status === "verified";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl py-10 pb-24 md:pb-10 space-y-6">
        {/* Profile header */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <Avatar className="h-20 w-20 mx-auto">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {profile.display_name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center gap-2 mt-3">
            <h1 className="text-xl font-bold text-foreground">{profile.display_name}</h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />{lang === "ar" ? "موثق" : "Verified"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
            <Calendar className="h-3.5 w-3.5" />{lang === "ar" ? `عضو منذ ${joined}` : `Member since ${joined}`}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{listings.length}</p>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "إعلانات نشطة" : "Active Listings"}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /><span className="text-lg font-bold">—</span></div>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "التقييم" : "Rating"}</p>
            </div>
          </div>
          <Button className="mt-4 gap-2" onClick={() => navigate("/messages")}>
            <MessageCircle className="h-4 w-4" />{lang === "ar" ? "إرسال رسالة" : "Send Message"}
          </Button>
        </div>

        {/* Listings grid */}
        {listings.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4">{lang === "ar" ? "الإعلانات النشطة" : "Active Listings"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(l => (
                <div key={l.id} onClick={() => navigate(`/listing/${l.id}`)} className="rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:shadow-elevated transition-shadow">
                  <div className="aspect-[4/3] bg-muted">
                    {l.images?.[0] && <img src={l.images[0]} alt={l.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{l.title}</p>
                    <p className="text-sm font-bold text-primary mt-1">{l.price ? `SAR ${l.price.toLocaleString()}` : "Contact"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default PublicProfile;
