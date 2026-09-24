import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contact } from "@/config/site";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M16.04 3A12.86 12.86 0 0 0 5.18 22.74L3 29l6.47-2.13A12.97 12.97 0 1 0 16.04 3Zm0 23.74c-2.12 0-4.2-.57-6-1.66l-.43-.26-3.84 1.27 1.3-3.74-.28-.45a10.7 10.7 0 1 1 9.25 4.84Zm5.87-8.02c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.58-1.6a9.66 9.66 0 0 1-1.79-2.22c-.19-.32-.02-.5.14-.66.15-.14.32-.37.49-.56.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.86.4-.3.33-1.14 1.12-1.14 2.73 0 1.6 1.17 3.16 1.33 3.38.16.21 2.3 3.51 5.57 4.93.78.34 1.38.54 1.86.69.78.25 1.49.21 2.05.13.63-.1 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37Z" />
    </svg>
  );
}

// CTA único de agendamento. Enquanto nenhum link real de WhatsApp é
// fornecido em /Regras, o botão não finge um link funcional — ele avisa
// claramente que o contato está pendente de configuração (ver regra 30,
// proibição de funcionalidade falsa).
export function WhatsAppCTA({
  className,
  size = "default",
  label = "Agendar consulta",
  iconOnly = false,
}) {
  const icon = iconOnly ? (
    <WhatsAppIcon className="size-7" />
  ) : (
    <MessageCircle aria-hidden="true" className="size-4" />
  );

  if (!contact.whatsappLink) {
    return (
      <span
        className={cn(
          "inline-flex flex-col items-start gap-1",
          className
        )}
        title="Número de WhatsApp pendente de configuração"
      >
        <Button
          type="button"
          size={size}
          disabled
          aria-disabled="true"
          className="cursor-not-allowed"
        >
          {icon}
          {iconOnly ? <span className="sr-only">{label}</span> : label}
        </Button>
        <span className="text-[11px] font-medium text-muted-foreground">
          WhatsApp pendente de configuração
        </span>
      </span>
    );
  }

  const url = `${contact.whatsappLink}?text=${encodeURIComponent(
    contact.whatsappMessage
  )}`;

  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      size={size}
      className={className}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
    >
      {icon}
      {iconOnly ? <span className="sr-only">{label}</span> : label}
    </Button>
  );
}
