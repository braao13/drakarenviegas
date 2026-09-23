import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Adaptado do PillNav (react-bits) a pedido do cliente — só o miolo do
// efeito (pílula com círculo que sobe no hover, texto trocando de cor)
// foi aproveitado. O componente original também trazia logo circular,
// react-router e menu mobile próprios; nada disso serve aqui — o Header
// já tem logo, CTA e menu mobile funcionando, e o site é uma página só
// (links são âncoras, não rotas), então isso tudo foi removido.
// Referência: https://reactbits.dev/components/pill-nav
export function PillNav({ items, ease = "power3.out" }) {
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");
        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, duration: 2, ease, overwrite: "auto" }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }
        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready?.then(layout).catch(() => {});
    return () => window.removeEventListener("resize", layout);
  }, [items, ease]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: "auto" });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: "auto" });
  };

  return (
    <ul className="pill-list" role="menubar">
      {items.map((item, i) => (
        <li key={item.href} role="none" className="flex">
          <a
            role="menuitem"
            href={item.href}
            className="pill"
            aria-label={item.label}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
          >
            <span
              className="hover-circle"
              aria-hidden="true"
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
            />
            <span className="label-stack">
              <span className="pill-label">{item.label}</span>
              <span className="pill-label-hover" aria-hidden="true">
                {item.label}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
