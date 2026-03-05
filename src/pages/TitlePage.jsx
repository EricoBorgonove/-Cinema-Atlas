import { useEffect, useMemo, useState } from 'react';
import { getTitleById } from '../omdb';

function TitlePage({ imdbID, onToggleFavorite, isFavorite }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imdbID) {
      setError('Titulo invalido.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchTitle() {
      setLoading(true);
      setError('');
      try {
        const data = await getTitleById({ imdbID, signal: controller.signal });
        setDetails(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Erro ao carregar titulo.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTitle();

    return () => controller.abort();
  }, [imdbID]);

  const normalizedFavorite = useMemo(() => {
    if (!details) return null;

    return {
      imdbID: details.imdbID,
      Title: details.Title,
      Year: details.Year,
      Type: details.Type,
      Poster: details.Poster,
      imdbRating: details.imdbRating
    };
  }, [details]);

  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Detalhes</p>
        <h2>Pagina do Titulo</h2>
        <p>Visual completo com sinopse, elenco, premios e avaliacao.</p>
      </header>

      <p>
        <a href="#/busca" className="inline-link">
          Voltar para busca
        </a>
      </p>

      {loading && <p className="empty-state">Carregando titulo...</p>}
      {error && <p className="error-box">{error}</p>}

      {!loading && details && (
        <section className="title-panel">
          <img
            src={
              details.Poster && details.Poster !== 'N/A'
                ? details.Poster
                : 'https://placehold.co/480x720/f6f0e6/7b6d58?text=Sem+Poster'
            }
            alt={`Poster de ${details.Title}`}
          />
          <div>
            <h3>{details.Title}</h3>
            <p className="meta-line">
              {details.Year} | {details.Runtime} | {details.Genre}
            </p>
            <p>{details.Plot}</p>
            <p>
              <strong>Direcao:</strong> {details.Director}
            </p>
            <p>
              <strong>Elenco:</strong> {details.Actors}
            </p>
            <p>
              <strong>IMDb:</strong> {details.imdbRating}
            </p>
            <p>
              <strong>Premios:</strong> {details.Awards}
            </p>
            <button
              type="button"
              className={`secondary-btn title-favorite ${isFavorite(details.imdbID) ? 'is-favorite' : ''}`}
              onClick={() => normalizedFavorite && onToggleFavorite(normalizedFavorite)}
            >
              {isFavorite(details.imdbID) ? 'Remover dos favoritos' : 'Salvar em favoritos'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default TitlePage;
