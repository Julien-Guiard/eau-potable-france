import { Layout } from "antd";
import { LandingHero } from "@/components/Landing/LandingHero";
import { LandingDepartement } from "@/components/Landing/LandingDepartement";
import ThemeWrapper from "@/components/ThemeConfigWrapper";
import { LandingPodium } from "@/components/Landing/LandingPodium";

export default function LandingPage() {
  return (
    <ThemeWrapper>
      <Layout className="h-screen overflow-auto">
        <LandingHero />
        <LandingDepartement />
        <LandingPodium />
      </Layout>
    </ThemeWrapper>
  );
}
