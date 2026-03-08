import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, Lock, Monitor, Check, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";

const SecuritySection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pw, setPw] = useState({ current: "", new: "", confirm: "" });
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const maskedEmail = user?.email
    ? user.email.replace(/(.{2})(.*)(@)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 5)) + c)
    : "";

  // Password strength
  const checks = {
    length: pw.new.length >= 8,
    upper: /[A-Z]/.test(pw.new),
    number: /[0-9]/.test(pw.new),
    special: /[^A-Za-z0-9]/.test(pw.new),
  };
  const strengthCount = Object.values(checks).filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Strong", "Very Strong"][strengthCount] || "";
  const strengthColor = ["", "bg-destructive", "bg-yellow-500", "bg-primary", "bg-primary"][strengthCount] || "";

  const handleChangePassword = async () => {
    if (pw.new !== pw.confirm) { toast.error(lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords don't match"); return; }
    if (strengthCount < 3) { toast.error(lang === "ar" ? "كلمة المرور ضعيفة" : "Password too weak"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw.new });
    if (error) toast.error(error.message);
    else { toast.success(lang === "ar" ? "تم تغيير كلمة المرور" : "Password changed"); setShowPasswordModal(false); setPw({ current: "", new: "", confirm: "" }); }
    setSaving(false);
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) toast.error(error.message);
    else { toast.success(lang === "ar" ? "تم إرسال رابط التأكيد" : "Confirmation email sent"); setShowEmailModal(false); }
    setSaving(false);
  };

  const handleSignOutAll = async () => {
    await supabase.auth.signOut({ scope: "global" });
    toast.success(lang === "ar" ? "تم تسجيل الخروج من جميع الأجهزة" : "Signed out of all devices");
  };

  return (
    <div className="space-y-6">
      {/* Email */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</p>
              <p className="text-sm text-muted-foreground">{maskedEmail}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowEmailModal(true)}>
            {lang === "ar" ? "تغيير" : "Change"}
          </Button>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{lang === "ar" ? "كلمة المرور" : "Password"}</p>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowPasswordModal(true)}>
            {lang === "ar" ? "تغيير" : "Change"}
          </Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">{lang === "ar" ? "الجلسات النشطة" : "Active Sessions"}</h3>
        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{lang === "ar" ? "الجهاز الحالي" : "Current Session"}</p>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? "هذا الجهاز" : "This device"}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={handleSignOutAll}>
          {lang === "ar" ? "تسجيل الخروج من جميع الأجهزة" : "Sign out of all other devices"}
        </Button>
      </div>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}</DialogTitle>
            <DialogDescription>{lang === "ar" ? "أدخل كلمة المرور الجديدة" : "Enter your new password"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>{lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}</Label><Input type="password" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} /></div>
            <div>
              <Label>{lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}</Label>
              <Input type="password" value={pw.new} onChange={e => setPw(p => ({ ...p, new: e.target.value }))} />
              {pw.new && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress value={strengthCount * 25} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{strengthLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries({ length: lang === "ar" ? "٨ أحرف على الأقل" : "At least 8 characters", upper: lang === "ar" ? "حرف كبير" : "One uppercase letter", number: lang === "ar" ? "رقم واحد" : "One number", special: lang === "ar" ? "رمز خاص" : "One special character" }).map(([k, label]) => (
                      <div key={k} className="flex items-center gap-1">
                        {checks[k as keyof typeof checks] ? <Check className="h-3 w-3 text-primary" /> : <X className="h-3 w-3 text-muted-foreground" />}
                        <span className={checks[k as keyof typeof checks] ? "text-primary" : "text-muted-foreground"}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div><Label>{lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</Label><Input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} /></div>
            <Button className="w-full" onClick={handleChangePassword} disabled={saving}>{lang === "ar" ? "تغيير" : "Change Password"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === "ar" ? "تغيير البريد الإلكتروني" : "Change Email"}</DialogTitle>
            <DialogDescription>{lang === "ar" ? "سيتم إرسال رابط تأكيد" : "A confirmation link will be sent"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>{lang === "ar" ? "البريد الجديد" : "New Email"}</Label><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} /></div>
            <Button className="w-full" onClick={handleChangeEmail} disabled={saving}>{lang === "ar" ? "إرسال التأكيد" : "Send Confirmation"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySection;
