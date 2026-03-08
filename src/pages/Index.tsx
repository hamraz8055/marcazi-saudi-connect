import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedListings from "@/components/FeaturedListings";
import HowItWorks from "@/components/HowItWorks";
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
      <HowItWorks />
      <CtaSection />
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Index;
