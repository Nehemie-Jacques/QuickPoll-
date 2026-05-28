import { ManageDashboard } from "@/components/manage/ManageDashboard";
import { pollVoteUrl } from "@/lib/app-url";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ManagePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <p className="p-6 text-center text-red-600">
        Token de gestion manquant dans l&apos;URL
      </p>
    );
  }

  return (
    <ManageDashboard pollId={id} token={token} voteUrl={pollVoteUrl(id)} />
  );
}
