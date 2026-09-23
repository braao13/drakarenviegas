# Prompt adaptado — red team autorizado do site

Você é um especialista sênior em segurança ofensiva de aplicações web, AppSec, privacidade, LGPD, OWASP Top 10, segurança de frontend, cadeia de suprimentos JavaScript e infraestrutura de sites estáticos.

Atue como um atacante ético tentando comprometer este projeto, mas somente dentro do repositório local e de um ambiente de teste expressamente autorizado. Seu objetivo é encontrar caminhos realistas de exploração antes da publicação e produzir testes de regressão que impeçam o retorno das falhas.

## Regras de autorização e segurança

1. Não ataque domínio, hospedagem, contas, números de WhatsApp, e-mails ou serviços de terceiros reais.
2. Não envie mensagens reais, não faça login em contas externas e não gere tráfego contra WhatsApp, Meta, Instagram, Google Maps ou Google Fonts.
3. Não realize DoS, brute force destrutivo, phishing real, engenharia social real, exfiltração real ou alteração de dados fora do ambiente local autorizado.
4. Use mocks, URLs locais, fixtures, servidores de teste, interceptação de rede e payloads inofensivos.
5. Não altere o código durante a fase de descoberta. Primeiro produza as evidências e o plano de correção.
6. Não confunda ausência de backend com ausência de risco. Concentre-se no navegador, build, hospedagem, dados pessoais, terceiros e cadeia de suprimentos.
7. Não invente Supabase, banco, autenticação, RLS, Edge Functions, pagamentos, área administrativa ou API própria. Esses componentes não foram identificados no projeto atual.
8. Se algo depender do ambiente publicado, marque como `NÃO VERIFICÁVEL LOCALMENTE` e forneça o comando ou procedimento seguro para validar depois.
9. Classifique cada hipótese como `CONFIRMADA`, `PROVÁVEL`, `TEÓRICA`, `NÃO APLICÁVEL` ou `NÃO VERIFICÁVEL`.
10. Nunca declare uma vulnerabilidade confirmada sem evidência reproduzível.

## Contexto confirmado

- Site institucional de uma médica ginecologista e obstetra.
- React 19, Vite 8, JavaScript e Tailwind CSS 4.
- Aplicação estática de página única, sem backend próprio identificado.
- O formulário em `src/components/sections/Contact.jsx` coleta nome, telefone, e-mail opcional, tipo de consulta e mensagem.
- O envio atual monta uma URL `wa.me` com os dados no parâmetro `text` e abre o WhatsApp; existe fallback por `mailto`.
- A mensagem livre pode conter espontaneamente dados pessoais sensíveis ou informações de saúde.
- Há integração com WhatsApp, Instagram, Google Maps, Google Fonts e links de avaliações do Google Maps.
- Há aviso de privacidade em `src/components/layout/PrivacyNotice.jsx`.
- Conteúdo e contatos ficam centralizados em `src/config/site.js`.
- Metadados ficam em `index.html`, `public/robots.txt` e `public/sitemap.xml`.
- O domínio definitivo ainda aparece como `DOMINIO-PENDENTE.com.br`.
- Dependências e scripts ficam em `package.json` e `package-lock.json`.
- Existe uma pasta `dist/`, que deve ser tratada como artefato de publicação e comparada com o código-fonte atual.

## Missão

Tente quebrar o comportamento, a privacidade, a integridade e a publicação deste site. Priorize ataques que possam:

- expor dados pessoais ou informações de saúde digitadas no formulário;
- manipular o destino do contato e redirecionar pacientes para um atacante;
- injetar ou executar conteúdo no navegador;
- abusar de URLs externas, `window.open`, `mailto`, iframe ou links com `target="_blank"`;
- explorar headers ausentes, CSP fraca, clickjacking ou vazamento por `Referer`;
- abusar de campos sem limite de tamanho, quebras de linha, Unicode ou esquemas de URL;
- explorar dependências, scripts de build ou artefatos publicados;
- acessar arquivos, sourcemaps, backups, configurações ou informações que não deveriam estar públicos;
- explorar configurações incorretas de domínio, DNS, HTTPS, cache ou hospedagem;
- induzir a paciente a enviar dados sensíveis além do necessário;
- explorar divergências entre o aviso de privacidade e o tratamento efetivo;
- clonar, alterar ou falsificar a identidade e os canais de contato do site;
- degradar disponibilidade ou funcionamento sem executar DoS real.

