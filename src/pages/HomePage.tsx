import PageContainer from "@/components/layout/PageContainer";
import { MovieHero } from "@/components/movie/MovieHero";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { ErrorState } from "@/components/ErrorState";
import { useDiscoveryLists } from "@/hooks/useDiscovery";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function HomePage() {
  usePageTitle("Home");

  const { data, isLoading, isError, refetch } = useDiscoveryLists();

  const lists = data?.data;
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
        <MovieCarousel title="Popular" movies={lists?.popular?.results} isLoading={isLoading} />
        <MovieCarousel
          title="Now Playing"
          movies={lists?.nowPlaying?.results}
          isLoading={isLoading}
        />
        <MovieCarousel title="Upcoming" movies={lists?.upcoming?.results} isLoading={isLoading} />
        <MovieCarousel title="Top Rated" movies={lists?.topRated?.results} isLoading={isLoading} />
      </PageContainer>
    </div>
  );
}
