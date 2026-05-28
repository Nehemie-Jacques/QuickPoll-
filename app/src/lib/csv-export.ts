import type { Vote } from "@/types/vote";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function votesToCsv(votes: Vote[]): string {
  const headers = [
    "voteId",
    "pollId",
    "createdAt",
    "optionIds",
    "rating",
    "yesNo",
    "alias",
    "comment",
  ];
  const rows = votes.map((v) =>
    [
      v.voteId,
      v.pollId,
      v.createdAt,
      (v.optionIds ?? []).join(";"),
      v.rating?.toString() ?? "",
      v.yesNo === undefined ? "" : String(v.yesNo),
      v.alias ?? "",
      v.comment ?? "",
    ].map(escapeCsv).join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}
