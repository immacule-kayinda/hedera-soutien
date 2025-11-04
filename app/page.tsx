import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import HowItWorks from "@/components/HowItWorks";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import TransparencyShowcase from "@/components/TransparencyShowcase";
import NFTGallery from "@/components/NFTGallery";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsCounter />
        <HowItWorks />
        <TestimonialCarousel />
        <TransparencyShowcase />
        <NFTGallery />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
