import MovieGrid from '../components/MovieGrid';

function FavoritesPage({ favorites, onOpenTitle, onToggleFavorite, isFavorite }) {
  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Minha Lista</p>
        <h2>Favoritos</h2>
        <p>Seus titulos salvos localmente no navegador.</p>
      </header>

      <MovieGrid
        items={favorites}
        loading={false}
        emptyMessage="Voce ainda nao favoritou nenhum titulo."
        onOpenTitle={onOpenTitle}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
        showRating
      />
    </main>
  );
}

export default FavoritesPage;
