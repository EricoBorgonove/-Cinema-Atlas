import { useEffect, useMemo, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { searchTitles } from '../omdb';

function SearchPage({ onOpenTitle, onToggleFavorite, isFavorite }) {
  const [query, setQuery] = useState('Dune');
  const [search, setSearch] = useState('Dune');
  const [type, setType] = useState('all');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = useMemo(() => {
    if (!totalResults) return 1;
    return Math.min(100, Math.ceil(totalResults / 10));
  }, [totalResults]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSearch() {
      setLoading(true);
      setError('');
      try {
        const data = await searchTitles({
          query: search,
          type,
          year,
          page,
          signal: controller.signal
        });
        setItems(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setItems([]);
          setTotalResults(0);
          setError(err.message || 'Erro inesperado ao buscar dados.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();

    return () => controller.abort();
  }, [search, type, year, page]);

  const submitSearch = (event) => {
    event.preventDefault();
    const normalized = query.trim();
    if (!normalized) return;
    setSearch(normalized);
    setPage(1);
  };

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Explorar Catalogo</p>
        <h1>Cinema Atlas</h1>
        <p className="subtitle">
          Busque filmes e series, aplique filtros por tipo e ano e abra detalhes completos de cada titulo.
        </p>

        <form className="search-panel" onSubmit={submitSearch}>
          <label className="field">
            <span>Titulo</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex: Blade Runner"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Tipo</span>
            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="movie">Filme</option>
              <option value="series">Serie</option>
              <option value="episode">Episodio</option>
            </select>
          </label>

          <label className="field">
            <span>Ano</span>
            <input
              type="number"
              inputMode="numeric"
              value={year}
              onChange={(event) => {
                setYear(event.target.value.slice(0, 4));
                setPage(1);
              }}
              placeholder="2025"
              min="1900"
              max="2100"
            />
          </label>

          <button type="submit">Buscar</button>
        </form>
      </header>

      <main>
        <section className="results-head">
          <h2>{loading ? 'Buscando...' : `${totalResults.toLocaleString('pt-BR')} resultados`}</h2>
          <p>
            Pesquisa atual: <strong>{search}</strong>
          </p>
        </section>

        {error && <p className="error-box">{error}</p>}

        <MovieGrid
          items={items}
          loading={loading}
          emptyMessage="Nenhum resultado para os filtros atuais."
          onOpenTitle={onOpenTitle}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />

        <nav className="pagination" aria-label="Paginas de resultados">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1 || loading}
          >
            Anterior
          </button>
          <span>
            Pagina {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages || loading}
          >
            Proxima
          </button>
        </nav>
      </main>
    </>
  );
}

export default SearchPage;
