---
type: "security-audit"
date: "2026-09-24T02:24:14.399129+00:00"
question: "Quais fluxos, sinks e limites de confiança expõem dados pessoais no site e quais controles de segurança falham?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["WhatsApp URL Data Flow", "Browser Security Headers", "WhatsApp URL Leakage Test", "Contact()", "External Navigation Abuse", "PrivacyNotice.jsx", "WhatsAppCTA.jsx"]
---

# Q: Quais fluxos, sinks e limites de confiança expõem dados pessoais no site e quais controles de segurança falham?

## Answer

# Red team autorizado — segurança, privacidade e publicação

**Data:** 23/09/2026  
**Escopo:** repositório local e servidores em `127.0.0.1`; nenhum contato ou tráfego de teste foi enviado a WhatsApp, Meta, Instagram, Google Maps, Google Fonts ou qualquer terceiro.  
**Decisão:** **NÃO APTO PARA PUBLICAÇÃO**.

## 1. Resumo executivo ofensivo

O caminho de ataque mais relevante não é XSS nem invasão de backend. É o próprio fluxo de contato: nome, telefone, e-mail e mensagem — inclusive texto clínico — são incorporados à URL aberta no navegador. Em mock local, essa URL completa ficou no histórico e no log HTTP. `encodeURIComponent` impediu alteração do domínio, criação de parâmetros adicionais e execução de HTML/JavaScript, mas não protege a confidencialidade do conteúdo e preserva quebras de linha e caracteres bidirecionais úteis para confusão visual.

Também foram confirmados: sucesso exibido mesmo se `window.open` retornar `null`, ausência de limites de tamanho e de normalização de controles Unicode, possibilidade de framing/clickjacking no preview, ausência de headers defensivos no preview, domínio placeholder no artefato publicável e divergência entre o CSS de `dist/` e um build limpo do fonte atual.

Resultados negativos importantes: não foi encontrado sink executável de XSS, todos os links declarados com `target="_blank"` têm `rel="noopener noreferrer"`, não há sourcemaps, secrets indicativos, `.env`, service worker ou arquivos de backup dentro de `dist/`, e a auditoria do lockfile executada na mesma data reportou zero vulnerabilidades conhecidas nas 113 dependências instaladas.

## 2. Limites e ambiente testado

- React 19.2.8, Vite 8.2.2 e Tailwind CSS 4.3.3.
- Preview local do `dist/` em `127.0.0.1:4180` e páginas atacantes/mocks somente em loopback.
- Payloads exclusivamente fictícios, marcados como teste.
- Nenhum domínio ou canal real foi aberto pelos testes ofensivos.
- DNS, registrar, MFA, CAA, DNSSEC, TLS, CDN/WAF, headers e cache da hospedagem real: **NÃO VERIFICÁVEL LOCALMENTE**.
- A fase de descoberta não alterou arquivos da aplicação. Este documento e a suíte em `security-tests/` são artefatos de auditoria.

## 3. Superfície de ataque e fluxo de dados

```text
Usuário
  → formulário React (memória do navegador)
  → concatenação de nome/telefone/e-mail/assunto/mensagem
  → URL com parâmetro ?text=...
  → histórico, barra de endereço, captura de tela, logs/telemetria do navegador ou proxy
  → WhatsApp (ou mailto/cliente de e-mail)

Página
  ├─ Google Fonts (CSS e fontes remotas)
  ├─ Google Maps (iframe + link)
  ├─ Google Reviews/Maps (27 links)
  ├─ Instagram
  ├─ WhatsApp
  └─ hospedagem/CDN/DNS ainda não informados
```

### Entradas, sinks e limites de confiança

| Origem | Transformação | Sink/destino | Observação |
|---|---|---|---|
| Campos do formulário | `trim` parcial e `encodeURIComponent` | `window.open(wa.me?...text=)` | Dados pessoais entram na URL |
| Campos do formulário | `encodeURIComponent` | `window.location.href = mailto:` | Fallback depende do cliente local |
| `src/config/site.js` | interpolação React/URL | WhatsApp, Instagram, Maps e reviews | Configuração comprometida troca o canal |
| Endereço estático | `encodeURIComponent` | iframe/link Google Maps | Terceiro recebe metadados de acesso |
| `index.html` | tags HTML | Google Fonts, canonical e Open Graph | placeholder presente |
| Hospedagem | headers/cache/rotas | navegador | não versionada no projeto |

