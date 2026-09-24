import { Modal } from "@/components/ui/Modal";
import { contact } from "@/config/site";

// Texto restrito ao comportamento verificável no frontend. A identificação
// formal do controlador, a retenção nos canais externos e o canal de direitos
// continuam como pendências operacionais até serem informados pelo responsável.
export function PrivacyNotice({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} titleId="privacy-title" title="Privacidade e LGPD">
      <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Este site não possui formulário, não armazena contatos e não envia
            mensagens automaticamente. Os botões de contato apenas abrem o
            WhatsApp ou o cliente de e-mail no seu dispositivo.
          </p>
          <p>
            <strong className="text-foreground">Serviços externos:</strong>{" "}
            WhatsApp, Instagram e Google Maps possuem políticas próprias e podem
            receber dados técnicos da conexão. O conteúdo que você decidir enviar
            nesses serviços será tratado por eles e pelo consultório.
          </p>
          <p>
            <strong className="text-foreground">Dados sensíveis:</strong> evite
            informar sintomas, exames ou outros detalhes de saúde no primeiro
            contato. Aguarde a orientação do consultório sobre o canal adequado.
          </p>
          <p>
            <strong className="text-foreground">Canal de contato:</strong>{" "}
            {contact.emailPending
              ? "e-mail pendente de definição — enquanto isso, use o WhatsApp do consultório."
              : contact.email}
          </p>
          <p>
            A identificação formal do controlador, o canal para exercício de
            direitos e os prazos de retenção das conversas ainda precisam ser
            confirmados pelo responsável pelo projeto antes da publicação.
          </p>
      </div>
    </Modal>
  );
}
