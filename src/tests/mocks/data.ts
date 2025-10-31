// Mock movie data for testing
export const movieMockData = [
  {
    id: 1,
    title: 'Test Movie 1',
    original_title: 'Test Movie 1',
    poster_path: '/test-poster-1.jpg',
    backdrop_path: '/test-backdrop-1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    original_language: 'en',
    overview: 'This is a test movie overview.',
    popularity: 100.5,
    adult: false,
    video: false,
    genre_ids: [28, 12, 16],
  },
  {
    id: 2,
    title: 'Test Movie 2',
    original_title: 'Test Movie 2',
    poster_path: '/test-poster-2.jpg',
    backdrop_path: '/test-backdrop-2.jpg',
    release_date: '2023-02-01',
    vote_average: 7.8,
    vote_count: 800,
    original_language: 'en',
    overview: 'This is another test movie overview.',
    popularity: 85.2,
    adult: false,
    video: false,
    genre_ids: [35, 18],
  },
  {
    id: 3,
    title: 'Action Movie',
    original_title: 'Action Movie',
    poster_path: '/action-poster.jpg',
    backdrop_path: '/action-backdrop.jpg',
    release_date: '2023-03-01',
    vote_average: 9.0,
    vote_count: 1500,
    original_language: 'en',
    overview: 'An action-packed thriller.',
    popularity: 120.8,
    adult: false,
    video: false,
    genre_ids: [28, 53],
  },
  {
    id: 4,
    title: 'Comedy Film',
    original_title: 'Comedy Film',
    poster_path: '/comedy-poster.jpg',
    backdrop_path: '/comedy-backdrop.jpg',
    release_date: '2023-04-01',
    vote_average: 7.2,
    vote_count: 600,
    original_language: 'en',
    overview: 'A hilarious comedy that will make you laugh.',
    popularity: 65.3,
    adult: false,
    video: false,
    genre_ids: [35],
  },
  {
    id: 5,
    title: 'Drama Picture',
    original_title: 'Drama Picture',
    poster_path: '/drama-poster.jpg',
    backdrop_path: '/drama-backdrop.jpg',
    release_date: '2023-05-01',
    vote_average: 8.1,
    vote_count: 900,
    original_language: 'en',
    overview: 'A moving drama about life and relationships.',
    popularity: 95.7,
    adult: false,
    video: false,
    genre_ids: [18],
  },
  // Add more mock movies for pagination testing
  ...Array.from({ length: 55 }, (_, i) => ({
    id: 6 + i,
    title: `Movie ${6 + i}`,
    original_title: `Movie ${6 + i}`,
    poster_path: `/poster-${6 + i}.jpg`,
    backdrop_path: `/backdrop-${6 + i}.jpg`,
    release_date: `2023-${String((i % 12) + 1).padStart(2, '0')}-01`,
    vote_average: 6 + (Math.random() * 4),
    vote_count: Math.floor(Math.random() * 2000) + 100,
    original_language: 'en',
    overview: `Overview for movie ${6 + i}.`,
    popularity: 50 + Math.random() * 100,
    adult: false,
    video: false,
    genre_ids: [28, 12, 35, 18, 53][Math.floor(Math.random() * 5)] ? [28] : [35],
  })),
];

// Mock movie details data
export const movieDetailsMockData = [
  {
    id: 1,
    title: 'Test Movie 1',
    original_title: 'Test Movie 1',
    poster_path: '/test-poster-1.jpg',
    backdrop_path: '/test-backdrop-1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    original_language: 'en',
    overview: 'This is a test movie overview with more details.',
    popularity: 100.5,
    adult: false,
    video: false,
    budget: 100000000,
    revenue: 500000000,
    runtime: 120,
    status: 'Released',
    tagline: 'An amazing test movie',
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
    ],
    production_companies: [
      {
        id: 1,
        name: 'Test Production Company',
        logo_path: '/test-logo.jpg',
        origin_country: 'US',
      },
    ],
    production_countries: [
      {
        iso_3166_1: 'US',
        name: 'United States of America',
      },
    ],
    spoken_languages: [
      {
        iso_639_1: 'en',
        english_name: 'English',
        name: 'English',
      },
    ],
  },
];

