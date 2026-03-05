const API_URL = 'https://www.omdbapi.com/';

function ensureApiKey() {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Defina VITE_OMDB_API_KEY no arquivo .env para usar a API do OMDb.');
  }
  return apiKey;
}

async function request(params, signal) {
  const apiKey = ensureApiKey();
  const searchParams = new URLSearchParams({ apikey: apiKey, ...params });
  const response = await fetch(`${API_URL}?${searchParams.toString()}`, { signal });

  if (!response.ok) {
    throw new Error('Falha de rede ao consultar o OMDb.');
  }

  const data = await response.json();
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Resposta inválida da API.');
  }

  return data;
}

export async function searchTitles({ query, type = 'all', year = '', page = 1, signal }) {
  const params = { s: query, page: String(page) };
  if (type !== 'all') params.type = type;
  if (year.trim()) params.y = year.trim();

  const data = await request(params, signal);
  return {
    items: data.Search || [],
    totalResults: Number(data.totalResults || 0)
  };
}

export async function getTitleById({ imdbID, signal }) {
  return request({ i: imdbID, plot: 'full' }, signal);
}

export async function getTitleByName({ title, year = '', signal }) {
  const params = { t: title, plot: 'short' };
  if (year) params.y = String(year);
  return request(params, signal);
}
