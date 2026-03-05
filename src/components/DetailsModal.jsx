import { useEffect, useState } from 'react';
import { getTitleById } from '../omdb';

function DetailsModal({ selectedId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return undefined;

    const controller = new AbortController();

    async function fetchDetails() {
      setLoading(true);
      try {
        const data = await getTitleById({ imdbID: selectedId, signal: controller.signal });
        setDetails(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setDetails({ Error: err.message || 'Erro ao carregar detalhes.' });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();

    return () => controller.abort();
  }, [selectedId]);

  if (!selectedId) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose} aria-label="Fechar detalhes">
          Fechar
        </button>

        {loading && <p>Carregando detalhes...</p>}
        {!loading && details?.Error && <p className="error-box">{details.Error}</p>}

        {!loading && details && !details.Error && (
          <>
            <h3>{details.Title}</h3>
            <p className="meta-line">
              {details.Year} | {details.Runtime} | {details.Genre}
            </p>
            <p>{details.Plot}</p>
            <p>
              <strong>Direcao:</strong> {details.Director}
            </p>
            <p>
              <strong>Elenco:</strong> {details.Actors}
            </p>
            <p>
              <strong>IMDb:</strong> {details.imdbRating}
            </p>
            <p>
              <strong>Premios:</strong> {details.Awards}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DetailsModal;
