import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, ChevronDown, ChevronUp, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  reviewed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  shortlisted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  withdrawn: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, Record<string, string>> = {
  new: { en: "New", ar: "جديد" },
  reviewed: { en: "Reviewed", ar: "تمت المراجعة" },
  shortlisted: { en: "Shortlisted", ar: "قائمة مختصرة" },
  rejected: { en: "Rejected", ar: "مرفوض" },
  withdrawn: { en: "Withdrawn", ar: "منسحب" },
};

const ApplicationsDashboard = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useI18n();
  const [applications, setApplications] = useState<any[]>([]);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !listingId) return;
    const load = async () => {
      const { data: l } = await supabase.from("listings").select("*").eq("id", listingId).single();
      setListing(l);
      const { data: apps } = await supabase.from("applications").select("*").eq("listing_id", listingId).order("applied_at", { ascending: false });
      setApplications(apps || []);
      setLoading(false);
    };
    load();
  }, [user, listingId]);

  const updateStatus = async (appId: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status, updated_at: new Date().toISOString() }).eq("id", appId);
    if (!error) {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      toast.success(lang === "ar" ? "تم تحديث الحالة" : "Status updated");
    }
  };

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === "new").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="container py-10"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64 w-full rounded-2xl" /></div><BottomTabBar /></div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.profile" /><Header />
      <div className="container max-w-4xl py-6 pb-24 md:pb-10">
        <button onClick={() => navigate("/my-ads")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{lang === "ar" ? "رجوع لإعلاناتي" : "Back to My Ads"}
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          {lang === "ar" ? "طلبات التوظيف" : "Applications"} — {listing?.title}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي" : "Total"}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.new}</p>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "جديد" : "New"}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.shortlisted}</p>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? "مختارين" : "Shortlisted"}</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-semibold">{lang === "ar" ? "لا توجد طلبات بعد" : "No applications yet"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => {
              const isExpanded = expandedId === app.id;
              const matchedCount = (app.matched_skills || []).length;
              const totalSkills = (listing?.required_skills || []).length;
              return (
                <div key={app.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{app.applicant_name?.[0]?.toUpperCase() || "?"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{app.applicant_name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {app.applicant_city && <span>{app.applicant_city}</span>}
                        <span>{new Date(app.applied_at).toLocaleDateString()}</span>
                        {totalSkills > 0 && <span>{matchedCount}/{totalSkills} {lang === "ar" ? "مهارات" : "skills"}</span>}
                      </div>
                    </div>
                    <Badge className={statusColors[app.status] || statusColors.new}>
                      {statusLabels[app.status]?.[lang] || app.status}
                    </Badge>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">{lang === "ar" ? "البريد:" : "Email:"}</span> {app.applicant_email}</div>
                        <div><span className="text-muted-foreground">{lang === "ar" ? "الهاتف:" : "Phone:"}</span> {app.applicant_phone || "—"}</div>
                      </div>
                      {app.cover_letter && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">{lang === "ar" ? "رسالة التقديم" : "Cover Letter"}</p>
                          <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">{app.cover_letter}</p>
                        </div>
                      )}
                      {app.resume_url && (
                        <Button size="sm" variant="outline" className="gap-2" asChild>
                          <a href={app.resume_url} target="_blank" rel="noopener noreferrer"><Download className="h-3.5 w-3.5" />{lang === "ar" ? "تحميل السيرة الذاتية" : "Download Resume"}</a>
                        </Button>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{lang === "ar" ? "تغيير الحالة:" : "Change status:"}</span>
                        <Select value={app.status} onValueChange={(val) => updateStatus(app.id, val)}>
                          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["new", "reviewed", "shortlisted", "rejected"].map(s => (
                              <SelectItem key={s} value={s}>{statusLabels[s]?.[lang] || s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer /><BottomTabBar />
    </div>
  );
};

export default ApplicationsDashboard;
