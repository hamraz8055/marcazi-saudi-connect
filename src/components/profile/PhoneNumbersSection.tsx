import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Plus, Trash2, CheckCircle, Star } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

interface PhoneEntry {
  id: string;
  number: string;
  label: string;
  primary: boolean;
  verified: boolean;
}

const PhoneNumbersSection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const [phones, setPhones] = useState<PhoneEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newLabel, setNewLabel] = useState("mobile");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("phone_numbers, phone").eq("user_id", user.id).single().then(({ data }) => {
      const pn = (data as any)?.phone_numbers;
      if (Array.isArray(pn) && pn.length > 0) {
        setPhones(pn);
      } else if (data?.phone) {
        setPhones([{ id: crypto.randomUUID(), number: data.phone, label: "mobile", primary: true, verified: false }]);
      }
    });
  }, [user]);

  const savePhones = async (updated: PhoneEntry[]) => {
    if (!user) return;
    const primary = updated.find(p => p.primary);
    await supabase.from("profiles").update({
      phone_numbers: updated,
      phone: primary?.number || updated[0]?.number || null,
    } as any).eq("user_id", user.id);
    setPhones(updated);
  };

  const handleAdd = async () => {
    if (!newNumber.trim()) return;
    setSaving(true);
    const entry: PhoneEntry = {
      id: crypto.randomUUID(),
      number: newNumber.trim(),
      label: newLabel,
      primary: phones.length === 0,
      verified: false,
    };
    await savePhones([...phones, entry]);
    setNewNumber("");
    setShowForm(false);
    toast.success(lang === "ar" ? "تمت الإضافة" : "Phone number added");
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const updated = phones.filter(p => p.id !== id);
    if (updated.length > 0 && !updated.some(p => p.primary)) updated[0].primary = true;
    await savePhones(updated);
    toast.success(lang === "ar" ? "تم الحذف" : "Removed");
  };

  const handleSetPrimary = async (id: string) => {
    const updated = phones.map(p => ({ ...p, primary: p.id === id }));
    await savePhones(updated);
    toast.success(lang === "ar" ? "تم التعيين كرقم أساسي" : "Set as primary");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">{lang === "ar" ? "أرقام الهاتف" : "Phone Numbers"}</h2>
          {!showForm && (
            <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />{lang === "ar" ? "إضافة رقم" : "Add Number"}
            </Button>
          )}
        </div>

        {phones.length === 0 && !showForm && (
          <div className="text-center py-8 text-muted-foreground">
            <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{lang === "ar" ? "لم تضف أي رقم" : "No phone numbers added"}</p>
          </div>
        )}

        {phones.map(p => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-border p-4 mb-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{p.number}</span>
                  {p.primary && <Badge variant="secondary" className="text-xs"><Star className="h-3 w-3 mr-1" />{lang === "ar" ? "أساسي" : "Primary"}</Badge>}
                  {p.verified && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-xs text-muted-foreground capitalize">{p.label}</span>
              </div>
            </div>
            <div className="flex gap-1">
              {!p.primary && <Button size="sm" variant="ghost" onClick={() => handleSetPrimary(p.id)}><Star className="h-4 w-4" /></Button>}
              <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}

        {showForm && (
          <div className="space-y-4 rounded-xl border border-border p-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{lang === "ar" ? "الرقم" : "Phone Number"}</Label>
                <Input value={newNumber} onChange={e => setNewNumber(e.target.value)} placeholder="+966 5XX XXX XXXX" />
              </div>
              <div>
                <Label>{lang === "ar" ? "التصنيف" : "Label"}</Label>
                <Select value={newLabel} onValueChange={setNewLabel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">{lang === "ar" ? "جوال" : "Mobile"}</SelectItem>
                    <SelectItem value="work">{lang === "ar" ? "عمل" : "Work"}</SelectItem>
                    <SelectItem value="home">{lang === "ar" ? "منزل" : "Home"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={saving}>{lang === "ar" ? "إضافة" : "Add"}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumbersSection;
