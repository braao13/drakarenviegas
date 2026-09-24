---
type: "security-patch"
date: "2026-09-24T02:40:54.776734+00:00"
question: "Revisar o projeto arquivo por arquivo e gerar um patch seguro de produção"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Contact()", "PrivacyNotice.jsx", "Browser Security Headers", "Publication Allowlist", "Pending Production Domain", "Public Artifact Exposure Test"]
---

# Q: Revisar o projeto arquivo por arquivo e gerar um patch seguro de produção

## Answer

# Revisão arquivo por arquivo e patch seguro de produção

**Data:** 23/09/2026  
**Escopo:** repositório local, build temporário e preview em loopback.  
**Estado:** patch de código aplicado e validado; publicação definitiva bloqueada até informar domínio, hospedagem e pendências LGPD.

## 1. Resumo executivo

O patch removeu a coleta intermediária de nome, telefone, e-mail, assunto e mensagem. O site agora abre o WhatsApp com texto fixo, sem colocar dados digitados pela paciente em URL, histórico ou logs. A mudança preserva o canal de agendamento e elimina também o falso estado de sucesso causado por `window.open`.

O build agora falha de forma segura sem `SITE_URL` HTTPS válida, substitui o domínio em canonical/Open Graph/robots/sitemap somente durante a compilação, desabilita sourcemaps explicitamente e restringe a varredura do Tailwind a `index.html` e `src/`. O preview local recebeu headers defensivos e 404 para caminhos sensíveis; a hospedagem real ainda precisa implementar esses controles.

Não foi gerado um `dist/` definitivo porque o domínio real não foi fornecido. O `dist/` existente continua desatualizado e não deve ser publicado.

## 2. Escopo, limitações e informações ausentes

- **CONFIRMADO:** aplicação React/Vite estática, sem backend, banco, autenticação, Supabase, uploads, pagamentos ou API própria.
- **CONFIRMADO:** não há configuração versionada de hospedagem/CDN/CI.
- **CONFIRMADO:** a pasta não contém `.git`; portanto, não foi possível criar commit, tag ou demonstrar rollback por versão.
- **NÃO VERIFICÁVEL NO REPOSITÓRIO:** domínio, DNS, TLS, registrar/MFA, CDN, headers reais, logs, analytics injetados pela plataforma, deploy e rollback operacional.
- **PENDENTE:** controlador, canal de direitos LGPD e retenção das conversas em WhatsApp/e-mail.

Nenhum terceiro foi acessado pelos testes. O build usou `https://security-test.invalid` apenas em diretório temporário, nunca como valor de produção.

## 3. Arquitetura e fluxo de dados observado

```text
Visitante
  → React estático
  → CTA com mensagem fixa
  → link HTTPS wa.me com rel=noopener noreferrer
  → decisão e envio acontecem fora do site, no WhatsApp

Página
  ├─ Google Fonts: fonte e metadados técnicos de conexão
  ├─ Google Maps: iframe/link e metadados técnicos de conexão
  ├─ Instagram: navegação externa
  ├─ Google Reviews: links externos
  └─ hospedagem/CDN: headers, cache, logs e redirects ainda desconhecidos
```

O frontend não armazena contatos, não usa cookies próprios, storage, Clipboard API ou parâmetros de URL, e não contém sinks de XSS como `dangerouslySetInnerHTML`, `innerHTML=`, `eval` ou `new Function`.

## 4. Matriz arquivo por arquivo

