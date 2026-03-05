import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { CRITICS_LISTS } from '../data/curation';
import { getTitleByName } from '../omdb';

function normalizeAsSearchItem(movie) {
  return {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster
  };
}

function CriticsPage({ onOpenDetails }) {
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
              items: movies.filter(Boolean)
            };
          })
        );

        setLists(hydrated);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Falha ao carregar listas da critica.');
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
        <h2>Selecoes Da Critica</h2>
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
            emptyMessage="Nao foi possivel carregar esta lista no momento."
            onOpenDetails={onOpenDetails}
          />
        </section>
      ))}
    </main>
  );
}

export default CriticsPage;
