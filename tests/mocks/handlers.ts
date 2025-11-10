import { http, HttpResponse } from 'msw';
import { movieMockData, movieDetailsMockData, movieCreditsMockData, movieImagesMockData, movieVideosMockData, movieKeywordsMockData } from './data';

// TMDB API base URL
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Popular movies handler
export const popularMoviesHandler = http.get(`${API_BASE_URL}/movie/popular`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';

  return HttpResponse.json({
    page: parseInt(page),
    results: movieMockData.slice(0, 20),
    total_pages: 5,
    total_results: 100,
  });
});

// Now playing movies handler
export const nowPlayingMoviesHandler = http.get(`${API_BASE_URL}/movie/now_playing`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';

  return HttpResponse.json({
    page: parseInt(page),
    results: movieMockData.slice(20, 40),
    total_pages: 5,
    total_results: 100,
  });
});

// Upcoming movies handler
export const upcomingMoviesHandler = http.get(`${API_BASE_URL}/movie/upcoming`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';

  return HttpResponse.json({
    page: parseInt(page),
    results: movieMockData.slice(40, 60),
    total_pages: 5,
    total_results: 100,
  });
});

// Main movie handler (featured movie)
export const mainMovieHandler = http.get(`${API_BASE_URL}/movie/main`, () => {
  return HttpResponse.json(movieMockData[0]);
});

// Movie details handler
export const movieDetailsHandler = http.get(`${API_BASE_URL}/movie/:id`, ({ params }) => {
  const { id } = params;
  const movieId = parseInt(id as string);

  const movieDetails = movieDetailsMockData.find(movie => movie.id === movieId);

  if (!movieDetails) {
    return HttpResponse.json(
      { status_message: 'Movie not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json(movieDetails);
});

// Movie credits handler
export const movieCreditsHandler = http.get(`${API_BASE_URL}/movie/:id/credits`, ({ params }) => {
  const { id } = params;
  const movieId = parseInt(id as string);

  const credits = movieCreditsMockData.find(credit => credit.id === movieId);

  if (!credits) {
    return HttpResponse.json(
      { status_message: 'Credits not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json(credits);
});

// Movie images handler
export const movieImagesHandler = http.get(`${API_BASE_URL}/movie/:id/images`, ({ params }) => {
  const { id } = params;
  const movieId = parseInt(id as string);

  const images = movieImagesMockData.find(image => image.id === movieId);

  if (!images) {
    return HttpResponse.json(
      { status_message: 'Images not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json(images);
});

// Movie videos handler
export const movieVideosHandler = http.get(`${API_BASE_URL}/movie/:id/videos`, ({ params }) => {
  const { id } = params;
  const movieId = parseInt(id as string);

  const videos = movieVideosMockData.find(video => video.id === movieId);

  if (!videos) {
    return HttpResponse.json(
      { status_message: 'Videos not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json(videos);
});

// Movie keywords handler
export const movieKeywordsHandler = http.get(`${API_BASE_URL}/movie/:id/keywords`, ({ params }) => {
  const { id } = params;
  const movieId = parseInt(id as string);

  const keywords = movieKeywordsMockData.find(keyword => keyword.id === movieId);

  if (!keywords) {
    return HttpResponse.json(
      { status_message: 'Keywords not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json(keywords);
});

// Search movies handler
export const searchMoviesHandler = http.get(`${API_BASE_URL}/search/movie`, ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || '';
  const page = url.searchParams.get('page') || '1';

  if (!query) {
    return HttpResponse.json({
      page: parseInt(page),
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  }

  // Filter movies based on search query
  const filteredMovies = movieMockData.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    movie.original_title.toLowerCase().includes(query.toLowerCase())
  );

  return HttpResponse.json({
    page: parseInt(page),
    results: filteredMovies.slice(0, 20),
    total_pages: Math.ceil(filteredMovies.length / 20),
    total_results: filteredMovies.length,
  });
});

// Error handler for testing error states
export const errorHandler = http.get(`${API_BASE_URL}/movie/error`, () => {
  return HttpResponse.json(
    { status_message: 'Internal server error' },
    { status: 500 }
  );
});

// Array of all handlers
export const handlers = [
  popularMoviesHandler,
  nowPlayingMoviesHandler,
  upcomingMoviesHandler,
  mainMovieHandler,
  movieDetailsHandler,
  movieCreditsHandler,
  movieImagesHandler,
  movieVideosHandler,
  movieKeywordsHandler,
  searchMoviesHandler,
  errorHandler,
];