| Arquivo | Finalidade/dados | Evidência | Risco e severidade | Patch/impacto | Validação |
|---|---|---|---|---|---|
| `index.html` | SEO, OG, fontes, JSON-LD profissional | linhas 7-58 | domínio pendente; política de referrer ausente — média | `__SITE_URL__` substituído no build; meta referrer; visual inalterado | build temporário sem token |
| `vite.config.js` | build e preview | linhas 7-122 | build publicável sem domínio, sourcemaps implícitos e preview permissivo — alta/média | gate HTTPS, injeção de metadados, sourcemap false, CSP/headers/404 no preview | build sem domínio falha; testes HTTP 3/3 |
| `package.json` | scripts/dependências | linhas 6-26 | faltavam comandos de regressão — baixa | adicionados `test:security` e `test:headers`; dependências não alteradas | lint/build/testes |
| `package-lock.json` | reprodução e integridade | lockfile v3 | supply chain mutável ao longo do tempo — informativa | sem atualização automática | auditoria anterior: 0 vulnerabilidades/113 deps |
| `.gitignore` / `.env.example` | evitar publicação de configuração | regras adicionadas | futuro `.env` poderia entrar no repositório — média | ignora `.env*`, preserva exemplo vazio | busca e build gate |
| `public/robots.txt` | descoberta de sitemap | linha 5 | domínio placeholder — média | token substituído no build | domínio temporário presente no output |
| `public/sitemap.xml` | URL canônica | linha 5 | domínio placeholder — média | token substituído no build | XML renderizado sem token |
| `public/favicon.svg`, `og-image.jpg` | assets públicos | inventário de `public/` | scraping/hotlinking — baixa | mantidos; são conteúdo público necessário | allowlist de publicação |
| `src/config/site.js` | contatos, conteúdo e links | linhas 8-321 | troca de canal se repositório/pipeline for comprometido — média | mensagem fixa documentada; teste de allowlist/numero | host/número exatos em teste |
| `Contact.jsx` | contato/agendamento | linhas 26-151 | PII/saúde em URL e sucesso falso — alta | formulário removido; CTA fixo por âncora | teste estático + visual local |
| `PrivacyNotice.jsx` | transparência LGPD | linhas 8-39 | texto contraditório/incompleto — média | descreve ausência de formulário e terceiros; expõe pendências | modal inspecionado no preview |
| `Location.jsx` | endereço e mapa | linhas 12-72 | referrer mais amplo que necessário — baixa | iframe usa `no-referrer`; lazy loading mantido | inspeção de fonte/build |
| `Testimonials.jsx` | avaliações públicas | linhas 20-100 | clonagem/scraping e terceiro — baixa | sem mudança de conteúdo; links já protegidos | teste de `target=_blank` |
| `WhatsAppCTA.jsx` | CTAs globais | linhas 10-52 | destino centralizado — baixa/média | já usava somente texto fixo e noopener/noreferrer | allowlist e revisão visual |
| `src/index.css` | tema/Tailwind | linhas 1-3 | docs/testes alteravam CSS gerado — média de integridade | `source(none)` + fontes explícitas | CSS caiu para 38.476 bytes e estabilizou |
| demais componentes React | layout e conteúdo editorial | `src/App.jsx`, layouts, sections e UI | nenhum sink executável encontrado — informativa | nenhuma mudança desnecessária | lint/build |
| imagens em `src/assets` | conteúdo visual público | 46 KB a 2,70 MB | desempenho e scraping; zero GPS detectado — baixa | sem recompressão para preservar qualidade | inspeção de dimensões/metadados |
| `dist/` atual | artefato antigo | inventário/hashes | não corresponde ao fonte e contém domínio antigo — alta operacional | não sobrescrito sem domínio real | 2 gates continuam falhando de propósito |
| `PRODUCAO_HEADERS_E_DEPLOY.md` | templates de infraestrutura | documento novo | provedor desconhecido — não verificável | opções separadas, nenhuma ativada arbitrariamente | aplicar uma opção e rodar testes HTTP |

## 5. Dados pessoais e sensíveis

| Item | Classificação | Estado após patch | Terceiros/risco | Minimização e retenção |
|---|---|---|---|---|
| Nome, telefone, e-mail digitados | dados pessoais | não são mais coletados | nenhum pelo site | eliminados; retenção não aplicável ao site |
| Tipo de consulta | pode revelar contexto de saúde | não é coletado | nenhum pelo site | eliminado |
| Mensagem livre | pode conter dado de saúde sensível | não existe no site | conteúdo só é digitado voluntariamente no canal externo | aviso para evitar detalhes no primeiro contato |
| Endereço profissional | dado profissional público | exibido e enviado ao Google Maps como query fixa | Google Maps e scraping | necessário para localização; retenção não aplicável |
| WhatsApp/e-mail | canal profissional público | bundle e UI | scraping/clonagem | necessário; monitorar fraude e alteração não autorizada |
| Depoimentos | conteúdo editorial derivado de avaliações públicas | exibidos com nomes abreviados | Google Maps e scraping | validar base/autorização juridicamente |
| Imagens | dado pessoal/identidade profissional | públicas | clonagem/hotlinking | zero GPS detectado; publicação intencional deve ser confirmada |

