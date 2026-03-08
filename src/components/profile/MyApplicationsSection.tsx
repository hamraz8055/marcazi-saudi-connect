import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, ExternalLink, XCircle } from "lucide-react";
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

const MyApplicationsSection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [listings, setListings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: apps } = await supabase.from("applications").select("*").eq("applicant_id", user.id).order("applied_at", { ascending: false });
      setApplications(apps || []);

      const ids = [...new Set((apps || []).map((a: any) => a.listing_id))];
      if (ids.length > 0) {
        const { data: lsts } = await supabase.from("listings").select("id, title, company_logo_url, category").in("id", ids);
        const map: Record<string, any> = {};
        (lsts || []).forEach((l: any) => { map[l.id] = l; });
        setListings(map);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleWithdraw = async (appId: string) => {
    if (!confirm(lang === "ar" ? "هل تريد سحب طلبك؟" : "Withdraw your application?")) return;
    const { error } = await supabase.from("applications").update({ status: "withdrawn" }).eq("id", appId);
    if (!error) {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: "withdrawn" } : a));
      toast.success(lang === "ar" ? "تم سحب الطلب" : "Application withdrawn");
    }
  };

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="font-semibold text-foreground">{lang === "ar" ? "لم تقدم على أي وظيفة بعد" : "No applications yet"}</p>
        <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "تصفح الوظائف وقدم بسهولة" : "Browse jobs and apply with Easy Apply"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/browse?category=jobs")}>
          {lang === "ar" ? "تصفح الوظائف" : "Browse Jobs"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">{lang === "ar" ? "طلباتي" : "My Applications"}</h2>
      <div className="space-y-3">
        {applications.map(app => {
          const listing = listings[app.listing_id];
          const logoLetter = listing?.title?.[0]?.toUpperCase() || "J";
          return (
            <div key={app.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              {listing?.company_logo_url ? (
                <img src={listing.company_logo_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{logoLetter}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{listing?.title || app.listing_id}</p>
                <p className="text-xs text-muted-foreground">{new Date(app.applied_at).toLocaleDateString()}</p>
              </div>
              <Badge className={statusColors[app.status] || statusColors.new}>
                {statusLabels[app.status]?.[lang] || app.status}
              </Badge>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => navigate(`/listing/${app.listing_id}`)}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                {app.status !== "withdrawn" && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => handleWithdraw(app.id)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplicationsSection;
