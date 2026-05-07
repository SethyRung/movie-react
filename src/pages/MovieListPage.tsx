import PageContainer from "@/components/layout/PageContainer";

export default function MovieListPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Movies</h1>
        <p className="text-muted-foreground max-w-md">Browse all movies coming soon.</p>
      </div>
    </PageContainer>
  );
}
