import { cn } from "@/lib/utils";

// Filtro em formato de "pill". Não é o componente PillNav da react-bits —
// aquele é uma navbar animada (GSAP + react-router) pra navegação principal
// do site, não serve pra filtrar uma lista de cards. Mesma linguagem visual
// (pills), implementação própria e simples: botões acessíveis, sem
// dependências extra.
export function FilterPills({ options, active, onChange }) {
  return (
    <div role="group" aria-label="Filtrar depoimentos" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
