import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

// Atalho persistente que reutiliza o mesmo destino e a mesma mensagem dos
// demais botões de agendamento do site.
export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
      <WhatsAppCTA
        iconOnly
        label="Agendar consulta"
        className="size-14 bg-[#25d366] p-0 text-white shadow-[0_10px_30px_-8px_rgba(42,33,25,0.55)] hover:scale-105 hover:bg-[#20bd5a] focus-visible:ring-[#25d366] sm:size-16"
      />
    </div>
  );
}
