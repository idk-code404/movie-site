// scripts/build.js
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../js/config.js');
const tmdbApiKey = process.env.TMDB_API_KEY;

if (!tmdbApiKey) {
  console.error('❌ Error: TMDB_API_KEY environment variable is not set.');
  process.exit(1);
}

let configContent = fs.readFileSync(configPath, 'utf8');
configContent = configContent.replace('__TMDB_API_KEY__', tmdbApiKey);

fs.writeFileSync(configPath, configContent);
console.log('✅ Injected TMDB_API_KEY into config.js');
