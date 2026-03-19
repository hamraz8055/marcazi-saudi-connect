import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1200",
    headline: "Discover the Best Deals.",
    sub: "Equipment, property, jobs across the Kingdom.",
  },
  {
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200",
    headline: "Rent Heavy Equipment.",
    sub: "Find cranes, excavators, generators & more.",
  },
  {
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200",
    headline: "Find Your Dream Property.",
    sub: "Villas, apartments, offices nationwide.",
  }
];

const HeroSection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full pb-4">
      {/* Editorial Card Carousel */}
      <motion.div 
        className="mx-4 mt-4 rounded-[28px] overflow-hidden relative h-[480px] md:h-[560px]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={slides[currentSlide].image} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            
            {/* Top-left badge */}
            <div className="absolute top-4 left-4 z-20 bg-white/18 backdrop-blur-md border border-white/25 rounded-full px-4 py-2 flex items-center gap-1.5">
              <span className="text-brand text-[13px]">⭐</span>
              <span className="text-white text-[13px] font-semibold">Featured Listings</span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 z-20 p-7 lg:p-10 w-full">
              <p className="tracking-[3px] text-[11px] text-white/60 uppercase mb-2">SAUDI ARABIA</p>
              <h2 className="font-fraunces text-[42px] md:text-[52px] font-bold text-white leading-[1.1] tracking-[-1.5px]">
                {slides[currentSlide].headline}
              </h2>
              <p className="text-[15px] text-white/75 mt-2.5 max-w-xs font-jakarta">
                {slides[currentSlide].sub}
              </p>
              <button 
                onClick={() => navigate('/browse')}
                className="bg-brand text-white rounded-full px-7 py-4 text-[16px] font-bold mt-5 w-fit shadow-[0_8px_24px_rgba(232,102,61,0.4)] hover:bg-brand-dark active:scale-95 transition-all"
              >
                Get Started →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-7 right-7 z-30 flex gap-1.5">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all ${currentSlide === i ? 'bg-white w-2 h-2' : 'bg-white/40 w-1.5 h-1.5'}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="mx-4 mt-4 bg-white dark:bg-[#1A1A1A] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center h-14 px-5 border border-transparent focus-within:border-brand transition-all"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Search className="text-text-muted w-5 h-5 mr-3" />
        <input 
          type="text" 
          placeholder={t("nav.search") || "Search listings..."}
          className="flex-1 bg-transparent outline-none text-[15px] placeholder-text-muted text-[#1A1A1A] dark:text-white"
          onClick={() => navigate('/browse')}
        />
        <button 
          onClick={() => navigate('/browse')}
          className="w-[44px] h-[44px] rounded-[14px] bg-brand shadow-[0_4px_12px_rgba(232,102,61,0.35)] flex items-center justify-center -mr-2"
        >
          <Search className="text-white w-5 h-5" />
        </button>
      </motion.div>

      {/* Quick Filter Pills */}
      <div className="mx-4 mt-3 overflow-x-auto flex gap-2 pb-1 scrollbar-hide">
        {[
          { label: "📍 Near Me", active: true },
          { label: "🔥 Urgent", active: false },
          { label: "⭐ Featured", active: false },
          { label: "🆕 New Today", active: false },
          { label: "💰 Under 10K", active: false },
        ].map((pill, i) => (
          <button 
            key={i}
            onClick={() => navigate('/browse')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              pill.active 
              ? 'bg-brand text-white border-brand' 
              : 'bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border-[#EBEBEB] dark:border-white/6'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
