import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export function ManageGate() {
  return (
    <PageContainer size="md" className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="font-display mt-4 text-xl font-bold">
          This page is for poll creators only
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Open the private creator link you received when creating the poll.
        </p>
      </Card>
    </PageContainer>
  );
}
