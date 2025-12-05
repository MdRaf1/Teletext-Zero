/**
 * API Service for Teletext Zero
 * Fetches real data from external APIs and formats for 40-column display
 * Supports caching for sub-page navigation (201-205, 301-305, 501-505)
 */

import { GRID } from '../constants';

// ============================================
// Types
// ============================================

export interface CachedArticle {
  title: string;
  description: string;
  url?: string;
  pubDate?: string;
  score?: number;
  author?: string;
}

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

interface RSS2JSONResponse {
  status: string;
  items: RSSItem[];
}

// ============================================
// Article Cache (In-Memory Store)
// ============================================

interface ArticleCache {
  news: CachedArticle[];
  tech: CachedArticle[];
  sports: CachedArticle[];
  lastFetched: {
    news: number;
    tech: number;
    sports: number;
  };
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const articleCache: ArticleCache = {
  news: [],
  tech: [],
  sports: [],
  lastFetched: {
    news: 0,
    tech: 0,
    sports: 0,
  },
};

/**
 * Get cached articles by category
 */
export function getCachedArticles(
  category: 'news' | 'tech' | 'sports'
): CachedArticle[] {
  return articleCache[category];
}

/**
 * Get a specific cached article by category and index (1-based)
 */
export function getCachedArticle(
  category: 'news' | 'tech' | 'sports',
  index: number
): CachedArticle | null {
  const articles = articleCache[category];
  if (index < 1 || index > articles.length) return null;
  return articles[index - 1];
}

// ============================================
// Utility Functions
// ============================================

/**
 * Word wrap text to fit within specified width
 * Breaks on word boundaries when possible
 */
export function wordWrap(text: string, width: number = GRID.COLUMNS): string[] {
  if (!text) return [];
  
  // Clean up HTML entities and tags
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  const lines: string[] = [];
  const words = cleanText.split(' ');
  let currentLine = '';

  for (const word of words) {
    // If word itself is longer than width, break it
    if (word.length > width) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      // Break long word into chunks
      for (let i = 0; i < word.length; i += width) {
        lines.push(word.substring(i, i + width));
      }
      continue;
    }

    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= width) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Truncate string to fit width
 */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 2) + '..';
}

/**
 * Format a headline for list display
 * Format: "1. [Headline]                   P201"
 * 
 * Layout (40 chars total):
 * - Prefix "1. " = 3 chars
 * - Title = max 31 chars (truncated with ..)
 * - Space + Page = " P201" = 6 chars
 */
function formatHeadlineWithPage(
  index: number,
  title: string,
  basePageNum: number
): string {
  const num = index + 1;
  const prefix = `${num}. `;
  const pageNum = basePageNum + num;
  const suffix = ` P${pageNum}`;
  
  // Fixed layout: prefix (3) + title (max 31) + suffix (6) = 40
  const maxTitleLen = 31;
  
  // Truncate title strictly
  let displayTitle = title;
  if (displayTitle.length > maxTitleLen) {
    displayTitle = displayTitle.substring(0, maxTitleLen - 2) + '..';
  }
  
  // Pad to ensure suffix aligns to right edge
  const usedLen = prefix.length + displayTitle.length + suffix.length;
  const paddingNeeded = GRID.COLUMNS - usedLen;
  const padding = paddingNeeded > 0 ? ' '.repeat(paddingNeeded) : '';
  
  return `${prefix}${displayTitle}${padding}${suffix}`;
}

// ============================================
// RSS Feed Fetching (BBC News, ESPN)
// ============================================

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

async function fetchRSSFeed(rssUrl: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(
      `${RSS2JSON_BASE}${encodeURIComponent(rssUrl)}`
    );
    if (!response.ok) throw new Error('RSS fetch failed');
    
    const data: RSS2JSONResponse = await response.json();
    if (data.status !== 'ok') throw new Error('RSS parse failed');
    
    return data.items;
  } catch (error) {
    console.error('RSS fetch error:', error);
    return [];
  }
}

