import { useState, useRef, useMemo } from "react";
import { ChevronDown, Search, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { pinnedCountries, otherCountries, type CountryCode } from "@/lib/vehicleData";
import { AnimatePresence, motion } from "framer-motion";

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  error?: string;
}

const PhoneInput = ({ countryCode, phoneNumber, onCountryCodeChange, onPhoneNumberChange, error }: PhoneInputProps) => {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allCountries = useMemo(() => [...pinnedCountries, ...otherCountries], []);
  const selected = allCountries.find(c => c.dial === countryCode) || pinnedCountries[0];

  const filteredPinned = useMemo(() => {
    if (!search) return pinnedCountries;
    const q = search.toLowerCase();
    return pinnedCountries.filter(c => c.name.en.toLowerCase().includes(q) || c.name.ar.includes(q) || c.dial.includes(q));
  }, [search]);

  const filteredOther = useMemo(() => {
    if (!search) return otherCountries;
    const q = search.toLowerCase();
    return otherCountries.filter(c => c.name.en.toLowerCase().includes(q) || c.name.ar.includes(q) || c.dial.includes(q));
  }, [search]);

  const selectCountry = (c: CountryCode) => {
    onCountryCodeChange(c.dial);
    setOpen(false);
    setSearch("");
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* Country code dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-3 text-sm min-w-[120px] hover:bg-muted/50 transition-colors"
          >
            <span className="text-base">{selected.flag}</span>
            <span className="font-medium text-foreground">{selected.dial}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ms-auto" />
          </button>

          <AnimatePresence>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(""); }} />
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full mt-1 start-0 z-50 w-72 rounded-xl border border-border bg-card shadow-lg max-h-[260px] overflow-hidden flex flex-col"
                >
                  <div className="p-2 border-b border-border">
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={lang === "ar" ? "ابحث عن دولة..." : "Search country..."}
                        className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto p-1">
                    {filteredPinned.map(c => (
                      <button key={c.code} type="button" onClick={() => selectCountry(c)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${countryCode === c.dial ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}>
                        <span>{c.flag}</span>
                        <span className="flex-1 text-start">{c.name[lang]}</span>
                        <span className="text-muted-foreground text-xs">{c.dial}</span>
                      </button>
                    ))}
                    {filteredPinned.length > 0 && filteredOther.length > 0 && (
                      <div className="border-t border-border my-1" />
                    )}
                    {filteredOther.map(c => (
                      <button key={c.code} type="button" onClick={() => selectCountry(c)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${countryCode === c.dial ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}>
                        <span>{c.flag}</span>
                        <span className="flex-1 text-start">{c.name[lang]}</span>
                        <span className="text-muted-foreground text-xs">{c.dial}</span>
                      </button>
                    ))}
                    {filteredPinned.length === 0 && filteredOther.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-4">{lang === "ar" ? "لا نتائج" : "No results"}</p>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Phone number input */}
        <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              onPhoneNumberChange(val);
            }}
            placeholder={selected.placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default PhoneInput;
