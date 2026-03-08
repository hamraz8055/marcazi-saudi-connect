import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PostAd from "./pages/PostAd";
import Messages from "./pages/Messages";
import Bidding from "./pages/Bidding";
import CreateAuction from "./pages/CreateAuction";
import RequestQuote from "./pages/RequestQuote";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import MyAds from "./pages/MyAds";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import ListingDetail from "./pages/ListingDetail";
import AuctionDetail from "./pages/AuctionDetail";
import QuotationDetail from "./pages/QuotationDetail";
import AuthCallback from "./pages/AuthCallback";
import PublicProfile from "./pages/PublicProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/post" element={<PostAd />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/bidding" element={<Bidding />} />
                <Route path="/bidding/create-auction" element={<CreateAuction />} />
                <Route path="/bidding/request-quote" element={<RequestQuote />} />
                <Route path="/bidding/auction/:id" element={<AuctionDetail />} />
                <Route path="/bidding/quotation/:id" element={<QuotationDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-ads" element={<MyAds />} />
                <Route path="/account" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/favourites" element={<Favorites />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
