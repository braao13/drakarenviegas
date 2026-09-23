import logoNova from "@/assets/img/logo-nova.png";

// logo-nova.png é toda em tinta branca (fundo transparente) — feita pra
// ficar sobre foto/fundo escuro (ver card do Hero). Pra usar em fundo claro
// (Header, Footer) sem sumir, isso aqui usa a arte como CSS mask e pinta
// com a cor pedida (por padrão a mesma --color-primary já usada em nav/CTAs
// como "cor atual" da marca), em vez de trocar o PNG por outro arquivo.
export function LogoMark({ className, color = "var(--color-primary)", label }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={className}
      style={{
        display: "inline-block",
        aspectRatio: "1 / 1",
        backgroundColor: color,
        WebkitMaskImage: `url(${logoNova})`,
        maskImage: `url(${logoNova})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
  );
}
