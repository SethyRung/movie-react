import PageContainer from "@/components/layout/PageContainer";

export default function SearchPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Search</h1>
        <p className="text-muted-foreground max-w-md">Search for movies coming soon.</p>
      </div>
    </PageContainer>
  );
}
