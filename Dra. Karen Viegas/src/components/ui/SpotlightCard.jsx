import { useRef } from "react";
import { cn } from "@/lib/utils";

import "./SpotlightCard.css";

// Efeito "spotlight" que segue o cursor — recriado no estilo react-bits
// (SpotlightCard), pois `npx shadcn add` falha na escrita de arquivos nesse
// projeto (mesmo erro do ScrollFloat/CircularGallery). Grava a posição do
// mouse em custom properties CSS; um gradiente radial no ::before usa essas
// variáveis pra iluminar a borda perto do cursor.
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(198, 166, 127, 0.35)",
  as: As = "div",
  ...props
}) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <As
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{ "--spotlight-color": spotlightColor }}
      className={cn("spotlight-card", className)}
      {...props}
    >
      {children}
    </As>
  );
}
