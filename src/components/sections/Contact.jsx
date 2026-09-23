import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { contact, address, amenities, careAreas, doctor } from "@/config/site";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

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

const initialForm = { name: "", phone: "", email: "", subject: "", message: "" };

const consultTypes = [...careAreas.map((a) => a.title), "Outro"];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Informe seu nome.";
  if (!form.phone.trim()) errors.phone = "Informe um telefone para contato.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "E-mail inválido.";
  }
  if (!form.message.trim()) errors.message = "Escreva sua mensagem.";
  return errors;
}

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const configPending = !contact.whatsappLink && !contact.email;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    if (configPending) {
      // Estrutura pronta, mas nenhum canal real (WhatsApp/e-mail) foi
      // configurado ainda — não simula envio, apenas avisa o pendente.
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Mensagem personalizada: junta tudo que a paciente preencheu no
    // formulário num único texto, pronto pra Dra. Karen ler direto no
    // WhatsApp — sem precisar abrir o site pra ver os dados.
    const body = `Nome: ${form.name}\nTelefone: ${form.phone}\nE-mail: ${form.email || "-"}\nTipo de consulta: ${form.subject || "-"}\n\n${form.message}`;

    try {
      if (contact.whatsappLink) {
        const lines = [
          "Olá! Gostaria de agendar uma consulta com a Dra. Karen Viegas.",
          "",
          `Nome: ${form.name}`,
          `Telefone: ${form.phone}`,
        ];
        if (form.email.trim()) lines.push(`E-mail: ${form.email}`);
        if (form.subject) lines.push(`Tipo de consulta: ${form.subject}`);
        lines.push("", `Mensagem: ${form.message}`);
        const text = lines.join("\n");
        window.open(
          `${contact.whatsappLink}?text=${encodeURIComponent(text)}`,
          "_blank",
          "noopener,noreferrer"
        );
      } else if (contact.email) {
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
          form.subject || "Contato via site"
        )}&body=${encodeURIComponent(body)}`;
      }
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  const whatsappUrl = contact.whatsappLink
    ? `${contact.whatsappLink}?text=${encodeURIComponent(contact.whatsappMessage)}`
    : null;

  return (
    <Section
      id="contato"
      eyebrow="Contato"
      title={`Pronta para começar essa jornada com ${doctor.shortName}?`}
      description={`Agende sua consulta e cuide da sua saúde com quem entende do assunto. ${doctor.tagline}.`}
      className="bg-secondary/30"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        {/* Coluna de informações — só dados reais confirmados em /Regras.
            Sem horário de atendimento: não consta nas regras e não pode
            ser inventado (regra 20). */}
        <div className="space-y-6">
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

          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="font-heading-alt text-sm font-bold uppercase tracking-wide text-foreground">
              Planejamento
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {amenities.planning[0]}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
          <div className="bg-primary px-6 py-5 sm:px-8 sm:py-6">
            <h3 className="font-heading text-xl font-semibold text-primary-foreground sm:text-2xl">
              Agende sua Consulta
            </h3>
            <p className="mt-1 text-sm text-primary-foreground/85">
              Preencha o formulário — você será direcionada(o) ao WhatsApp
              para finalizar o envio.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome completo" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
              <Field label="Telefone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required type="tel" />
            </div>

            <Field label="E-mail" name="email" value={form.email} onChange={handleChange} error={errors.email} type="email" />

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-foreground">
                Tipo de consulta
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Selecione o tipo de consulta</option>
                {consultTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                Mensagem <span className="text-primary">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Descreva brevemente o motivo da consulta ou suas dúvidas…"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-xs text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" /> Enviando…
                </>
              ) : (
                <>
                  <MessageCircle aria-hidden="true" className="size-4" />
                  Agendar via WhatsApp
                </>
              )}
            </Button>

            {status === "success" && (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700" role="status">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Mensagem preparada — finalize o envio na janela aberta.
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-2 text-sm font-medium text-amber-700" role="alert">
                <AlertTriangle aria-hidden="true" className="size-4" />
                {configPending
                  ? "Canal de contato (WhatsApp/e-mail) ainda não configurado neste site."
                  : "Não foi possível abrir o canal de envio. Tente novamente."}
              </p>
            )}
          </form>
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

function Field({ label, name, value, onChange, error, required, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
