import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { CareAreas } from "@/components/sections/CareAreas";
import { Differentials } from "@/components/sections/Differentials";
import { Testimonials } from "@/components/sections/Testimonials";
import { Location } from "@/components/sections/Location";
import { FAQSection } from "@/components/sections/FAQSection";
import { Contact } from "@/components/sections/Contact";

function App() {
  return (
    <>
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main className="flex-1 pb-16 lg:pb-0">
        <Hero />
        <CareAreas />
        <Differentials />
        <Location />
        <About />
        <Testimonials />
        <FAQSection />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default App;
