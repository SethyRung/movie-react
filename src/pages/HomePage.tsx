import PageContainer from "@/components/layout/PageContainer";
import { MovieHero } from "@/components/movie/MovieHero";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { ErrorState } from "@/components/ErrorState";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useDiscoveryLists } from "@/hooks/useDiscovery";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function HomePage() {
  usePageTitle("Home");

  const { data, isLoading, isError, refetch } = useDiscoveryLists();

  const lists = data;
  const heroMovie = lists?.popular?.results[0];

  if (isError) {
    return (
      <PageContainer>
        <ErrorState message="Failed to load movie lists." onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <div>
      <MovieHero movie={heroMovie} isLoading={isLoading} />
      <PageContainer className="space-y-2">
        <ScrollReveal>
          <MovieCarousel title="Popular" movies={lists?.popular?.results} isLoading={isLoading} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <MovieCarousel
            title="Now Playing"
            movies={lists?.nowPlaying?.results}
            isLoading={isLoading}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <MovieCarousel title="Upcoming" movies={lists?.upcoming?.results} isLoading={isLoading} />
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <MovieCarousel
            title="Top Rated"
            movies={lists?.topRated?.results}
            isLoading={isLoading}
          />
        </ScrollReveal>
      </PageContainer>
    </div>
  );
}
