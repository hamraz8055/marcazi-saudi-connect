import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { lang } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1000));
    toast.success(lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.contact" />
      <Header />
      <div className="container max-w-4xl py-10 pb-24 md:pb-10">
        <h1 className="text-3xl font-bold text-foreground">{lang === "ar" ? "تواصل معنا" : "Contact Us"}</h1>
        <p className="mt-2 text-muted-foreground">{lang === "ar" ? "نسعد بتواصلكم" : "We'd love to hear from you"}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Mail, label: lang === "ar" ? "البريد الإلكتروني" : "Email", value: "support@marcazi.com" },
            { icon: Phone, label: lang === "ar" ? "الهاتف" : "Phone", value: "+966 11 XXX XXXX" },
            { icon: MapPin, label: lang === "ar" ? "العنوان" : "Address", value: lang === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">{lang === "ar" ? "الاسم" : "Name"}</label>
              <Input className="mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label>
              <Input className="mt-1" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{lang === "ar" ? "الموضوع" : "Subject"}</label>
            <Input className="mt-1" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{lang === "ar" ? "الرسالة" : "Message"}</label>
            <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "..." : lang === "ar" ? "إرسال" : "Send Message"}
          </Button>
        </form>
      </div>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Contact;
