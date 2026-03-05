import { useEffect, useMemo, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { searchTitles } from '../omdb';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_VISIBLE = 8;

function dedupeById(items) {
  return Array.from(new Map(items.map((item) => [item.imdbID, item])).values());
}

function ReleasesPage({ onOpenTitle, onToggleFavorite, isFavorite }) {
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentSeries, setRecentSeries] = useState([]);
  const [movieVisible, setMovieVisible] = useState(DEFAULT_VISIBLE);
  const [seriesVisible, setSeriesVisible] = useState(DEFAULT_VISIBLE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReleases() {
      setLoading(true);
      setError('');

      try {
        const [movieA, movieB, seriesA, seriesB] = await Promise.all([
          searchTitles({ query: 'new', type: 'movie', year: String(CURRENT_YEAR), page: 1, signal: controller.signal }),
          searchTitles({ query: 'best', type: 'movie', year: String(CURRENT_YEAR - 1), page: 1, signal: controller.signal }),
          searchTitles({ query: 'new', type: 'series', year: String(CURRENT_YEAR), page: 1, signal: controller.signal }),
          searchTitles({ query: 'best', type: 'series', year: String(CURRENT_YEAR - 1), page: 1, signal: controller.signal })
        ]);

        setRecentMovies(dedupeById([...movieA.items, ...movieB.items]));
        setRecentSeries(dedupeById([...seriesA.items, ...seriesB.items]));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Não foi possível carregar os lançamentos.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();

    return () => controller.abort();
  }, []);

  const visibleMovies = useMemo(() => recentMovies.slice(0, movieVisible), [recentMovies, movieVisible]);
  const visibleSeries = useMemo(() => recentSeries.slice(0, seriesVisible), [recentSeries, seriesVisible]);

  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Atualizações</p>
        <h2>Lançamentos Recentes</h2>
        <p>
          Catálogo focado em filmes e séries de {CURRENT_YEAR} e {CURRENT_YEAR - 1}, com limite inicial para
          navegação mais limpa.
        </p>
      </header>

      {error && <p className="error-box">{error}</p>}

      <section className="stack-section">
        <div className="section-head">
          <h3>Filmes de {CURRENT_YEAR} e {CURRENT_YEAR - 1}</h3>
        </div>
        <MovieGrid
          items={visibleMovies}
          loading={loading}
          emptyMessage="Nenhum filme recente encontrado."
          onOpenTitle={onOpenTitle}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
        {!loading && recentMovies.length > DEFAULT_VISIBLE && (
          <div className="inline-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setMovieVisible((current) =>
                  current >= recentMovies.length ? DEFAULT_VISIBLE : Math.min(current + DEFAULT_VISIBLE, recentMovies.length)
                )
              }
            >
              {movieVisible >= recentMovies.length ? 'Mostrar menos' : 'Mostrar mais filmes'}
            </button>
          </div>
        )}
      </section>

      <section className="stack-section">
        <div className="section-head">
          <h3>Séries de {CURRENT_YEAR} e {CURRENT_YEAR - 1}</h3>
        </div>
        <MovieGrid
          items={visibleSeries}
          loading={loading}
          emptyMessage="Nenhuma série recente encontrada."
          onOpenTitle={onOpenTitle}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
        {!loading && recentSeries.length > DEFAULT_VISIBLE && (
          <div className="inline-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setSeriesVisible((current) =>
                  current >= recentSeries.length
                    ? DEFAULT_VISIBLE
                    : Math.min(current + DEFAULT_VISIBLE, recentSeries.length)
                )
              }
            >
              {seriesVisible >= recentSeries.length ? 'Mostrar menos' : 'Mostrar mais séries'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ReleasesPage;
