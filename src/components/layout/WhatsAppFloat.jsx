import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

// CTA persistente mobile (item 10 do briefing). Some em telas grandes, onde
// o header já expõe o botão de agendamento.
export function WhatsAppFloat() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden">
      <WhatsAppCTA className="w-full justify-center" />
    </div>
  );
}
