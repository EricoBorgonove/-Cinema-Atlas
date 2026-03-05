# Cinema Atlas (React + Vite + OMDb)

Aplicacao web para explorar filmes e series com visual moderno e multiplas paginas:

- `#/busca`: busca completa com filtro por tipo/ano e paginacao
- `#/destaques`: secoes em destaque por curadoria dinamica
- `#/lancamentos`: selecao de lancamentos recentes com limite inicial e botao "mostrar mais"
- `#/critica`: listas editoriais ordenadas por nota IMDb
- `#/favoritos`: titulos salvos no navegador (`localStorage`)
- `#/titulo/:imdbID`: pagina propria de detalhes do titulo

## Funcionalidades

- Busca por titulo
- Filtro por tipo (`movie`, `series`, `episode`)
- Filtro por ano
- Paginacao
- Favoritos persistidos localmente
- Detalhes completos (plot, elenco, direcao, premios, IMDb)
- Interface responsiva com animacoes suaves

## Requisitos

- Node.js 18+
- chave da OMDb API (https://www.omdbapi.com/apikey.aspx)

## Configuracao

1. Copie `.env.example` para `.env`
2. Defina sua chave:

```bash
VITE_OMDB_API_KEY=sua_chave_aqui
```

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de producao

```bash
npm run build
npm run preview
```
