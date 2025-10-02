import { ReactNode } from "react";

interface DocsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocsSection({ title, description, children }: DocsSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {children}
    </section>
  );
}
