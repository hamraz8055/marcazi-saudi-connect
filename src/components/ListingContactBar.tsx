import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Share2, ChevronDown, ChevronUp, Send, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import type { Listing } from "@/hooks/useListings";

interface ListingContactBarProps {
  listing: Listing;
  seller: { display_name: string | null; avatar_url: string | null; user_id: string } | null;
  onAuthRequired: () => void;
}

const ListingContactBar = ({ listing, seller, onAuthRequired }: ListingContactBarProps) => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPhone, setShowPhone] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatMessage, setChatMessage] = useState(
    lang === "ar" ? `مرحباً، أنا مهتم بإعلانك: ${listing.title}` : `Hi, I'm interested in your listing: ${listing.title}`
  );
  const [chatSent, setChatSent] = useState(false);

  const showPhoneData = listing.show_phone && listing.phone;
  const fullPhone = listing.phone_country_code && listing.phone_number
    ? `${listing.phone_country_code}${listing.phone_number}`
    : listing.phone;

  const handleChat = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!listing.user_id || !seller) { toast.info(lang === "ar" ? "هذا إعلان تجريبي" : "This is a demo listing"); return; }
    setMessaging(true);
    try {
      // Check existing conversation
      const { data: existingParticipations } = await supabase
        .from("conversation_participants").select("conversation_id").eq("user_id", user.id);
      if (existingParticipations?.length) {
        for (const p of existingParticipations) {
          const { data: conv } = await supabase.from("conversations").select("*").eq("id", p.conversation_id).eq("listing_id", listing.id).single();
          if (conv) {
            const { data: otherP } = await supabase.from("conversation_participants").select("user_id").eq("conversation_id", conv.id).neq("user_id", user.id).single();
            if (otherP?.user_id === seller.user_id) { navigate("/messages"); return; }
          }
        }
      }
      const { data: conv } = await supabase.from("conversations").insert({ listing_id: listing.id, listing_title: listing.title }).select().single();
      if (conv) {
        await supabase.from("conversation_participants").insert([
          { conversation_id: conv.id, user_id: user.id },
          { conversation_id: conv.id, user_id: seller.user_id },
        ]);
        // Increment chat_starts
        await supabase.from("listings").update({ chat_starts: (listing.chat_starts || 0) + 1 } as any).eq("id", listing.id);
        navigate("/messages");
      }
    } catch { toast.error(lang === "ar" ? "حدث خطأ" : "Something went wrong"); }
    finally { setMessaging(false); }
  };

  const handleShowPhone = async () => {
    if (!user) { onAuthRequired(); return; }
    setShowPhone(true);
    // Increment call_clicks
    await supabase.from("listings").update({ call_clicks: (listing.call_clicks || 0) + 1 } as any).eq("id", listing.id);
  };

  const handleWhatsApp = async () => {
    if (!user) { onAuthRequired(); return; }
    const phone = fullPhone?.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Hi, I saw your listing on Marcazi: ${listing.title} - ${window.location.href}`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    await supabase.from("listings").update({ whatsapp_clicks: (listing.whatsapp_clicks || 0) + 1 } as any).eq("id", listing.id);
  };

  const handleSendInlineChat = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!chatMessage.trim() || !seller) return;
    setMessaging(true);
    try {
      // Find or create conversation
      let convId: string | null = null;
      const { data: existingParticipations } = await supabase
        .from("conversation_participants").select("conversation_id").eq("user_id", user.id);
      if (existingParticipations?.length) {
        for (const p of existingParticipations) {
          const { data: conv } = await supabase.from("conversations").select("*").eq("id", p.conversation_id).eq("listing_id", listing.id).single();
          if (conv) {
            const { data: otherP } = await supabase.from("conversation_participants").select("user_id").eq("conversation_id", conv.id).neq("user_id", user.id).single();
            if (otherP?.user_id === seller.user_id) { convId = conv.id; break; }
          }
        }
      }
      if (!convId) {
        const { data: conv } = await supabase.from("conversations").insert({ listing_id: listing.id, listing_title: listing.title }).select().single();
        if (conv) {
          convId = conv.id;
          await supabase.from("conversation_participants").insert([
            { conversation_id: conv.id, user_id: user.id },
            { conversation_id: conv.id, user_id: seller.user_id },
          ]);
        }
      }
      if (convId) {
        await supabase.from("messages").insert({ conversation_id: convId, sender_id: user.id, content: chatMessage });
        await supabase.from("listings").update({ chat_starts: (listing.chat_starts || 0) + 1 } as any).eq("id", listing.id);
        setChatSent(true);
      }
    } catch { toast.error(lang === "ar" ? "حدث خطأ" : "Something went wrong"); }
    finally { setMessaging(false); }
  };

  const displayName = seller?.display_name || (lang === "ar" ? "البائع" : "Seller");

  return (
    <div className="space-y-3">
      {/* Contact heading */}
      <h3 className="font-semibold text-foreground text-sm">
        {lang === "ar" ? `تواصل مع ${displayName}` : `Contact ${displayName}`}
      </h3>

      {/* Chat button */}
      <Button className="w-full gap-2" onClick={handleChat} disabled={messaging || listing.user_id === user?.id}>
        <MessageCircle className="h-4 w-4" />{lang === "ar" ? "محادثة في مركزي" : "Chat on Marcazi"}
      </Button>

      {/* Call & WhatsApp (only if show_phone) */}
      {showPhoneData && (
        <div className="flex gap-2">
          {showPhone ? (
            <Button variant="outline" className="flex-1 gap-2" asChild>
              <a href={`tel:${fullPhone}`}><Phone className="h-4 w-4" />{fullPhone}</a>
            </Button>
          ) : (
            <Button variant="outline" className="flex-1 gap-2" onClick={handleShowPhone}>
              <Phone className="h-4 w-4" />{lang === "ar" ? "إظهار الرقم" : "Show Number"}
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
            onClick={handleWhatsApp}
          >
            💚 WhatsApp
          </Button>
        </div>
      )}

      {/* Share */}
      <Button variant="outline" className="w-full gap-2" onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(lang === "ar" ? "تم نسخ الرابط" : "Link copied!");
      }}>
        <Share2 className="h-4 w-4" />{lang === "ar" ? "مشاركة" : "Share"}
      </Button>

      {/* Inline chat widget */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setChatExpanded(!chatExpanded)}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="flex-1 text-start">
            {lang === "ar" ? `أرسل رسالة إلى ${displayName}` : `Send a message to ${displayName}`}
          </span>
          {chatExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {chatExpanded && (
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
            {!user ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">{lang === "ar" ? "سجل الدخول لإرسال رسالة" : "Sign in to send a message"}</p>
                <Button size="sm" onClick={onAuthRequired}>{lang === "ar" ? "تسجيل الدخول" : "Sign In"}</Button>
              </div>
            ) : chatSent ? (
              <div className="text-center py-4">
                <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{lang === "ar" ? "تم إرسال الرسالة!" : "Message sent!"}</p>
                <Button variant="link" size="sm" onClick={() => navigate("/messages")} className="mt-1">
                  {lang === "ar" ? "عرض في الرسائل ←" : "View in Messages →"}
                </Button>
              </div>
            ) : (
              <>
                <textarea
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary resize-none placeholder:text-muted-foreground"
                />
                <Button size="sm" className="w-full gap-2" onClick={handleSendInlineChat} disabled={messaging || !chatMessage.trim()}>
                  <Send className="h-3.5 w-3.5" />{lang === "ar" ? "إرسال" : "Send"}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  🔒 {lang === "ar" ? "الرد يصل إلى رسائلك" : "Reply goes to your Messages"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingContactBar;
