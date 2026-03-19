import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { LogIn, UserPlus, X } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { lang, t } = useI18n();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(lang === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(lang === "ar" ? "تم تسجيل الدخول" : "Signed in successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white dark:bg-[#1A1A1A] border-none rounded-[24px] shadow-2xl gap-0 [&>button]:hidden">
        
        {/* Custom close button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md text-white md:text-[#1A1A1A] md:dark:text-white md:bg-[#FAFAFA] md:dark:bg-[#333] hover:bg-black/40 md:hover:bg-[#EBEBEB] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Image Side - Hidden on mobile */}
          <div className="hidden md:block relative bg-[#1A1A1A] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Luxury Estate" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                <span className="font-fraunces font-bold text-xl">M</span>
              </div>
              <h3 className="text-[28px] font-fraunces font-bold leading-tight mb-3">
                {lang === "ar" ? "اكتشف عالم من الفخامة" : "Discover a world of luxury"}
              </h3>
              <p className="text-[15px] font-medium text-white/80 leading-relaxed max-w-[280px]">
                {lang === "ar" 
                  ? "انضم إلى منصة مركزي للوصول إلى أفضل العروض العقارية والمنتجات الحصرية." 
                  : "Join Marcazi platform to access the best real estate offers and exclusive items."}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#1A1A1A] relative">
            
            <div className="mb-8">
              <h2 className="text-[28px] font-fraunces font-bold text-[#1A1A1A] dark:text-white mb-2 leading-tight">
                {mode === "login"
                  ? lang === "ar" ? "مرحباً بعودتك" : "Welcome back"
                  : lang === "ar" ? "إنشاء حساب جديد" : "Create new account"}
              </h2>
              <p className="text-[15px] font-medium text-text-muted">
                {mode === "login"
                  ? lang === "ar" ? "سجل الدخول للمتابعة إلى حسابك" : "Sign in to continue to your account"
                  : lang === "ar" ? "انضم إلينا اليوم للبدء" : "Join us today to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block mb-2">
                    {lang === "ar" ? "الاسم" : "Display Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "محمد صالح" : "John Doe"}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-[#9CA3AF] transition-all"
                  />
                </div>
              )}
              
              <div>
                <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block mb-2">
                  {lang === "ar" ? "البريد الإلكتروني" : "Email address"}
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[14px] font-bold text-[#1A1A1A] dark:text-white block">
                    {lang === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  {mode === "login" && (
                    <a href="#" className="text-[13px] font-bold text-brand hover:underline">
                      {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot pass?"}
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 px-4 rounded-xl bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] font-bold text-[15px] hover:bg-black/90 dark:hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
                ) : (
                  <>
                    {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {mode === "login"
                      ? lang === "ar" ? "تسجيل الدخول" : "Sign In"
                      : lang === "ar" ? "إنشاء الحساب" : "Create Account"}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#EBEBEB] dark:border-white/6 text-center">
              <p className="text-[14px] font-medium text-text-muted">
                {mode === "login"
                  ? lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"
                  : lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}
                {" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-[#1A1A1A] dark:text-white font-bold hover:text-brand transition-colors"
                >
                  {mode === "login"
                    ? lang === "ar" ? "سجل الآن" : "Sign Up"
                    : lang === "ar" ? "سجل دخول" : "Sign In"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
