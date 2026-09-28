import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { LogoMark } from "@/components/ui/LogoMark";
import { address, doctor } from "@/config/site";

const pageContent = {
  ginecologista: {
    eyebrow: "Ginecologia em Ipatinga/MG",
    title: "Ginecologista em Ipatinga/MG",
    intro:
      "A Dra. Karen Viegas Albuquerque oferece cuidado ginecológico com escuta, atenção e acolhimento em todas as fases da vida da mulher.",
    focus: "Cuidado com a saúde da mulher em todas as fases da vida.",
  },
  obstetra: {
    eyebrow: "Obstetrícia em Ipatinga/MG",
    title: "Obstetra em Ipatinga/MG",
    intro:
      "A Dra. Karen Viegas Albuquerque realiza atendimento obstétrico completo, com acompanhamento atento e cuidado humanizado.",
    focus: "Atendimento obstétrico da concepção ao pós-parto.",
  },
  "pre-natal": {
    eyebrow: "Pré-natal em Ipatinga/MG",
    title: "Pré-natal em Ipatinga/MG",
    intro:
      "O pré-natal com a Dra. Karen Viegas Albuquerque acompanha a gestação do início ao fim, com atenção, escuta e segurança em cada etapa.",
    focus: "Acompanhamento da gestação desde o início, com cuidado e escuta.",
  },
};

export function SeoLandingPage({ page }) {
  const content = pageContent[page];

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center" aria-label={`${doctor.fullName} — início`}>
            <LogoMark className="h-20" />
          </a>
          <a className="text-sm font-semibold text-primary hover:underline" href="/#contato">
            Agendar consulta
          </a>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto w-full max-w-4xl px-5 py-16 sm:py-24">
          <p className="font-heading-alt text-sm font-bold uppercase tracking-[0.12em] text-primary">
            {content.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-light leading-tight sm:text-6xl">
            {content.title}
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {content.intro}
          </p>

          <section className="mt-14 rounded-3xl border border-border bg-card p-7 sm:p-10">
            <h2 className="text-3xl font-light">Atendimento com acolhimento e responsabilidade</h2>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{content.focus}</p>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              {doctor.fullName} é {doctor.specialty}, {doctor.crm} e {doctor.rqe}. Para orientações sobre
              disponibilidade, convênios e agendamento, entre em contato diretamente pelo WhatsApp.
            </p>
            <div className="mt-8">
              <WhatsAppCTA size="lg" label="Agendar pelo WhatsApp" />
            </div>
          </section>

          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-3xl font-light">Consultório em Ipatinga</h2>
            <address className="mt-4 not-italic text-muted-foreground">
              {address.street}, {address.neighborhood} — {address.city}/{address.state}, {address.zip}
            </address>
            <a className="mt-5 inline-block font-semibold text-primary hover:underline" href="/#localizacao">
              Ver localização e informações de acesso
            </a>
          </section>
        </article>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary hover:underline">Voltar ao site da Dra. Karen Viegas</a>
      </footer>
    </div>
  );
}
