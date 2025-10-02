import { ReactNode } from "react";

interface DocsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocsSection({ title, description, children }: DocsSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      {description && (
        <p className="text-gray-300 mb-4">{description}</p>
      )}
      {children}
    </section>
  );
}
