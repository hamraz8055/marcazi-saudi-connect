import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocation, useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { icon: Home, key: "bottom.home", path: "/" },
  { icon: Search, key: "bottom.browse", path: "/browse" },
  { icon: PlusCircle, key: "bottom.post", path: "/post", primary: true },
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
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-xl safe-bottom" aria-label="Main navigation">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || (tab.path === '/bidding' && location.pathname.startsWith('/bidding'));
          const isBidding = location.pathname.startsWith('/bidding');

          let colorClass = "text-muted-foreground hover:text-foreground";
          if (tab.primary) {
            colorClass = isBidding ? "text-bidding" : "text-primary";
          } else if (isActive) {
            colorClass = isBidding ? "text-bidding" : "text-primary";
          }

          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              aria-label={t(tab.key)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${colorClass}`}
            >
              <Icon className={`${tab.primary ? "h-7 w-7" : "h-5 w-5"}`} />
              {tab.showBadge && user && totalUnread > 0 && (
                <span className="absolute -top-0.5 end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
              <span className="text-[10px] font-medium">{t(tab.key)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
