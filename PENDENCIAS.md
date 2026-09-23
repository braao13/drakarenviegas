# Pendências do projeto

Itens que dependem de dado real ou decisão do cliente/dev — não podem ser
inventados (ver regra do projeto contra fake implementation).

## 1. Depoimentos ao vivo do Google (Places API) — descartado

**Decisão do cliente (23/08/2026): não vai ter.** Site fica com os 27
depoimentos reais estáticos (texto extraído de `Regras/Avaliações.txt`,
link de cada um copiado do Google Maps pelo cliente) — ver
`src/config/site.js`. Sem qualquer avaliação inventada.

## 2. Contato — resolvido

- `contact.whatsappLink` **resolvido** — link oficial fornecido pelo
  cliente, em uso em todos os CTAs.
- `contact.email` **resolvido** (29/08/2026) — `disporpartoipatinga@gmail.com`,
  fornecido pelo cliente.

## 3. Convênios — resolvido

**Decisão do cliente (29/08/2026): removida.** Seção `Insurance` excluída
do site (`src/components/sections/Insurance.jsx` removido, import/uso em
`src/App.jsx` e export `insurance` em `src/config/site.js` removidos).

## 4. Domínio

- `index.html`, `public/sitemap.xml` e `public/robots.txt` usam
  `https://DOMINIO-PENDENTE.com.br/` em canonical/OG/sitemap — trocar nos
  3 arquivos assim que o domínio definitivo for definido (busca por
  "DOMINIO-PENDENTE" acha todas as ocorrências).

## 5. Código órfão — resolvido

`src/components/ui/CircularGallery.jsx` e `.css` removidos (23/08/2026,
decisão do cliente: não vai usar).