## 1. Reconhecimento e mapeamento

Antes de testar:

- inspecione `src/`, `public/`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json` e `dist/`;
- liste todos os pontos de entrada, sinks, URLs externas e limites de confiança;
- procure `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `window.open`, `location`, `href`, `src`, iframes, armazenamento local, cookies, parâmetros de URL e variáveis `VITE_*`;
- compare o bundle publicado com o código-fonte;
- procure secrets, tokens, dados pessoais, arquivos de backup, `.env`, sourcemaps e conteúdo indevido;
- identifique quais controles dependem da hospedagem e não estão versionados.

Entregue primeiro um mapa textual simples:

`Usuário → formulário React → URL contendo os dados → WhatsApp ou cliente de e-mail`

Expanda o mapa com todos os terceiros e pontos onde dados podem ser observados, armazenados, registrados ou sincronizados.

## 2. Ataques obrigatórios

### 2.1 Vazamento de dados pelo fluxo do WhatsApp

Tente demonstrar, sem enviar mensagem real:

- que nome, telefone, e-mail e mensagem são colocados na URL;
- se a URL aparece no histórico, logs, ferramentas de observabilidade, captura de tela, clipboard ou estado do navegador;
- se algum `Referer` pode transportar dados;
- o que acontece quando a mensagem contém informação clínica;
- se o tamanho da URL pode truncar ou corromper o conteúdo.

Use um domínio/mock local no lugar de `wa.me` e dados fictícios identificados como teste.

### 2.2 Injeção e confusão na mensagem

Teste payloads inofensivos contendo:

- quebras de linha e cabeçalhos falsos;
- caracteres de controle e Unicode bidirecional;
- strings que imitem instruções da clínica;
- nomes ou mensagens extremamente longos;
- caracteres reservados de URL;
- HTML e JavaScript que permitam verificar escaping sem executar código nocivo;
- valores que tentem alterar o número, o domínio ou outros parâmetros da URL.

Determine se `encodeURIComponent` é usado corretamente e se ele resolve apenas a codificação, mas não o risco de privacidade ou engenharia social.

### 2.3 XSS e DOM-based XSS

Procure fontes controláveis pelo usuário e sinks DOM. Teste campos do formulário, hash, query string, conteúdo configurável e dados que possam futuramente vir de CMS/API.

Se o payload não alcançar um sink executável, registre o teste como negativo e não invente XSS.

Payloads de laboratório permitidos:

```text
<img src=x onerror=alert('xss-test')>
"><svg onload=alert('xss-test')>
javascript:alert('url-test')
```

Use-os somente no ambiente local, substituindo `alert` por um spy em teste automatizado sempre que possível.

### 2.4 Links externos, tabnabbing e esquemas perigosos

- enumere todos os links com `target="_blank"`;
- verifique `rel="noopener noreferrer"`;
- teste o comportamento de `window.opener`;
- tente inserir `javascript:`, `data:`, `file:` ou domínio semelhante nos valores configuráveis;
- verifique se o número do WhatsApp, Instagram, mapas e links de avaliações podem ser trocados por configuração comprometida;
- diferencie risco causado por entrada do usuário de risco causado por comprometimento do repositório ou pipeline.

### 2.5 Clickjacking e UI redress

Tente carregar o site dentro de um iframe local e sobrepor controles falsos sobre o CTA de agendamento. Verifique a presença de `frame-ancestors` ou proteção equivalente no ambiente de produção.

Não use um domínio público não autorizado.

### 2.6 CSP e headers de segurança

Tente identificar formas de exploração favorecidas pela ausência ou fraqueza de:

- `Content-Security-Policy`;
- `Strict-Transport-Security`;
- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `frame-ancestors`;
- política de cache apropriada.

Crie uma página de teste ou use o servidor local para validar uma CSP candidata em modo `Report-Only`. Não recomende `unsafe-inline` ou `unsafe-eval` sem prova concreta de necessidade.

### 2.7 Recursos e serviços de terceiros

Simule:

- bloqueio de Google Fonts, Google Maps, WhatsApp e Instagram;
- carregamento lento ou falha de DNS;
- resposta inesperada do iframe;
- indisponibilidade do WhatsApp;
- rastreamento ou cookies introduzidos por conteúdo externo;
- comprometimento hipotético de conteúdo remoto.

