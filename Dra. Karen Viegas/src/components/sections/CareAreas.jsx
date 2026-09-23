import { Section } from "@/components/ui/Section";
import { BorderGlow } from "@/components/ui/BorderGlow";
import { doctor, careAreas } from "@/config/site";
import { HeartPulse, Baby, Stethoscope, Activity } from "lucide-react";
import careAreasPhoto from "@/assets/img/care-areas.jpg";

const icons = [Baby, Activity, HeartPulse, Stethoscope];

export function CareAreas() {
  return (
    <Section
      id="atuacao"
      eyebrow="Atuação"
      title="Áreas de cuidado"
      description="Do pré-natal ao parto, com atenção em cada fase da saúde da mulher."
      className="bg-secondary/30"
    >
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <img
          src={careAreasPhoto}
          alt={`${doctor.fullName} em atendimento`}
          className="mx-auto aspect-[3/4] w-full max-w-xs rounded-3xl object-cover shadow-xl lg:mx-0 lg:max-w-sm"
          loading="lazy"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {careAreas.map((area, index) => {
            const Icon = icons[index % icons.length];
            return (
              <BorderGlow
                key={area.title}
                className="border border-border p-6 shadow-sm transition-shadow hover:shadow-md"
                backgroundColor="var(--card)"
                borderRadius={20}
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
                  <Icon aria-hidden="true" className="size-5 text-primary" />
                </div>
                <h3 className="mt-4 font-heading-alt text-base font-bold text-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {area.description}
                </p>
              </BorderGlow>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