Não foram encontrados `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, cookies, `localStorage`, `sessionStorage`, Clipboard API, leitura de hash/query ou variáveis `VITE_*` no código da aplicação.

## 4. Cadeias de ataque mais plausíveis

1. Paciente descreve sintoma/gestação no campo livre → conteúdo vira URL → URL persiste em histórico, logs ou captura/sincronização do navegador → exposição de dado pessoal sensível.
2. Pop-up é bloqueado ou `window.open` falha → aplicação ignora o retorno, limpa o formulário e mostra sucesso → paciente acredita que iniciou o agendamento, mas nenhuma janela abriu.
3. Atacante enquadra o site em um iframe → sobrepõe interface falsa ao CTA → induz clique ou coleta dados em uma camada atacante, caso a hospedagem não aplique `frame-ancestors`/X-Frame-Options.
4. Repositório/pipeline é comprometido → único ponto de configuração troca WhatsApp/Instagram/Maps → aparência legítima direciona pacientes ao atacante. Não é controlável por entrada pública; exige comprometimento de supply chain.
5. Publicação usa o `dist/` atual → CSS antigo e domínio placeholder entram no ar → identidade/canonical incorretos e comportamento visual diferente do fonte revisado.

## 5. Achados

### RT-001 — Dados pessoais e clínicos incorporados à URL de WhatsApp

- **Status:** CONFIRMADA.
- **Severidade:** alta.
- **Evidência:** `src/components/sections/Contact.jsx:76-96`; mock local registrou a query completa no log HTTP e no histórico do navegador.
- **Cenário:** paciente informa nome, telefone, e-mail e sintoma; todo o conteúdo vira `?text=`.
- **Pré-condições:** preencher e submeter o formulário; nenhuma invasão é necessária.
- **Payload/ação simulada:** dados fictícios `TESTE_ALICE`, telefone de teste e `TESTE_CLINICO: sintoma ficticio`, enviados apenas a `127.0.0.1`.
- **Resultado esperado:** dados não deveriam integrar uma URL observável.
- **Resultado observado:** os quatro campos e a informação clínica apareceram na URL, histórico e log do mock. `noreferrer` deixou `document.referrer` vazio no destino, mas não removeu os dados da própria URL.
- **Impacto:** exposição de dado pessoal e potencial dado de saúde em superfícies que podem ser registradas, capturadas ou sincronizadas; risco LGPD e perda de confiança.
- **Correção:** remover o campo livre do deep link; preferir CTA simples sem PII e coletar o mínimo já dentro do canal escolhido. Se o formulário permanecer, não transportar dado clínico em URL, exibir aviso explícito antes do campo e definir fluxo/retenção com base legal.
- **Teste automatizado:** teste de componente deve falhar se valores dos campos forem interpolados em URL; teste deve permitir somente texto fixo no deep link.
- **Risco residual:** o próprio WhatsApp/e-mail continuará sendo terceiro e deverá constar no aviso de privacidade.

### RT-002 — Sucesso falso quando a abertura do WhatsApp falha

- **Status:** CONFIRMADA.
- **Severidade:** média.
- **Evidência:** `src/components/sections/Contact.jsx:93-104`; o retorno de `window.open` é ignorado e `setStatus("success")` sempre é executado se não houver exceção.
- **Cenário:** bloqueador de pop-up, política corporativa, navegador embarcado ou falha de abertura faz `window.open` retornar `null` sem lançar exceção.
- **Pré-condições:** formulário válido e canal WhatsApp configurado.
- **Payload/ação simulada:** stub local `window.open = () => null`.
- **Resultado esperado:** preservar os dados e exibir erro/instrução alternativa.
- **Resultado observado:** pelo fluxo do código, o formulário é limpo e aparece “Mensagem preparada” apesar de nenhuma confirmação de abertura.
- **Impacto:** perda do contato e falsa impressão de agendamento; relevante para acesso ao cuidado.
- **Correção:** guardar o retorno; se for `null`, mostrar erro, não limpar os campos e oferecer link/cópia manual sem dados sensíveis. Texto de sucesso deve dizer apenas que o canal foi aberto, nunca que a mensagem foi enviada.
- **Teste automatizado:** mock de `window.open` retornando `null`, exigindo alerta e ausência de estado `success`.
- **Risco residual:** abertura da janela não comprova envio; a interface deve continuar explícita sobre isso.

### RT-003 — Campos ilimitados e controles Unicode aceitos

- **Status:** CONFIRMADA.
- **Severidade:** média.
- **Evidência:** `src/components/sections/Contact.jsx:38-46,197-245`; não há `maxLength`, normalização ou remoção de controles bidi/zero-width.
- **Cenário:** mensagem longa, cabeçalhos falsos, U+202E e caracteres invisíveis geram texto visualmente enganoso e URL enorme.
- **Pré-condições:** acesso ao formulário.
- **Payload/ação simulada:** newline `X-Clinica: instrucao falsa`, U+202E, HTML/JS inofensivo e tamanhos de 0 a 16.384 caracteres.
- **Resultado esperado:** limites proporcionais e rejeição/normalização de controles invisíveis perigosos.
- **Resultado observado:** newline e bidi sobreviveram ao round-trip. URLs chegaram a 46.159 caracteres. O teste local preservou conteúdo, origem e path; truncamento no WhatsApp real não foi testado.
- **Impacto:** confusão/engenharia social, falhas de abertura e degradação do fluxo; não houve execução de código.
- **Correção:** limites HTML e de aplicação (ex.: nome 120, telefone 32, e-mail 254, mensagem 500–1.000), normalização Unicode e rejeição de controles bidi/zero-width não necessários.
- **Teste automatizado:** limites por campo, mensagem só com espaços Unicode e remoção/rejeição de controles.
- **Risco residual:** texto humano ainda pode ser enganoso; reduzir dados e usar rótulos fixos.

### RT-004 — Framing e UI redress permitidos no preview local

- **Status:** CONFIRMADA no artefato local; produção NÃO VERIFICÁVEL LOCALMENTE.
- **Severidade:** média.
- **Evidência:** preview sem `Content-Security-Policy`, `frame-ancestors` ou `X-Frame-Options`; página atacante em `127.0.0.1:4181` carregou todo o site em iframe e exibiu camada falsa sobreposta.
- **Cenário:** página maliciosa enquadra o site e posiciona controles enganosos sobre CTA/formulário.
- **Pré-condições:** hospedagem real também não enviar proteção anti-framing.
- **Payload/ação simulada:** iframe local apontando para `127.0.0.1:4180` com `div` absoluta sobreposta.
- **Resultado esperado:** bloqueio do frame por `frame-ancestors 'none'` (ou política estritamente justificada).
- **Resultado observado:** conteúdo completo acessível dentro do frame.
- **Impacto:** phishing contextual e captura de interação pela página superior.
- **Correção:** configurar na hospedagem `Content-Security-Policy: frame-ancestors 'none'` e, como compatibilidade, `X-Frame-Options: DENY`.
- **Teste automatizado:** teste HTTP do header e teste E2E local verificando que o frame é bloqueado.
- **Risco residual:** headers não protegem contra clone visual em outro domínio; identidade e canais devem ser verificáveis.

### RT-005 — Aviso de privacidade incompleto e contraditório com o fluxo

- **Status:** CONFIRMADA.
- **Severidade:** média.
- **Evidência:** `src/components/layout/PrivacyNotice.jsx:13-37`; `Contact.jsx:220-227` pede para descrever motivo/dúvidas e envia via WhatsApp/e-mail.
- **Cenário:** aviso diz que não solicita saúde e que dados não são compartilhados para marketing, mas o design incentiva texto clínico e o tratamento envolve terceiros; controlador, direitos, retenção e contato responsável estão ausentes/pendentes.
- **Pré-condições:** usuário confiar no aviso e usar o formulário.
- **Payload/ação simulada:** comparar texto do aviso, placeholder e fluxo real.
- **Resultado esperado:** transparência completa e minimização coerente.
- **Resultado observado:** informação material sobre terceiros e ciclo de vida não está clara.
- **Impacto:** consentimento/expectativa inadequados, maior probabilidade de dado sensível e risco regulatório.
- **Correção:** remover incentivo a detalhes clínicos, identificar controlador/canal, finalidades, base legal aplicável, destinatários, retenção, direitos e riscos do redirecionamento.
- **Teste automatizado:** teste de conteúdo mínimo do aviso e ausência de placeholder que solicite motivo clínico.
- **Risco residual:** revisão jurídica e operacional continua necessária.

### RT-006 — Headers defensivos ausentes no preview

- **Status:** CONFIRMADA no preview; produção NÃO VERIFICÁVEL LOCALMENTE.
- **Severidade:** média.
- **Evidência:** resposta 200 em `127.0.0.1:4180/` sem CSP, CSP-Report-Only, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy ou X-Frame-Options.
- **Cenário:** a hospedagem replica o artefato sem configuração adicional.
- **Pré-condições:** deploy sem camada de headers.
- **Payload/ação simulada:** `curl -I https://DOMINIO_REAL/` após publicação autorizada.
- **Resultado esperado:** política restritiva compatível com os recursos necessários.
- **Resultado observado:** o servidor de preview não adiciona essas proteções.
- **Impacto:** aumenta o impacto de injeções futuras, framing e vazamento de metadados.
- **Correção:** versionar configuração da hospedagem. CSP candidata inicial: `default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`. Validar primeiro em Report-Only, depois enforcement, sem `unsafe-eval`; evitar `unsafe-inline` eliminando o JSON-LD inline ou usando hash/nonce.
- **Teste automatizado:** suíte HTTP parametrizada por `SECURITY_PREVIEW_URL`.
- **Risco residual:** CSP precisa ser retestada a cada novo terceiro.

