import { base44 } from '@/api/base44Client';

const GENRE_MAP = {
  'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35,
  'Crime': 80, 'Documentary': 99, 'Drama': 18, 'Family': 10751,
  'Fantasy': 14, 'History': 36, 'Horror': 27, 'Music': 10402,
  'Mystery': 9648, 'Romance': 10749, 'Sci-Fi': 878, 'Thriller': 53,
  'War': 10752, 'Western': 37,
};

const LANGUAGE_MAP = {
  'English': 'en', 'Hindi': 'hi', 'Arabic': 'ar', 'Turkish': 'tr',
  'Korean': 'ko', 'Japanese': 'ja', 'French': 'fr', 'Spanish': 'es',
  'German': 'de', 'Italian': 'it', 'Chinese': 'zh', 'Portuguese': 'pt',
};

export { GENRE_MAP, LANGUAGE_MAP };

export async function discoverMovies(filters) {
  const { genres = [], cast, yearRange, duration, social, languages = [] } = filters;

  const genreIds = genres.map(g => GENRE_MAP[g]).filter(Boolean).join(',');
  const langCodes = languages.map(l => LANGUAGE_MAP[l]).filter(Boolean);

  let runtimeFilter = '';
  if (duration === '~1h30') runtimeFilter = 'with a runtime around 90 minutes';
  else if (duration === '~2h') runtimeFilter = 'with a runtime around 120 minutes';
  else if (duration === '~2h30+') runtimeFilter = 'with a runtime of 150 minutes or more';

  let socialContext = '';
  if (social === 'Alone') socialContext = 'suitable for watching alone, possibly introspective or intense';
  else if (social === 'With Friends') socialContext = 'fun, exciting, great for watching with friends';
  else if (social === 'Family') socialContext = 'family-friendly, appropriate for all ages';

  const prompt = `You are a movie recommendation engine with expert knowledge of TMDB data. Based on these filters, recommend exactly 6 movies:

Genres: ${genres.join(', ') || 'any'}
${cast ? `Cast preference: ${cast}` : ''}
Year range: ${yearRange || 'any'}
${runtimeFilter}
${socialContext}
Languages: ${languages.join(', ') || 'any'}

Return movies that match these criteria as closely as possible, sorted by rating (highest first). For each movie provide the TMDB data format.
Return REAL movies that exist on TMDB with accurate data.`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        movies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              overview: { type: 'string' },
              release_date: { type: 'string' },
              vote_average: { type: 'number' },
              vote_count: { type: 'number' },
              poster_path: { type: 'string' },
              original_language: { type: 'string' },
              genre_ids: { type: 'array', items: { type: 'number' } },
              streaming_platforms: { type: 'array', items: { type: 'string' } },
              trailer_key: { type: 'string' },
            }
          }
        }
      }
    },
    add_context_from_internet: true,
  });

  return result.movies || [];
}

export async function aiSearchMovies(query) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a movie recommendation AI. The user described what they want to watch: "${query}"

Parse this natural language request and recommend exactly 6 movies that match their intent. Consider mood, setting, themes, tone, and any specific requirements mentioned.

Return REAL movies that exist on TMDB with accurate data.`,
    response_json_schema: {
      type: 'object',
      properties: {
        intent_summary: { type: 'string' },
        movies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              overview: { type: 'string' },
              release_date: { type: 'string' },
              vote_average: { type: 'number' },
              vote_count: { type: 'number' },
              poster_path: { type: 'string' },
              original_language: { type: 'string' },
              streaming_platforms: { type: 'array', items: { type: 'string' } },
              trailer_key: { type: 'string' },
            }
          }
        }
      }
    },
    add_context_from_internet: true,
  });

  return result;
}

export async function getTrendingMovies(region) {
  const regionMap = {
    'Arab World': 'Arabic-language films trending in 2024-2025',
    'Europe': 'European films trending in 2024-2025',
    'Asia': 'Asian films (Korean, Japanese, Chinese, Indian) trending in 2024-2025',
    'USA': 'American Hollywood films trending in 2024-2025',
    'Global': 'globally trending films of 2024-2025',
  };

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Return the top 10 ${regionMap[region] || 'globally trending films'} with high ratings. Return REAL movies with accurate TMDB data.`,
    response_json_schema: {
      type: 'object',
      properties: {
        movies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              overview: { type: 'string' },
              release_date: { type: 'string' },
              vote_average: { type: 'number' },
              vote_count: { type: 'number' },
              poster_path: { type: 'string' },
              original_language: { type: 'string' },
              streaming_platforms: { type: 'array', items: { type: 'string' } },
            }
          }
        }
      }
    },
    add_context_from_internet: true,
  });

  return result.movies || [];
}

export async function getSurpriseMovie(mood) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Pick ONE highly-rated movie for someone feeling "${mood}". It should be a hidden gem or crowd favorite. Return REAL movie data from TMDB.`,
    response_json_schema: {
      type: 'object',
      properties: {
        movie: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            overview: { type: 'string' },
            release_date: { type: 'string' },
            vote_average: { type: 'number' },
            vote_count: { type: 'number' },
            poster_path: { type: 'string' },
            original_language: { type: 'string' },
            streaming_platforms: { type: 'array', items: { type: 'string' } },
            trailer_key: { type: 'string' },
          }
        },
        reason: { type: 'string' },
      }
    },
    add_context_from_internet: true,
  });

  return result;
}