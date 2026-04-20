// app.js - Main page logic

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const trendingContainer = document.getElementById('trending-container');
  const movieContainer = document.getElementById('movie-container');
  const loader = document.getElementById('loader');
  const errorEl = document.getElementById('error');
  const loadMoreBtn = document.getElementById('load-more');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const genreFilter = document.getElementById('genre-filter');
  const yearFilter = document.getElementById('year-filter');
  const ratingFilter = document.getElementById('rating-filter');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resultCount = document.getElementById('result-count');
  
  // Initialize filters
  populateGenreFilter();
  populateYearFilter();
  
  // Load trending movies
  loadTrending();
  
  // Load initial discover movies
  loadMovies();
  
  // Event listeners
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  applyFiltersBtn.addEventListener('click', () => {
    State.currentPage = 1;
    State.currentFilters = {
      genre: genreFilter.value,
      year: yearFilter.value,
      rating: ratingFilter.value,
      sort: 'popularity.desc'
    };
    State.searchQuery = '';
    searchInput.value = '';
    loadMovies(true);
  });
  
  loadMoreBtn.addEventListener('click', loadMore);
  
  // Functions
  async function loadTrending() {
    const trendingLoader = document.getElementById('trending-loader');
    const trendingError = document.getElementById('trending-error');
    
    try {
      trendingLoader.style.display = 'flex';
      trendingError.style.display = 'none';
      
      const data = await fetchTrending();
      displayMovies(data.results, trendingContainer);
      
    } catch (error) {
      showError('trending-error', 'Failed to load trending movies. Please try again.');
    } finally {
      trendingLoader.style.display = 'none';
    }
  }
  
  async function loadMovies(reset = false) {
    if (reset) {
      movieContainer.innerHTML = '';
    }
    
    setLoader('loader', true);
    hideError('error');
    loadMoreBtn.style.display = 'none';
    
    try {
      let data;
      
      if (State.searchQuery) {
        data = await searchMovies(State.searchQuery, State.currentPage);
      } else {
        const params = {
          page: State.currentPage,
          with_genres: State.currentFilters.genre,
          primary_release_year: State.currentFilters.year,
          'vote_average.gte': State.currentFilters.rating || undefined,
          sort_by: State.currentFilters.sort
        };
        data = await fetchDiscoverMovies(params);
      }
      
      displayMovies(data.results, movieContainer, reset);
      
      State.totalPages = data.total_pages;
      resultCount.textContent = `${data.total_results.toLocaleString()} results`;
      
      if (State.currentPage < data.total_pages) {
        loadMoreBtn.style.display = 'inline-block';
      }
      
    } catch (error) {
      showError('error', `Failed to load movies: ${error.message}`);
    } finally {
      setLoader('loader', false);
    }
  }
  
  function displayMovies(movies, container, reset = false) {
    if (!movies || movies.length === 0) {
      if (reset) {
        container.innerHTML = '<div class="error-message">No movies found.</div>';
      }
      return;
    }
    
    const fragment = document.createDocumentFragment();
    movies.forEach(movie => {
      fragment.appendChild(createMovieCard(movie));
    });
    
    if (reset) {
      container.innerHTML = '';
    }
    container.appendChild(fragment);
  }
  
  async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    State.searchQuery = query;
    State.currentPage = 1;
    State.currentFilters = { genre: '', year: '', rating: '', sort: 'popularity.desc' };
    
    // Reset filter selects
    genreFilter.value = '';
    yearFilter.value = '';
    ratingFilter.value = '';
    
    await loadMovies(true);
  }
  
  async function loadMore() {
    State.currentPage++;
    await loadMovies();
  }
});
