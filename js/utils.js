// utils.js - Helper functions and state management

// Simple state management
const State = {
  currentPage: 1,
  totalPages: 1,
  currentFilters: {
    genre: '',
    year: '',
    rating: '',
    sort: 'popularity.desc'
  },
  searchQuery: '',
  genres: []
};

// Debounce utility
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Format date to year only
function formatYear(dateString) {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
}

// Build image URL
function getImageUrl(path, size = 'w500') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Show/hide loader
function setLoader(elementId, isLoading) {
  const loader = document.getElementById(elementId);
  if (loader) loader.style.display = isLoading ? 'flex' : 'none';
}

// Show error message
function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function hideError(elementId) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) errorEl.style.display = 'none';
}

// Create movie card HTML
function createMovieCard(movie) {
  const posterPath = movie.poster_path;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.dataset.id = movie.id;
  card.addEventListener('click', () => {
    window.location.href = `movie-detail.html?id=${movie.id}`;
  });
  
  const posterDiv = document.createElement('div');
  posterDiv.className = 'movie-card-poster';
  
  if (posterPath) {
    const img = document.createElement('img');
    img.src = getImageUrl(posterPath, 'w342');
    img.alt = movie.title;
    img.loading = 'lazy';
    posterDiv.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'movie-card-placeholder';
    placeholder.innerHTML = '<i class="fas fa-film fa-2x"></i>';
    posterDiv.appendChild(placeholder);
  }
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'movie-card-info';
  
  const title = document.createElement('div');
  title.className = 'movie-card-title';
  title.textContent = movie.title;
  
  const meta = document.createElement('div');
  meta.className = 'movie-card-meta';
  
  const rating = document.createElement('span');
  rating.className = 'movie-card-rating';
  rating.innerHTML = `<i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1) || 'N/A'}`;
  
  const yearSpan = document.createElement('span');
  yearSpan.textContent = year || '—';
  
  meta.appendChild(rating);
  meta.appendChild(yearSpan);
  
  infoDiv.appendChild(title);
  infoDiv.appendChild(meta);
  
  card.appendChild(posterDiv);
  card.appendChild(infoDiv);
  
  return card;
}

// Populate genre dropdown
async function populateGenreFilter(selectId = 'genre-filter') {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  // Clear existing options except first
  while (select.options.length > 1) select.remove(1);
  
  try {
    const genres = await fetchGenres();
    State.genres = genres;
    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load genres:', error);
  }
}

// Populate year dropdown (last 50 years)
function populateYearFilter(selectId = 'year-filter') {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  while (select.options.length > 1) select.remove(1);
  
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 50; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  }
}

// Get query parameters from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
