import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { FEATURED_QUERIES } from '../data/curation';
import { searchTitles } from '../omdb';

function FeaturedPage({ onOpenDetails }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFeatured() {
      setLoading(true);
      setError('');
      try {
        const results = await Promise.all(
          FEATURED_QUERIES.map(async (section) => {
            const data = await searchTitles({
              query: section.query,
              type: section.type,
              page: 1,
              signal: controller.signal
            });

            return {
              title: section.label,
              items: data.items.slice(0, 6)
            };
          })
        );

        setSections(results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Nao foi possivel carregar os destaques.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();

    return () => controller.abort();
  }, []);

  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Curadoria</p>
        <h2>Filmes Em Destaque</h2>
        <p>Selecao dinamica para descobrir titulos populares por estilo.</p>
      </header>

      {error && <p className="error-box">{error}</p>}

      {sections.map((section) => (
        <section className="stack-section" key={section.title}>
          <div className="section-head">
            <h3>{section.title}</h3>
          </div>
          <MovieGrid
            items={section.items}
            loading={loading}
            emptyMessage="Sem destaques nesta categoria no momento."
            onOpenDetails={onOpenDetails}
          />
        </section>
      ))}
    </main>
  );
}

export default FeaturedPage;
