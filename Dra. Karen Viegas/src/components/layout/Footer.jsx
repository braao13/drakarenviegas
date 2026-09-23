import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { doctor, address, nav, contact } from "@/config/site";
import { PrivacyNotice } from "@/components/layout/PrivacyNotice";
import { LogoMark } from "@/components/ui/LogoMark";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoMark className="h-[135px]" label={doctor.fullName} />
          <p className="mt-4 text-sm text-muted-foreground">
            {doctor.crm} | {doctor.rqe}
          </p>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        </div>

        <div>
          <h3 className="font-heading-alt text-sm font-bold uppercase tracking-wide text-foreground">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading-alt text-sm font-bold uppercase tracking-wide text-foreground">
            Localização
          </h3>
          <address className="mt-4 text-sm not-italic text-muted-foreground">
            {address.street}
            <br />
            {address.neighborhood}, {address.city}/{address.state}
            <br />
            {address.zip}
          </address>
        </div>

        <div>
          <h3 className="font-heading-alt text-sm font-bold uppercase tracking-wide text-foreground">
            Contato
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            {contact.emailPending
              ? "E-mail: pendente de configuração. Agende pelo WhatsApp."
              : contact.email}
          </p>
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Privacidade e LGPD
          </button>
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {doctor.fullName}. Todos os direitos reservados.
          </p>
          <p>{doctor.crm} | {doctor.rqe}</p>
        </Container>
      </div>

      <PrivacyNotice open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}
