# Headers e publicação segura

Nenhum provedor de hospedagem/CDN foi informado. Os blocos abaixo são alternativas: adote **somente um** depois de confirmar o ambiente. Substitua `DOMINIO_FINAL` pelo domínio real e teste em homologação.

## Política comum

Primeira implantação, por alguns dias:

```text
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'sha256-gy2b6sh2LPt8K1cIivymNHONu1zK5tLqPlvQRfJu4VE='; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
```

Depois de validar que não há violações necessárias, trocar o nome do header para:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-gy2b6sh2LPt8K1cIivymNHONu1zK5tLqPlvQRfJu4VE='; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
```

O hash autoriza somente o JSON-LD inline atual. Se `index.html` mudar, gere o hash novamente ou mova os dados estruturados para uma solução compatível; não adicione `unsafe-inline` ou `unsafe-eval`.

Headers adicionais:

```text
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

Ative HSTS somente depois de confirmar HTTPS em todo o domínio. `includeSubDomains` exige validar todos os subdomínios; não use `preload` sem decisão operacional específica.

## Cache recomendado

| Caminho | Header |
|---|---|
| `/index.html` e `/` | `Cache-Control: no-cache` |
| `/assets/*` | `Cache-Control: public, max-age=31536000, immutable` |
| `/robots.txt`, `/sitemap.xml` | `Cache-Control: public, max-age=3600` |
| `/favicon.svg`, `/og-image.jpg` | `Cache-Control: public, max-age=86400, must-revalidate` |

Habilite Brotli e Gzip na plataforma. O servidor deve publicar somente `dist/`, negar dotfiles e retornar 404 real para arquivos internos; o fallback SPA não deve transformar pedidos por `/.env`, `/.git/config`, `*.map`, `*.zip` ou arquivos com extensão desconhecida em status 200.

## Opção A — Netlify/Cloudflare Pages compatível com `_headers`

Crie `public/_headers` apenas se o provedor confirmar esse formato:

```text
/*
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'sha256-gy2b6sh2LPt8K1cIivymNHONu1zK5tLqPlvQRfJu4VE='; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  X-Frame-Options: DENY

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache
```

Crie `public/_redirects` somente depois de conhecer os hosts:

```text
https://www.DOMINIO_FINAL/* https://DOMINIO_FINAL/:splat 301!
/* /index.html 200
```

## Opção B — Vercel

Estrutura a incorporar em `vercel.json` após substituir os placeholders:

```json
{
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy-Report-Only", "value": "default-src 'self'; script-src 'self' 'sha256-gy2b6sh2LPt8K1cIivymNHONu1zK5tLqPlvQRfJu4VE='; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ],
  "rewrites": [{ "source": "/((?!.*\\.[^/]+$).*)", "destination": "/index.html" }]
}
```

## Opção C — Nginx

Trecho para o `server` HTTPS, após confirmar certificados e domínio:

```nginx
root /CAMINHO/ABSOLUTO/PARA/dist;
index index.html;
autoindex off;

add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'sha256-gy2b6sh2LPt8K1cIivymNHONu1zK5tLqPlvQRfJu4VE='; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests" always;
add_header X-Content-Type-Options nosniff always;
add_header Referrer-Policy strict-origin-when-cross-origin always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" always;
add_header X-Frame-Options DENY always;

location /assets/ {
  try_files $uri =404;
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
  try_files $uri $uri/ /index.html;
  add_header Cache-Control "no-cache";
}

location ~ /(?:\.|.*\.(?:map|zip|bak|old)$) { return 404; }
```

## Validação

```powershell
$env:SITE_URL='https://DOMINIO_FINAL'
npm run build
npm run preview -- --host 127.0.0.1 --port 4180
$env:SECURITY_PREVIEW_URL='http://127.0.0.1:4180'
npm run test:headers
```

No deploy autorizado, repita `test:headers` com a URL HTTPS de homologação. Primeiro use `SECURITY_EXPECT_CSP_MODE=report-only`; após promover a política, use `enforce`.
