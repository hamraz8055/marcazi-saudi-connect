import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const NATIONALITIES = [
  "Saudi Arabia", "UAE", "Egypt", "India", "Pakistan", "Philippines",
  "Jordan", "Syria", "Lebanon", "Yemen", "Sudan", "Bangladesh",
  "Indonesia", "Morocco", "Tunisia", "Turkey", "United States", "United Kingdom", "Other",
];

const BasicInfoSection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    display_name: "",
    avatar_url: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    verification_status: "unverified",
    joined_at: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfile({
          first_name: (data as any).first_name || "",
          last_name: (data as any).last_name || "",
          nickname: (data as any).nickname || "",
          display_name: data.display_name || "",
          avatar_url: data.avatar_url || "",
          date_of_birth: (data as any).date_of_birth || "",
          gender: (data as any).gender || "",
          nationality: (data as any).nationality || "",
          verification_status: data.verification_status || "unverified",
          joined_at: (data as any).joined_at || data.created_at || "",
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    
    if (uploadError) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();

    await supabase.from("profiles").update({ avatar_url: avatarUrl } as any).eq("user_id", user.id);
    setProfile(p => ({ ...p, avatar_url: avatarUrl }));
    toast.success(lang === "ar" ? "تم تحديث الصورة" : "Avatar updated");
    setUploading(false);
  };

  const handleSaveBasic = async () => {
    if (!user) return;
    setSaving(true);
    const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.nickname || profile.display_name;
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      first_name: profile.first_name,
      last_name: profile.last_name,
      nickname: profile.nickname,
    } as any).eq("user_id", user.id);
    if (!error) toast.success(lang === "ar" ? "تم الحفظ" : "Saved successfully");
    else toast.error("Error saving");
    setSaving(false);
  };

  const handleSaveDetails = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      date_of_birth: profile.date_of_birth || null,
      gender: profile.gender || null,
      nationality: profile.nationality || null,
    } as any).eq("user_id", user.id);
    if (!error) toast.success(lang === "ar" ? "تم الحفظ" : "Saved successfully");
    else toast.error("Error saving");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  const displayName = profile.first_name || profile.display_name || user?.email?.split("@")[0] || "User";
  const joinedDate = profile.joined_at ? new Date(profile.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
            {joinedDate && (
              <p className="text-sm text-muted-foreground">
                {lang === "ar" ? `انضم في ${joinedDate}` : `Joined on ${joinedDate}`}
              </p>
            )}
          </div>
        </div>

        {/* Verification banner */}
        {profile.verification_status !== "verified" && (
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {lang === "ar" ? "احصل على شارة التوثيق!" : "Got a verified badge yet?"}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" />{lang === "ar" ? "رؤية أكبر" : "Get more visibility"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3 w-3" />{lang === "ar" ? "مصداقية أعلى" : "Enhance your credibility"}
                </span>
              </div>
            </div>
            <Button size="sm" onClick={() => window.location.hash = "verify"}>
              {lang === "ar" ? "ابدأ" : "Get Started"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Name */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{lang === "ar" ? "الاسم" : "Profile Name"}</h2>
          <p className="text-sm text-muted-foreground">{lang === "ar" ? "يظهر في ملفك الشخصي" : "This is displayed on your profile"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>{lang === "ar" ? "الاسم الأول" : "First Name"}</Label>
            <Input value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} />
          </div>
          <div>
            <Label>{lang === "ar" ? "اسم العائلة" : "Last Name"}</Label>
            <Input value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} />
          </div>
        </div>
        <div>
          <Label>{lang === "ar" ? "اسم العرض" : "Nickname / Display Name"}</Label>
          <Input value={profile.nickname} onChange={e => setProfile(p => ({ ...p, nickname: e.target.value }))} placeholder={lang === "ar" ? "اختياري" : "Optional"} />
        </div>
        <Button onClick={handleSaveBasic} disabled={saving}>{lang === "ar" ? "حفظ التغييرات" : "Save Changes"}</Button>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{lang === "ar" ? "تفاصيل الحساب" : "Account Details"}</h2>
          <p className="text-sm text-muted-foreground">{lang === "ar" ? "غير مرئي للمستخدمين الآخرين" : "This is not visible to other users"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>{lang === "ar" ? "تاريخ الميلاد" : "Date of Birth"}</Label>
            <Input type="date" value={profile.date_of_birth} onChange={e => setProfile(p => ({ ...p, date_of_birth: e.target.value }))} />
          </div>
          <div>
            <Label>{lang === "ar" ? "الجنس" : "Gender"}</Label>
            <Select value={profile.gender} onValueChange={v => setProfile(p => ({ ...p, gender: v }))}>
              <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر" : "Select"} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{lang === "ar" ? "ذكر" : "Male"}</SelectItem>
                <SelectItem value="female">{lang === "ar" ? "أنثى" : "Female"}</SelectItem>
                <SelectItem value="other">{lang === "ar" ? "أفضل عدم القول" : "Prefer not to say"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{lang === "ar" ? "الجنسية" : "Nationality"}</Label>
          <Select value={profile.nationality} onValueChange={v => setProfile(p => ({ ...p, nationality: v }))}>
            <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر الجنسية" : "Select nationality"} /></SelectTrigger>
            <SelectContent>
              {NATIONALITIES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSaveDetails} disabled={saving}>{lang === "ar" ? "حفظ التغييرات" : "Save Changes"}</Button>
      </div>
    </div>
  );
};

export default BasicInfoSection;
