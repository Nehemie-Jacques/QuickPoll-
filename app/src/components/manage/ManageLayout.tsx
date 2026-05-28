"use client";

import * as Tabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

interface ManageLayoutProps {
  title: string;
  overview: ReactNode;
  responses: ReactNode;
  share: ReactNode;
  danger: ReactNode;
}

export function ManageLayout({
  title,
  overview,
  responses,
  share,
  danger,
}: ManageLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Tabs.Root defaultValue="overview">
        <Tabs.List className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
          {[
            { value: "overview", label: "Vue d'ensemble" },
            { value: "responses", label: "Réponses" },
            { value: "share", label: "Partage" },
            { value: "danger", label: "Danger" },
          ].map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className="px-4 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-indigo-600"
            >
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="overview" className="pt-6">
          {overview}
        </Tabs.Content>
        <Tabs.Content value="responses" className="pt-6">
          {responses}
        </Tabs.Content>
        <Tabs.Content value="share" className="pt-6">
          {share}
        </Tabs.Content>
        <Tabs.Content value="danger" className="pt-6">
          {danger}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
