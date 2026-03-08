import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Upload, FileText, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type VerificationType = "individual" | "business";
type Step = 1 | 2 | 3;

const VerificationSection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const [status, setStatus] = useState<string>("unverified");
  const [step, setStep] = useState<Step>(1);
  const [vType, setVType] = useState<VerificationType>("individual");
  const [files, setFiles] = useState<Record<string, File | null>>({
    id_front: null, id_back: null, selfie: null, cr_doc: null, vat_doc: null,
  });
  const [crNumber, setCrNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("verification_status").eq("user_id", user.id).single().then(({ data }) => {
      setStatus(data?.verification_status || "unverified");
    });
  }, [user]);

  const handleFileChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFiles(f => ({ ...f, [key]: e.target.files![0] }));
  };

  const handleSubmit = async () => {
    if (!user || !confirmed) return;
    setSubmitting(true);

    // Upload files
    const uploadedDocs: Record<string, string> = {};
    for (const [key, file] of Object.entries(files)) {
      if (!file) continue;
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${key}.${ext}`;
      const { error } = await supabase.storage.from("verification-docs").upload(path, file, { upsert: true });
      if (!error) uploadedDocs[key] = path;
    }

    await supabase.from("profiles").update({
      verification_status: "pending",
      verification_docs: {
        type: vType,
        files: uploadedDocs,
        cr_number: crNumber,
        business_name: businessName,
        submitted_at: new Date().toISOString(),
      },
    } as any).eq("user_id", user.id);

    setStatus("pending");
    toast.success(lang === "ar" ? "تم إرسال طلب التوثيق" : "Verification request submitted");
    setSubmitting(false);
  };

  if (status === "verified") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle className="h-12 w-12 mx-auto text-primary mb-3" />
        <h2 className="text-lg font-bold text-foreground">{lang === "ar" ? "تم التوثيق" : "Verified Seller"}</h2>
        <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "حسابك موثق ومعتمد" : "Your account is verified and trusted"}</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10 p-8 text-center">
        <Clock className="h-12 w-12 mx-auto text-yellow-600 mb-3" />
        <h2 className="text-lg font-bold text-foreground">{lang === "ar" ? "قيد المراجعة" : "Under Review"}</h2>
        <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "عادة ١-٢ أيام عمل" : "Typically 1–2 business days"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex items-center gap-2 ${s <= step ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${s <= step ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-8 ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Choose type */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">{lang === "ar" ? "نوع التوثيق" : "Choose verification type"}</h2>
          <div className="space-y-3">
            <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer ${vType === "individual" ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="radio" checked={vType === "individual"} onChange={() => setVType("individual")} className="mt-1" />
              <div>
                <p className="text-sm font-medium">{lang === "ar" ? "فرد (هوية / إقامة)" : "Individual (National ID / Iqama)"}</p>
              </div>
            </label>
            <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer ${vType === "business" ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="radio" checked={vType === "business"} onChange={() => setVType("business")} className="mt-1" />
              <div>
                <p className="text-sm font-medium">{lang === "ar" ? "شركة (سجل تجاري)" : "Business (Commercial Registration / CR)"}</p>
              </div>
            </label>
          </div>
          <Button className="w-full" onClick={() => setStep(2)}>{lang === "ar" ? "التالي" : "Next"}</Button>
        </div>
      )}

      {/* Step 2 — Upload docs */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">{lang === "ar" ? "رفع المستندات" : "Upload Documents"}</h2>

          {vType === "individual" ? (
            <div className="space-y-4">
              <FileUploadField label={lang === "ar" ? "وجه الهوية" : "Front of ID / Iqama"} file={files.id_front} onChange={handleFileChange("id_front")} />
              <FileUploadField label={lang === "ar" ? "خلف الهوية" : "Back of ID / Iqama"} file={files.id_back} onChange={handleFileChange("id_back")} />
              <FileUploadField label={lang === "ar" ? "صورة شخصية مع الهوية (اختياري)" : "Selfie holding ID (optional)"} file={files.selfie} onChange={handleFileChange("selfie")} />
            </div>
          ) : (
            <div className="space-y-4">
              <FileUploadField label={lang === "ar" ? "السجل التجاري" : "CR Document"} file={files.cr_doc} onChange={handleFileChange("cr_doc")} />
              <FileUploadField label={lang === "ar" ? "شهادة ضريبة القيمة المضافة (اختياري)" : "VAT Certificate (optional)"} file={files.vat_doc} onChange={handleFileChange("vat_doc")} />
              <div>
                <Label>{lang === "ar" ? "اسم الشركة" : "Business Name"}</Label>
                <Input value={businessName} onChange={e => setBusinessName(e.target.value)} />
              </div>
              <div>
                <Label>{lang === "ar" ? "رقم السجل التجاري" : "CR Number"}</Label>
                <Input value={crNumber} onChange={e => setCrNumber(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>{lang === "ar" ? "رجوع" : "Back"}</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>{lang === "ar" ? "التالي" : "Next"}</Button>
          </div>
        </div>
      )}

      {/* Step 3 — Review & Submit */}
      {step === 3 && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold">{lang === "ar" ? "مراجعة وإرسال" : "Review & Submit"}</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{lang === "ar" ? "نوع التوثيق:" : "Type:"} <span className="font-medium text-foreground capitalize">{vType}</span></p>
            <p className="text-sm text-muted-foreground">{lang === "ar" ? "المستندات المرفوعة:" : "Uploaded docs:"}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(files).filter(([, f]) => f).map(([key, file]) => (
                <div key={key} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5" />{file!.name}
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={confirmed} onCheckedChange={c => setConfirmed(!!c)} />
            <span className="text-sm">{lang === "ar" ? "أؤكد أن هذه المستندات حقيقية وتخصني" : "I confirm these documents are genuine and belong to me / my business"}</span>
          </label>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>{lang === "ar" ? "رجوع" : "Back"}</Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!confirmed || submitting}>
              <ShieldCheck className="h-4 w-4 mr-1" />{lang === "ar" ? "إرسال للمراجعة" : "Submit for Verification"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const FileUploadField = ({ label, file, onChange }: { label: string; file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <Label>{label}</Label>
    <label className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
      <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground truncate">{file ? file.name : "Click to upload"}</span>
      <input type="file" accept="image/*,.pdf" className="hidden" onChange={onChange} />
    </label>
  </div>
);

export default VerificationSection;
