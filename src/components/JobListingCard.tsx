import { motion } from "framer-motion";
import { MapPin, Heart, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { saudiCities } from "@/lib/cities";
import { getEmploymentBadgeStyle, getEmploymentLabel, formatJobSalary } from "@/lib/jobSkillSuggestions";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  listing: any;
  index?: number;
  isFavorite?: boolean;
  onFavorite?: (e: React.MouseEvent) => void;
  companyName?: string;
}

const JobListingCard = ({ listing, index = 0, isFavorite = false, onFavorite, companyName }: JobCardProps) => {
  const { lang } = useI18n();
  const navigate = useNavigate();

  const cityName = saudiCities.find(c => c.id === listing.city)?.name[lang] || listing.city;
  const empType = listing.employment_type || "full-time";
  const skills: string[] = listing.required_skills || [];
  const daysAgo = Math.floor((Date.now() - new Date(listing.created_at).getTime()) / 86400000);
  const postedLabel = daysAgo === 0 ? (lang === "ar" ? "اليوم" : "Today") :
    daysAgo === 1 ? (lang === "ar" ? "أمس" : "Yesterday") : `${daysAgo}${lang === "ar" ? " أيام" : "d ago"}`;
  const displayName = companyName || listing.title.split(" ")[0];
  const logoLetter = displayName[0]?.toUpperCase() || "J";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
    >
      <div className="p-4 space-y-3">
        {/* Header: Logo + Company + Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {listing.company_logo_url ? (
              <img src={listing.company_logo_url} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 border border-border" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{logoLetter}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{cityName}</span>
                <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{postedLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`rounded-lg px-2 py-1 text-[10px] font-semibold whitespace-nowrap ${getEmploymentBadgeStyle(empType)}`}>
              {getEmploymentLabel(empType, lang)}
            </span>
            {onFavorite && (
              <button onClick={onFavorite} className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-destructive transition-colors" aria-label="Save">
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {skills.slice(0, 3).map(skill => (
              <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-medium">+{skills.length - 3} {lang === "ar" ? "المزيد" : "more"}</span>
            )}
          </div>
        )}

        {/* Salary + Easy Apply */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-sm font-bold text-primary flex items-center gap-1">
            💰 {formatJobSalary(listing, lang)}
          </p>
          <Button size="sm" className="text-xs py-1.5 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            onClick={(e) => { e.stopPropagation(); navigate(`/listing/${listing.id}`); }}>
            {lang === "ar" ? "تقديم سريع" : "Easy Apply"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default JobListingCard;
