import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { icon: Home, key: "bottom.home", path: "/" },
  { icon: Search, key: "bottom.browse", path: "/browse" },
  { icon: Plus, key: "bottom.post", path: "/post", primary: true },
  { icon: MessageCircle, key: "bottom.messages", path: "/messages", showBadge: true },
  { icon: User, key: "bottom.account", path: "/account" },
];

const BottomTabBar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { totalUnread } = useConversations();

  return (
    <nav className="fixed bottom-5 left-4 right-4 z-50 md:hidden" aria-label="Main navigation">
      <div className="bg-white/92 dark:bg-[#1A1A1A]/95 backdrop-blur-xl rounded-[28px] h-[72px] border border-black/4 dark:border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.14),_0_2px_8px_rgba(0,0,0,0.06)] flex items-stretch pb-[max(0px,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || (tab.path === '/bidding' && location.pathname.startsWith('/bidding'));

          // Special center floating button
          if (tab.primary) {
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                aria-label={t(tab.key)}
                className="flex-1 flex flex-col items-center justify-start border-none bg-transparent"
              >
                <div className="w-[44px] h-[44px] rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(232,102,61,0.4)] -mt-5 flex items-center justify-center active:scale-90 transition-transform">
                  <Icon size={24} strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          const colorClass = isActive ? "text-brand" : "text-[#9CA3AF]";

          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              aria-label={t(tab.key)}
              className={`flex-1 flex flex-col items-center justify-center gap-[3px] cursor-pointer border-none bg-transparent ${colorClass}`}
            >
              <div className="relative">
                <Icon size={24} />
                {tab.showBadge && user && totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-1">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] font-semibold">{t(tab.key)}</span>
              {isActive && <div className="w-[5px] h-[5px] rounded-full bg-brand mt-0.5 absolute bottom-1.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
