import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Share2, ChevronDown, ChevronUp, Send, Check, Copy } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import type { Listing } from "@/hooks/useListings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ListingContactBarProps {
  listing: Listing;
  seller: { display_name: string | null; avatar_url: string | null; user_id: string } | null;
  onAuthRequired: () => void;
}

const ListingContactBar = ({ listing, seller, onAuthRequired }: ListingContactBarProps) => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatMessage, setChatMessage] = useState(
    lang === "ar" ? `مرحباً، أنا مهتم بإعلانك: ${listing.title}` : `Hi, I'm interested in your listing: ${listing.title}`
  );
  const [chatSent, setChatSent] = useState(false);

  const hasPhone = listing.show_phone && (listing.phone || (listing.phone_country_code && listing.phone_number));
  const fullPhone = listing.phone_country_code && listing.phone_number
    ? `${listing.phone_country_code}${listing.phone_number}`
    : listing.phone;
  const formattedPhone = fullPhone ? `${listing.phone_country_code || ""} ${listing.phone_number || fullPhone?.replace(listing.phone_country_code || "", "")}` : "";
  const hasEmail = listing.show_email && listing.contact_email;

  const findOrCreateConversation = async (): Promise<string | null> => {
    if (!user || !seller) return null;
    // Check existing conversation
    const { data: existingParticipations } = await supabase
      .from("conversation_participants").select("conversation_id").eq("user_id", user.id);
    if (existingParticipations?.length) {
      for (const p of existingParticipations) {
        const { data: conv } = await supabase.from("conversations").select("*").eq("id", p.conversation_id).eq("listing_id", listing.id).single();
        if (conv) {
          const { data: otherP } = await supabase.from("conversation_participants").select("user_id").eq("conversation_id", conv.id).neq("user_id", user.id).single();
          if (otherP?.user_id === seller.user_id) return conv.id;
        }
      }
    }
    // Create new
    const { data: conv } = await supabase.from("conversations").insert({ listing_id: listing.id, listing_title: listing.title }).select().single();
    if (conv) {
      await supabase.from("conversation_participants").insert([
        { conversation_id: conv.id, user_id: user.id },
        { conversation_id: conv.id, user_id: seller.user_id },
      ]);
      return conv.id;
    }
    return null;
  };

  const handleChat = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!listing.user_id || !seller) { toast.info(lang === "ar" ? "هذا إعلان تجريبي" : "This is a demo listing"); return; }
    setMessaging(true);
    try {
      const convId = await findOrCreateConversation();
      if (convId) {
        await supabase.from("listings").update({ chat_starts: (listing.chat_starts || 0) + 1 } as any).eq("id", listing.id);
        navigate("/messages");
      }
    } catch { toast.error(lang === "ar" ? "حدث خطأ" : "Something went wrong"); }
    finally { setMessaging(false); }
  };

  const handleShowPhone = async () => {
    if (!user) { onAuthRequired(); return; }
    setPhoneRevealed(true);
    await supabase.from("listings").update({ call_clicks: (listing.call_clicks || 0) + 1 } as any).eq("id", listing.id);
  };

  const handleCopyPhone = () => {
    if (fullPhone) {
      navigator.clipboard.writeText(fullPhone);
      toast.success(lang === "ar" ? "تم نسخ الرقم" : "Number copied!");
    }
  };

  const handleWhatsApp = async () => {
    if (!user) { onAuthRequired(); return; }
    const phone = fullPhone?.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Hi, I saw your listing on Marcazi: ${listing.title} - ${window.location.href}`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    await supabase.from("listings").update({ whatsapp_clicks: (listing.whatsapp_clicks || 0) + 1 } as any).eq("id", listing.id);
  };

  const handleEmail = async () => {
    if (!listing.contact_email) return;
    const subject = encodeURIComponent(`Inquiry about: ${listing.title} - Marcazi`);
    const body = encodeURIComponent(`Hi, I am interested in your listing "${listing.title}" on Marcazi.\n\nPlease contact me back at your earliest convenience.\n\nListing link: ${window.location.href}`);
    window.location.href = `mailto:${listing.contact_email}?subject=${subject}&body=${body}`;
    await supabase.from("listings").update({ email_inquiries: (listing.email_inquiries || 0) + 1 } as any).eq("id", listing.id);
  };

  const handleSendInlineChat = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!chatMessage.trim() || !seller) return;
    setMessaging(true);
    try {
      const convId = await findOrCreateConversation();
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
      <h3 className="font-semibold text-foreground text-sm">
        {lang === "ar" ? `تواصل مع ${displayName}` : `Contact ${displayName}`}
      </h3>

      {/* Chat button — always shown */}
      <Button className="w-full gap-2" onClick={handleChat} disabled={messaging || listing.user_id === user?.id}>
        <MessageCircle className="h-4 w-4" />{lang === "ar" ? "محادثة في مركزي" : "Chat on Marcazi"}
      </Button>

      {/* Call & WhatsApp — only if show_phone */}
      {hasPhone && (
        <div className="flex gap-2">
          {phoneRevealed ? (
            <div className="flex-1 flex items-center gap-2 rounded-md border border-border px-3 py-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={`tel:${fullPhone}`} className="text-sm font-medium text-foreground flex-1 hover:text-primary transition-colors">
                {formattedPhone}
              </a>
              <button onClick={handleCopyPhone} className="text-muted-foreground hover:text-foreground">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
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

      {/* Email — only if show_email */}
      {hasEmail && (
        <Button variant="outline" className="w-full gap-2" onClick={handleEmail}>
          <Mail className="h-4 w-4" />{lang === "ar" ? "مراسلة عبر الإيميل" : "Email Seller"}
        </Button>
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
