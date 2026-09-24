import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { contact, address, doctor } from "@/config/site";
import { Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

// lucide-react removeu ícones de marca (Instagram, Facebook etc.) por
// licenciamento — SVG próprio, mesmo estilo outline dos demais ícones.
function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Contact() {
  const whatsappUrl = contact.whatsappLink
    ? `${contact.whatsappLink}?text=${encodeURIComponent(contact.whatsappMessage)}`
    : null;
  const emailUrl = contact.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent("Agendamento de consulta")}`
    : null;

  return (
    <Section
      id="contato"
      eyebrow="Contato"
      title={`Pronta para começar essa jornada com ${doctor.shortName}?`}
      description={`Agende sua consulta e cuide da sua saúde com quem entende do assunto. ${doctor.tagline}.`}
      className="bg-secondary/30 py-12 sm:py-14 lg:py-16"
      containerClassName="max-w-5xl"
    >
      <div className="rounded-3xl border border-border bg-card/75 p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem icon={MessageCircle} label="WhatsApp">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Clique para conversar →
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">
                Pendente de configuração.
              </span>
            )}
          </InfoItem>

          <InfoItem icon={Mail} label="E-mail">
            {contact.emailPending ? (
              <span className="text-sm text-muted-foreground">
                Pendente de configuração — use o WhatsApp.
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">{contact.email}</span>
            )}
          </InfoItem>

          <InfoItem icon={InstagramIcon} label="Instagram">
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              @drakarenviegas →
            </a>
          </InfoItem>

          <InfoItem icon={MapPin} label="Endereço">
            <address className="text-sm not-italic text-muted-foreground">
              {address.street}
              <br />
              {address.neighborhood}, {address.city}/{address.state}
              <br />
              {address.zip}
            </address>
          </InfoItem>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl gap-3">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Contato direto e privado
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Este site não coleta nome, telefone, e-mail, sintomas ou mensagem.
                Você revisa o conteúdo no aplicativo antes de enviar; nenhuma mensagem
                é enviada automaticamente.
              </p>
            </div>
          </div>

          {whatsappUrl ? (
            <Button
              as="a"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Abrir WhatsApp do consultório
            </Button>
          ) : emailUrl ? (
            <Button as="a" href={emailUrl} className="shrink-0">
              <Mail aria-hidden="true" className="size-4" />
              Abrir cliente de e-mail
            </Button>
          ) : (
            <p className="text-sm font-medium text-amber-700" role="alert">
              Canal de contato ainda não configurado neste site.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <Icon aria-hidden="true" className="size-5 text-primary" />
      </div>
      <div>
        <h3 className="font-heading-alt text-sm font-bold text-foreground">{label}</h3>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
