import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConversations, useChatMessages } from "@/hooks/useMessages";
import { useI18n } from "@/lib/i18n";
import Header from "@/components/Header";
import BottomTabBar from "@/components/BottomTabBar";
import { ArrowLeft, Send, MessageCircle, LogIn, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthDialog from "@/components/AuthDialog";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useI18n();
  const { conversations, loading } = useConversations();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-page dark:bg-[#0D0D0D] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
        <BottomTabBar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-page dark:bg-[#0D0D0D] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-6 px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-brand/10 dark:bg-brand/20">
            <MessageCircle className="h-10 w-10 text-brand" />
          </div>
          <div>
            <h2 className="text-[24px] font-fraunces font-bold text-[#1A1A1A] dark:text-white mb-2">
              {lang === "ar" ? "سجل الدخول للمراسلة" : "Sign in to message"}
            </h2>
            <p className="text-[15px] font-medium text-text-muted max-w-sm mx-auto leading-relaxed">
              {lang === "ar"
                ? "سجل الدخول للتواصل مع البائعين والمشترين ومتابعة صفقاتك"
                : "Sign in to connect with buyers and sellers and track your deals"}
            </p>
          </div>
          <button 
            onClick={() => setShowAuth(true)} 
            className="flex items-center gap-2 px-8 h-12 rounded-full bg-brand text-white font-bold text-[15px] hover:bg-[#E6501C] transition-colors shadow-sm"
          >
            <LogIn className="h-4 w-4" />
            {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </button>
        </div>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        <BottomTabBar />
      </div>
    );
  }

  const filteredConversations = conversations.filter(c => 
    c.other_user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.listing_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-page dark:bg-[#0D0D0D] flex flex-col">
      <Header />
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-0 md:px-5 lg:px-8 py-0 md:py-8 pb-32 md:pb-12 h-content-area">
        <div className="h-full flex flex-col md:flex-row md:rounded-3xl md:border border-[#EBEBEB] dark:border-white/6 md:bg-white md:dark:bg-[#1A1A1A] overflow-hidden md:shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          
          {/* Conversation List (Hidden on mobile if conversation selected) */}
          <div className={`md:flex ${selectedConv ? 'hidden' : 'flex'} flex-col w-full md:w-[380px] lg:w-[420px] md:border-r border-[#EBEBEB] dark:border-white/6 bg-white dark:bg-[#1A1A1A] h-full`}>
            
            {/* List Header */}
            <div className="p-5 md:p-6 border-b border-[#EBEBEB] dark:border-white/6 bg-white dark:bg-[#1A1A1A] sticky top-0 z-10">
              <h1 className="text-[28px] font-fraunces font-bold text-[#1A1A1A] dark:text-white leading-none mb-5">
                {lang === "ar" ? "الرسائل" : "Messages"}
              </h1>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
                <input
                  type="text"
                  placeholder={lang === "ar" ? "ابحث في الرسائل..." : "Search messages..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 text-[14px] font-medium text-[#1A1A1A] dark:text-white placeholder:text-[#9CA3AF] focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                />
              </div>
            </div>

            {/* List scroll area */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center text-text-muted h-full">
                  <div className="w-16 h-16 rounded-full bg-[#FAFAFA] dark:bg-[#222] flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-[#9CA3AF]" />
                  </div>
                  <p className="text-[15px] font-medium">
                    {searchQuery 
                      ? (lang === "ar" ? "لا توجد نتائج" : "No results found") 
                      : (lang === "ar" ? "لا توجد محادثات بعد" : "No conversations yet")}
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv.id)}
                      className={`w-full flex items-start gap-4 p-4 md:px-6 transition-colors border-b border-[#EBEBEB]/50 dark:border-white/5 last:border-none ${
                        selectedConv === conv.id ? "bg-[#FAFAFA] dark:bg-[#222]" : "hover:bg-[#FAFAFA]/50 dark:hover:bg-[#222]/50"
                      }`}
                    >
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 dark:from-brand/30 dark:to-brand/10 shrink-0">
                          <span className="text-brand font-bold text-[16px]">
                            {conv.other_user?.display_name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        {conv.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand text-white text-[11px] font-bold px-1.5 shadow-sm border-2 border-white dark:border-[#1A1A1A]">
                            {conv.unread_count}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5 mt-0.5">
                        <div className="flex items-center justify-between w-full gap-2">
                          <span className="font-bold text-[15px] text-[#1A1A1A] dark:text-white truncate">
                            {conv.other_user?.display_name || (lang === "ar" ? "مستخدم" : "User")}
                          </span>
                          {conv.last_message && (
                            <span className="text-[12px] font-medium text-text-muted shrink-0">
                              {new Date(conv.last_message.created_at).toLocaleDateString(
                                lang === "ar" ? "ar-SA" : "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          )}
                        </div>
                        
                        {conv.listing_title && (
                          <span className="text-[12px] font-bold text-brand truncate max-w-full">
                            {conv.listing_title}
                          </span>
                        )}
                        
                        <p className={`text-[14px] truncate max-w-full mt-1 ${conv.unread_count > 0 ? "font-bold text-[#1A1A1A] dark:text-white" : "font-medium text-text-muted"}`}>
                          {conv.last_message?.content || (lang === "ar" ? "بدء محادثة" : "Start chatting")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat View Pane */}
          <div className={`md:flex ${selectedConv ? 'flex' : 'hidden'} flex-1 flex-col h-[calc(100vh-64px)] md:h-full bg-page md:bg-[#FAFAFA] dark:bg-[#0D0D0D] md:dark:bg-[#111]`}>
            {selectedConv ? (
              <ChatView
                conversationId={selectedConv}
                onBack={() => setSelectedConv(null)}
                conversation={conversations.find((c) => c.id === selectedConv)}
              />
            ) : (
              <div className="hidden md:flex flex-1 flex-col items-center justify-center text-text-muted p-10">
                <div className="w-24 h-24 rounded-full border-4 border-[#EBEBEB] dark:border-white/10 flex items-center justify-center mb-6">
                  <MessageCircle className="h-10 w-10 text-[#D1D5DB] dark:text-gray-600" />
                </div>
                <h3 className="text-[20px] font-fraunces font-bold text-[#1A1A1A] dark:text-white mb-2">
                  {lang === "ar" ? "الرسائل الخاصة" : "Direct Messages"}
                </h3>
                <p className="text-[15px] font-medium text-center max-w-[280px]">
                  {lang === "ar" ? "اختر محادثة من القائمة الجانبية للبدء في المراسلة" : "Select a conversation from the sidebar to start messaging"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {!selectedConv && <BottomTabBar />}
    </div>
  );
};

function ChatView({
  conversationId,
  onBack,
  conversation,
}: {
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await sendMessage(msg);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white md:bg-transparent dark:bg-[#1A1A1A] md:dark:bg-transparent">
      {/* Chat Header */}
      <div className="flex items-center gap-4 px-4 py-3 md:px-6 md:py-4 border-b border-[#EBEBEB] dark:border-white/6 bg-white dark:bg-[#1A1A1A] z-10 shadow-sm md:shadow-none">
        <button 
          onClick={onBack} 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#FAFAFA] dark:hover:bg-[#222] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[#1A1A1A] dark:text-white rtl:rotate-180" />
        </button>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 shrink-0">
          <span className="text-[#1A1A1A] dark:text-white font-bold text-[16px]">
            {conversation?.other_user?.display_name?.[0]?.toUpperCase() || "?"}
          </span>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="font-bold text-[16px] text-[#1A1A1A] dark:text-white truncate leading-tight">
            {conversation?.other_user?.display_name || (lang === "ar" ? "مستخدم" : "User")}
          </p>
          {conversation?.listing_title && (
            <p className="text-[13px] font-medium text-text-muted truncate mt-0.5">{conversation.listing_title}</p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand/5 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-brand/50" />
            </div>
            <p className="text-[15px] font-medium text-text-muted">
              {lang === "ar" ? "لا توجد رسائل بعد. ابدأ المحادثة!" : "No messages yet. Start the conversation!"}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.sender_id === user?.id;
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const sameAsPrev = prevMsg && prevMsg.sender_id === msg.sender_id;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"} ${sameAsPrev ? "-mt-4" : ""}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 text-[15px] font-medium leading-relaxed shadow-sm ${
                    isMine
                      ? `bg-brand text-white ${sameAsPrev ? 'rounded-[20px] rounded-tr-[5px]' : 'rounded-[20px] rounded-br-[5px]'}`
                      : `bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/5 text-[#1A1A1A] dark:text-white ${sameAsPrev ? 'rounded-[20px] rounded-tl-[5px]' : 'rounded-[20px] rounded-bl-[5px]'}`
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                {!sameAsPrev && (
                  <p className={`text-[11px] font-medium mt-1.5 px-1 ${isMine ? "text-text-muted" : "text-text-muted"}`}>
                    {new Date(msg.created_at).toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white dark:bg-[#1A1A1A] border-t border-[#EBEBEB] dark:border-white/6 mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "ar" ? "اكتب رسالتك هنا..." : "Type your message here..."}
              className="w-full h-12 pl-5 pr-12 rounded-full bg-[#FAFAFA] dark:bg-[#222] border border-[#EBEBEB] dark:border-white/10 text-[15px] font-medium text-[#1A1A1A] dark:text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-[#9CA3AF]"
            />
          </div>
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white hover:bg-[#E6501C] transition-colors disabled:opacity-50 disabled:hover:bg-brand shadow-sm shrink-0"
          >
            <Send className="h-5 w-5 rtl:rotate-180 -ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
