import { ManageDashboard } from "@/components/manage/ManageDashboard";
import { ManageGate } from "@/components/manage/ManageGate";
import { voteUrl } from "@/lib/urls";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ManagePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) {
    return <ManageGate />;
  }

  return (
    <ManageDashboard pollId={id} token={token} voteUrl={voteUrl(id)} />
  );
}
