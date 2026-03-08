import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListings";
import { useFavorites } from "@/hooks/useFavorites";
import { getListingById } from "@/lib/mockListings";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import ImageFallback from "@/components/ImageFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Heart, MapPin, Eye, Phone, MessageCircle, ArrowLeft, Share2, Calendar, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { saudiCities } from "@/lib/cities";
import { categories, getSubcategoryName } from "@/lib/categories";
import { toast } from "@/components/ui/sonner";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { listing: dbListing, loading, seller: dbSeller } = useListing(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [messaging, setMessaging] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  // Try mock data if DB returns nothing
  const mockListing = getListingById(id || "");
  
  const listing = dbListing || (mockListing ? {
    id: mockListing.id,
    user_id: "",
    category: mockListing.category,
    subcategory: mockListing.subcategory,
    title: mockListing.title,
    description: mockListing.description,
    listing_type: mockListing.listing_type,
    city: mockListing.city,
    price: mockListing.price,
    contact_for_price: mockListing.contactForPrice,
    phone: mockListing.phone,
    images: mockListing.images,
    views: mockListing.views,
    status: "active",
    created_at: mockListing.postedAt,
    updated_at: mockListing.postedAt,
  } : null);

  const seller = dbSeller || (mockListing ? {
    display_name: mockListing.seller.name,
    avatar_url: null,
    user_id: "",
    verification_status: mockListing.seller.verified ? "verified" : "unverified",
    member_since: mockListing.seller.memberSince,
    total_listings: mockListing.seller.totalListings,
  } : null);

  const handleFavorite = async () => {
    if (!user) { setShowAuth(true); return; }
    if (listing) await toggleFavorite(listing.id);
  };

  const handleMessage = async () => {
    if (!user) { setShowAuth(true); return; }
    if (!listing || !seller) return;
    if (!listing.user_id) { toast.info(lang === "ar" ? "هذا إعلان تجريبي" : "This is a demo listing"); return; }
    setMessaging(true);
    try {
      const { data: existingParticipations } = await supabase
        .from("conversation_participants").select("conversation_id").eq("user_id", user.id);
      if (existingParticipations?.length) {
        for (const p of existingParticipations) {
          const { data: conv } = await supabase.from("conversations").select("*").eq("id", p.conversation_id).eq("listing_id", listing.id).single();
          if (conv) {
            const { data: otherP } = await supabase.from("conversation_participants").select("user_id").eq("conversation_id", conv.id).neq("user_id", user.id).single();
            if (otherP?.user_id === seller.user_id) { navigate("/messages"); return; }
          }
        }
      }
      const { data: conv } = await supabase.from("conversations").insert({ listing_id: listing.id, listing_title: listing.title }).select().single();
      if (conv) {
        await supabase.from("conversation_participants").insert([
          { conversation_id: conv.id, user_id: user.id },
          { conversation_id: conv.id, user_id: seller.user_id },
        ]);
        navigate("/messages");
      }
    } catch { toast.error(lang === "ar" ? "حدث خطأ" : "Something went wrong"); }
    finally { setMessaging(false); }
  };

  const handleShowPhone = () => {
    if (!user) { setShowAuth(true); return; }
    setShowPhone(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl py-6 pb-24">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl mb-4" />
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <BottomTabBar />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "الإعلان غير موجود" : "Listing not found"}</p>
          <Button variant="outline" onClick={() => navigate("/browse")} className="mt-4">{lang === "ar" ? "تصفح الإعلانات" : "Browse Listings"}</Button>
        </div>
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  const cat = categories.find(c => c.id === listing.category);
  const cityName = saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city;
  const isFav = isFavorite(listing.id);
  const isVerified = (seller as any)?.verification_status === "verified";
  const postedDate = new Date(listing.created_at);
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / 86400000);
  const postedLabel = daysAgo === 0 ? (lang === "ar" ? "اليوم" : "Today") :
    daysAgo === 1 ? (lang === "ar" ? "أمس" : "Yesterday") :
    `${daysAgo} ${lang === "ar" ? "أيام" : "days ago"}`;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.listing" />
      <Header />
      <div className="container max-w-4xl py-6 pb-24 md:pb-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link></BreadcrumbLink>
            </BreadcrumbItem>
            {cat && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to={`/browse?category=${cat.id}`}>{t(cat.key)}</Link></BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {listing.subcategory && cat && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/browse?category=${cat.id}&subcategory=${listing.subcategory}`}>
                      {t(`subcategory.${listing.subcategory}`) !== `subcategory.${listing.subcategory}` ? t(`subcategory.${listing.subcategory}`) : getSubcategoryName(cat.id, listing.subcategory)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px]">{listing.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Images */}
            {listing.images?.length > 0 ? (
              <div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                  <ImageFallback src={listing.images[selectedImg]} alt={listing.title} className="h-full w-full object-cover" />
                </motion.div>
                {listing.images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {listing.images.map((img: string, i: number) => (
                      <button key={i} onClick={() => setSelectedImg(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImg ? "border-primary" : "border-border"}`}>
                        <ImageFallback src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl border border-border bg-muted flex items-center justify-center">
                <ImageFallback src="" alt={listing.title} className="h-full w-full" />
              </div>
            )}

            {/* Details */}
            <div className="mt-6">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {cat && (
                  <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${cat.color}`}>
                    <cat.icon className="h-3.5 w-3.5" />{t(cat.key)}
                  </span>
                )}
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${listing.listing_type === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {t(`listing.${listing.listing_type}`)}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {cityName}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {listing.views?.toLocaleString()} {lang === "ar" ? "مشاهدة" : "views"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {postedLabel}</span>
              </div>

              {listing.description && (
                <div className="mt-6">
                  <h2 className="font-semibold text-foreground mb-2">{lang === "ar" ? "الوصف" : "Description"}</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-20">
              <p className="text-3xl font-bold text-primary">
                {listing.contact_for_price ? t("listing.contactPrice") : `${Number(listing.price).toLocaleString()} ${t("listing.sar")}`}
              </p>

              {/* Seller */}
              {seller && (
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {seller.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm">{seller.display_name || (lang === "ar" ? "بائع" : "Seller")}</p>
                      {isVerified && <Shield className="h-3.5 w-3.5 text-gold" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(seller as any)?.member_since ? `${lang === "ar" ? "عضو منذ" : "Since"} ${(seller as any).member_since}` : (lang === "ar" ? "عضو في مركزي" : "Marcazi member")}
                    </p>
                    {(seller as any)?.total_listings !== undefined && (
                      <p className="text-xs text-muted-foreground">{(seller as any).total_listings} {lang === "ar" ? "إعلانات" : "listings"}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <Button className="w-full gap-2" onClick={handleMessage} disabled={messaging || listing.user_id === user?.id}>
                  <MessageCircle className="h-4 w-4" />{lang === "ar" ? "إرسال رسالة" : "Send Message"}
                </Button>
                {listing.phone && (
                  showPhone ? (
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <a href={`tel:${listing.phone}`}><Phone className="h-4 w-4" />{listing.phone}</a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full gap-2" onClick={handleShowPhone}>
                      <Phone className="h-4 w-4" />{lang === "ar" ? "إظهار رقم الهاتف" : "Show Phone Number"}
                    </Button>
                  )
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleFavorite}>
                    <Heart className={`h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                    {isFav ? (lang === "ar" ? "تم الحفظ" : "Saved") : (lang === "ar" ? "حفظ" : "Save")}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success(lang === "ar" ? "تم نسخ الرابط" : "Link copied!"); }}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default ListingDetail;