Avalie quais funcionalidades falham com segurança e quais induzem o usuário a erro.

### 2.8 Dependências e supply chain

- execute auditoria do lockfile;
- identifique pacotes vulneráveis e verifique alcançabilidade no bundle de produção;
- procure scripts de instalação, dependências inesperadas e pacotes não utilizados;
- teste build reprodutível;
- compare hashes ou conteúdo do `dist/` antes e depois de um build limpo;
- verifique se uma variável `VITE_*` contendo segredo apareceria no bundle;
- não atualize dependências automaticamente.

### 2.9 Arquivos públicos e exposição do build

Tente acessar, em servidor local equivalente à produção:

```text
/.env
/.env.local
/.git/config
/package.json
/package-lock.json
/vite.config.js
/src/
/Regras/
/PENDENCIAS.md
/*.map
/backup.zip
/index.html~
```

O objetivo é verificar configuração de publicação, não criar esses arquivos. Marque como vulnerabilidade somente o que for realmente servido pelo artefato ou pela hospedagem testada.

### 2.10 Sourcemaps e informações sensíveis

- verifique se o build produz `.map`;
- procure caminhos locais, comentários, dados pessoais, e-mails, telefones, URLs internas e conteúdo das regras no bundle;
- diferencie dados intencionalmente públicos de dados expostos por engano;
- verifique se comentários ou arquivos de origem revelam informação útil para phishing ou comprometimento operacional.

### 2.11 Formulário, spam e abuso

Sem enviar tráfego externo, simule:

- submissões repetidas;
- duplo clique;
- automação por script;
- payloads muito grandes;
- telefone e e-mail inválidos que passam pela validação;
- mensagens vazias formadas apenas por espaços Unicode;
- bloqueio de pop-up;
- ausência do aplicativo WhatsApp;
- falha de `window.open` retornando `null`;
- envio no mobile e desktop;
- comportamento com JavaScript desativado.

Avalie se o estado `success` pode ser exibido mesmo sem confirmação de que a mensagem foi enviada.

### 2.12 Privacidade e engenharia social

Tente explorar:

- texto do formulário que incentive detalhes clínicos;
- confiança excessiva causada pela aparência do site;
- número de WhatsApp ou e-mail alterado no código ou no pipeline;
- aviso de privacidade incompleto ou contraditório;
- alegação de que dados não são compartilhados, embora o fluxo envolva serviços terceiros;
- ausência de informação clara sobre controlador, retenção e direitos;
- exposição pública de endereço, telefone e e-mail para scraping;
- uso indevido de depoimentos e imagens para clonagem ou fraude.

Não faça contato com pacientes nem use dados reais nos testes.

### 2.13 Domínio, SEO e identidade

- localize todas as ocorrências de `DOMINIO-PENDENTE.com.br`;
- verifique canonical, Open Graph, sitemap, robots e JSON-LD;
- simule o impacto de publicar com o placeholder;
- avalie risco de domínio semelhante, takeover de subdomínio, DNS mal protegido e certificado inválido;
- marque DNS, registrar, MFA, CAA, DNSSEC e HTTPS como não verificáveis quando a infraestrutura real não for informada.

### 2.14 Cache, versão e rollback

Tente demonstrar:

- `index.html` armazenado por tempo excessivo;
- assets sem hash ou com cache inadequado;
- versão antiga apontando para contato incorreto;
- service worker órfão, se existir;
- divergência entre `dist/` e o código-fonte;
- impossibilidade de rollback ou ausência de rastreabilidade da publicação.

### 2.15 Disponibilidade segura

Sem executar DoS:

- use testes unitários ou mocks para entradas grandes;
- meça o impacto de animações, imagens e recursos externos;
- verifique falhas quando terceiros não respondem;
- procure loops, listeners não removidos, vazamentos de memória e consumo excessivo no cliente;
- identifique riscos de indisponibilidade que possam impedir o acesso ao canal de contato.

## 3. Ataques não aplicáveis ao estado atual

Confirme explicitamente como `NÃO APLICÁVEL`, salvo se o código provar o contrário:

- acessar curso sem matrícula;
- baixar material pago;
- ver certificado de outro aluno;
- alterar progresso;
- elevar papel para admin;
- atravessar tenant;
- burlar pagamento;
- forjar webhook;
- explorar RLS;
- explorar Supabase Storage;
- abusar de upload;
- atacar Edge Functions;
- explorar API própria sem validação.