### RT-007 — `dist/` divergente do fonte atual

- **Status:** CONFIRMADA.
- **Severidade:** média.
- **Evidência:** antes da criação dos artefatos de auditoria, build limpo Vite 8.2.2: JS atual e novo com SHA-256 `FA67B47C…D40`; CSS atual `FD554533…B9D`/39.020 bytes e novo `0EB79AD7…BA1`/41.070 bytes. Depois de adicionar `security-tests/`, sem alterar `src/`, o CSS novo mudou novamente para `F26FB465…439`. Isso demonstra que a descoberta automática de fontes do Tailwind alcança arquivos fora da aplicação.
- **Cenário:** publicação usa o diretório existente em vez de build limpo e rastreável.
- **Pré-condições:** pipeline publica `dist/` como está.
- **Payload/ação simulada:** build em diretório temporário e comparação dos hashes dos assets referenciados pelo HTML.
- **Resultado esperado:** conteúdo idêntico.
- **Resultado observado:** CSS diferente; nomes de assets e `index.html` também divergem. Arquivos de documentação/teste na raiz podem alterar as classes detectadas e, portanto, o CSS final.
- **Impacto:** versão revisada não é necessariamente a publicada; rollback e investigação ficam frágeis.
- **Correção:** restringir explicitamente as fontes analisadas pelo Tailwind a `index.html` e `src/`; gerar `dist/` somente em CI a partir de commit/lockfile identificados, comparar manifest/hashes e publicar artefato imutável.
- **Teste automatizado:** teste `build limpo corresponde ao dist versionado` incluído.
- **Risco residual:** reprodutibilidade depende também da versão do Node e do gerenciador.

