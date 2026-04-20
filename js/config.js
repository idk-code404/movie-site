// config.js - Load environment variables
// In production, replace with actual values or use a build step.
window.ENV = {
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY', // Replace with your key
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
  VIDLINK_API_BASE: 'https://vidlink.pro/api/vidlink'
};

// Optionally load from a meta tag if you want to inject via server
// For static hosting, you can hardcode the key here (not recommended) 
// or use a build process. We'll provide an example .env file.