Validação jurídica permanece necessária para depoimentos/imagens, controlador, direitos e retenção nos canais externos.

## 6. Relacionamentos e fluxos perigosos

### PROD-001 — Dados pessoais na URL do WhatsApp

- **Status da evidência:** CONFIRMADO e corrigido.
- **Severidade:** alta.
- **Arquivo/linha:** `Contact.jsx` antigo, linhas 61-104; novo fluxo em `Contact.jsx:26-32,132-150`.
- **Problema:** campos do formulário eram concatenados em query string.
- **Impacto:** histórico/logs/capturas podiam conter PII e informação clínica.
- **Correção:** remoção do formulário; URL contém apenas mensagem fixa de `site.js`.
- **Alteração de regra de negócio:** o canal de agendamento permanece WhatsApp; a paciente informa dados somente após abrir o aplicativo.
- **Teste:** ausência de form/inputs e parâmetro `text` fixo.
- **Risco residual:** WhatsApp processa o conteúdo que a paciente decidir enviar.

### PROD-002 — Estado de sucesso sem envio

- **Status da evidência:** CONFIRMADO e corrigido.
- **Severidade:** média.
- **Arquivo/linha:** `Contact.jsx` antigo, linhas 93-104.
- **Problema:** `window.open()` retornando `null` ainda limpava o formulário e mostrava sucesso.
- **Impacto:** falsa impressão de início de agendamento.
- **Correção:** fluxo usa âncora normal e não declara sucesso/envio.
- **Alteração de regra de negócio:** somente a mensagem de interface ficou mais precisa.
- **Teste:** texto “nenhuma mensagem é enviada automaticamente”.
- **Risco residual:** abertura do WhatsApp não comprova que a mensagem foi enviada.

### PROD-003 — Domínio pendente propagado ao artefato

- **Status da evidência:** CONFIRMADO; patch de prevenção aplicado, valor real pendente.
- **Severidade:** alta operacional.
- **Arquivo/linha:** `index.html:15,25-26`; `public/robots.txt:5`; `public/sitemap.xml:5`; `vite.config.js:27-53`.
- **Problema:** era possível compilar/publicar canonical, OG e sitemap com placeholder.
- **Impacto:** SEO, identidade e compartilhamentos incorretos.
- **Correção:** build exige `SITE_URL` HTTPS contendo apenas a origem e substitui tokens.
- **Alteração de regra de negócio:** nenhuma; exige decisão operacional antes do release.
- **Teste:** sem variável, build retorna código 1; com URL de teste, todos os metadados são renderizados.
- **Risco residual:** DNS/registrar/TLS não são verificáveis.

### PROD-004 — Headers e framing dependentes da hospedagem

- **Status da evidência:** CONFIRMADO no preview; produção NÃO VERIFICÁVEL.
- **Severidade:** média.
- **Arquivo/linha:** `vite.config.js:8-24,110-122`; `PRODUCAO_HEADERS_E_DEPLOY.md`.
- **Problema:** o artefato estático não impõe sozinho CSP, HSTS, cache ou anti-framing.
- **Impacto:** clickjacking e menor contenção de injeções futuras.
- **Correção:** preview endurecido; templates Report-Only → enforcement para três famílias de hospedagem.
- **Alteração de regra de negócio:** CSP permite somente os terceiros atualmente necessários.
- **Teste:** suíte HTTP e prova de framing.
- **Risco residual:** somente a configuração real do provedor produz proteção em produção.

### PROD-005 — `dist/` desatualizado

- **Status da evidência:** CONFIRMADO e deliberadamente não sobrescrito.
- **Severidade:** alta operacional.
- **Arquivo/linha:** `dist/index.html`, JS e CSS existentes.
- **Problema:** artefato atual contém código/formulário antigo e placeholder.
- **Impacto:** publicar `dist/` agora reintroduziria as falhas corrigidas.
- **Correção:** gerar novo `dist/` somente com domínio definitivo e publicar exclusivamente esse diretório.
- **Alteração de regra de negócio:** nenhuma.
- **Teste:** suíte estática mantém dois gates vermelhos até o build final.
- **Risco residual:** pipeline precisa ligar artefato a commit/release; não há Git atual.

