import { useEffect, useMemo, useState } from 'react';
import DetailsModal from './components/DetailsModal';
import CriticsPage from './pages/CriticsPage';
import FeaturedPage from './pages/FeaturedPage';
import ReleasesPage from './pages/ReleasesPage';
import SearchPage from './pages/SearchPage';

const ROUTES = {
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
  }
};

function getRouteFromHash() {
  const hash = window.location.hash || '#/busca';
  const key = hash.replace('#/', '');
  return ROUTES[key] ? key : 'busca';
}

function App() {
  const [route, setRoute] = useState(getRouteFromHash());
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const handleHash = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHash);

    if (!window.location.hash) {
      window.location.hash = ROUTES.busca.path;
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const activeRoute = useMemo(() => ROUTES[route], [route]);

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
              className={item.key === route ? 'active' : ''}
              role="tab"
              aria-selected={item.key === route}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {activeRoute.key === 'busca' && <SearchPage onOpenDetails={setSelectedId} />}
      {activeRoute.key === 'destaques' && <FeaturedPage onOpenDetails={setSelectedId} />}
      {activeRoute.key === 'lancamentos' && <ReleasesPage onOpenDetails={setSelectedId} />}
      {activeRoute.key === 'critica' && <CriticsPage onOpenDetails={setSelectedId} />}

      <DetailsModal selectedId={selectedId} onClose={() => setSelectedId('')} />
    </div>
  );
}

export default App;
