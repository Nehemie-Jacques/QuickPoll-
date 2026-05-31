import type { PollType } from "@/types/poll";

export const POLL_TYPE_LABELS: Record<PollType, string> = {
  single_choice: "Single choice",
  multiple_choice: "Multiple choice",
  rating: "Rating",
  yes_no: "Yes / No",
};
