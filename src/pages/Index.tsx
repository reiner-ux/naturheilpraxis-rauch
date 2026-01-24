import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { InfoSection } from "@/components/home/InfoSection";
import SEOHead from "@/components/seo/SEOHead";

const Index = () => {
  return (
    <Layout>
      <SEOHead />
      <HeroSection />
      <FeaturesSection />
      <InfoSection />
    </Layout>
  );
};

export default Index;
