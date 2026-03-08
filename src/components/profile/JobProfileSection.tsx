import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Upload, Download, Trash2, Check, GraduationCap, Briefcase, Wrench, FileText, Globe, Award, Image, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const SECTIONS = [
  { key: "qualifications", icon: GraduationCap, en: "Qualifications", ar: "المؤهلات" },
  { key: "experience", icon: Briefcase, en: "Experience", ar: "الخبرات" },
  { key: "skills", icon: Wrench, en: "Skills", ar: "المهارات" },
  { key: "resume", icon: FileText, en: "Resume", ar: "السيرة الذاتية" },
  { key: "digital_profiles", icon: Globe, en: "Digital Profile", ar: "الملف الرقمي" },
  { key: "certificates", icon: Award, en: "Licences or Certificates", ar: "الشهادات" },
  { key: "portfolio", icon: Image, en: "Portfolio", ar: "الأعمال" },
  { key: "references", icon: Users, en: "Reference", ar: "المراجع" },
];

const SUGGESTED_SKILLS = ["Project Management", "AutoCAD", "Microsoft Office", "Forklift Operation", "Welding", "Customer Service", "Salesforce", "Data Entry", "Accounting", "Python", "Marketing", "Sales"];

const JobProfileSection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: up } = await supabase.from("profiles").select("display_name, avatar_url").eq("user_id", user.id).single();
      setUserProfile(up);
      const { data } = await supabase.from("job_profiles").select("*").eq("user_id", user.id).single();
      if (data) setProfile(data);
      else {
        await supabase.from("job_profiles").insert({ user_id: user.id } as any);
        setProfile({ user_id: user.id, skills: [], qualifications: [], experience: [], digital_profiles: [], certificates: [], portfolio: [], references: [] });
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const save = async (field: string, value: any) => {
    if (!user) return;
    await supabase.from("job_profiles").update({ [field]: value } as any).eq("user_id", user.id);
    setProfile((p: any) => ({ ...p, [field]: value }));
    toast.success(lang === "ar" ? "تم الحفظ" : "Saved");
  };

  const completedSections = profile ? SECTIONS.filter(s => {
    const val = profile[s.key];
    if (s.key === "resume") return !!profile.resume_url;
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  }).length : 0;
  const remaining = SECTIONS.length - completedSections;
  const progressPct = (completedSections / SECTIONS.length) * 100;

  if (loading) return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left mini sidebar */}
      <div className="w-full md:w-56 shrink-0">
        <div className="rounded-2xl border border-border bg-card p-4 md:sticky md:top-24 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {userProfile?.avatar_url && <AvatarImage src={userProfile.avatar_url} />}
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {(userProfile?.display_name || user?.email)?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold text-foreground truncate">{userProfile?.display_name || user?.email?.split("@")[0]}</p>
          </div>
          <div>
            <Progress value={progressPct} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {remaining > 0 ? `${remaining} ${lang === "ar" ? "أقسام متبقية" : "sections remaining"}` : (lang === "ar" ? "مكتمل!" : "Complete!")}
            </p>
          </div>
          <div className="space-y-1">
            {SECTIONS.map(s => {
              const val = profile?.[s.key];
              const done = s.key === "resume" ? !!profile?.resume_url : (Array.isArray(val) && val.length > 0);
              return (
                <div key={s.key} className="flex items-center gap-2 text-xs">
                  {done ? <Check className="h-3.5 w-3.5 text-primary" /> : <div className="h-3.5 w-3.5 rounded border border-muted-foreground/30" />}
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>{lang === "ar" ? s.ar : s.en}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground italic">
            {lang === "ar" ? "الملفات المكتملة تحصل على اهتمام أكبر من أصحاب العمل" : "Complete profiles get more attention from potential employers."}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Skills */}
        <SectionCard title={lang === "ar" ? "المهارات" : "Skills"} icon={Wrench}>
          <div className="flex flex-wrap gap-2 mb-3">
            {(profile?.skills || []).map((skill: string, i: number) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button onClick={() => save("skills", profile.skills.filter((_: any, idx: number) => idx !== i))}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
          <SkillInput onAdd={(skill) => save("skills", [...(profile?.skills || []), skill])} suggestions={SUGGESTED_SKILLS.filter(s => !(profile?.skills || []).includes(s))} lang={lang} />
        </SectionCard>

        {/* Qualifications */}
        <SectionCard title={lang === "ar" ? "المؤهلات" : "Qualifications"} icon={GraduationCap} onAdd={() => setActiveModal("qualification")}>
          {(profile?.qualifications || []).map((q: any, i: number) => (
            <div key={i} className="flex items-start justify-between rounded-xl border border-border p-3 mb-2">
              <div>
                <p className="text-sm font-medium">{q.degree} — {q.field}</p>
                <p className="text-xs text-muted-foreground">{q.institution} ({q.startYear}–{q.endYear || "Present"})</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => save("qualifications", profile.qualifications.filter((_: any, idx: number) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </SectionCard>

        {/* Experience */}
        <SectionCard title={lang === "ar" ? "الخبرات" : "Experience"} icon={Briefcase} onAdd={() => setActiveModal("experience")}>
          {(profile?.experience || []).map((e: any, i: number) => (
            <div key={i} className="flex items-start justify-between rounded-xl border border-border p-3 mb-2">
              <div>
                <p className="text-sm font-medium">{e.title} at {e.company}</p>
                <p className="text-xs text-muted-foreground">{e.type} · {e.startDate}–{e.endDate || "Present"}</p>
                {e.description && <p className="text-xs text-muted-foreground mt-1">{e.description}</p>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => save("experience", profile.experience.filter((_: any, idx: number) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </SectionCard>

        {/* Resume */}
        <SectionCard title={lang === "ar" ? "السيرة الذاتية" : "Resume"} icon={FileText}>
          {profile?.resume_url ? (
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span className="text-sm">Resume uploaded</span></div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => save("resume_url", null)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => resumeRef.current?.click()}><Upload className="h-4 w-4 mr-1" />{lang === "ar" ? "رفع" : "Upload"}</Button>
              <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={async (e) => {
                if (!e.target.files?.[0] || !user) return;
                const file = e.target.files[0];
                const path = `${user.id}/resume.${file.name.split(".").pop()}`;
                await supabase.storage.from("resumes").upload(path, file, { upsert: true });
                save("resume_url", path);
              }} />
            </>
          )}
        </SectionCard>

        {/* Certificates */}
        <SectionCard title={lang === "ar" ? "الشهادات" : "Licences or Certificates"} icon={Award} onAdd={() => setActiveModal("certificate")}>
          {(profile?.certificates || []).map((c: any, i: number) => (
            <div key={i} className="flex items-start justify-between rounded-xl border border-border p-3 mb-2">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.organization} · {c.issueDate}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => save("certificates", profile.certificates.filter((_: any, idx: number) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </SectionCard>

        {/* Portfolio */}
        <SectionCard title={lang === "ar" ? "الأعمال" : "Portfolio"} icon={Image} onAdd={() => setActiveModal("portfolio")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(profile?.portfolio || []).map((p: any, i: number) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{p.title}</p>
                {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                {p.url && <a href={p.url} target="_blank" className="text-xs text-primary hover:underline">{p.url}</a>}
                <Button size="sm" variant="ghost" className="mt-1" onClick={() => save("portfolio", profile.portfolio.filter((_: any, idx: number) => idx !== i))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Digital Profiles */}
        <SectionCard title={lang === "ar" ? "الملف الرقمي" : "Digital Profile"} icon={Globe} onAdd={() => setActiveModal("digital")}>
          {(profile?.digital_profiles || []).map((d: any, i: number) => (
            <div key={i} className="flex items-start justify-between rounded-xl border border-border p-3 mb-2">
              <div>
                <p className="text-sm font-medium">{d.type}</p>
                <a href={d.url} target="_blank" className="text-xs text-primary hover:underline">{d.url}</a>
              </div>
              <Button size="icon" variant="ghost" onClick={() => save("digital_profiles", profile.digital_profiles.filter((_: any, idx: number) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </SectionCard>

        {/* References */}
        <SectionCard title={lang === "ar" ? "المراجع" : "Reference"} icon={Users} onAdd={() => setActiveModal("reference")}>
          {(profile?.references || []).map((r: any, i: number) => (
            <div key={i} className="flex items-start justify-between rounded-xl border border-border p-3 mb-2">
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.title} at {r.company}</p>
                <p className="text-xs text-muted-foreground">{r.email} · {r.phone}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => save("references", profile.references.filter((_: any, idx: number) => idx !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Modals */}
      <QualificationModal open={activeModal === "qualification"} onClose={() => setActiveModal(null)} onSave={(q) => save("qualifications", [...(profile?.qualifications || []), q])} lang={lang} />
      <ExperienceModal open={activeModal === "experience"} onClose={() => setActiveModal(null)} onSave={(e) => save("experience", [...(profile?.experience || []), e])} lang={lang} />
      <CertificateModal open={activeModal === "certificate"} onClose={() => setActiveModal(null)} onSave={(c) => save("certificates", [...(profile?.certificates || []), c])} lang={lang} />
      <PortfolioModal open={activeModal === "portfolio"} onClose={() => setActiveModal(null)} onSave={(p) => save("portfolio", [...(profile?.portfolio || []), p])} lang={lang} />
      <DigitalProfileModal open={activeModal === "digital"} onClose={() => setActiveModal(null)} onSave={(d) => save("digital_profiles", [...(profile?.digital_profiles || []), d])} lang={lang} />
      <ReferenceModal open={activeModal === "reference"} onClose={() => setActiveModal(null)} onSave={(r) => save("references", [...(profile?.references || []), r])} lang={lang} />
    </div>
  );
};

// Reusable card wrapper
const SectionCard = ({ title, icon: Icon, onAdd, children }: { title: string; icon: any; onAdd?: () => void; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">{title}</h3></div>
      {onAdd && <Button size="sm" variant="outline" onClick={onAdd}><Plus className="h-4 w-4 mr-1" />Add</Button>}
    </div>
    {children}
  </div>
);

// Skill input with suggestions
const SkillInput = ({ onAdd, suggestions, lang }: { onAdd: (s: string) => void; suggestions: string[]; lang: string }) => {
  const [val, setVal] = useState("");
  return (
    <div>
      <div className="flex gap-2">
        <Input value={val} onChange={e => setVal(e.target.value)} placeholder={lang === "ar" ? "أدخل مهارة..." : "Type a skill..."} onKeyDown={e => { if (e.key === "Enter" && val.trim()) { onAdd(val.trim()); setVal(""); } }} />
        <Button size="sm" disabled={!val.trim()} onClick={() => { onAdd(val.trim()); setVal(""); }}>{lang === "ar" ? "إضافة" : "Add"}</Button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.slice(0, 8).map(s => (
            <button key={s} onClick={() => onAdd(s)} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">{s}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// -- Modals --
const QualificationModal = ({ open, onClose, onSave, lang }: { open: boolean; onClose: () => void; onSave: (q: any) => void; lang: string }) => {
  const [form, setForm] = useState({ degree: "", field: "", institution: "", startYear: "", endYear: "" });
  const handleSave = () => { onSave(form); setForm({ degree: "", field: "", institution: "", startYear: "", endYear: "" }); onClose(); };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{lang === "ar" ? "إضافة مؤهل" : "Add Qualification"}</DialogTitle><DialogDescription>{lang === "ar" ? "أدخل تفاصيل المؤهل" : "Enter qualification details"}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>{lang === "ar" ? "الدرجة" : "Degree"}</Label>
            <Select value={form.degree} onValueChange={v => setForm(f => ({ ...f, degree: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>{lang === "ar" ? "التخصص" : "Field of Study"}</Label><Input value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} /></div>
          <div><Label>{lang === "ar" ? "المؤسسة" : "Institution"}</Label><Input value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{lang === "ar" ? "سنة البداية" : "Start Year"}</Label><Input value={form.startYear} onChange={e => setForm(f => ({ ...f, startYear: e.target.value }))} /></div>
            <div><Label>{lang === "ar" ? "سنة النهاية" : "End Year"}</Label><Input value={form.endYear} onChange={e => setForm(f => ({ ...f, endYear: e.target.value }))} placeholder="Present" /></div>
          </div>
          <Button className="w-full" onClick={handleSave}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ExperienceModal = ({ open, onClose, onSave, lang }: { open: boolean; onClose: () => void; onSave: (e: any) => void; lang: string }) => {
  const [form, setForm] = useState({ title: "", company: "", type: "Full-time", startDate: "", endDate: "", description: "" });
  const handleSave = () => { onSave(form); setForm({ title: "", company: "", type: "Full-time", startDate: "", endDate: "", description: "" }); onClose(); };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{lang === "ar" ? "إضافة خبرة" : "Add Experience"}</DialogTitle><DialogDescription>{lang === "ar" ? "أدخل تفاصيل الخبرة" : "Enter experience details"}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>{lang === "ar" ? "المسمى" : "Job Title"}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><Label>{lang === "ar" ? "الشركة" : "Company"}</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
          <div><Label>{lang === "ar" ? "نوع التوظيف" : "Employment Type"}</Label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Full-time", "Part-time", "Freelance", "Internship"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{lang === "ar" ? "بداية" : "Start"}</Label><Input type="month" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div><Label>{lang === "ar" ? "نهاية" : "End"}</Label><Input type="month" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} placeholder="Present" /></div>
          </div>
          <div><Label>{lang === "ar" ? "الوصف" : "Description"}</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
          <Button className="w-full" onClick={handleSave}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CertificateModal = ({ open, onClose, onSave, lang }: { open: boolean; onClose: () => void; onSave: (c: any) => void; lang: string }) => {
  const [form, setForm] = useState({ name: "", organization: "", issueDate: "", expiryDate: "", certId: "" });
  const handleSave = () => { onSave(form); setForm({ name: "", organization: "", issueDate: "", expiryDate: "", certId: "" }); onClose(); };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{lang === "ar" ? "إضافة شهادة" : "Add Certificate"}</DialogTitle><DialogDescription>{lang === "ar" ? "أدخل تفاصيل الشهادة" : "Enter certificate details"}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>{lang === "ar" ? "الاسم" : "Name"}</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><Label>{lang === "ar" ? "الجهة المصدرة" : "Organization"}</Label><Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{lang === "ar" ? "تاريخ الإصدار" : "Issue Date"}</Label><Input type="date" value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} /></div>
            <div><Label>{lang === "ar" ? "تاريخ الانتهاء" : "Expiry"}</Label><Input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
          </div>
          <div><Label>{lang === "ar" ? "رقم الشهادة" : "Certificate ID"}</Label><Input value={form.certId} onChange={e => setForm(f => ({ ...f, certId: e.target.value }))} /></div>
          <Button className="w-full" onClick={handleSave}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PortfolioModal = ({ open, onClose, onSave, lang }: { open: boolean; onClose: () => void; onSave: (p: any) => void; lang: string }) => {
  const [form, setForm] = useState({ title: "", description: "", url: "" });
  const handleSave = () => { onSave(form); setForm({ title: "", description: "", url: "" }); onClose(); };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{lang === "ar" ? "إضافة عمل" : "Add Portfolio Item"}</DialogTitle><DialogDescription>{lang === "ar" ? "أدخل تفاصيل المشروع" : "Enter project details"}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>{lang === "ar" ? "العنوان" : "Title"}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><Label>{lang === "ar" ? "الوصف" : "Description"}</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
          <div><Label>{lang === "ar" ? "الرابط" : "URL"}</Label><Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
          <Button className="w-full" onClick={handleSave}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DigitalProfileModal = ({ open, onClose, onSave, lang }: { open: boolean; onClose: () => void; onSave: (d: any) => void; lang: string }) => {
  const [form, setForm] = useState({ type: "LinkedIn", url: "", description: "" });
  const handleSave = () => { onSave(form); setForm({ type: "LinkedIn", url: "", description: "" }); onClose(); };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{lang === "ar" ? "إضافة ملف رقمي" : "Add Digital Profile"}</DialogTitle><DialogDescription>{lang === "ar" ? "أدخل رابط الملف" : "Enter profile details"}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>{lang === "ar" ? "النوع" : "Type"}</Label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["LinkedIn", "Portfolio Website", "GitHub", "Video Introduction", "Audio Introduction"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>{lang === "ar" ? "الرابط" : "URL"}</Label><Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
          <Button className="w-full" onClick={handleSave}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReferenceModal = ({ open, onClose, onSave, lang }: { open: boolean; onClose: () => void; onSave: (r: any) => void; lang: string }) => {
  const [form, setForm] = useState({ name: "", title: "", company: "", email: "", phone: "", relationship: "" });
  const handleSave = () => { onSave(form); setForm({ name: "", title: "", company: "", email: "", phone: "", relationship: "" }); onClose(); };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{lang === "ar" ? "إضافة مرجع" : "Add Reference"}</DialogTitle><DialogDescription>{lang === "ar" ? "أدخل معلومات المرجع" : "Enter reference details"}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>{lang === "ar" ? "الاسم" : "Name"}</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{lang === "ar" ? "المسمى" : "Job Title"}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>{lang === "ar" ? "الشركة" : "Company"}</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{lang === "ar" ? "البريد" : "Email"}</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>{lang === "ar" ? "الهاتف" : "Phone"}</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div><Label>{lang === "ar" ? "العلاقة" : "Relationship"}</Label><Input value={form.relationship} onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))} /></div>
          <Button className="w-full" onClick={handleSave}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobProfileSection;
