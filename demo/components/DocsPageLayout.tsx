"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReactNode } from "react";

interface DocsPageLayoutProps {
  children: ReactNode;
}

const PAGE_METADATA: Record<string, { title: string; parent?: string }> = {
  "/docs": { title: "Documentation" },
  "/docs/quickstart": { title: "Quickstart", parent: "/docs" },
  "/docs/api": { title: "API Reference", parent: "/docs" },
  "/docs/api-reference": { title: "API Reference", parent: "/docs" },
  "/docs/scope-functions": { title: "Scope Functions", parent: "/docs" },
  "/docs/sequences": { title: "Lazy Sequences", parent: "/docs" },
  "/docs/flow": { title: "Flow Streams", parent: "/docs" },
  "/docs/coroutines": { title: "Coroutines", parent: "/docs" },
  "/docs/monads": { title: "Typed Errors", parent: "/docs" },
  "/docs/collections": { title: "Collections", parent: "/docs" },
  "/docs/extensions": { title: "Extensions", parent: "/docs" },
  "/docs/client-side": { title: "Client-Side Guide", parent: "/docs" },
  "/docs/server-side": { title: "Server-Side Guide", parent: "/docs" },
};

function buildBreadcrumbs(pathname: string) {
  const breadcrumbs = [{ label: "Home", href: "/" }];

  const metadata = PAGE_METADATA[pathname];
  if (!metadata) return breadcrumbs;

  if (metadata.parent) {
    const parentMetadata = PAGE_METADATA[metadata.parent];
    if (parentMetadata) {
      breadcrumbs.push({
        label: parentMetadata.title,
        href: metadata.parent,
      });
    }
  }

  breadcrumbs.push({
    label: metadata.title,
    href: pathname,
  });

  return breadcrumbs;
}

export function DocsPageLayout({ children }: DocsPageLayoutProps) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className="animate-fadeInUp">
      <Breadcrumbs items={breadcrumbs} />
      {children}
    </div>
  );
}
