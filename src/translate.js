const translationCache = new Map();

function normalize(text) {
  return (text || '').trim();
}

export async function translateToPortuguese(text, signal) {
  const input = normalize(text);
  if (!input) return '';

  if (translationCache.has(input)) {
    return translationCache.get(input);
  }

  const params = new URLSearchParams({
    client: 'gtx',
    sl: 'auto',
    tl: 'pt',
    dt: 't',
    q: input
  });

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
      signal
    });

    if (!response.ok) {
      throw new Error('Falha ao traduzir texto.');
    }

    const data = await response.json();
    const translated = (data?.[0] || []).map((part) => part?.[0] || '').join('').trim();

    if (!translated) {
      translationCache.set(input, input);
      return input;
    }

    translationCache.set(input, translated);
    return translated;
  } catch (_err) {
    translationCache.set(input, input);
    return input;
  }
}
