import { useI18n } from "@/lib/i18n";
import { heavyEquipmentMakes, carMakes, fuelTypes, bodyTypes, sellerTypes, rentalPeriods } from "@/lib/vehicleData";
import { motion } from "framer-motion";

interface VehicleFieldsProps {
  category: string; // "heavy-equipment" | "motors"
  listingType: "sale" | "rent";
  year: string;
  kilometers: string;
  fuelType: string;
  sellerType: string;
  make: string;
  model: string;
  bodyType: string; // motors only
  rentalRate: string;
  rentalPeriod: string;
  onUpdate: (field: string, value: any) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

const VehicleFields = ({
  category, listingType, year, kilometers, fuelType, sellerType,
  make, model, bodyType, rentalRate, rentalPeriod, onUpdate
}: VehicleFieldsProps) => {
  const { lang } = useI18n();
  const isMotors = category === "motors";
  const isHeavy = category === "heavy-equipment";
  const makesData = isMotors ? carMakes : heavyEquipmentMakes;
  const makesList = Object.keys(makesData);
  const modelsList = make && make !== "Other" ? makesData[make] || [] : [];

  const inputClass = "mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground";

  return (
    <div className="space-y-5">
      {/* Rental pricing (when rent selected) */}
      {listingType === "rent" && (
        <div>
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "سعر الإيجار" : "Rental Rate"}
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              type="number"
              value={rentalRate}
              onChange={e => onUpdate("rentalRate", e.target.value)}
              placeholder={lang === "ar" ? "المبلغ" : "Amount"}
              className={`${inputClass} flex-1`}
            />
            <select
              value={rentalPeriod}
              onChange={e => onUpdate("rentalPeriod", e.target.value)}
              className={`${inputClass} w-32`}
            >
              {rentalPeriods.map(p => (
                <option key={p.id} value={p.id}>
                  {lang === "ar" ? `لكل ${p.label.ar}` : `per ${p.label.en}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Year */}
      <div>
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "سنة الصنع" : "Year of Manufacture"} <span className="text-destructive">*</span>
        </label>
        <select value={year} onChange={e => onUpdate("year", e.target.value)} className={inputClass}>
          <option value="">{lang === "ar" ? "اختر السنة" : "Select Year"}</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Kilometers */}
      <div>
        <label className="text-sm font-medium text-foreground">
          {isMotors ? (lang === "ar" ? "المسافة المقطوعة (كم)" : "Mileage (km)") : (lang === "ar" ? "الكيلومترات / ساعات الاستخدام" : "Kilometers / Hours Used")}
        </label>
        <input
          type="number"
          value={kilometers}
          onChange={e => onUpdate("kilometers", e.target.value)}
          placeholder={lang === "ar" ? "مثال: 12500" : "e.g. 12500"}
          className={inputClass}
        />
        {isHeavy && (
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === "ar" ? "للمعدات التي تُتبع بالساعات، أدخل ساعات الاستخدام" : "For equipment tracked by hours, enter hours used"}
          </p>
        )}
      </div>

      {/* Fuel Type */}
      <div>
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "نوع الوقود" : "Fuel Type"} {isMotors && <span className="text-destructive">*</span>}
        </label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {fuelTypes.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => onUpdate("fuelType", f.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-all ${
                fuelType === f.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {f.emoji} {f.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type (motors only) */}
      {isMotors && (
        <div>
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "نوع الهيكل" : "Body Type"} <span className="text-destructive">*</span>
          </label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {bodyTypes.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => onUpdate("bodyType", b.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium border transition-all ${
                  bodyType === b.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {b.emoji} {b.label[lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seller Type */}
      <div>
        <label className="text-sm font-medium text-foreground">
          {lang === "ar" ? "نوع البائع" : "Seller Type"}
        </label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {sellerTypes.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onUpdate("sellerType", s.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-all ${
                sellerType === s.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {s.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Make & Model */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "الشركة المصنعة" : "Make / Company"}
            {isMotors ? <span className="text-destructive"> *</span> : <span className="text-muted-foreground text-xs ms-1">({lang === "ar" ? "اختياري" : "Optional"})</span>}
          </label>
          <select value={make} onChange={e => { onUpdate("make", e.target.value); onUpdate("model", ""); }} className={inputClass}>
            <option value="">{lang === "ar" ? "اختر" : "Select"}</option>
            {makesList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">
            {lang === "ar" ? "الموديل" : "Model"}
            {isMotors ? <span className="text-destructive"> *</span> : <span className="text-muted-foreground text-xs ms-1">({lang === "ar" ? "اختياري" : "Optional"})</span>}
          </label>
          <select
            value={model}
            onChange={e => onUpdate("model", e.target.value)}
            disabled={!make || make === "Other"}
            className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">{lang === "ar" ? "اختر" : "Select"}</option>
            {modelsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {make === "Other" && (
            <input
              type="text"
              value={model}
              onChange={e => onUpdate("model", e.target.value)}
              placeholder={lang === "ar" ? "أدخل الاسم" : "Enter name"}
              className={`${inputClass} mt-2`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleFields;
