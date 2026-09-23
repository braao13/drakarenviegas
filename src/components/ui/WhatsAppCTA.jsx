import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contact } from "@/config/site";
import { cn } from "@/lib/utils";

// CTA único de agendamento. Enquanto nenhum link real de WhatsApp é
// fornecido em /Regras, o botão não finge um link funcional — ele avisa
// claramente que o contato está pendente de configuração (ver regra 30,
// proibição de funcionalidade falsa).
export function WhatsAppCTA({ className, size = "default", label = "Agendar consulta" }) {
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
          <MessageCircle aria-hidden="true" className="size-4" />
          {label}
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
    >
      <MessageCircle aria-hidden="true" className="size-4" />
      {label}
    </Button>
  );
}
