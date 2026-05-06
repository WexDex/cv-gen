"use client";

import Link from "next/link";

import { templateList } from "@/components/templates";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const setTemplate = useResumeStore((state) => state.setTemplate);

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Template Gallery</h1>
          <Link href="/builder" className="rounded border bg-white px-3 py-1 text-sm">
            Back to Builder
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {templateList.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setTemplate(template.id)}
              className={cn(
                "rounded border bg-white p-4 text-left shadow-sm transition hover:shadow",
                activeResume?.templateId === template.id && "border-zinc-900 ring-2 ring-zinc-900/10",
              )}
            >
              <h2 className="text-lg font-semibold">{template.name}</h2>
              <p className="text-sm text-zinc-600">{template.description}</p>
              <div className="mt-4 h-36 rounded border bg-gradient-to-br from-zinc-50 to-zinc-200" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
