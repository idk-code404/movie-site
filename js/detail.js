// detail.js - Movie detail page with player

document.addEventListener('DOMContentLoaded', async () => {
  const movieId = getQueryParam('id');
  if (!movieId) {
    window.location.href = 'index.html';
    return;
  }
  
  const detailContainer = document.getElementById('movie-detail');
  const recContainer = document.getElementById('recommendations-container');
  
  // Load movie details and player
  await loadMovieDetails(movieId);
  
  // Load recommendations
  await loadRecommendations(movieId);
  
  // Search functionality (same as main page)
  setupSearch();
  
  async function loadMovieDetails(id) {
    try {
      detailContainer.innerHTML = '<div class="loader"></div>';
      
      const movie = await fetchMovieDetails(id);
      
      // Build detail view
      detailContainer.innerHTML = `
        <div class="movie-detail">
          <div class="movie-detail-poster">
            <img src="${getImageUrl(movie.poster_path, 'w500')}" alt="${movie.title}">
          </div>
          <div class="movie-detail-info">
            <h1 class="movie-detail-title">${movie.title}</h1>
            <div class="movie-detail-meta">
              <span><i class="fas fa-star"></i> ${movie.vote_average?.toFixed(1)}/10</span>
              <span><i class="fas fa-calendar"></i> ${formatYear(movie.release_date)}</span>
              <span><i class="fas fa-clock"></i> ${movie.runtime} min</span>
            </div>
            <div class="movie-detail-genres">
              ${movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('')}
            </div>
            <p class="movie-detail-overview">${movie.overview || 'No overview available.'}</p>
          </div>
        </div>
        <div class="player-container">
          <div id="player-loader" class="loader"></div>
          <div id="player-error" class="error-message" style="display: none;"></div>
          <video id="video-player" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto"></video>
        </div>
      `;
      
      // Initialize video player with VidLink stream
      await initVideoPlayer(id);
      
    } catch (error) {
      detailContainer.innerHTML = `<div class="error-message">Failed to load movie details: ${error.message}</div>`;
    }
  }
  
  async function initVideoPlayer(movieId) {
    const playerLoader = document.getElementById('player-loader');
    const playerError = document.getElementById('player-error');
    const videoElement = document.getElementById('video-player');
    
    try {
      // Fetch stream URL from VidLink.pro
      const streamUrl = await fetchVidLinkStream(movieId, true);
      
      if (!streamUrl) {
        throw new Error('No stream available');
      }
      
      // Initialize Video.js with HLS support
      const player = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        responsive: true,
        html5: {
          hls: {
            overrideNative: true
          }
        }
      });
      
      // Check if HLS is supported natively
      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        player.src({
          src: streamUrl,
          type: 'application/x-mpegURL'
        });
      } else if (Hls.isSupported()) {
        // Use hls.js
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        
        // Handle HLS errors
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            showPlayerError('Stream playback failed. Please try again later.');
          }
        });
      } else {
        showPlayerError('Your browser does not support HLS playback.');
      }
      
      playerLoader.style.display = 'none';
      
    } catch (error) {
      console.error('Player initialization error:', error);
      showPlayerError(`Failed to load video: ${error.message}`);
    }
    
    function showPlayerError(message) {
      playerLoader.style.display = 'none';
      playerError.textContent = message;
      playerError.style.display = 'block';
      videoElement.style.display = 'none';
    }
  }
  
  async function loadRecommendations(movieId) {
    const recLoader = document.getElementById('recommendations-loader');
    const recError = document.getElementById('recommendations-error');
    
    try {
      recLoader.style.display = 'flex';
      const data = await fetchRecommendations(movieId);
      
      if (data.results && data.results.length > 0) {
        data.results.slice(0, 12).forEach(movie => {
          recContainer.appendChild(createMovieCard(movie));
        });
      } else {
        recContainer.innerHTML = '<p>No recommendations available.</p>';
      }
    } catch (error) {
      showError('recommendations-error', 'Failed to load recommendations.');
    } finally {
      recLoader.style.display = 'none';
    }
  }
  
  function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `index.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
});
