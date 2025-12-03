import { Navigation } from '@/modules/landing/ui/components/navigation';
import { HeroSection } from '@/modules/landing/ui/components/hero-section';
import { FeaturesSection } from '@/modules/landing/ui/components/features-section';
import { IntegrationsSection } from '@/modules/landing/ui/components/integrations-section';
import { PricingSection } from '@/modules/landing/ui/components/pricing-section';
import { CtaSection } from '@/modules/landing/ui/components/cta-section';
import { Footer } from '@/modules/landing/ui/components/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main>
        <section id="hero">
          <HeroSection />
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="integrations">
          <IntegrationsSection />
        </section>

        <section id="pricing">
          <PricingSection />
        </section>

        <section id="show">
          <CtaSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
