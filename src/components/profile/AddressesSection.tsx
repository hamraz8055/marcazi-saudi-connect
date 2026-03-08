import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saudiCities, regions, getCitiesByRegion } from "@/lib/cities";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Address {
  id: string;
  country: string;
  region: string;
  city: string;
  district: string;
  full_address: string;
}

const AddressesSection = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Address, "id">>({ country: "Saudi Arabia", region: "", city: "", district: "", full_address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("address").eq("user_id", user.id).single().then(({ data }) => {
      const addrs = (data as any)?.address || [];
      setAddresses(Array.isArray(addrs) ? addrs : []);
    });
  }, [user]);

  const filteredCities = form.region ? getCitiesByRegion(form.region) : saudiCities;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const newAddr: Address = { ...form, id: editing?.id || crypto.randomUUID() };
    const updated = editing
      ? addresses.map(a => a.id === editing.id ? newAddr : a)
      : [...addresses, newAddr];
    const { error } = await supabase.from("profiles").update({ address: updated } as any).eq("user_id", user.id);
    if (!error) {
      setAddresses(updated);
      setShowForm(false);
      setEditing(null);
      setForm({ country: "Saudi Arabia", region: "", city: "", district: "", full_address: "" });
      toast.success(lang === "ar" ? "تم الحفظ" : "Address saved");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const updated = addresses.filter(a => a.id !== id);
    await supabase.from("profiles").update({ address: updated } as any).eq("user_id", user.id);
    setAddresses(updated);
    toast.success(lang === "ar" ? "تم الحذف" : "Address removed");
  };

  const startEdit = (addr: Address) => {
    setEditing(addr);
    setForm({ country: addr.country, region: addr.region, city: addr.city, district: addr.district, full_address: addr.full_address });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{lang === "ar" ? "العناوين" : "My Addresses"}</h2>
          </div>
          {!showForm && (
            <Button size="sm" variant="outline" onClick={() => { setShowForm(true); setEditing(null); setForm({ country: "Saudi Arabia", region: "", city: "", district: "", full_address: "" }); }}>
              <Plus className="h-4 w-4 mr-1" />{lang === "ar" ? "إضافة عنوان" : "Add Address"}
            </Button>
          )}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{lang === "ar" ? "لم تضف أي عنوان بعد" : "No addresses added yet"}</p>
          </div>
        )}

        {addresses.map(addr => (
          <div key={addr.id} className="flex items-start justify-between rounded-xl border border-border p-4 mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">{addr.district}, {addr.city}</p>
              <p className="text-xs text-muted-foreground">{addr.full_address}</p>
              <p className="text-xs text-muted-foreground">{addr.region} — {addr.country}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(addr)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(addr.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}

        {showForm && (
          <div className="space-y-4 rounded-xl border border-border p-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{lang === "ar" ? "الدولة" : "Country"}</Label>
                <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              </div>
              <div>
                <Label>{lang === "ar" ? "المنطقة" : "Region"}</Label>
                <Select value={form.region} onValueChange={v => setForm(f => ({ ...f, region: v, city: "" }))}>
                  <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر المنطقة" : "Select region"} /></SelectTrigger>
                  <SelectContent>
                    {regions.map(r => <SelectItem key={r} value={r}>{lang === "ar" ? r : r.replace("region.", "")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{lang === "ar" ? "المدينة" : "City"}</Label>
                <Select value={form.city} onValueChange={v => setForm(f => ({ ...f, city: v }))}>
                  <SelectTrigger><SelectValue placeholder={lang === "ar" ? "اختر المدينة" : "Select city"} /></SelectTrigger>
                  <SelectContent>
                    {filteredCities.map(c => <SelectItem key={c.id} value={c.id}>{c.name[lang]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{lang === "ar" ? "الحي" : "District / Area"}</Label>
                <Input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>{lang === "ar" ? "العنوان الكامل" : "Full Address"}</Label>
              <Textarea value={form.full_address} onChange={e => setForm(f => ({ ...f, full_address: e.target.value }))} rows={2} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{lang === "ar" ? "حفظ" : "Save"}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesSection;
