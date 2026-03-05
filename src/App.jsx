import { useEffect, useMemo, useState } from 'react';
import CriticsPage from './pages/CriticsPage';
import FavoritesPage from './pages/FavoritesPage';
import FeaturedPage from './pages/FeaturedPage';
import HomePage from './pages/HomePage';
import ReleasesPage from './pages/ReleasesPage';
import SearchPage from './pages/SearchPage';
import TitlePage from './pages/TitlePage';

const FAVORITES_KEY = 'cinema-atlas:favorites';
const THEME_KEY = 'cinema-atlas:theme';

const ROUTES = {
  inicio: {
    key: 'inicio',
    label: 'Inicio',
    path: '#/'
  },
  busca: {
    key: 'busca',
    label: 'Busca',
    path: '#/busca'
  },
  destaques: {
    key: 'destaques',
    label: 'Destaques',
    path: '#/destaques'
  },
  lancamentos: {
    key: 'lancamentos',
    label: 'Lancamentos',
    path: '#/lancamentos'
  },
  critica: {
    key: 'critica',
    label: 'Listas da Critica',
    path: '#/critica'
  },
  favoritos: {
    key: 'favoritos',
    label: 'Favoritos',
    path: '#/favoritos'
  }
};

function readFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && item.imdbID);
  } catch (_err) {
    return [];
  }
}

function readTheme() {
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getRouteFromHash() {
  const hash = window.location.hash || '#/';
  const clean = hash.replace('#/', '');

  if (clean.startsWith('titulo/')) {
    const imdbID = clean.split('/')[1] || '';
    return { key: 'titulo', imdbID };
  }

  if (clean === '') {
    return { key: 'inicio', imdbID: '' };
  }

  if (ROUTES[clean]) {
    return { key: clean, imdbID: '' };
  }

  return { key: 'inicio', imdbID: '' };
}

function App() {
  const [routeInfo, setRouteInfo] = useState(getRouteFromHash());
  const [favorites, setFavorites] = useState(readFavorites);
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const handleHash = () => setRouteInfo(getRouteFromHash());
    window.addEventListener('hashchange', handleHash);

    if (!window.location.hash) {
      window.location.hash = ROUTES.inicio.path;
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const activeRoute = useMemo(() => ROUTES[routeInfo.key] || ROUTES.busca, [routeInfo.key]);

  const openTitle = (imdbID) => {
    window.location.hash = `#/titulo/${imdbID}`;
  };

  const isFavorite = (imdbID) => favorites.some((item) => item.imdbID === imdbID);

  const toggleFavorite = (item) => {
    setFavorites((current) => {
      const exists = current.some((fav) => fav.imdbID === item.imdbID);
      if (exists) {
        return current.filter((fav) => fav.imdbID !== item.imdbID);
      }

      const normalized = {
        imdbID: item.imdbID,
        Title: item.Title,
        Year: item.Year,
        Type: item.Type,
        Poster: item.Poster,
        imdbRating: item.imdbRating || 'N/A'
      };

      return [normalized, ...current];
    });
  };

  return (
    <div className="app-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="grid-overlay" />

      <nav className="top-nav">
        <p className="brand">Cinema Atlas</p>
        <div className="nav-links" role="tablist" aria-label="Navegacao principal">
          {Object.values(ROUTES).map((item) => (
            <a
              key={item.key}
              href={item.path}
              className={item.key === routeInfo.key ? 'active' : ''}
              role="tab"
              aria-selected={item.key === routeInfo.key}
            >
              {item.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          aria-label="Alternar tema claro e escuro"
        >
          {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        </button>
      </nav>

      {routeInfo.key === 'inicio' && (
        <HomePage
          onOpenTitle={openTitle}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {routeInfo.key === 'busca' && (
        <SearchPage
          onOpenTitle={openTitle}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {routeInfo.key === 'destaques' && (
        <FeaturedPage
          onOpenTitle={openTitle}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {routeInfo.key === 'lancamentos' && (
        <ReleasesPage
          onOpenTitle={openTitle}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {routeInfo.key === 'critica' && (
        <CriticsPage
          onOpenTitle={openTitle}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {routeInfo.key === 'favoritos' && (
        <FavoritesPage
          favorites={favorites}
          onOpenTitle={openTitle}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {routeInfo.key === 'titulo' && (
        <TitlePage
          imdbID={routeInfo.imdbID}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      <footer className="app-footer">
        <p>
          Pagina atual: <strong>{routeInfo.key === 'titulo' ? 'titulo' : activeRoute.label}</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
