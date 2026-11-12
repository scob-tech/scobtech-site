import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Authority } from "@/components/site/authority";
import { Comparison } from "@/components/site/comparison";
import { Cases } from "@/components/site/cases";
import { BeforeScob } from "@/components/site/before-scob";
import { HowItWorks } from "@/components/site/how-it-works";
import { TechStack } from "@/components/site/tech-stack";
import { About } from "@/components/site/about";
import { Pricing } from "@/components/site/pricing";
import { FinalCta } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";
import { MobileCta } from "@/components/site/mobile-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Authority />
        <Comparison />
        <Cases />
        <BeforeScob />
        <HowItWorks />
        <TechStack />
        <About />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
