# Toda Hitotsu

Site companheiro do livro **Toda Hitotsu**. As ilustrações do livro ficam armazenadas de forma descentralizada no [IPFS](https://ipfs.tech/): cada página impressa traz um QR Code que aponta para o conteúdo, e este site é o leitor que resolve esse código e exibe a imagem em tela cheia.

🌐 **Produção:** https://todahitotsu.com
🧪 **Staging:** https://thiegocarvalho.github.io/todahitotsu/

## Como funciona

1. O leitor escaneia o QR Code do livro com a câmera do celular, ou abre direto o link impresso (`https://todahitotsu.com/?cid=<CID>`).
2. O site extrai o [CID](https://docs.ipfs.tech/concepts/content-addressing/) do código. Aceita uma URL com `?cid=` ou um CID puro.
3. O CID é pedido a vários gateways IPFS ao mesmo tempo. O primeiro que entregar uma imagem vence e é exibido em tela cheia.

Tudo roda no navegador. Não há backend, banco de dados nem conta de usuário.

### Por que IPFS

O conteúdo é endereçado pelo seu hash (o CID), então o link impresso no livro continua apontando para exatamente a mesma ilustração, independente de quem a hospeda. Se um gateway cair, outro responde.

## Segurança e privacidade

- Só CIDs válidos (CIDv0 ou CIDv1) são aceitos. Caminhos, parâmetros extras e qualquer coisa que não seja um CID puro são rejeitados.
- Só é exibido o que o navegador consegue decodificar como imagem.
- O site não coleta dados nem usa cookies ou analytics. Ao carregar uma imagem, os gateways IPFS consultados veem o CID e o IP do leitor.

Para reportar uma vulnerabilidade, veja [SECURITY.md](SECURITY.md).

## Tecnologias

[React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/), CSS puro e [html5-qrcode](https://github.com/mebjas/html5-qrcode) para a leitura do QR Code.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run build    # checagem de tipos + build em dist/
npm run preview  # serve o build
```

Para testar sem câmera, abra `http://localhost:5173/?cid=<CID>`.

## Deploy

Todo push na `main` dispara o workflow [deploy.yml](.github/workflows/deploy.yml), que gera o build e publica no GitHub Pages. A `main` é protegida: mudanças entram por pull request.

## Contribuindo

Contribuições são bem-vindas. Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um PR.

## Conteúdo do livro

As ilustrações e os textos do livro **não fazem parte deste repositório** e pertencem ao autor. O repositório contém apenas o código do site.