### RT-008 — Domínio placeholder no artefato publicável

- **Status:** CONFIRMADA.
- **Severidade:** média.
- **Evidência:** `index.html:14,24-25`, `public/robots.txt:5`, `public/sitemap.xml:5` e equivalentes em `dist/` contêm `DOMINIO-PENDENTE.com.br`.
- **Cenário:** release preserva canonical, Open Graph e sitemap incorretos.
- **Pré-condições:** publicar o artefato atual.
- **Payload/ação simulada:** busca literal por `DOMINIO-PENDENTE`.
- **Resultado esperado:** zero ocorrência no build.
- **Resultado observado:** ocorrências confirmadas.
- **Impacto:** identidade/SEO inconsistentes e oportunidade de confusão se o placeholder ou domínio semelhante for registrado por terceiro.
- **Correção:** definir domínio real, substituir todas as referências e bloquear CI se o marcador aparecer.
- **Teste automatizado:** varredura do `dist/` incluída.
- **Risco residual:** typosquatting, registrar/DNS/MFA/CAA/DNSSEC exigem controles operacionais separados.

### RT-009 — Troca de canais por comprometimento de configuração/pipeline

- **Status:** PROVÁVEL como cadeia pós-comprometimento; não explorável por entrada pública atual.
- **Severidade:** média.
- **Evidência:** `src/config/site.js:56-64,122-283` centraliza WhatsApp, Instagram e reviews; componentes consomem esses valores sem allowlist de host.
- **Cenário:** invasor com escrita no repositório/pipeline substitui `wa.me` por domínio semelhante ou esquema perigoso.
- **Pré-condições:** comprometimento prévio do código, dependência ou pipeline.
- **Payload/ação simulada:** revisão estática de `javascript:`, `data:`, `file:` e host semelhante; nenhum valor público controla a configuração.
- **Resultado esperado:** validação de esquema/host no build e revisão de mudança sensível.
- **Resultado observado:** valores atuais são HTTPS legítimos, mas a aplicação aceitaria configuração alterada.
- **Impacto:** redirecionamento de pacientes e phishing com identidade legítima.
- **Correção:** teste de allowlist exata (`wa.me`, `instagram.com`, `google.com`, `maps.app.goo.gl`), CODEOWNERS/revisão para contatos, proteção do pipeline e confirmação fora de banda antes do release.
- **Teste automatizado:** validação de esquema, host e número esperado incluída.
- **Risco residual:** allowlist não evita conta legítima comprometida.