// Mock movie credits data
export const movieCreditsMockData = [
  {
    id: 1,
    cast: [
      {
        adult: false,
        gender: 2,
        id: 101,
        known_for_department: 'Acting',
        name: 'Test Actor 1',
        original_name: 'Test Actor 1',
        popularity: 85.5,
        profile_path: '/actor1-profile.jpg',
        cast_id: 1,
        character: 'Main Character',
        credit_id: 'credit1',
        order: 0,
      },
      {
        adult: false,
        gender: 1,
        id: 102,
        known_for_department: 'Acting',
        name: 'Test Actress 1',
        original_name: 'Test Actress 1',
        popularity: 75.3,
        profile_path: '/actress1-profile.jpg',
        cast_id: 2,
        character: 'Supporting Character',
        credit_id: 'credit2',
        order: 1,
      },
    ],
    crew: [
      {
        adult: false,
        gender: 2,
        id: 201,
        known_for_department: 'Directing',
        name: 'Test Director',
        original_name: 'Test Director',
        popularity: 95.8,
        profile_path: '/director-profile.jpg',
        credit_id: 'credit3',
        department: 'Directing',
        job: 'Director',
      },
      {
        adult: false,
        gender: 1,
        known_for_department: 'Writing',
        name: 'Test Writer',
        original_name: 'Test Writer',
        popularity: 70.2,
        profile_path: '/writer-profile.jpg',
        credit_id: 'credit4',
        department: 'Writing',
        job: 'Screenplay',
      },
    ],
  },
];

// Mock movie images data
export const movieImagesMockData = [
  {
    id: 1,
    backdrops: [
      {
        aspect_ratio: 1.778,
        height: 1080,
        iso_639_1: null,
        file_path: '/backdrop1.jpg',
        vote_average: 8.5,
        vote_count: 12,
        width: 1920,
      },
      {
        aspect_ratio: 1.778,
        height: 1080,
        iso_639_1: null,
        file_path: '/backdrop2.jpg',
        vote_average: 7.8,
        vote_count: 8,
        width: 1920,
      },
    ],
    posters: [
      {
        aspect_ratio: 0.667,
        height: 1500,
        iso_639_1: 'en',
        file_path: '/poster1.jpg',
        vote_average: 8.9,
        vote_count: 25,
        width: 1000,
      },
      {
        aspect_ratio: 0.667,
        height: 1500,
        iso_639_1: null,
        file_path: '/poster2.jpg',
        vote_average: 7.5,
        vote_count: 6,
        width: 1000,
      },
    ],
    logos: [
      {
        aspect_ratio: 2.75,
        height: 360,
        iso_639_1: null,
        file_path: '/logo1.png',
        vote_average: 8.2,
        vote_count: 10,
        width: 990,
      },
    ],
  },
];

// Mock movie videos data
export const movieVideosMockData = [
  {
    id: 1,
    results: [
      {
        iso_639_1: 'en',
        iso_3166_1: 'US',
        name: 'Official Trailer',
        key: 'trailer123',
        site: 'YouTube',
        size: 1080,
        type: 'Trailer',
        official: true,
        published_at: '2023-01-01T10:00:00.000Z',
        id: 'video1',
      },
      {
        iso_639_1: 'en',
        iso_3166_1: 'US',
        name: 'Behind the Scenes',
        key: 'bts123',
        site: 'YouTube',
        size: 720,
        type: 'Behind the Scenes',
        official: false,
        published_at: '2023-01-02T15:30:00.000Z',
        id: 'video2',
      },
    ],
  },
];

// Mock movie keywords data
export const movieKeywordsMockData = [
  {
    id: 1,
    keywords: [
      {
        id: 1001,
        name: 'superhero',
      },
      {
        id: 1002,
        name: 'action',
      },
      {
        id: 1003,
        name: 'adventure',
      },
      {
        id: 1004,
        name: 'based on comic',
      },
    ],
  },
];

// Mock search results
export const searchMockData = {
  query: 'test',
  results: movieMockData.slice(0, 3),
  total_pages: 1,
  total_results: 3,
};