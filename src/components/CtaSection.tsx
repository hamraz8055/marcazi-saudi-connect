import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-4 rounded-3xl overflow-hidden h-[220px] relative shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
      >
        <img 
          src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800" 
          alt="Sell Faster" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 md:from-black/90 to-transparent" />
        
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center p-6 md:px-10 z-10 max-w-sm">
          <div className="bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-3">
            POST FOR FREE
          </div>
          <h2 className="font-fraunces text-[32px] md:text-[36px] font-bold text-white leading-none">
            Sell Faster.
          </h2>
          <p className="text-[14px] text-white/70 mt-2 font-medium">
            Post your listing in 60 seconds and reach thousands of buyers across the Kingdom.
          </p>
          <button
            className="mt-4 bg-brand text-white rounded-full px-6 py-2.5 text-[14px] font-bold w-fit hover:bg-brand-dark transition-colors shadow-[0_4px_16px_rgba(232,102,61,0.4)]"
            onClick={() => navigate("/post")}
          >
            Get Started →
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
