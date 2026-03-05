const HIGHLIGHTS = [
  {
    title: 'Descubra Rapido',
    text: 'Entre em busca e filtre por tipo, ano e tema em poucos cliques.',
    href: '#/busca',
    cta: 'Ir para Busca'
  },
  {
    title: 'Veja Tendencias',
    text: 'Explore os destaques e os lancamentos mais recentes do catalogo.',
    href: '#/lancamentos',
    cta: 'Ver Lancamentos'
  },
  {
    title: 'Curadoria Critica',
    text: 'Acompanhe listas editoriais ordenadas por nota IMDb.',
    href: '#/critica',
    cta: 'Abrir Listas'
  }
];

function HomePage() {
  return (
    <main>
      <section className="impact-hero">
        <p className="eyebrow">Nova Experiencia</p>
        <h1 className="impact-title">Cinema Atlas</h1>
        <p className="impact-subtitle">
          Explore cinema com uma experiencia visual intensa, curadoria inteligente e detalhes completos da OMDb em uma
          interface feita para descoberta.
        </p>

        <div className="impact-cta-row">
          <a className="impact-cta primary" href="#/busca">
            Comecar Agora
          </a>
          <a className="impact-cta secondary" href="#/destaques">
            Ver Destaques
          </a>
        </div>

        <div className="impact-stats">
          <article>
            <strong>5</strong>
            <span>Paginas Tematicas</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>Integrada ao OMDb</span>
          </article>
          <article>
            <strong>Local</strong>
            <span>Favoritos no Navegador</span>
          </article>
        </div>
      </section>

      <section className="impact-grid">
        {HIGHLIGHTS.map((item) => (
          <article key={item.title} className="impact-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <a href={item.href}>{item.cta}</a>
          </article>
        ))}
      </section>
    </main>
  );
}

export default HomePage;
