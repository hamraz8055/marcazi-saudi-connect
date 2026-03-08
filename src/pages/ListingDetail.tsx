import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListings";
import { useFavorites } from "@/hooks/useFavorites";
import { getListingById } from "@/lib/mockListings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import ImageFallback from "@/components/ImageFallback";
import EasyApplyModal from "@/components/EasyApplyModal";
import ListingContactBar from "@/components/ListingContactBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Heart, MapPin, Eye, Phone, MessageCircle, ArrowLeft, Share2, Calendar, Shield, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { saudiCities } from "@/lib/cities";
import { categories, getSubcategoryName } from "@/lib/categories";
import { toast } from "@/components/ui/sonner";
import { getEmploymentBadgeStyle, getEmploymentLabel, formatJobSalary } from "@/lib/jobSkillSuggestions";
import { fuelTypes, bodyTypes, sellerTypes, rentalPeriods } from "@/lib/vehicleData";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { listing: dbListing, loading, seller: dbSeller } = useListing(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [showApply, setShowApply] = useState(false);

  const mockListing = getListingById(id || "");
  const listing = dbListing || (mockListing ? {
    id: mockListing.id, user_id: "", category: mockListing.category, subcategory: mockListing.subcategory,
    title: mockListing.title, description: mockListing.description, listing_type: mockListing.listing_type,
    city: mockListing.city, price: mockListing.price, contact_for_price: mockListing.contactForPrice,
    phone: mockListing.phone, images: mockListing.images, views: mockListing.views, status: "active",
    created_at: mockListing.postedAt, updated_at: mockListing.postedAt,
  } : null);

  const seller = dbSeller || (mockListing ? {
    display_name: mockListing.seller.name, avatar_url: null, user_id: "",
    verification_status: mockListing.seller.verified ? "verified" : "unverified",
    member_since: mockListing.seller.memberSince, total_listings: mockListing.seller.totalListings,
  } : null);

  const isJob = listing?.category === "jobs";
  const isVehicle = listing?.category === "heavy-equipment" || listing?.category === "motors";

  const handleFavorite = async () => {
    if (!user) { setShowAuth(true); return; }
    if (listing) await toggleFavorite(listing.id);
  };

  const handleEasyApply = () => { if (!user) { setShowAuth(true); return; } setShowApply(true); };

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="container max-w-4xl py-6 pb-24"><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="aspect-[16/9] w-full rounded-2xl mb-4" /><Skeleton className="h-6 w-64 mb-2" /><Skeleton className="h-4 w-full" /></div>
        <BottomTabBar /></div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-xl font-bold">{lang === "ar" ? "الإعلان غير موجود" : "Listing not found"}</p>
          <Button variant="outline" onClick={() => navigate("/browse")} className="mt-4">{lang === "ar" ? "تصفح الإعلانات" : "Browse Listings"}</Button>
        </div><Footer /><BottomTabBar /></div>
    );
  }

  const cat = categories.find(c => c.id === listing.category);
  const cityName = saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city;
  const isFav = isFavorite(listing.id);
  const isVerified = (seller as any)?.verification_status === "verified";
  const postedDate = new Date(listing.created_at);
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / 86400000);
  const postedLabel = daysAgo === 0 ? (lang === "ar" ? "اليوم" : "Today") : daysAgo === 1 ? (lang === "ar" ? "أمس" : "Yesterday") : `${daysAgo} ${lang === "ar" ? "أيام" : "days ago"}`;
  const displayName = seller?.display_name || (lang === "ar" ? "البائع" : "Seller");
  const requiredSkills: string[] = listing?.required_skills || [];
  const empType = listing?.employment_type;

  const BreadcrumbNav = () => (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link></BreadcrumbLink></BreadcrumbItem>
        {cat && (<><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink asChild><Link to={`/browse?category=${cat.id}`}>{t(cat.key)}</Link></BreadcrumbLink></BreadcrumbItem></>)}
        {listing.subcategory && cat && (<><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink asChild><Link to={`/browse?category=${cat.id}&subcategory=${listing.subcategory}`}>{t(`subcategory.${listing.subcategory}`) !== `subcategory.${listing.subcategory}` ? t(`subcategory.${listing.subcategory}`) : getSubcategoryName(cat.id, listing.subcategory)}</Link></BreadcrumbLink></BreadcrumbItem></>)}
        <BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage className="line-clamp-1 max-w-[200px]">{listing.title}</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  const BackButton = () => (
    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع" : "Back"}
    </button>
  );

  // Vehicle details grid
  const VehicleDetailsGrid = () => {
    if (!isVehicle) return null;
    const fuelLabel = fuelTypes.find(f => f.id === listing.fuel_type)?.label[lang];
    const bodyLabel = bodyTypes.find(b => b.id === listing.body_type)?.label[lang];
    const sellerLabel = sellerTypes.find(s => s.id === listing.seller_type)?.label[lang];
    const periodLabel = rentalPeriods.find(p => p.id === listing.rental_period)?.label[lang];

    return (
      <div>
        <h2 className="font-semibold text-foreground mb-3">{lang === "ar" ? "تفاصيل الإعلان" : "Ad Details"}</h2>
        <div className="grid grid-cols-2 gap-3">
          {listing.year && <DetailItem label={lang === "ar" ? "📅 السنة" : "📅 Year"} value={String(listing.year)} />}
          {listing.kilometers != null && <DetailItem label={listing.category === "motors" ? (lang === "ar" ? "🛣️ المسافة" : "🛣️ Mileage") : (lang === "ar" ? "⚙️ الكيلومترات/الساعات" : "⚙️ KM/Hours")} value={`${listing.kilometers.toLocaleString()} ${listing.category === "motors" ? "km" : ""}`} />}
          {fuelLabel && <DetailItem label={lang === "ar" ? "⛽ نوع الوقود" : "⛽ Fuel Type"} value={fuelLabel} />}
          {bodyLabel && <DetailItem label={lang === "ar" ? "🚗 نوع الهيكل" : "🚗 Body Type"} value={bodyLabel} />}
          {sellerLabel && <DetailItem label={lang === "ar" ? "👤 نوع البائع" : "👤 Seller Type"} value={sellerLabel} />}
          {listing.make && <DetailItem label={lang === "ar" ? "🏢 الشركة / الموديل" : "🏢 Make / Model"} value={`${listing.make}${listing.model ? ` ${listing.model}` : ""}`} />}
          {listing.rental_rate && periodLabel && <DetailItem label={lang === "ar" ? "💰 سعر الإيجار" : "💰 Rental Rate"} value={`${listing.rental_rate.toLocaleString()} ${t("listing.sar")}/${periodLabel}`} />}
        </div>
      </div>
    );
  };

  // JOB DETAIL LAYOUT
  if (isJob) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.listing" /><Header />
        <div className="container max-w-4xl py-6 pb-24 md:pb-10">
          <BreadcrumbNav /><BackButton />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                {listing.company_logo_url ? (
                  <img src={listing.company_logo_url} alt="" className="h-20 w-20 rounded-2xl object-cover border border-border" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{displayName[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
                    {isVerified && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />{postedLabel} · <MapPin className="h-3.5 w-3.5" />{cityName}
                  </p>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {empType && (
                  <span className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${getEmploymentBadgeStyle(empType)}`}>
                    {getEmploymentLabel(empType, lang)}
                  </span>
                )}
                <span className="text-lg font-bold text-primary">💰 {formatJobSalary(listing, lang)}</span>
              </div>
              <hr className="border-border" />
              {listing.description && (
                <div>
                  <h2 className="font-semibold text-foreground mb-2">{lang === "ar" ? "عن الوظيفة" : "About the Role"}</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
              {requiredSkills.length > 0 && (
                <div>
                  <h2 className="font-semibold text-foreground mb-3">{lang === "ar" ? "المهارات المطلوبة" : "Required Skills"}</h2>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((s: string) => (
                      <span key={s} className="rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2 className="font-semibold text-foreground mb-3">{lang === "ar" ? "تفاصيل الوظيفة" : "Job Details"}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {empType && <DetailItem label={lang === "ar" ? "نوع التوظيف" : "Employment Type"} value={getEmploymentLabel(empType, lang)} />}
                  <DetailItem label={lang === "ar" ? "الراتب" : "Salary"} value={formatJobSalary(listing, lang)} />
                  {listing.contract_duration && <DetailItem label={lang === "ar" ? "مدة العقد" : "Contract Duration"} value={listing.contract_duration} />}
                  <DetailItem label={lang === "ar" ? "الموقع" : "Location"} value={cityName} />
                  {cat && <DetailItem label={lang === "ar" ? "المجال" : "Category"} value={t(cat.key)} />}
                  <DetailItem label={lang === "ar" ? "تاريخ النشر" : "Posted"} value={postedLabel} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 sticky top-20 space-y-4">
                <div className="flex items-center gap-3">
                  {listing.company_logo_url ? (
                    <img src={listing.company_logo_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{displayName[0]?.toUpperCase()}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{listing.title}</p>
                  </div>
                </div>
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleEasyApply}>
                  <Briefcase className="h-4 w-4" />{lang === "ar" ? "تقديم سريع" : "Easy Apply"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">{lang === "ar" ? "قدم بملفك الشخصي في مركزي" : "Apply with your Marcazi profile"}</p>
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Eye className="h-3.5 w-3.5" />{listing.views?.toLocaleString()} {lang === "ar" ? "شاهدوا هذه الوظيفة" : "people viewed this job"}
                </p>
                <div className="flex gap-2 pt-2 border-t border-border">
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
        <EasyApplyModal open={showApply} onOpenChange={setShowApply} listing={listing} />
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        <Footer /><BottomTabBar />
      </div>
    );
  }

  // NON-JOB LISTING (original + enhanced layout)
  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.listing" /><Header />
      <div className="container max-w-4xl py-6 pb-24 md:pb-10">
        <BreadcrumbNav /><BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
            <div className="mt-6">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {cat && (<span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${cat.color}`}><cat.icon className="h-3.5 w-3.5" />{t(cat.key)}</span>)}
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${listing.listing_type === "sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>{t(`listing.${listing.listing_type}`)}</span>
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
              {/* Vehicle details grid */}
              {isVehicle && <div className="mt-6"><VehicleDetailsGrid /></div>}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-20 space-y-4">
              {/* Price */}
              {listing.rental_rate && listing.rental_period ? (
                <p className="text-2xl font-bold text-primary">
                  {listing.rental_rate.toLocaleString()} {t("listing.sar")}/{rentalPeriods.find(p => p.id === listing.rental_period)?.label[lang] || listing.rental_period}
                </p>
              ) : (
                <p className="text-3xl font-bold text-primary">
                  {listing.contact_for_price ? t("listing.contactPrice") : `${Number(listing.price).toLocaleString()} ${t("listing.sar")}`}
                </p>
              )}

              {/* Seller info */}
              {seller && (
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{seller.display_name?.[0]?.toUpperCase() || "?"}</AvatarFallback></Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm">{seller.display_name || (lang === "ar" ? "بائع" : "Seller")}</p>
                      {isVerified && <Shield className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(seller as any)?.member_since ? `${lang === "ar" ? "عضو منذ" : "Since"} ${(seller as any).member_since}` : (lang === "ar" ? "عضو في مركزي" : "Marcazi member")}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact bar */}
              <div className="pt-4 border-t border-border">
                <ListingContactBar listing={listing} seller={seller as any} onAuthRequired={() => setShowAuth(true)} />
              </div>

              {/* Favorite */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleFavorite}>
                  <Heart className={`h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                  {isFav ? (lang === "ar" ? "تم الحفظ" : "Saved") : (lang === "ar" ? "حفظ" : "Save")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      <Footer /><BottomTabBar />
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-muted/50 p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
  </div>
);

export default ListingDetail;
