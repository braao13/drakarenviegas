import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { faq } from "@/config/site";

export function FAQSection() {
  return (
    <Section
      id="faq"
      eyebrow="Dúvidas"
      title="Perguntas frequentes"
      className="bg-background"
    >
      <div className="max-w-2xl">
        <Accordion items={faq} />
      </div>
    </Section>
  );
}
