# Como obter a chave da API do OMDb

1. Acesse: https://www.omdbapi.com/apikey.aspx
2. Escolha o plano `FREE` (ou pago, se preferir).
3. Preencha nome e email.
4. Confirme o captcha e envie.
5. Verifique seu email e clique no link de ativacao.
6. Copie a chave recebida.

## Configurar no projeto

1. Crie o arquivo `.env` na raiz do projeto (ou copie do `.env.example`):

```bash
cp .env.example .env
```

2. Coloque sua chave no `.env`:

```env
VITE_OMDB_API_KEY=sua_chave_aqui
```

3. Rode o projeto:

```bash
npm install
npm run dev
```

## Observacoes

- Sem ativar a chave por email, a API pode nao funcionar.
- No plano gratuito, podem existir limites de uso.
