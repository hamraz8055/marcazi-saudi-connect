import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const tabs = [
  { icon: Home, key: "bottom.home" },
  { icon: Search, key: "bottom.browse" },
  { icon: PlusCircle, key: "bottom.post", primary: true },
  { icon: MessageCircle, key: "bottom.messages" },
  { icon: User, key: "bottom.account" },
];

const BottomTabBar = () => {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-xl safe-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                tab.primary
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`${tab.primary ? "h-7 w-7" : "h-5 w-5"}`} />
              <span className="text-[10px] font-medium">{t(tab.key)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
