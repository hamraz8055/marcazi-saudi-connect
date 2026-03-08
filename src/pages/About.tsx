import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import { motion } from "framer-motion";
import { Target, Users, Globe, Shield } from "lucide-react";

const About = () => {
  const { t, lang } = useI18n();

  const values = [
    { icon: Target, title: lang === "ar" ? "رؤيتنا" : "Our Vision", desc: lang === "ar" ? "أن نكون السوق الرقمي الأول في المملكة العربية السعودية لتبادل الموارد والخدمات" : "To be Saudi Arabia's leading digital marketplace for resource and service exchange" },
    { icon: Users, title: lang === "ar" ? "مجتمعنا" : "Our Community", desc: lang === "ar" ? "أكثر من 100,000 مستخدم نشط يتبادلون الموارد يومياً" : "Over 100,000 active users exchanging resources daily" },
    { icon: Globe, title: lang === "ar" ? "تغطيتنا" : "Our Reach", desc: lang === "ar" ? "نغطي أكثر من 30 مدينة في جميع أنحاء المملكة" : "Covering 30+ cities across the Kingdom" },
    { icon: Shield, title: lang === "ar" ? "الثقة والأمان" : "Trust & Safety", desc: lang === "ar" ? "نظام تحقق متقدم لضمان تجربة آمنة وموثوقة" : "Advanced verification system ensuring safe, trusted transactions" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.about" descriptionKey="about.desc" />
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary py-20">
        <div className="container relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold text-primary-foreground">
            {lang === "ar" ? "عن مركزي" : "About Marcazi"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            {lang === "ar"
              ? "مركزي هو السوق الرقمي الأول في المملكة العربية السعودية، يربط بين المشترين والبائعين في مجالات المعدات والعقارات والمركبات والخدمات والوظائف والتجارة."
              : "Marcazi is Saudi Arabia's premier B2B marketplace connecting buyers and sellers across equipment, property, vehicles, services, jobs, and trading."}
          </motion.p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{v.title}</h3>
                <p className="mt-1 text-muted-foreground">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-muted/50 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {lang === "ar" ? "مهمتنا" : "Our Mission"}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
            {lang === "ar"
              ? "نسعى لتمكين الشركات والأفراد في المملكة العربية السعودية من خلال توفير منصة رقمية موثوقة وسهلة الاستخدام لتبادل الموارد والخدمات، دعماً لرؤية 2030."
              : "We empower businesses and individuals across Saudi Arabia with a trusted, easy-to-use digital platform for resource and service exchange, supporting Vision 2030."}
          </p>
        </div>
      </section>

      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default About;
