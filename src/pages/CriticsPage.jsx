import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { CRITICS_LISTS } from '../data/curation';
import { getTitleByName } from '../omdb';

function normalizeAsSearchItem(movie) {
  const parsedRating = Number.parseFloat(movie.imdbRating);

  return {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster,
    imdbRating: Number.isFinite(parsedRating) ? parsedRating.toFixed(1) : 'N/A',
    _ratingSort: Number.isFinite(parsedRating) ? parsedRating : -1
  };
}

function CriticsPage({ onOpenTitle, onToggleFavorite, isFavorite }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLists() {
      setLoading(true);
      setError('');

      try {
        const hydrated = await Promise.all(
          CRITICS_LISTS.map(async (list) => {
            const movies = await Promise.all(
              list.titles.map(async (title) => {
                try {
                  const data = await getTitleByName({ title, signal: controller.signal });
                  return normalizeAsSearchItem(data);
                } catch (_err) {
                  return null;
                }
              })
            );

            return {
              title: list.title,
              description: list.description,
              items: movies.filter(Boolean).sort((a, b) => b._ratingSort - a._ratingSort)
            };
          })
        );

        setLists(hydrated);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Falha ao carregar listas da crítica.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLists();

    return () => controller.abort();
  }, []);

  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Listas Especiais</p>
        <h2>Seleções da Crítica</h2>
        <p>Curadoria editorial inspirada em listas recorrentes de especialistas em cinema.</p>
      </header>

      {error && <p className="error-box">{error}</p>}

      {lists.map((list) => (
        <section className="stack-section" key={list.title}>
          <div className="section-head">
            <h3>{list.title}</h3>
            <p>{list.description}</p>
          </div>
          <MovieGrid
            items={list.items}
            loading={loading}
            emptyMessage="Não foi possível carregar esta lista no momento."
            onOpenTitle={onOpenTitle}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
            showRating
          />
        </section>
      ))}
    </main>
  );
}

export default CriticsPage;
