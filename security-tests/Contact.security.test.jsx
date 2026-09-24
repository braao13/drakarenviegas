import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/site", () => ({
  contact: {
    whatsappLink: "https://wa.me/5511000000000",
    whatsappMessage: "Mensagem fixa de teste",
    email: "teste@example.invalid",
    emailPending: false,
    instagramUrl: "https://www.instagram.com/conta-de-teste/",
  },
  address: {
    street: "Endereço de teste",
    neighborhood: "Bairro",
    city: "Cidade",
    state: "MG",
    zip: "00000-000",
  },
  amenities: { planning: ["Marcar hora"] },
  doctor: { shortName: "Dra. Teste", tagline: "Cuidado de teste" },
}));

import { Contact } from "@/components/sections/Contact";

describe("segurança do contato", () => {
  it("não coleta dados pessoais ou mensagem no site", () => {
    render(<Contact />);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Nome|Telefone|Mensagem/i)).not.toBeInTheDocument();
  });

  it("abre somente o host e número esperados com mensagem fixa", () => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: /Abrir WhatsApp do consultório/i });
    const url = new URL(link.getAttribute("href"));

    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/5511000000000");
    expect([...url.searchParams.keys()]).toEqual(["text"]);
    expect(url.searchParams.get("text")).toBe("Mensagem fixa de teste");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("explica que o site não envia a mensagem automaticamente", () => {
    render(<Contact />);
    expect(screen.getByText(/não coleta nome, telefone, e-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhuma mensagem é enviada automaticamente/i)).toBeInTheDocument();
  });
});