### RT-010 — XSS/DOM XSS não alcançável no estado atual

- **Status:** NÃO APLICÁVEL ao fluxo atual (teste negativo).
- **Severidade:** informativa.
- **Evidência:** ausência de sinks executáveis; campos só chegam a URL codificada. Payloads `<img onerror>`, SVG e `<script>` foram recebidos como texto no mock.
- **Cenário:** tentativa de executar markup via formulário/hash/query.
- **Pré-condições:** nenhuma.
- **Payload/ação simulada:** payloads permitidos do prompt e `javascript:alert('url-test')` em campos.
- **Resultado esperado:** nenhuma execução e destino preservado.
- **Resultado observado:** origem/path preservados e uma única query `text`; nenhum script executado.
- **Impacto:** nenhum XSS confirmado.
- **Correção:** manter renderização React segura e criar validação de URL antes de futura origem CMS/API.
- **Teste automatizado:** varredura de sinks e teste de codificação.
- **Risco residual:** conteúdo futuro de CMS/API pode mudar a conclusão.

### RT-011 — Proteção de tabnabbing presente

- **Status:** CONFIRMADA (controle positivo).
- **Severidade:** informativa.
- **Evidência:** todos os `target="_blank"` em `Contact.jsx`, `Testimonials.jsx`, `Location.jsx` e `WhatsAppCTA.jsx` usam `rel="noopener noreferrer"`; `window.open` passa `noopener,noreferrer`.
- **Cenário:** destino tenta acessar `window.opener`.
- **Pré-condições:** abrir link externo.
- **Payload/ação simulada:** enumeração estática e mock local.
- **Resultado esperado:** opener nulo e referrer ausente.
- **Resultado observado:** atributos corretos; `document.referrer` vazio no mock.
- **Impacto:** risco clássico de reverse-tabnabbing reduzido.
- **Correção:** manter teste em CI.
- **Teste automatizado:** auditoria de tags e argumentos de `window.open`.
- **Risco residual:** a URL ainda contém dados e permanece observável.

### RT-012 — Arquivos sensíveis não expostos pelo artefato, mas rotas têm soft-404

- **Status:** CONFIRMADA (não exposição); baixa para soft-404.
- **Severidade:** baixa.
- **Evidência:** requests a `/.env`, `/.git/config`, `/package.json`, `/src/`, `/PENDENCIAS.md`, backups e `.map` retornaram o mesmo `index.html` de 3.052 bytes (`spaFallback=True`), não o arquivo pedido.
- **Cenário:** scanner tenta obter fonte/configuração.
- **Pré-condições:** acesso ao preview local.
- **Payload/ação simulada:** requests GET aos caminhos obrigatórios do prompt.
- **Resultado esperado:** 404/410 e nenhum conteúdo sensível.
- **Resultado observado:** nenhum segredo/arquivo exposto; status 200 pode confundir caches, scanners e SEO.
- **Impacto:** sem exfiltração confirmada; observabilidade e semântica HTTP prejudicadas.
- **Correção:** configurar 404 real para caminhos com extensão/dotfiles e fallback SPA apenas para rotas válidas.
- **Teste automatizado:** probes HTTP incluídos na suíte parametrizada.
- **Risco residual:** hospedagens diferentes têm regras diferentes; retestar o deploy.

