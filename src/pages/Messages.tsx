import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConversations, useChatMessages } from "@/hooks/useMessages";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import PageMeta from "@/components/PageMeta";
import AuthDialog from "@/components/AuthDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, MessageCircle, LogIn, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { conversations, loading } = useConversations();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.messages" />
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <BottomTabBar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta titleKey="page.messages" />
        <Header />
        <div className="flex flex-col items-center justify-center py-32 gap-4 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{lang === "ar" ? "سجل الدخول للمراسلة" : "Sign in to message"}</h2>
          <p className="text-muted-foreground max-w-sm">{lang === "ar" ? "سجل الدخول للتواصل مع البائعين والمشترين" : "Sign in to connect with buyers and sellers"}</p>
          <Button onClick={() => setShowAuth(true)} className="gap-2"><LogIn className="h-4 w-4" />{lang === "ar" ? "تسجيل الدخول" : "Sign In"}</Button>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        <BottomTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta titleKey="page.messages" />
      <Header />
      <div className="container py-6 pb-24 md:pb-6">
        <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl border border-border bg-card">
          <AnimatePresence mode="wait">
            {(!selectedConv || window.innerWidth >= 768) && (
              <motion.div initial={{ x: lang === "ar" ? 50 : -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: lang === "ar" ? 50 : -50, opacity: 0 }}
                className="w-full md:w-80 lg:w-96 border-e border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">{lang === "ar" ? "الرسائل" : "Messages"}</h2>
                </div>
                <ScrollArea className="flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                      <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{lang === "ar" ? "لا توجد محادثات بعد" : "No conversations yet"}</p>
                      <Button variant="outline" size="sm" onClick={() => navigate("/browse")} className="gap-2">
                        <Search className="h-3.5 w-3.5" />{lang === "ar" ? "تصفح الإعلانات" : "Browse Listings"}
                      </Button>
                    </div>
                  ) : (
                    conversations.map(conv => (
                      <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
                        className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 ${selectedConv === conv.id ? "bg-muted" : ""}`}>
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{conv.other_user?.display_name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 text-start">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm text-foreground truncate">{conv.other_user?.display_name || (lang === "ar" ? "مستخدم" : "User")}</span>
                            {conv.last_message && (
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {new Date(conv.last_message.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                          {conv.listing_title && <p className="text-xs text-primary truncate">{conv.listing_title}</p>}
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground truncate">{conv.last_message?.content || (lang === "ar" ? "بدء محادثة" : "Start chatting")}</p>
                            {conv.unread_count > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 shrink-0">{conv.unread_count}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {selectedConv ? (
              <ChatView conversationId={selectedConv} onBack={() => setSelectedConv(null)} conversation={conversations.find(c => c.id === selectedConv)} />
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{lang === "ar" ? "اختر محادثة للبدء" : "Select a conversation to start"}</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
};

function ChatView({ conversationId, onBack, conversation }: {
  conversationId: string;
  onBack: () => void;
  conversation?: ReturnType<typeof useConversations>["conversations"][0];
}) {
  const { user } = useAuth();
  const { lang } = useI18n();
  const { messages, loading, sendMessage } = useChatMessages(conversationId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={onBack} className="md:hidden text-muted-foreground hover:text-foreground" aria-label="Back to conversations">
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{conversation?.other_user?.display_name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{conversation?.other_user?.display_name || (lang === "ar" ? "مستخدم" : "User")}</p>
          {conversation?.listing_title && <p className="text-xs text-primary truncate">{conversation.listing_title}</p>}
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            {lang === "ar" ? "لا توجد رسائل بعد. ابدأ المحادثة!" : "No messages yet. Start the conversation!"}
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === user?.id;
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      <div className="p-4 border-t border-border">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."} className="flex-1 rounded-xl" />
          <Button type="submit" size="icon" className="rounded-xl shrink-0" disabled={!input.trim()} aria-label="Send message">
            <Send className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default Messages;
