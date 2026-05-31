import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PropertyCategories from '@/components/PropertyCategories';
import FeaturedProperties from '@/components/FeaturedProperties';
import AIInsightsSection from '@/components/AIInsightsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import CityMap from '@/components/CityMap';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { WhatsAppFloatingButton } from '@/components/WhatsAppButton';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PropertyCategories />
      <FeaturedProperties />
      <AIInsightsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <CityMap />
      <Footer />
      <ChatWidget />
      <WhatsAppFloatingButton />
      <StickyMobileCTA />
    </main>
  );
}