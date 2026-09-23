import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import "./ScrollReveal.css";

// Substitui o ScrollFloat (GSAP ScrollTrigger + scrub contínuo de posição
// de scroll). Este aqui é "element-based": usa IntersectionObserver e
// dispara UMA VEZ quando o próprio elemento entra na viewport, em vez de
// recalcular opacity a cada pixel rolado. Resolve o bug que tínhamos no
// Hero (texto acima da dobra ficava com opacity:0 preso porque o scrub do
// GSAP calculava progresso a partir de um intervalo start/end que já tinha
// "passado" no primeiro paint da página).
export function ScrollReveal({
  children,
  as: As = "h2",
  containerClassName = "",
  textClassName = "",
  stagger = 0.05,
  threshold = 0.2,
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const words = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(" ");
  }, [children]);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, revealed]);

  const fullText = typeof children === "string" ? children : undefined;

  return (
    <As ref={ref} className={containerClassName} aria-label={fullText}>
      <span
        className={`scroll-reveal-text ${revealed ? "is-revealed" : ""} ${textClassName}`}
        aria-hidden={fullText ? "true" : undefined}
      >
        {words.map((word, i) => (
          // O espaço fica FORA do inline-block da palavra: se ficasse dentro,
          // vira uma caixa atômica sem ponto de quebra e o título deixa de
          // dar wrap em telas estreitas.
          <Fragment key={i}>
            <span className="scroll-reveal-word" style={{ "--reveal-delay": `${i * stagger}s` }}>
              {word}
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </As>
  );
}
