import PageContainer from "@/components/layout/PageContainer";
import { MovieHero } from "@/components/movie/MovieHero";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { useDiscoveryLists } from "@/hooks/useDiscovery";

export default function HomePage() {
  const { data, isLoading } = useDiscoveryLists();

  const lists = data?.data;
  const heroMovie = lists?.popular?.results[0];

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
