import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { searchTitles } from '../omdb';

const CURRENT_YEAR = new Date().getFullYear();

function ReleasesPage({ onOpenDetails }) {
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentSeries, setRecentSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReleases() {
      setLoading(true);
      setError('');

      try {
        const [movieA, movieB, seriesA, seriesB] = await Promise.all([
          searchTitles({ query: 'the', type: 'movie', year: String(CURRENT_YEAR), page: 1, signal: controller.signal }),
          searchTitles({ query: 'a', type: 'movie', year: String(CURRENT_YEAR - 1), page: 1, signal: controller.signal }),
          searchTitles({ query: 'the', type: 'series', year: String(CURRENT_YEAR), page: 1, signal: controller.signal }),
          searchTitles({ query: 'a', type: 'series', year: String(CURRENT_YEAR - 1), page: 1, signal: controller.signal })
        ]);

        setRecentMovies([...movieA.items, ...movieB.items].slice(0, 12));
        setRecentSeries([...seriesA.items, ...seriesB.items].slice(0, 12));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Nao foi possivel carregar os lancamentos.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();

    return () => controller.abort();
  }, []);

  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Atualizacoes</p>
        <h2>Lancamentos Recentes</h2>
        <p>Catalogo focado em filmes e series dos anos mais recentes.</p>
      </header>

      {error && <p className="error-box">{error}</p>}

      <section className="stack-section">
        <div className="section-head">
          <h3>Filmes de {CURRENT_YEAR} e {CURRENT_YEAR - 1}</h3>
        </div>
        <MovieGrid
          items={recentMovies}
          loading={loading}
          emptyMessage="Nenhum filme recente encontrado."
          onOpenDetails={onOpenDetails}
        />
      </section>

      <section className="stack-section">
        <div className="section-head">
          <h3>Series de {CURRENT_YEAR} e {CURRENT_YEAR - 1}</h3>
        </div>
        <MovieGrid
          items={recentSeries}
          loading={loading}
          emptyMessage="Nenhuma serie recente encontrada."
          onOpenDetails={onOpenDetails}
        />
      </section>
    </main>
  );
}

export default ReleasesPage;