### PROD-006 — Aviso de privacidade e governança incompletos

- **Status da evidência:** CONFIRMADO; parte técnica corrigida, governança pendente.
- **Severidade:** média.
- **Arquivo/linha:** `PrivacyNotice.jsx:8-39`.
- **Problema:** texto anterior descrevia formulário e compartilhamento de modo incompleto.
- **Impacto:** expectativa incorreta sobre tratamento de dados.
- **Correção:** texto alinhado ao fluxo, terceiros e ausência de envio automático; pendências não foram inventadas.
- **Alteração de regra de negócio:** texto visível mudou para refletir a realidade.
- **Teste:** inspeção do modal local.
- **Risco residual:** requer informação do controlador e validação jurídica.

### PROD-007 — Recursos externos e privacidade técnica

- **Status da evidência:** CONFIRMADO.
- **Severidade:** baixa.
- **Arquivo/linha:** `index.html:32-37`; `Location.jsx:12-17,54-62`.
- **Problema:** Google Fonts e Maps recebem conexão do navegador.
- **Impacto:** metadados técnicos e falha funcional parcial se bloqueados.
- **Correção:** `no-referrer` no iframe; CSP restrita. Auto-hospedar fontes e mapa sob ação são melhorias opcionais.
- **Alteração de regra de negócio:** somente referrer foi reduzido.
- **Teste:** bloquear terceiros em E2E futuro e confirmar fallback textual.
- **Risco residual:** conteúdo remoto continua sob disponibilidade/política do fornecedor.

### PROD-008 — Assets grandes

- **Status da evidência:** CONFIRMADO.
- **Severidade:** baixa, desempenho.
- **Arquivo/linha:** `dra-karen.png` 2,70 MB; `fundo.png` 1,50 MB; `logo-nova.png` 318 KB.
- **Problema:** custo de transferência e decodificação em mobile.
- **Impacto:** carregamento mais lento; não é vulnerabilidade.
- **Correção:** melhoria opcional: gerar AVIF/WebP responsivos preservando originais e qualidade aprovada.
- **Alteração de regra de negócio:** pode alterar fidelidade visual, por isso não aplicado automaticamente.
- **Teste:** Lighthouse e comparação visual.
- **Risco residual:** imagens públicas podem ser copiadas.

## 7. Controles ausentes ou fracos

| Controle | Estado do patch | Produção |
|---|---|---|
| CSP | enforcement no preview; Report-Only e enforcement documentados | pendente no provedor |
| HSTS | não simulado em HTTP local | ativar só após HTTPS confirmado |
| `nosniff`, Referrer, Permissions | preview configurado | pendente no provedor |
| `frame-ancestors`/XFO | preview bloqueia | pendente no provedor |
| CORS | NÃO APLICÁVEL: sem API/recurso cross-origin próprio | não adicionar genericamente |
| Cache | matriz definida | pendente no CDN/servidor |
| HTTPS/canonical redirects | template com placeholders | domínio/provedor pendentes |
| 404 SPA | preview nega caminhos sensíveis | reproduzir no provedor |
| Directory listing/dotfiles | não aplicável ao bundle em si | negar no servidor |
| Sourcemaps | `false` explícito + teste | manter no pipeline |
| SRI | não aplicável a CSS Google Fonts dinâmico | self-hosting é alternativa melhor |
| Links externos | noopener/noreferrer + allowlist em teste | manter CI |
| Campos | removidos | não aplicável |
| Dados em URL | somente mensagem fixa | risco de conteúdo digitado no terceiro permanece |

A política CSP foi construída sem `unsafe-inline` ou `unsafe-eval`; o JSON-LD atual é autorizado por hash. A varredura Tailwind foi restringida conforme a documentação oficial do Tailwind v4; `SITE_URL` é usada apenas na configuração e não é uma variável `VITE_*` exposta ao cliente.

## 8. Operações no frontend e necessidade de backend