// ============================================
// BBC World News (Page 200)
// ============================================

const BBC_WORLD_RSS = 'http://feeds.bbci.co.uk/news/world/rss.xml';

/**
 * Fetch BBC World News for Page 200
 */
export async function fetchWorldNews(): Promise<string[]> {
  const now = Date.now();
  
  // Check cache
  if (
    articleCache.news.length > 0 &&
    now - articleCache.lastFetched.news < CACHE_TTL
  ) {
    return formatNewsListPage(articleCache.news, 'BBC WORLD NEWS', 200);
  }

  try {
    const items = await fetchRSSFeed(BBC_WORLD_RSS);
    
    // Cache the articles
    articleCache.news = items.slice(0, 5).map((item) => ({
      title: item.title,
      description: item.description,
      url: item.link,
      pubDate: item.pubDate,
    }));
    articleCache.lastFetched.news = now;

    return formatNewsListPage(articleCache.news, 'BBC WORLD NEWS', 200);
  } catch (error) {
    console.error('BBC News error:', error);
    return [
      'BBC WORLD NEWS',
      '',
      '================================',
      '',
      'ERROR: UNABLE TO FETCH NEWS',
      '',
      'Service temporarily unavailable.',
      '',
      'Press 100 for index',
    ];
  }
}

/**
 * Get BBC News article detail page (201-205)
 */
export function getNewsDetailPage(articleIndex: number): string[] {
  const article = getCachedArticle('news', articleIndex);
  if (!article) {
    return [
      'ARTICLE NOT FOUND',
      '',
      'Please visit Page 200 first',
      'to load the news headlines.',
      '',
      'Press 200 for headlines',
    ];
  }
  return formatArticleDetailPage(article, 'BBC NEWS', 200);
}

// ============================================
// The Verge Tech News (Page 300)
// ============================================

const VERGE_RSS = 'https://www.theverge.com/rss/index.xml';

/**
 * Fetch The Verge Tech News for Page 300
 */
export async function fetchTechNews(): Promise<string[]> {
  const now = Date.now();
  
  // Check cache
  if (
    articleCache.tech.length > 0 &&
    now - articleCache.lastFetched.tech < CACHE_TTL
  ) {
    return formatNewsListPage(articleCache.tech, 'THE VERGE', 300);
  }

  try {
    const items = await fetchRSSFeed(VERGE_RSS);
    
    // Cache the articles
    articleCache.tech = items.slice(0, 5).map((item) => ({
      title: item.title,
      description: item.description || 'No description available.',
      url: item.link,
      pubDate: item.pubDate,
    }));
    articleCache.lastFetched.tech = now;

    return formatNewsListPage(articleCache.tech, 'THE VERGE', 300);
  } catch (error) {
    console.error('The Verge error:', error);
    return [
      'THE VERGE',
      '',
      '================================',
      '',
      'ERROR: UNABLE TO FETCH NEWS',
      '',
      'Service temporarily unavailable.',
      '',
      'Press 100 for index',
    ];
  }
}

/**
 * Get The Verge article detail page (301-305)
 */
export function getTechDetailPage(articleIndex: number): string[] {
  const article = getCachedArticle('tech', articleIndex);
  if (!article) {
    return [
      'ARTICLE NOT FOUND',
      '',
      'Please visit Page 300 first',
      'to load the tech headlines.',
      '',
      'Press 300 for headlines',
    ];
  }
  return formatArticleDetailPage(article, 'THE VERGE', 300);
}

// ============================================
// ESPN Sports (Page 500)
// ============================================

const ESPN_RSS = 'https://www.espn.com/espn/rss/news';

/**
 * Fetch ESPN Sports for Page 500
 */
