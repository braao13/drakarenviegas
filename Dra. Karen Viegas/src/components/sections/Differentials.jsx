import { Section } from "@/components/ui/Section";
import { differentials } from "@/config/site";
import { Sparkles } from "lucide-react";

export function Differentials() {
  return (
    <Section
      eyebrow="Diferenciais"
      title="Por que pacientes recomendam"
      description="Padrões observados nas avaliações reais de pacientes no Google."
      className="bg-background"
    >
      <div className="differentials-grid grid gap-5 sm:grid-cols-2">
        {differentials.map((item) => (
          <div
            key={item.title}
            className="differential-card relative flex gap-4 rounded-2xl border border-border bg-background p-5"
          >
            <Sparkles aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-heading-alt text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
