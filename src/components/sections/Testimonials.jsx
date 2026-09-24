import { useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { FilterPills } from "@/components/ui/FilterPills";
import {
  googleReviewSummary,
  testimonials,
  testimonialFilters,
} from "@/config/site";
import { ChevronLeft, ChevronRight, ExternalLink, Quote, Star } from "lucide-react";

const PAGE_SIZE = 3;

function Stars() {
  return (
    <span className="flex items-center gap-0.5" aria-label="Avaliação no Google">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden="true" className="size-3.5 fill-primary text-primary" />
      ))}
    </span>
  );
}

export function Testimonials() {
  const [filter, setFilter] = useState("todos");
  const [page, setPage] = useState(0);

  const list = useMemo(
    () => (filter === "todos" ? testimonials : testimonials.filter((t) => t.category === filter)),
    [filter]
  );

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const visibleList = list.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // Troca de filtro muda a lista — sem resetar a página aqui, ela ficaria
  // "presa" num índice que não existe mais na categoria nova (grid em branco).
  function handleFilterChange(value) {
    setFilter(value);
    setPage(0);
  }

  return (
    <Section
      id="depoimentos"
      eyebrow="Depoimentos"
      title="Quem já é paciente conta"
      description="Avaliações reais publicadas no Google — filtre pelo momento que mais te interessa."
      className="bg-secondary/30"
    >
      <div className="mb-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-primary/20 bg-card px-4 py-2 shadow-sm">
        <Stars />
        <strong className="text-sm text-foreground">
          {googleReviewSummary.rating} de 5
        </strong>
        <span className="text-sm text-muted-foreground">
          · {googleReviewSummary.count} avaliações na ficha da Dra. Karen
        </span>
      </div>

      <FilterPills options={testimonialFilters} active={filter} onChange={handleFilterChange} />

      {list.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Nenhum depoimento nessa categoria ainda.
        </p>
      )}

      {list.length > 0 && (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleList.map((t) => (
              <SpotlightCard
                key={t.name}
                as="figure"
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <Quote aria-hidden="true" className="size-6 text-primary" />
                <blockquote className="mt-3 flex-1 text-sm text-foreground/85">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="flex items-center gap-3">
                    <Stars />
                    {t.reviewUrl && (
                      <a
                        href={t.reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        aria-label={`Ver avaliação de ${t.name} no Google (abre em nova aba)`}
                      >
                        Google
                        <ExternalLink aria-hidden="true" className="size-3" />
                      </a>
                    )}
                  </span>
                </figcaption>
              </SpotlightCard>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Depoimentos anteriores"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>

              <span className="text-xs font-medium text-muted-foreground" aria-live="polite">
                Página {page + 1} de {pageCount}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page === pageCount - 1}
                aria-label="Mais depoimentos"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Depoimentos extraídos de avaliações públicas no Google — nomes
        reduzidos por discrição.
      </p>
    </Section>
  );
}