| Operação | Classificação | Justificativa |
|---|---|---|
| validação de campos | NÃO APLICÁVEL após patch | não há campos |
| preparar mensagem fixa WhatsApp | segura no frontend | conteúdo público, sem segredo/PII |
| `mailto` fixo | segura no frontend | somente fallback, sem corpo pessoal |
| armazenar contatos | exige backend e governança | cria retenção, acesso, exclusão, logs e antiabuso |
| e-mail automático | exige backend | credencial não pode ficar no navegador |
| analytics/pixels | decisão de produto/jurídica | não adicionar sem necessidade, transparência e minimização |
| upload | exige backend/serviço dedicado | MIME, malware, autorização, retenção |
| agendamento online | exige backend | disponibilidade, autenticação e integridade |
| dados clínicos | não deveriam existir neste frontend | usar fluxo clínico apropriado |
| área da paciente | exige backend e autenticação forte | autorização/IDOR/logs sensíveis |
| alterar conteúdo/contatos | segura via código após revisão | proteger repositório/pipeline |
| logs/auditoria | hospedagem/pipeline | evitar URLs e dados sensíveis |

Adicionar backend ao fluxo atual não foi recomendado: ele reduziria a URL, mas criaria armazenamento, superfície de ataque, retenção, autenticação operacional, rate limiting e resposta a incidentes. O CTA sem formulário resolve o risco com menor complexidade.

## 9. Revisão de `public/` e `dist/`

### Allowlist de publicação

Somente estes itens devem compor o release:

```text
dist/index.html
dist/favicon.svg
dist/og-image.jpg
dist/robots.txt
dist/sitemap.xml
dist/assets/*  # somente arquivos gerados pelo build
```

Nunca publicar: `src/`, `Regras/`, `.git/`, `.env*`, `node_modules/`, `_to_delete/`, prompts/relatórios, `package*.json`, `vite.config.js`, testes, backups, sourcemaps ou arquivos internos. Um arquivo secreto colocado em `public/` é público por definição; URL obscura não é controle de acesso.

O `public/` atual contém somente favicon, OG image e arquivos SEO. O `dist/` antigo contém apenas a estrutura allowlisted, sem sourcemaps/backups, mas seu conteúdo está desatualizado. A pasta `_to_delete/reactbits-project.zip` está fora de `dist/`, porém seria exposta se alguém publicasse a raiz inteira.

Metadados inspecionados nas imagens publicáveis e importadas: 2–3 itens por imagem, nenhum GPS detectado. Dados de contato, CRM/RQE, endereço, fotos e depoimentos são intencionalmente públicos, mas facilitam clonagem e phishing.

## 10. Dependências, build, cache e desempenho

- `lint`: código 0; um warning preexistente em `Button.jsx` sobre Fast Refresh.
- build sem `SITE_URL`: falha fechada, como esperado.
- build temporário com URL `.invalid`: sucesso, 1.845 módulos.
- bundle novo: JS 339.469 bytes (gzip 112,77 KB); CSS 38.476 bytes (gzip 8,03 KB).
- assets principais: 2,70 MB e 1,50 MB; otimização de imagem é o maior ganho futuro.
- sourcemaps: desabilitados e ausentes.
- auditoria de dependências realizada na etapa anterior: zero vulnerabilidades conhecidas; precisa ser repetida no release porque a base muda.
- cache recomendado: HTML revalidado; assets hashados imutáveis por um ano; favicon/OG revalidados em prazo curto.
- compressão: Brotli/Gzip depende da hospedagem.
- Google Fonts: os preconnects são coerentes enquanto as fontes forem remotas; self-hosting permitiria removê-los.

## 11. Plano priorizado

### Crítico

Nenhum achado crítico confirmado.

### Alto

1. Informar `SITE_URL`, gerar um novo `dist/` e nunca publicar o artefato antigo.
2. Publicar somente `dist/` a partir de release rastreável.

### Médio

1. Aplicar no provedor real uma opção de headers/redirects e promover CSP de Report-Only para enforcement.
2. Confirmar controlador, direitos e retenção; revisar o aviso juridicamente.
3. Proteger alteração de WhatsApp/domínio/pipeline com revisão e MFA.

### Baixo

1. Auto-hospedar fontes ou documentar o terceiro.
2. Converter imagens grandes para formatos responsivos modernos.
3. Considerar mapa carregado somente após ação da pessoa usuária.

