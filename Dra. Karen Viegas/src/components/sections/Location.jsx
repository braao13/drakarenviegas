import { Section } from "@/components/ui/Section";
import { address, amenities } from "@/config/site";
import { MapPin, CreditCard, Accessibility, Clock, ExternalLink } from "lucide-react";

const infoBlocks = [
  { icon: Accessibility, title: "Acessibilidade", items: amenities.accessibility },
  { icon: CreditCard, title: "Pagamentos", items: amenities.payments },
  { icon: Clock, title: "Planejamento", items: amenities.planning },
];

export function Location() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    address.mapsQuery
  )}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.mapsQuery
  )}`;

  return (
    <Section
      id="localizacao"
      eyebrow="Localização"
      title="Onde fica o consultório"
      className="bg-background"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-start gap-2 text-base text-foreground">
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <address className="not-italic">{address.full}</address>
          </div>

          <div className="mt-6 space-y-5">
            {infoBlocks.map(({ icon: Icon, title, items }) => (
              <div key={title}>
                <h3 className="flex items-center gap-2 font-heading-alt text-sm font-bold uppercase tracking-wide text-foreground">
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                  {title}
                </h3>
                <ul className="mt-2 space-y-1 pl-6 text-sm text-muted-foreground">
                  {items.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              title="Mapa de localização do consultório"
              src={mapsSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 360 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Abrir no Google Maps
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </Section>
  );
}
