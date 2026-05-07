import PageContainer from "@/components/layout/PageContainer";

export default function GenrePage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Genre</h1>
        <p className="text-muted-foreground max-w-md">Browse movies by genre coming soon.</p>
      </div>
    </PageContainer>
  );
}
