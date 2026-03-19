import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-[#111827] px-7 pt-14 pb-7">
      <div className="container max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & About */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-end gap-0.5 text-white">
              <span className="text-[24px] font-extrabold font-fraunces leading-none tracking-tight">Marcazi</span>
              <span className="text-brand text-[28px] leading-none mb-1">.</span>
            </Link>
            <p className="text-[13px] text-[#9CA3AF] leading-relaxed max-w-sm">
              The premier marketplace in Saudi Arabia. Discover equipment, property, jobs, and vehicles all in one reliable platform.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Marketplace</h3>
            <ul className="space-y-3">
              {['Equipment', 'Real Estate', 'Vehicles', 'Jobs', 'Services', 'Trading', 'Classifieds'].map((cat) => (
                <li key={cat}>
                  <Link to="/browse" className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors block">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Company</h3>
            <ul className="space-y-3">
              {['About Marcazi', 'Careers', 'Press', 'Mobile App', 'Blog'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Safety Rules', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1F2937] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-[#6B7280]">
          <p>© {new Date().getFullYear()} Marcazi. {t("footer.rights") || "All rights reserved."}</p>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-white transition-colors">English</span>
            <span className="cursor-pointer hover:text-white transition-colors">عربي</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