### RT-013 — Dependências sem vulnerabilidade conhecida na auditoria atual

- **Status:** CONFIRMADA (controle positivo pontual).
- **Severidade:** informativa.
- **Evidência:** auditoria do `package-lock.json` executada em 23/09/2026: 0 vulnerabilidades em 113 dependências; lockfile v3 com `resolved` do registry npm e `integrity` nas entradas aplicáveis; nenhum script de instalação próprio encontrado no `package.json`.
- **Cenário:** pacote vulnerável ou lockfile adulterado entra no build.
- **Pré-condições:** dependência comprometida/conhecida.
- **Payload/ação simulada:** auditoria do lockfile e inspeção de scripts/resoluções.
- **Resultado esperado:** zero alta/crítica e lock íntegro.
- **Resultado observado:** política satisfeita nesta data.
- **Impacto:** não elimina risco futuro ou pacote malicioso sem CVE.
- **Correção:** CI com `npm ci` e `npm audit --audit-level=high`, revisão de diffs do lockfile e atualização deliberada.
- **Teste automatizado:** comando documentado; não foi alterado o lockfile.
- **Risco residual:** base de vulnerabilidades e cadeia npm mudam com o tempo.

### RT-014 — Recursos de terceiros degradam funcionalidade/privacidade

- **Status:** PROVÁVEL; comportamento de cada terceiro real não foi testado.
- **Severidade:** baixa.
- **Evidência:** Google Fonts em `index.html:31-36`; iframe Google Maps em `Location.jsx:54-62`; links externos em `site.js`.
- **Cenário:** bloqueio DNS/adblock, lentidão ou alteração do terceiro.
- **Pré-condições:** recurso remoto indisponível/comprometido.
- **Payload/ação simulada:** execução local com rede externa não utilizada; iframe permaneceu `about:blank`, enquanto endereço e link textual continuaram disponíveis.
- **Resultado esperado:** conteúdo e canal alternativo continuam compreensíveis.
- **Resultado observado:** mapa/fonte podem falhar; texto/endereço e CSS local preservam a função principal. WhatsApp não tem confirmação real nem alternativa de telefone clicável.
- **Impacto:** degradação e potencial rastreamento de metadados pelo conteúdo incorporado.
- **Correção:** auto-hospedar fontes, carregar mapa sob ação/consentimento ou usar mapa estático local, manter endereço e canal alternativo claros.
- **Teste automatizado:** E2E com requests de terceiros bloqueadas, sem chamadas reais.
- **Risco residual:** links externos continuam sujeitos à disponibilidade/conta do fornecedor.

### RT-015 — Cache, HTTPS, DNS e rollback da produção desconhecidos

- **Status:** NÃO VERIFICÁVEL LOCALMENTE.
- **Severidade:** informativa até o ambiente existir.
- **Evidência:** não há configuração versionada de hospedagem; preview usa `Cache-Control: no-cache` tanto no HTML quanto nos assets.
- **Cenário:** HTML antigo aponta para contato incorreto, assets não são imutáveis ou TLS/DNS são frágeis.
- **Pré-condições:** configuração inadequada da plataforma.
- **Payload/ação simulada:** inspeção do repositório e headers locais.
- **Resultado esperado:** HTML `no-cache`/revalidação; assets com hash `public,max-age=31536000,immutable`; HTTPS/HSTS; releases identificáveis e rollback testado.
- **Resultado observado:** assets têm hash no nome, mas a política real e o procedimento de rollback não existem no escopo.
- **Impacto:** versões antigas, canal incorreto e recuperação lenta.
- **Correção:** versionar configuração, registrar commit/build/hashes, manter release anterior e ensaiar rollback.
- **Teste automatizado:** checks de headers no domínio autorizado após deploy.
- **Risco residual:** propagação de CDN/DNS durante rollback.

### RT-016 — Dados públicos facilitam scraping e clonagem de identidade