export async function fetchSports(): Promise<string[]> {
  const now = Date.now();
  
  // Check cache
  if (
    articleCache.sports.length > 0 &&
    now - articleCache.lastFetched.sports < CACHE_TTL
  ) {
    return formatNewsListPage(articleCache.sports, 'ESPN SPORTS', 500);
  }

  try {
    const items = await fetchRSSFeed(ESPN_RSS);
    
    // Cache the articles
    articleCache.sports = items.slice(0, 5).map((item) => ({
      title: item.title,
      description: item.description,
      url: item.link,
      pubDate: item.pubDate,
    }));
    articleCache.lastFetched.sports = now;

    return formatNewsListPage(articleCache.sports, 'ESPN SPORTS', 500);
  } catch (error) {
    console.error('ESPN Sports error:', error);
    return [
      'ESPN SPORTS',
      '',
      '================================',
      '',
      'ERROR: UNABLE TO FETCH SPORTS',
      '',
      'Service temporarily unavailable.',
      '',
      'Press 100 for index',
    ];
  }
}

/**
 * Get ESPN Sports article detail page (501-505)
 */
export function getSportsDetailPage(articleIndex: number): string[] {
  const article = getCachedArticle('sports', articleIndex);
  if (!article) {
    return [
      'ARTICLE NOT FOUND',
      '',
      'Please visit Page 500 first',
      'to load the sports headlines.',
      '',
      'Press 500 for headlines',
    ];
  }
  return formatArticleDetailPage(article, 'ESPN SPORTS', 500);
}

// ============================================
// Formatting Helpers
// ============================================

/**
 * Format a list page with headlines
 */
function formatNewsListPage(
  articles: CachedArticle[],
  title: string,
  basePageNum: number
): string[] {
  const lines: string[] = [
    title,
    '',
    '================================',
    '',
  ];

  articles.forEach((article, index) => {
    lines.push(formatHeadlineWithPage(index, article.title, basePageNum));
    lines.push('');
  });

  lines.push('================================');
  lines.push('');
  lines.push('Type page number for full story');
  lines.push('');
  lines.push('Press 100 for index');

  return lines;
}

/**
 * Format an article detail page with word wrapping
 * Ensures footer is at row 23 (within 23 content rows)
 */
function formatArticleDetailPage(
  article: CachedArticle,
  source: string,
  backPage: number
): string[] {
  const lines: string[] = [
    source,
    '',
    '================================',
    '',
  ];

  // Add title with word wrap
  const titleLines = wordWrap(article.title.toUpperCase(), GRID.COLUMNS);
  lines.push(...titleLines);
  lines.push('');
  lines.push('--------------------------------');
  lines.push('');

  // Calculate remaining space for description
  // Total content rows = 23, footer needs 2 lines (blank + text)
  const headerRows = lines.length;
  const footerRows = 2;
  const maxDescLines = 23 - headerRows - footerRows - 1; // -1 for safety

  // Add description with word wrap
  if (article.description) {
    const descLines = wordWrap(article.description, GRID.COLUMNS);
    lines.push(...descLines.slice(0, Math.max(1, maxDescLines)));
    if (descLines.length > maxDescLines) {
      lines.push('...');
    }
  } else {
    lines.push('No description available.');
  }

  // Pad to push footer to bottom (row ~21-22)
  const currentLines = lines.length;
  const targetLines = 21; // Leave room for footer
  if (currentLines < targetLines) {
    for (let i = currentLines; i < targetLines; i++) {
      lines.push('');
    }
  }

  // Footer at row 22-23
  lines.push('');
  lines.push(`Press ${backPage} for headlines`);

  return lines;
}

// ============================================
// Weather (Page 400) - Unchanged
// ============================================

