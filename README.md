# MovieStream — Dark Minimalist Movie Site

A production-ready, client-side movie streaming website that integrates the VidLink.pro API for video playback and TMDB for movie metadata. Built with vanilla JavaScript, no frameworks.

## Features

- 🔍 **Search** movies by title
- 🎬 **Trending** section with weekly popular movies
- 🎛️ **Filters** for genre, year, and rating
- 📄 **Movie details** page with full info
- 🎥 **Embedded video player** using VidLink.pro streams (HLS)
- 📱 **Fully responsive** design
- 🌙 **Dark minimalist** aesthetic
- ♿ **Accessible** and keyboard-friendly
- ⚡ **Fast** — client-side only, deploy to any static host

## Tech Stack

- **Vanilla JavaScript** (ES6+)
- **TMDB API** for movie metadata
- **VidLink.pro API** for streaming
- **Video.js + hls.js** for HLS playback
- **CSS Grid/Flexbox** for layout
- **Jest** for unit testing

## Prerequisites

- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)
- Node.js (for local development/testing)

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-site
