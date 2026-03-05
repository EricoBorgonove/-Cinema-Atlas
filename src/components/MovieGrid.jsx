function MovieGrid({
  items,
  loading,
  emptyMessage,
  onOpenTitle,
  onToggleFavorite,
  isFavorite,
  showRating = false
}) {
  return (
    <section className="card-grid" aria-live="polite">
      {!loading && !items.length && <p className="empty-state">{emptyMessage}</p>}

      {loading &&
        Array.from({ length: 8 }).map((_, idx) => (
          <article className="card skeleton" key={idx} aria-hidden="true" />
        ))}

      {!loading &&
        items.map((item) => {
          const favorite = isFavorite(item.imdbID);

          return (
            <article className="card" key={item.imdbID}>
              <img
                src={
                  item.Poster && item.Poster !== 'N/A'
                    ? item.Poster
                    : 'https://placehold.co/480x720/f6f0e6/7b6d58?text=Sem+Poster'
                }
                alt={`Poster de ${item.Title}`}
                loading="lazy"
              />
              <div className="card-body">
                <h3>{item.Title}</h3>
                <p>
                  {item.Type} | {item.Year}
                </p>
                {showRating && item.imdbRating && (
                  <p className="rating-line">IMDb: {item.imdbRating}</p>
                )}
                <div className="card-actions">
                  <button onClick={() => onOpenTitle(item.imdbID)}>Ver página</button>
                  <button
                    type="button"
                    className={`secondary-btn ${favorite ? 'is-favorite' : ''}`}
                    onClick={() => onToggleFavorite(item)}
                  >
                    {favorite ? 'Remover favorito' : 'Favoritar'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
    </section>
  );
}

export default MovieGrid;
