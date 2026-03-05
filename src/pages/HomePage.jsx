import { useEffect, useMemo, useState } from 'react';
import { CRITICS_LISTS } from '../data/curation';
import { getTitleByName, searchTitles } from '../omdb';

const CURRENT_YEAR = new Date().getFullYear();

function normalizeFromDetails(movie) {
  return {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster,
    imdbRating: movie.imdbRating
  };
}

function normalizeFromSearch(movie) {
  return {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster,
    imdbRating: 'N/A'
  };
}

function dedupe(items) {
  return Array.from(new Map(items.map((item) => [item.imdbID, item])).values());
}

function HomeRail({ title, subtitle, items, onOpenTitle, onToggleFavorite, isFavorite }) {
  return (
    <section className="home-rail">
      <div className="home-rail-head">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="home-rail-track" role="list" aria-label={title}>
        {items.map((item) => (
          <article key={item.imdbID} className="home-poster-card" role="listitem">
            <img
              src={
                item.Poster && item.Poster !== 'N/A'
                  ? item.Poster
                  : 'https://placehold.co/480x720/111827/eeeeee?text=Sem+Poster'
              }
              alt={`Poster de ${item.Title}`}
              loading="lazy"
            />
            <div className="home-poster-overlay">
              <h4>{item.Title}</h4>
              <p>
                {item.Year} | {item.Type}
              </p>
              {item.imdbRating && item.imdbRating !== 'N/A' && <p className="home-rating">IMDb {item.imdbRating}</p>}
              <div className="home-poster-actions">
                <button onClick={() => onOpenTitle(item.imdbID)}>Ver pagina</button>
                <button
                  type="button"
                  className={`secondary-btn ${isFavorite(item.imdbID) ? 'is-favorite' : ''}`}
                  onClick={() => onToggleFavorite(item)}
                >
                  {isFavorite(item.imdbID) ? 'Favoritado' : 'Favoritar'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomePage({ onOpenTitle, onToggleFavorite, isFavorite }) {
  const [hero, setHero] = useState(null);
  const [rails, setRails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHome() {
      setLoading(true);
      setError('');

      try {
        const criticTitles = CRITICS_LISTS[0].titles.slice(0, 6);

        const [heroMovie, awards, premieres, critics] = await Promise.all([
          getTitleByName({ title: 'Dune', year: 2021, signal: controller.signal }),
          searchTitles({ query: 'award', type: 'movie', page: 1, signal: controller.signal }),
          searchTitles({
            query: 'new',
            type: 'movie',
            year: String(CURRENT_YEAR),
            page: 1,
            signal: controller.signal
          }),
          Promise.all(
            criticTitles.map(async (title) => {
              try {
                const data = await getTitleByName({ title, signal: controller.signal });
                return normalizeFromDetails(data);
              } catch (_err) {
                return null;
              }
            })
          )
        ]);

        setHero(normalizeFromDetails(heroMovie));

        setRails([
          {
            title: 'Agora Em Destaque',
            subtitle: 'Filmes com alto interesse para maratonar hoje.',
            items: dedupe(awards.items.map(normalizeFromSearch)).slice(0, 10)
          },
          {
            title: `Lancamentos ${CURRENT_YEAR}`,
            subtitle: 'Atualizados para manter sua home viva com novidades.',
            items: dedupe(premieres.items.map(normalizeFromSearch)).slice(0, 10)
          },
          {
            title: 'Escolhas Da Critica',
            subtitle: 'Titulos de listas editoriais recorrentes.',
            items: critics.filter(Boolean)
          }
        ]);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Nao foi possivel carregar a pagina inicial.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchHome();

    return () => controller.abort();
  }, []);

  const heroBg = useMemo(() => {
    if (!hero?.Poster || hero.Poster === 'N/A') return '';
    return `linear-gradient(110deg, rgba(7, 11, 20, 0.9) 0%, rgba(7, 11, 20, 0.7) 40%, rgba(7, 11, 20, 0.28) 100%), url(${hero.Poster})`;
  }, [hero]);

  return (
    <main>
      <section className="home-hero" style={heroBg ? { backgroundImage: heroBg } : undefined}>
        <div className="home-hero-content">
          <p className="eyebrow">Experiencia Premium</p>
          <h1 className="home-hero-title">Cinema Atlas</h1>
          <p className="home-hero-subtitle">
            Um hub de descoberta visual: capas reais, curadoria inteligente e navegação profissional para explorar o
            universo do cinema.
          </p>

          <div className="home-hero-actions">
            <a className="impact-cta primary" href="#/busca">
              Explorar Catalogo
            </a>
            <a className="impact-cta secondary" href="#/destaques">
              Ver Curadoria
            </a>
          </div>
        </div>

        {hero && (
          <article className="home-feature-card">
            <p className="badge">Em Alta</p>
            <h2>{hero.Title}</h2>
            <p className="meta-line">
              {hero.Year} | {hero.Type}
            </p>
            <p className="home-rating">IMDb {hero.imdbRating || 'N/A'}</p>
            <div className="home-feature-actions">
              <button onClick={() => onOpenTitle(hero.imdbID)}>Abrir titulo</button>
              <button
                type="button"
                className={`secondary-btn ${isFavorite(hero.imdbID) ? 'is-favorite' : ''}`}
                onClick={() => onToggleFavorite(hero)}
              >
                {isFavorite(hero.imdbID) ? 'Favoritado' : 'Favoritar'}
              </button>
            </div>
          </article>
        )}
      </section>

      {error && <p className="error-box home-error">{error}</p>}

      {loading && <p className="empty-state">Carregando pagina inicial...</p>}

      {!loading &&
        rails.map((rail) => (
          <HomeRail
            key={rail.title}
            title={rail.title}
            subtitle={rail.subtitle}
            items={rail.items}
            onOpenTitle={onOpenTitle}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
          />
        ))}
    </main>
  );
}

export default HomePage;
