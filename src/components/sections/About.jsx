import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Modal } from "@/components/ui/Modal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { doctor, bio } from "@/config/site";
import { BookOpen, ShieldCheck } from "lucide-react";
import aboutPhoto from "@/assets/img/about.jpg";

export function About() {
  const [bioOpen, setBioOpen] = useState(false);

  return (
    <Section id="sobre" className="bg-background">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="order-2 max-w-xl space-y-4 text-base sm:text-lg text-foreground/85 lg:order-1">
          <span className="font-heading-alt text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Sobre
          </span>
          <ScrollReveal
            as="h2"
            containerClassName="mt-3"
            textClassName="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground"
          >
            {doctor.fullName}
          </ScrollReveal>
          <p>
            {doctor.fullName} é médica especialista em{" "}
            {doctor.specialty.toLowerCase()}, atendendo em {doctor.city},
            com foco em acompanhar a paciente do pré-natal ao parto.
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm">
            <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <span>
              {doctor.crm} · {doctor.rqe} — registro verificável junto ao Conselho
              Regional de Medicina.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBioOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <BookOpen aria-hidden="true" className="size-4" />
            Biografia
          </button>
        </div>

        <img
          src={aboutPhoto}
          alt={`${doctor.fullName}, ${doctor.specialty}`}
          className="order-1 mx-auto aspect-[3/4] w-full max-w-xs rounded-3xl object-cover shadow-xl lg:order-2 lg:ml-auto lg:max-w-sm"
          loading="lazy"
        />
      </div>

      <Modal
        open={bioOpen}
        onClose={() => setBioOpen(false)}
        titleId="bio-title"
        title={doctor.shortName}
      >
        <div className="space-y-3 text-sm text-muted-foreground">
          {bio.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "text-foreground" : undefined}>
              {paragraph}
            </p>
          ))}
          <p className="text-foreground">
            {doctor.crm} · {doctor.rqe} — registro verificável junto ao
            Conselho Regional de Medicina.
          </p>
        </div>
      </Modal>
    </Section>
  );
}