- **Status:** CONFIRMADA como exposição intencional; abuso é PROVÁVEL.
- **Severidade:** baixa.
- **Evidência:** bundle e HTML expõem nome, CRM/RQE, endereço, e-mail, telefone/WhatsApp, fotos e depoimentos abreviados.
- **Cenário:** fraudador clona aparência e troca o canal de contato.
- **Pré-condições:** acesso público normal ao site.
- **Payload/ação simulada:** busca no bundle; nenhuma coleta externa.
- **Resultado esperado:** somente dados necessários e identidade verificável.
- **Resultado observado:** dados operacionais são facilmente extraíveis, como esperado para site institucional.
- **Impacto:** phishing e falsificação fora do site.
- **Correção:** publicar canais oficiais verificáveis, orientar pacientes a conferir domínio/número, monitorar domínios semelhantes e manter processo de resposta a fraude.
- **Teste automatizado:** snapshot/allowlist dos canais oficiais para detectar troca não revisada.
- **Risco residual:** conteúdo público sempre pode ser copiado.

### RT-017 — Sourcemaps, backups e service worker ausentes em `dist/`

- **Status:** CONFIRMADA (controle positivo).
- **Severidade:** informativa.
- **Evidência:** busca recursiva no `dist/` encontrou zero `.map`, `.zip`, `.bak`, arquivo terminado em `~`, `sw.js` ou service worker. O ZIP `_to_delete/reactbits-project.zip` está fora de `dist/`.
- **Cenário:** artefato acidental expõe fontes/regras/backups ou service worker órfão mantém versão antiga.
- **Pré-condições:** publicação exata de `dist/`.
- **Payload/ação simulada:** inventário recursivo e probes HTTP.
- **Resultado esperado/observado:** nenhum desses artefatos publicado.
- **Impacto:** risco não confirmado no build atual.
- **Correção:** manter allowlist de artefato e excluir a pasta `_to_delete` de qualquer pipeline amplo.
- **Teste automatizado:** varredura do `dist/` incluída.
- **Risco residual:** publicar a raiz do repositório em vez de `dist/` mudaria a conclusão.

## 6. Hipóteses não confirmadas e validação segura

| Hipótese | Status | Validação após informar o ambiente |
|---|---|---|
| Headers/HSTS/CSP reais | NÃO VERIFICÁVEL LOCALMENTE | `curl -sS -D- -o /dev/null https://DOMINIO_REAL/` |
| DNSSEC, CAA, registrar e MFA | NÃO VERIFICÁVEL LOCALMENTE | revisar no registrador e consultar DNS autorizado, sem varredura invasiva |
| Cache CDN e rollback | NÃO VERIFICÁVEL LOCALMENTE | conferir headers de HTML/assets, ID do release e executar rollback controlado |
| Logs/analytics contendo query | NÃO VERIFICÁVEL LOCALMENTE | revisar configuração e consultar apenas canário fictício em ambiente autorizado |
| Truncamento pelo WhatsApp | NÃO VERIFICÁVEL sem atingir terceiro | não testar com dados reais; reduzir/remover dados da URL torna a hipótese irrelevante |
| Cookies/rastreamento do iframe | NÃO VERIFICÁVEL sem terceiro | inventário de cookies/storage em homologação com consentimento e rede autorizada |

## 7. Cenários não aplicáveis

**NÃO APLICÁVEL:** curso/matrícula/material pago/certificado/progresso; admin/papéis/tenant; pagamento/webhook; banco, Supabase, RLS, Storage, Edge Functions; upload; API própria. Nenhum desses componentes existe no repositório atual.

### Apêndice condicional para evolução futura

Se forem adicionados backend, agendamento persistente, CMS, analytics, área da paciente, upload ou Supabase, testar separadamente: IDOR/BOLA, acesso horizontal/vertical, mass assignment, bypass de autenticação/autorização, alteração de papel, isolamento de tenants, RLS, exposição de `service_role`, buckets/signed URLs, MIME spoofing/path traversal, assinatura/timestamp/idempotência de webhook, replay/manipulação de pagamento, CSRF, CORS, rate limiting, enumeração e PII em logs. Não há infraestrutura atual contra a qual executar esses testes.

## 8. Correções prioritárias antes da publicação

