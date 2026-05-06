"use client";

import dynamic from "next/dynamic";

const BuilderPageClient = dynamic(() => import("@/components/builder/BuilderPageClient"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 text-zinc-500 text-sm">
      Loading builder…
    </main>
  ),
});

export function BuilderPageDynamic() {
  return <BuilderPageClient />;
}
