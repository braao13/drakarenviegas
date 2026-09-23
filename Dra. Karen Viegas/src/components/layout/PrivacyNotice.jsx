import { Modal } from "@/components/ui/Modal";
import { doctor, contact } from "@/config/site";

// Aviso de privacidade (LGPD) — o formulário de contato coleta nome,
// telefone, e-mail e mensagem, dados possivelmente relacionados a gestação.
// Texto restrito ao que é verificável no projeto; contato do responsável
// pelos dados fica como pendência até ser informado.
export function PrivacyNotice({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} titleId="privacy-title" title="Privacidade e LGPD">
      <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Este site coleta, através do formulário de contato, apenas os
            dados que você mesma(o) informa: nome, telefone, e-mail, assunto
            e mensagem.
          </p>
          <p>
            <strong className="text-foreground">Finalidade:</strong> esses
            dados são usados exclusivamente para responder seu contato e
            organizar o agendamento com {doctor.shortName}, via WhatsApp ou
            e-mail.
          </p>
          <p>
            <strong className="text-foreground">Compartilhamento:</strong>{" "}
            os dados não são vendidos nem compartilhados com terceiros para
            fins de marketing.
          </p>
          <p>
            <strong className="text-foreground">Dados sensíveis:</strong> não
            solicitamos informações de saúde pelo formulário — detalhes
            clínicos devem ser tratados diretamente na consulta.
          </p>
          <p>
            <strong className="text-foreground">Contato do responsável:</strong>{" "}
            {contact.emailPending
              ? "e-mail do responsável pendente de definição — enquanto isso, use o WhatsApp do consultório."
              : contact.email}
          </p>
      </div>
    </Modal>
  );
}
