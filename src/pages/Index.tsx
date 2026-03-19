import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedListings from "@/components/FeaturedListings";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { Moon, Sun, Bell, Shield, MessageCircle, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StatsCard = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [counts, setCounts] = useState({ listings: 0, cities: 0, users: 0, sales: 0 });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        // easeOut quint
        const easeProgress = 1 - Math.pow(1 - progress, 5);
        
        setCounts({
          listings: Math.min(50, Math.floor(50 * easeProgress)),
          cities: Math.min(30, Math.floor(30 * easeProgress)),
          users: Math.min(100, Math.floor(100 * easeProgress)),
          sales: Math.min(10, Math.floor(10 * easeProgress)),
        });
        
        if (step >= steps) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, hasAnimated]);

  return (
    <div ref={ref} className="mx-4 rounded-3xl p-7 my-6 shadow-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'}}>
      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div>
          <div className="font-fraunces text-[32px] font-bold text-white">{counts.listings}K+</div>
          <div className="text-[12px] text-[#9CA3AF] mt-1">Active Listings</div>
        </div>
        <div>
          <div className="font-fraunces text-[32px] font-bold text-white">{counts.cities}+</div>
          <div className="text-[12px] text-[#9CA3AF] mt-1">Cities Covered</div>
        </div>
        <div>
          <div className="font-fraunces text-[32px] font-bold text-white">{counts.users}K+</div>
          <div className="text-[12px] text-[#9CA3AF] mt-1">Monthly Users</div>
        </div>
        <div>
          <div className="font-fraunces text-[32px] font-bold text-white">{counts.sales}K+</div>
          <div className="text-[12px] text-[#9CA3AF] mt-1">Successful Deals</div>
        </div>
      </div>
    </div>
  );
};

const TrustPillars = () => {
  return (
    <section className="py-6 overflow-hidden">
      <div className="flex gap-3 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
        {[
          { icon: Shield, title: "Verified Sellers", body: "Every seller is vetted for safety." },
          { icon: MessageCircle, title: "Secure Chat", body: "End-to-end encrypted messaging." },
          { icon: Star, title: "Real Reviews", body: "Honest feedback from actual buyers." }
        ].map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div key={i} className="snap-start w-[160px] flex-shrink-0 bg-white dark:bg-[#1A1A1A] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#EBEBEB] dark:border-white/6 cursor-pointer hover:border-brand transition-colors">
              <div className="w-10 h-10 rounded-full bg-brand/12 flex items-center justify-center text-brand mb-2.5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-[13px] font-bold text-[#1A1A1A] dark:text-white leading-tight">
                {pillar.title}
              </h3>
              <p className="text-[11.5px] text-text-muted leading-relaxed mt-1.5">
                {pillar.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const CityExplore = () => {
  const navigate = useNavigate();
  const cities = [
    { name: "Riyadh", image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=500&fit=crop" },
    { name: "Jeddah", image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=500&fit=crop" },
    { name: "Dammam", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=500&fit=crop" },
    { name: "Mecca", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=500&fit=crop" },
    { name: "Medina", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=500&fit=crop" }
  ];

  return (
    <section className="py-8 overflow-hidden">
      <div className="px-5 mb-5">
        <h2 className="font-fraunces text-[22px] font-bold text-[#1A1A1A] dark:text-white leading-none">
          Explore by City
        </h2>
      </div>
      <div className="flex gap-3.5 overflow-x-auto px-5 pb-4 scrollbar-hide snap-x snap-mandatory">
        {cities.map((city, i) => (
          <div 
            key={i} 
            className="snap-start w-[140px] h-[180px] flex-shrink-0 rounded-[20px] overflow-hidden relative cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            onClick={() => navigate('/browse?city=' + city.name.toLowerCase())}
          >
            <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand rounded-[20px] transition-colors z-20" />
            <span className="absolute bottom-0 left-0 p-3.5 text-[14px] font-bold text-white z-10">
              {city.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const BiddingBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="py-6">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="mx-4 rounded-3xl overflow-hidden cursor-pointer relative shadow-xl"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' }}
        onClick={() => navigate('/bidding')}
      >
        <div className="px-7 py-8 relative z-10">
          <div className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-3">
            LIVE AUCTIONS
          </div>
          <h2 className="font-fraunces text-[28px] md:text-[32px] font-bold text-white leading-tight">
            Bid on premium equipment.
          </h2>
          <p className="text-[13px] text-white/80 mt-2 font-medium max-w-[240px]">
            Join verified auctions for heavy machinery and real estate.
          </p>
          <button className="mt-5 bg-white text-[#7c3aed] rounded-full px-5 py-2.5 text-[13px] font-bold hover:bg-gray-50 transition-colors">
            Enter Arena →
          </button>
        </div>
      </motion.div>
    </section>
  );
}

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useI18n();

  return (
    <div className="min-h-screen pb-[100px] bg-page dark:bg-[#0D0D0D] transition-colors duration-300">
      {/* Editorial Top Bar (Home Page Only) */}
      <div className="px-5 pt-5 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[3px] text-text-muted uppercase mb-1">
            MARKETPLACE
          </p>
          <h1 className="text-[28px] font-extrabold tracking-tight text-[#1A1A1A] dark:text-white font-fraunces leading-none">
            Marcazi<span className="text-brand text-[32px]">.</span>
          </h1>
        </div>

        <div className="flex gap-2 items-center">
          <button 
            onClick={toggleTheme}
            className="flex w-11 h-11 items-center justify-center rounded-full bg-white dark:bg-[#1A1A1A] shadow-md text-[#1A1A1A] dark:text-white"
          >
            {(theme as string) === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleLang}
            className="h-11 px-4 rounded-full border border-[#EBEBEB] dark:border-white/6 text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-center bg-white dark:bg-[#1A1A1A]"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>

          <button className="relative flex w-11 h-11 items-center justify-center rounded-full bg-white dark:bg-[#1A1A1A] shadow-md text-[#1A1A1A] dark:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border border-white dark:border-[#1A1A1A]" />
          </button>
        </div>
      </div>

      <HeroSection />
      <CategoriesSection />
      <FeaturedListings />
      <BiddingBanner />
      {/* We reuse FeaturedListings as RecentListings for now, since it handles the same cards visually */}
      <StatsCard />
      <CityExplore />
      <TrustPillars />
      <CtaSection />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Index;