### Informativo

1. Repetir auditoria de dependências e testes em cada release.
2. Monitorar domínio semelhante e fraude de identidade.

## 12. Patch aplicado por arquivo

- `Contact.jsx`: formulário e estados removidos; CTA fixo e aviso de minimização.
- `PrivacyNotice.jsx`: fluxo real, terceiros e pendências explícitos.
- `Location.jsx`: iframe com `no-referrer`.
- `site.js`: comentário alinhado à mensagem fixa.
- `index.css`: fonte Tailwind limitada ao app.
- `index.html`, `robots.txt`, `sitemap.xml`: token de domínio e meta referrer.
- `vite.config.js`: validação de domínio, substituição de metadata, sourcemaps, preview headers e 404.
- `.gitignore`, `.env.example`: proteção/configuração operacional.
- `package.json`: scripts de regressão.
- `security-tests/*`: testes ajustados ao novo modelo sem formulário.
- `PRODUCAO_HEADERS_E_DEPLOY.md`: opções de infraestrutura sem escolher provedor.

Nenhuma dependência, contato, depoimento ou imagem foi trocado.

## 13. Testes de regressão

Resultados atuais:

- lint: aprovado com 1 warning preexistente;
- build temporário: aprovado;
- build sem domínio: bloqueado como esperado;
- preview headers/framing/404: **3/3 aprovados**;
- testes estáticos: **5/7 aprovados**;
- duas falhas são gates operacionais corretos: `dist/` antigo contém placeholder e diverge do fonte;
- teste visual: CTA e modal aprovados; nenhum terceiro foi aberto.

Os testes React/RTL foram atualizados, mas não executados porque Vitest/Testing Library não fazem parte do projeto e dependências não foram instaladas automaticamente.

## 14. Aplicação e rollback

### Aplicação

1. Confirmar domínio e provedor.
2. Criar `.env.local` com `SITE_URL=https://DOMINIO_REAL`.
3. Executar `npm ci`, lint, testes e build.
4. Confirmar que `dist/` contém apenas a allowlist e zero token/placeholder.
5. Aplicar uma única opção de headers em Report-Only na homologação.
6. Rodar `test:headers`, inspecionar violações e promover para enforcement.
7. Registrar hash/commit do release e publicar somente `dist/`.

### Rollback

Como não existe repositório Git, não há rollback seguro demonstrável hoje. Antes do primeiro deploy:

1. inicializar/restaurar controle de versão ou criar backup imutável do release anterior;
2. registrar `SITE_URL`, hashes e configuração de headers usados;
3. manter o artefato anterior disponível;
4. em falha, republicar o artefato anterior e reverter os headers para a versão registrada;
5. não reutilizar o `dist/` antigo presente hoje, pois contém as falhas corrigidas.

O patch de código é reversível por arquivo, mas reintroduzir o formulário reabre o vazamento de PII e não é rollback seguro.

## 15. Pendências obrigatórias

1. Qual é o domínio definitivo?
2. Qual é o provedor de hospedagem/CDN?
3. Onde headers e redirects são configurados?
4. O deploy publica somente `dist/` ou o repositório inteiro?
5. A plataforma envia sourcemaps fora do artefato local?
6. Existem analytics, pixels, cookies ou scripts injetados pela hospedagem?
7. Existem logs que armazenam URLs completas ou query strings?
8. Quem pode alterar WhatsApp, domínio e conteúdo publicado?
9. Qual é o processo de revisão, publicação e rollback?
10. Quem é o controlador e qual é o canal de direitos LGPD?
11. Qual é a retenção das conversas no WhatsApp e e-mail?
12. Há intenção futura de armazenar formulários, aceitar uploads ou criar área da paciente?

## Decisão atual

**PATCH DE CÓDIGO APROVADO PARA HOMOLOGAÇÃO; PRODUÇÃO BLOQUEADA.** O bloqueio não decorre mais do formulário: depende do domínio real, novo `dist/`, configuração efetiva da hospedagem e respostas de governança/LGPD.

## Outcome

- Signal: useful

## Source Nodes

- Contact()
- PrivacyNotice.jsx
- Browser Security Headers
- Publication Allowlist
- Pending Production Domain
- Public Artifact Exposure Test