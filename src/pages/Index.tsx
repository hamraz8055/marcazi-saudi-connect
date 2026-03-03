import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedListings from "@/components/FeaturedListings";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedListings />
      <CtaSection />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Index;
