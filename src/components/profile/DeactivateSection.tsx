import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const REASONS = [
  { value: "privacy", en: "Privacy concerns", ar: "مخاوف الخصوصية" },
  { value: "break", en: "Taking a break", ar: "أخذ استراحة" },
  { value: "found", en: "Found what I needed", ar: "وجدت ما أحتاج" },
  { value: "emails", en: "Too many emails", ar: "إيميلات كثيرة" },
  { value: "other", en: "Other", ar: "أخرى" },
];

const DeactivateSection = () => {
  const { user, signOut } = useAuth();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"temp" | "permanent">("temp");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [processing, setProcessing] = useState(false);

  const canSubmit = reason.length > 0 && password.length > 0;

  const handleDeactivate = async () => {
    if (mode === "permanent") {
      setShowConfirm(true);
      setCountdown(10);
      const interval = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; }), 1000);
      return;
    }
    await doDeactivate();
  };

  const doDeactivate = async () => {
    if (!user) return;
    setProcessing(true);
    await supabase.from("profiles").update({
      status: mode === "permanent" ? "deleted" : "deactivated",
      deactivation_reason: reason,
    } as any).eq("user_id", user.id);
    await signOut();
    toast.success(lang === "ar" ? "تم تعطيل الحساب" : "Account deactivated");
    navigate("/");
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-destructive/30 bg-card p-6">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">
            {lang === "ar"
              ? "تعطيل حسابك سيخفي جميع إعلاناتك ولن تتمكن من تسجيل الدخول."
              : "Deactivating your account will hide all your listings and you won't be able to sign in."}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${mode === "temp" ? "border-primary bg-primary/5" : "border-border"}`}>
            <input type="radio" checked={mode === "temp"} onChange={() => setMode("temp")} className="mt-1" />
            <div>
              <p className="text-sm font-medium">{lang === "ar" ? "تعطيل مؤقت" : "Temporarily deactivate"}</p>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "يمكنك إعادة التفعيل لاحقاً" : "I want to take a break. I can reactivate later."}</p>
            </div>
          </label>
          <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${mode === "permanent" ? "border-destructive bg-destructive/5" : "border-border"}`}>
            <input type="radio" checked={mode === "permanent"} onChange={() => setMode("permanent")} className="mt-1" />
            <div>
              <p className="text-sm font-medium text-destructive">{lang === "ar" ? "حذف نهائي" : "Permanently delete"}</p>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "حذف جميع بياناتي. لا يمكن التراجع." : "Delete all my data. This cannot be undone."}</p>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <Label>{lang === "ar" ? "السبب" : "Reason"}</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر السبب" : "Select a reason"} /></SelectTrigger>
              <SelectContent>
                {REASONS.map(r => <SelectItem key={r.value} value={r.value}>{lang === "ar" ? r.ar : r.en}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{lang === "ar" ? "تفاصيل إضافية (اختياري)" : "Tell us more (optional)"}</Label>
            <Textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} />
          </div>
          <div>
            <Label>{lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button variant="destructive" className="w-full" onClick={handleDeactivate} disabled={!canSubmit || processing}>
            {lang === "ar" ? "تعطيل الحساب" : "Deactivate Account"}
          </Button>
        </div>
      </div>

      {/* Permanent delete confirm */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">{lang === "ar" ? "هل أنت متأكد تماماً؟" : "Are you absolutely sure?"}</DialogTitle>
            <DialogDescription>{lang === "ar" ? "سيتم حذف جميع بياناتك نهائياً" : "All your data will be permanently deleted"}</DialogDescription>
          </DialogHeader>
          <Button variant="destructive" className="w-full" disabled={countdown > 0 || processing} onClick={doDeactivate}>
            {countdown > 0
              ? `${lang === "ar" ? "انتظر" : "Wait"} ${countdown}s`
              : lang === "ar" ? "حذف نهائياً" : "Delete Permanently"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeactivateSection;
