# Toda Hitotsu - IPFS Web App

Aplicativo web para acesso a conteúdos exclusivos do universo *Toda Hitotsu*.

## Funcionalidades
- **Scanner de QR Code:** Acesso direto via câmera do celular aos códigos do livro.
- **Resolução de IPFS Dinâmica:** Busca concorrente de CIDs no IPFS utilizando múltiplos gateways em tempo real para garantir o carregamento mais rápido possível dos ativos digitais.
- **Design Imersivo:** Estética tática sci-fi "Scanner Eye" com layout otimizado (Mobile First) para imersão total do leitor na história.
- **Compatível com Links Diretos:** Aceita leitura automática de parâmetros via URL (`?cid=...`).

## Tecnologias Utilizadas
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/) 
- [TypeScript](https://www.typescriptlang.org/)
- Vanilla CSS 

## Desenvolvimento Local
Para rodar o projeto localmente:
1. Instale as dependências: `npm install`
2. Inicie o servidor: `npm run dev`
3. Acesse `http://localhost:5173`

## Deploy
O deploy está automatizado via GitHub Actions. Qualquer novo commit na branch `main` irá gerar e publicar a nova versão da aplicação automaticamente no GitHub Pages:

👉 [Acessar a Aplicação](https://thiegocarvalho.github.io/todahitotsu/)