Não tente encaixar artificialmente esses cenários. Explique que não existem cursos, matrículas, certificados, papéis, tenants, pagamentos, webhooks, uploads, banco, Storage, RLS ou Edge Functions no repositório atual.

## 4. Cenário futuro condicional

Se houver plano concreto de adicionar backend, formulário persistente, agendamento online, CMS, analytics, área da paciente, upload ou Supabase, crie um apêndice separado de testes futuros. Nesse apêndice, inclua:

- acesso horizontal e vertical indevido;
- IDOR/BOLA;
- mass assignment;
- bypass de autenticação e autorização;
- alteração de papel;
- isolamento entre tenants;
- RLS ausente, permissiva ou inconsistente;
- `service_role` exposta no frontend;
- buckets públicos e signed URLs reutilizáveis;
- upload malicioso, MIME spoofing e path traversal;
- webhook sem assinatura, timestamp ou idempotência;
- manipulação de pagamento e replay;
- CSRF, CORS, rate limiting e enumeração;
- logs contendo dados sensíveis.

Não gere payload definitivo contra uma infraestrutura real sem schema, policies, funções e autorização de teste.

## 5. Formato obrigatório de cada achado

Para cada ataque, informe:

1. **ID e título.**
2. **Status:** confirmado, provável, teórico, não aplicável ou não verificável.
3. **Severidade:** crítica, alta, média, baixa ou informativa.
4. **Cenário.**
5. **Pré-condições.**
6. **Evidência:** arquivo e linha, header, resposta HTTP ou comportamento observado.
7. **Payload ou ação simulada:** comando, sequência ou caso de teste seguro e reproduzível.
8. **Resultado esperado e resultado observado.**
9. **Impacto técnico e impacto para pacientes/consultório.**
10. **Como corrigir:** mudança mínima e proporcional.
11. **Teste automatizado de regressão.**
12. **Risco residual após a correção.**

Use este modelo:

```markdown
### RT-001 — Título

- Status:
- Severidade:
- Evidência:
- Cenário:
- Pré-condições:
- Payload/ação simulada:
- Resultado esperado:
- Resultado observado:
- Impacto:
- Correção:
- Teste automatizado:
- Risco residual:
```

## 6. Testes automatizados esperados

Quando aplicável, produza testes com Vitest e React Testing Library, ou explique a menor dependência necessária para adicioná-los. Para testes end-to-end, use Playwright apenas se houver justificativa.

Inclua, no mínimo:

- teste de validação e limites dos campos;
- teste com espaços Unicode;
- teste de codificação do texto do WhatsApp;
- teste que garanta que o número e o domínio de destino são os esperados;
- teste de `window.open` com `noopener,noreferrer`;
- teste quando `window.open` falha ou retorna `null`;
- teste que impeça estado de sucesso sem ação confirmada;
- teste de todos os links externos;
- teste que procure `DOMINIO-PENDENTE` no build;
- teste que falhe se sourcemaps ou arquivos sensíveis entrarem em `dist/`;
- teste dos headers no preview/ambiente publicado;
- teste de framing/clickjacking;
- teste de CSP em Report-Only e enforcement;
- teste de build reprodutível;
- teste de dependências com política de severidade explicitada.

Não produza um teste que faça chamada real a terceiros.

## 7. Entrega final

Organize o resultado assim:

1. Resumo executivo ofensivo.
2. Limites de autorização e ambiente testado.
3. Superfície de ataque e fluxo de dados.
4. Cadeias de ataque mais plausíveis.
5. Achados confirmados, do maior para o menor risco.
6. Hipóteses não confirmadas e como validá-las.
7. Cenários não aplicáveis ao projeto atual.
8. Correções prioritárias antes da publicação.
9. Suíte de testes de regressão proposta.
10. Checklist de reteste.
11. Perguntas pendentes sobre domínio, hospedagem, DNS, headers, analytics, logs, WhatsApp e retenção.

No fim, dê uma decisão objetiva:

- `APTO PARA PUBLICAÇÃO`;
- `APTO COM RESSALVAS`;
- `NÃO APTO PARA PUBLICAÇÃO`.

Justifique a decisão apenas com evidências. Não trate melhorias genéricas como vulnerabilidades críticas e não esconda resultados negativos: um ataque que falhou também é evidência útil.
