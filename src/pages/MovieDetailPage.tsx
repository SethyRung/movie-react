import PageContainer from "@/components/layout/PageContainer";

export default function MovieDetailPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Movie Details
        </h1>
        <p className="text-muted-foreground max-w-md">Movie details page coming soon.</p>
      </div>
    </PageContainer>
  );
}
