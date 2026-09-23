import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Section({
  id,
  className,
  containerClassName,
  eyebrow,
  title,
  description,
  children,
  as: As = "section",
}) {
  return (
    <As id={id} className={cn("py-16 sm:py-20 lg:py-24 scroll-mt-20", className)}>
      <Container className={containerClassName}>
        {(eyebrow || title || description) && (
          <div className="mb-10 sm:mb-14 max-w-2xl">
            {eyebrow && (
              <span className="font-heading-alt text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </span>
            )}
            {title && (
              <ScrollReveal
                as="h2"
                containerClassName="mt-3"
                textClassName="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground"
              >
                {title}
              </ScrollReveal>
            )}
            {description && (
              <p className="mt-4 text-base sm:text-lg text-muted-foreground italic">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </As>
  );
}
