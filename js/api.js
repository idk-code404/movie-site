// api.js - TMDB and VidLink.pro API interactions

// TMDB API helper
async function tmdbFetch(endpoint, params = {}) {
  const apiKey = window.ENV.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB API key not configured. Please set window.ENV.TMDB_API_KEY.');
  }
  
  const url = new URL(`${window.ENV.TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  return response.json();
}

// Fetch genres
async function fetchGenres() {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres;
}

// Fetch trending movies
async function fetchTrending(page = 1) {
  return tmdbFetch('/trending/movie/week', { page });
}

// Discover movies with filters
async function fetchDiscoverMovies(params = {}) {
  const defaultParams = {
    sort_by: 'popularity.desc',
    include_adult: false,
    include_video: false,
    page: 1
  };
  
  const mergedParams = { ...defaultParams, ...params };
  
  // Map rating filter to vote_average.gte
  if (mergedParams.rating) {
    mergedParams['vote_average.gte'] = mergedParams.rating;
    delete mergedParams.rating;
  }
  
  return tmdbFetch('/discover/movie', mergedParams);
}

// Search movies
async function searchMovies(query, page = 1) {
  return tmdbFetch('/search/movie', { query, page });
}

// Fetch movie details
async function fetchMovieDetails(movieId) {
  return tmdbFetch(`/movie/${movieId}`);
}

// Fetch movie recommendations
async function fetchRecommendations(movieId, page = 1) {
  return tmdbFetch(`/movie/${movieId}/recommendations`, { page });
}

// ---------- VidLink.pro API ----------
// Fetch stream URL from VidLink.pro
async function fetchVidLinkStream(movieId, isMovie = true, season = null, episode = null) {
  const baseUrl = window.ENV.VIDLINK_API_BASE;
  const url = new URL(`${baseUrl}/watch`);
  url.searchParams.append('isMovie', isMovie);
  url.searchParams.append('id', movieId);
  if (!isMovie) {
    if (season) url.searchParams.append('season', season);
    if (episode) url.searchParams.append('episode', episode);
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`VidLink API error: ${response.status}`);
    }
    const data = await response.json();
    
    // VidLink returns a stream object with playlist URL
    if (data && data.stream && data.stream.playlist) {
      return data.stream.playlist;
    }
    throw new Error('No stream URL found in VidLink response');
  } catch (error) {
    console.error('VidLink fetch error:', error);
    throw error;
  }
}
