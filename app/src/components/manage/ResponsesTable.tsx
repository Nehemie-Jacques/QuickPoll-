"use client";

import type { Vote } from "@/types/vote";

interface ResponsesTableProps {
  votes: Vote[];
}

export function ResponsesTable({ votes }: ResponsesTableProps) {
  if (votes.length === 0) {
    return <p className="text-sm text-zinc-500">Aucune réponse</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Alias</th>
            <th className="p-3">Réponse</th>
            <th className="p-3">Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((v) => (
            <tr key={v.voteId} className="border-t border-zinc-100 dark:border-zinc-800">
              <td className="p-3">{new Date(v.createdAt).toLocaleString()}</td>
              <td className="p-3">{v.alias ?? "—"}</td>
              <td className="p-3">
                {v.optionIds?.join(", ") ??
                  (v.rating !== undefined ? `${v.rating}★` : undefined) ??
                  (v.yesNo !== undefined ? (v.yesNo ? "Oui" : "Non") : "—")}
              </td>
              <td className="p-3">{v.comment ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