1. **P0:** retirar dados pessoais/clínicos da URL; transformar o formulário em CTA mínimo ou redesenhar o tratamento com privacidade explícita.
2. **P0:** definir domínio real e bloquear release com `DOMINIO-PENDENTE`.
3. **P0:** gerar e publicar um `dist/` limpo, rastreável e idêntico ao fonte revisado.
4. **P0:** tratar `window.open === null`; não limpar formulário nem mostrar sucesso falso.
5. **P0:** versionar CSP/anti-framing, Referrer-Policy, nosniff, Permissions-Policy, HSTS e cache na hospedagem.
6. **P1:** limitar/normalizar campos, rejeitar whitespace Unicode e reduzir o incentivo a informação clínica.
7. **P1:** completar aviso de privacidade e processo operacional LGPD.
8. **P1:** allowlist de canais/hosts e revisão reforçada para alterações de contato/pipeline.
9. **P2:** auto-hospedar fontes, reduzir iframe de mapa e configurar 404 real.

## 9. Suíte de regressão

Foram adicionados testes locais sem chamadas a terceiros:

- `security-tests/red-team-static.test.mjs`: artefato, domínio, sourcemaps/arquivos indevidos, sinks, links, allowlist e build reprodutível.
- `security-tests/Contact.security.test.jsx`: especificação de testes de componente para validação, Unicode, limites, codificação, destino, `noopener,noreferrer`, pop-up bloqueado e sucesso.
- `security-tests/preview-security.test.mjs`: headers, framing e caminhos sensíveis contra URL expressamente autorizada.
- `security-tests/README.md`: comandos, dependências mínimas e política de auditoria.

Os testes de componente exigem, sem alteração automática neste trabalho: `vitest`, `jsdom`, `@testing-library/react` e `@testing-library/jest-dom`. Playwright só é justificável para a prova visual de framing e bloqueio de terceiros; os checks atuais usam HTTP/DOM e não exigem tráfego externo.

## 10. Checklist de reteste

- [ ] Nenhum dado de campo aparece em URL, histórico ou log do mock.
- [ ] Pop-up bloqueado mantém os dados e mostra erro.
- [ ] Limites e whitespace/controles Unicode são rejeitados.
- [ ] Payloads HTML/JS permanecem texto; origem/path não mudam.
- [ ] Todos os links externos passam em allowlist e têm proteção de opener.
- [ ] Zero `DOMINIO-PENDENTE` no build.
- [ ] Build limpo e artefato publicado têm hashes/conteúdo equivalentes.
- [ ] Zero sourcemap, backup, regra interna ou secret no artefato.
- [ ] CSP Report-Only sem violações inesperadas; depois CSP enforcement.
- [ ] Framing bloqueado.
- [ ] Headers e cache aprovados no domínio real.
- [ ] Terceiros bloqueados não impedem acesso a endereço/canal alternativo.
- [ ] `npm audit --audit-level=high` aprovado na data do release.
- [ ] Rollback para release anterior testado.

## 11. Perguntas pendentes

1. Qual é o domínio definitivo e quem controla registrar/DNS/MFA?
2. Qual plataforma/CDN hospedará o site e onde os headers serão versionados?
3. Existem analytics, pixels, logs de CDN/proxy ou replay de sessão planejados?
4. Por quanto tempo o consultório retém contatos recebidos por WhatsApp/e-mail e como atende direitos LGPD?
5. O número e e-mail publicados têm processo de verificação e recuperação contra takeover?
6. Quem aprova mudanças nos canais e no pipeline de publicação?
7. O mapa incorporado é indispensável ou pode ser carregado sob ação do usuário?

## Decisão

**NÃO APTO PARA PUBLICAÇÃO.** A decisão se apoia em quatro evidências bloqueadoras: dados potencialmente clínicos em URL observável, domínio placeholder, artefato `dist/` divergente do fonte e sucesso falso quando a janela não abre. A ausência de headers/anti-framing no preview reforça a necessidade de configurar e retestar a hospedagem antes do release.

## Outcome

- Signal: useful

## Source Nodes

- WhatsApp URL Data Flow
- Browser Security Headers
- WhatsApp URL Leakage Test
- Contact()
- External Navigation Abuse
- PrivacyNotice.jsx
- WhatsAppCTA.jsx