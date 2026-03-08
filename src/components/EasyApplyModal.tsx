import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useRef } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: any;
}

const EasyApplyModal = ({ open, onOpenChange, listing }: Props) => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [jobProfile, setJobProfile] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    coverLetter: "",
    resumeFile: null as File | null,
    useProfileResume: false,
    matchedSkills: [] as string[],
    confirmedDocuments: [] as string[],
  });

  useEffect(() => {
    if (!user || !open) return;
    const loadProfile = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (p) {
        setProfile(p);
        setForm(prev => ({
          ...prev,
          name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.display_name || "",
          email: user.email || "",
          phone: p.phone || "",
        }));
      }
      const { data: jp } = await supabase.from("job_profiles").select("*").eq("user_id", user.id).single();
      if (jp) {
        setJobProfile(jp);
        if (jp.resume_url) setForm(prev => ({ ...prev, useProfileResume: true }));
        // Auto-match skills
        const jobSkills: string[] = listing.required_skills || [];
        const userSkills: string[] = jp.skills || [];
        const matched = jobSkills.filter(s => userSkills.some(us => us.toLowerCase() === s.toLowerCase()));
        setForm(prev => ({ ...prev, matchedSkills: matched }));
      }
    };
    loadProfile();
    setSubmitted(false);
  }, [user, open, listing]);

  const handleSkillToggle = (skill: string) => {
    setForm(prev => ({
      ...prev,
      matchedSkills: prev.matchedSkills.includes(skill)
        ? prev.matchedSkills.filter(s => s !== skill)
        : [...prev.matchedSkills, skill],
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      let resumeUrl = form.useProfileResume && jobProfile?.resume_url ? jobProfile.resume_url : null;
      if (form.resumeFile) {
        const ext = form.resumeFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("resumes").upload(path, form.resumeFile);
        if (!error) {
          const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(path);
          resumeUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from("applications").insert({
        listing_id: listing.id,
        applicant_id: user.id,
        applicant_name: form.name,
        applicant_email: form.email,
        applicant_phone: form.phone,
        applicant_city: form.city,
        cover_letter: form.coverLetter || null,
        resume_url: resumeUrl,
        matched_skills: form.matchedSkills,
        confirmed_documents: form.confirmedDocuments.length > 0 ? form.confirmedDocuments : null,
      } as any);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || (lang === "ar" ? "حدث خطأ" : "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  const requiredSkills: string[] = listing?.required_skills || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {submitted
              ? (lang === "ar" ? "تم إرسال الطلب!" : "Application Submitted!")
              : `${lang === "ar" ? "تقديم على" : "Apply for"} ${listing?.title || ""}`}
          </SheetTitle>
        </SheetHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {lang === "ar" ? "تم إرسال طلبك!" : "Application Submitted!"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {lang === "ar"
                ? "تم إخطار صاحب العمل. يمكنك تتبع طلباتك من ملفك الشخصي."
                : "The employer has been notified. You can track your applications in My Profile."}
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              {lang === "ar" ? "إغلاق" : "Close"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Section 1: Your Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">{lang === "ar" ? "معلوماتك" : "Your Info"}</h3>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
              <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder={lang === "ar" ? "المدينة الحالية" : "Current City"}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>

            {/* Section 2: Application */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">{lang === "ar" ? "طلبك" : "Your Application"}</h3>
              <textarea value={form.coverLetter} onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))}
                rows={4} placeholder={lang === "ar" ? "قدم نفسك واشرح لماذا أنت مناسب لهذا الدور..." : "Introduce yourself and explain why you're a good fit for this role..."}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary resize-none" />

              {/* Resume */}
              {jobProfile?.resume_url && form.useProfileResume && !form.resumeFile && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    {lang === "ar" ? "✓ استخدام السيرة الذاتية من ملفك" : "✓ Using resume from your profile"}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm" className="gap-2" onClick={() => resumeInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                {form.resumeFile
                  ? form.resumeFile.name
                  : (lang === "ar" ? "رفع سيرة ذاتية مختلفة" : "Upload a different resume")}
              </Button>
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => {
                const f = e.target.files?.[0];
                if (f) {
                  if (f.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
                  setForm(p => ({ ...p, resumeFile: f, useProfileResume: false }));
                }
              }} className="hidden" />
            </div>

            {/* Section 3: Skills Match */}
            {requiredSkills.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">{lang === "ar" ? "مطابقة المهارات" : "Skills Match"}</h3>
                <div className="space-y-2">
                  {requiredSkills.map(skill => (
                    <label key={skill} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.matchedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm text-foreground">{skill}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {form.matchedSkills.length}/{requiredSkills.length} {lang === "ar" ? "مهارات مطابقة" : "skills matched"}
                </p>
              </div>
            )}

            {/* Documents Checklist */}
            {listing?.required_documents?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">{lang === "ar" ? "قائمة المستندات" : "Documents Checklist"}</h3>
                <p className="text-xs text-muted-foreground">
                  {lang === "ar" ? "تأكد من جاهزية هذه المستندات قبل أو بعد التقديم. قد يطلبها صاحب العمل." : "Make sure you have these ready before or after applying. The employer may request them."}
                </p>
                <div className="space-y-2">
                  {listing.required_documents.map((doc: string) => (
                    <label key={doc} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.confirmedDocuments.includes(doc)}
                        onChange={() => {
                          setForm(prev => ({
                            ...prev,
                            confirmedDocuments: prev.confirmedDocuments.includes(doc)
                              ? prev.confirmedDocuments.filter(d => d !== doc)
                              : [...prev.confirmedDocuments, doc],
                          }));
                        }}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm text-foreground">📄 {doc}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
            <Button onClick={handleSubmit} disabled={submitting || !form.name || !form.email} className="w-full gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {lang === "ar" ? "إرسال الطلب" : "Submit Application"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EasyApplyModal;
