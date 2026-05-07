import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
export default function PersonDetailPage() {
  const { personId } = useParams<{ personId: string }>();

  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Person</h1>
      <p className="text-muted-foreground">Person ID: {personId}</p>
      <p className="text-sm text-muted-foreground mt-2">Person details page coming soon.</p>
    </PageContainer>
  );
}