const WEATHER_CODES: Record<number, string> = {
  0: 'CLEAR SKY',
  1: 'MAINLY CLEAR',
  2: 'PARTLY CLOUDY',
  3: 'OVERCAST',
  45: 'FOG',
  48: 'DEPOSITING RIME FOG',
  51: 'LIGHT DRIZZLE',
  53: 'MODERATE DRIZZLE',
  55: 'DENSE DRIZZLE',
  56: 'FREEZING DRIZZLE',
  57: 'DENSE FREEZING DRIZZLE',
  61: 'SLIGHT RAIN',
  63: 'MODERATE RAIN',
  65: 'HEAVY RAIN',
  66: 'FREEZING RAIN',
  67: 'HEAVY FREEZING RAIN',
  71: 'SLIGHT SNOW',
  73: 'MODERATE SNOW',
  75: 'HEAVY SNOW',
  77: 'SNOW GRAINS',
  80: 'SLIGHT SHOWERS',
  81: 'MODERATE SHOWERS',
  82: 'VIOLENT SHOWERS',
  85: 'SLIGHT SNOW SHOWERS',
  86: 'HEAVY SNOW SHOWERS',
  95: 'THUNDERSTORM',
  96: 'THUNDERSTORM W/ HAIL',
  99: 'THUNDERSTORM W/ HEAVY HAIL',
};

interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

function getUserLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { timeout: 10000 }
    );
  });
}

async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    if (!response.ok) return 'YOUR LOCATION';
    const data = await response.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      'YOUR LOCATION'
    ).toUpperCase();
  } catch {
    return 'YOUR LOCATION';
  }
}

export async function fetchWeather(): Promise<string[]> {
  try {
    let location: GeoLocation;
    try {
      location = await getUserLocation();
    } catch {
      location = { latitude: 51.5074, longitude: -0.1278, city: 'LONDON' };
    }

    const cityName =
      location.city || (await getCityName(location.latitude, location.longitude));

    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
    weatherUrl.searchParams.set('latitude', location.latitude.toString());
    weatherUrl.searchParams.set('longitude', location.longitude.toString());
    weatherUrl.searchParams.set(
      'current',
      'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m'
    );
    weatherUrl.searchParams.set(
      'daily',
      'temperature_2m_max,temperature_2m_min,weather_code'
    );
    weatherUrl.searchParams.set('timezone', 'auto');

    const response = await fetch(weatherUrl.toString());
    if (!response.ok) throw new Error('Weather API error');

    const data: WeatherData = await response.json();
    const current = data.current;
    const daily = data.daily;

    const weatherDesc = WEATHER_CODES[current.weather_code] || 'UNKNOWN';
    const temp = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const wind = Math.round(current.wind_speed_10m);

    const lines: string[] = [
      'WEATHER FORECAST',
      '',
      '================================',
      '',
      `LOCATION: ${truncate(cityName, 28)}`,
      '',
      'CURRENT CONDITIONS:',
      '',
      `  ${weatherDesc}`,
      '',
      `  TEMPERATURE:  ${temp}C`,
      `  HUMIDITY:     ${humidity}%`,
      `  WIND SPEED:   ${wind} km/h`,
      '',
      '================================',
      '',
      '3-DAY FORECAST:',
      '',
    ];

    const days = ['TODAY', 'TOMORROW', 'DAY AFTER'];
    for (let i = 0; i < 3 && i < daily.temperature_2m_max.length; i++) {
      const maxTemp = Math.round(daily.temperature_2m_max[i]);
      const minTemp = Math.round(daily.temperature_2m_min[i]);
      const dayWeather = WEATHER_CODES[daily.weather_code[i]] || 'UNKNOWN';
      lines.push(`  ${days[i]}: ${minTemp}C - ${maxTemp}C`);
      lines.push(`          ${dayWeather}`);
    }

    lines.push('');
    lines.push('Press 100 for index');

    return lines;
  } catch (error) {
    console.error('Weather API error:', error);
    return [
      'WEATHER SERVICE',
      '',
      '================================',
      '',
      'ERROR: UNABLE TO FETCH WEATHER',
      '',
      'Please check:',
      '- Location permissions',
      '- Internet connection',
      '',
      'Press 100 for index',
    ];
  }
}
