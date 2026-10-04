# Contribuindo

Obrigado por querer ajudar! Este é um projeto pequeno, então o processo é simples.

## Antes de começar

- Para mudanças grandes, abra uma issue primeiro para alinharmos a ideia.
- Falhas de segurança **não** vão em issue pública. Veja [SECURITY.md](SECURITY.md).

## Fluxo

1. Faça um fork e crie um branch a partir da `main`.
2. Faça a mudança e rode `npm run lint` e `npm run build`. Os dois precisam passar.
3. Abra um pull request para a `main` explicando o que mudou e por quê.

A `main` é protegida: ela só recebe mudanças por pull request aprovado.

## Convenções

- TypeScript e CSS puro, sem bibliotecas novas sem necessidade.
- Tudo roda no cliente. Não adicione backend nem serviços de rastreamento.
- A interface é em português do Brasil.
- Mensagens de commit curtas, no imperativo (por exemplo, "Fix gateway timeout").
- Não suba arquivos do livro (ilustrações, PDFs, QR Codes gerados) para o repositório.
