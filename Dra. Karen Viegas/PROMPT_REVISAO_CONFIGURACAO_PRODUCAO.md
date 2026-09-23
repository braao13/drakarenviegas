# Prompt adaptado — revisão arquivo por arquivo e patch seguro de produção

Você é um especialista sênior em segurança de aplicações web, AppSec, privacidade, LGPD, React, Vite, segurança de sites estáticos, headers HTTP, Content Security Policy, cadeia de suprimentos JavaScript e infraestrutura de publicação.

Vou fornecer o repositório atual e, quando disponíveis, as configurações de hospedagem, domínio, DNS, CDN, redirects e headers.

Revise o projeto arquivo por arquivo e gere um plano de hardening e um patch seguro para produção.

## Contexto confirmado

- Site institucional de uma médica ginecologista e obstetra.
- React 19, Vite 8, JavaScript e Tailwind CSS 4.
- Aplicação estática, sem backend, banco, autenticação, Supabase, RLS, Edge Functions ou API própria identificados atualmente.
- O formulário em `src/components/sections/Contact.jsx` coleta nome, telefone, e-mail opcional, tipo de consulta e mensagem.
- O formulário monta uma URL `wa.me` com os dados no parâmetro `text`; existe fallback por `mailto`.
- A mensagem pode conter espontaneamente dados pessoais sensíveis ou informações de saúde.
- Serviços externos observados: WhatsApp, Instagram, Google Maps, Google Fonts e links de avaliações do Google Maps.
- O aviso de privacidade está em `src/components/layout/PrivacyNotice.jsx`.
- Conteúdo e contatos ficam em `src/config/site.js`.
- Metadados ficam em `index.html`, `public/robots.txt` e `public/sitemap.xml`.
- O domínio definitivo ainda aparece como `DOMINIO-PENDENTE.com.br`.
- Dependências e scripts ficam em `package.json` e `package-lock.json`.
- A pasta `dist/` é um artefato de build e deve ser comparada com o código-fonte atual.

## Regra central

Não trate este projeto como uma aplicação Supabase ou como um sistema com banco. Os conceitos do prompt original — tabelas, `tenant_id`, `user_id`, RLS, policies, buckets, Edge Functions, índices e migração SQL — não se aplicam ao estado atual, salvo se o repositório trouxer evidência concreta do contrário.

Substitua-os pelos controles equivalentes deste projeto:

- tabelas → arquivos, componentes, configurações e artefatos publicados;
- RLS/policies → CSP, headers HTTP, isolamento do navegador, regras de hospedagem e allowlists;
- campos sensíveis → dados pessoais coletados, dados de contato, mensagens e possíveis dados de saúde;
- buckets → arquivos em `public/`, `dist/` e demais caminhos publicados;
- Edge Functions → backend mínimo somente para operações que não possam permanecer com segurança no navegador;
- índices → cache, compressão, hashing de assets, bundle e desempenho de carregamento;
- migração SQL → patch versionado de código/configuração, acompanhado de validação e rollback.

## Regras obrigatórias

1. Inspecione o código e as configurações antes de recomendar mudanças.
2. Para cada achado, cite arquivo e linha ou marque `NÃO VERIFICÁVEL NO REPOSITÓRIO`.
3. Classifique afirmações como `CONFIRMADO`, `INFERIDO`, `NÃO VERIFICÁVEL` ou `NÃO APLICÁVEL`.
4. Não invente hospedagem, CDN, analytics, cookies, WAF, backend, banco ou processos internos.
5. Diferencie vulnerabilidade, risco de privacidade, melhoria de hardening, problema de desempenho e pendência operacional.
6. Não mova automaticamente o formulário para um backend. Primeiro demonstre por que isso seria necessário e qual novo risco de retenção seria criado.
7. Não adicione consentimento, cookies, captcha, analytics ou serviços terceiros sem justificar necessidade e impacto de privacidade.
8. Não altere regras de negócio, textos, contatos, depoimentos, imagens ou fluxo de agendamento sem explicar o motivo e obter confirmação quando houver decisão de produto.
9. Não aplique atualizações automáticas de dependências durante a revisão.
10. O patch deve ser mínimo, reversível, comentado quando necessário e acompanhado de testes.

## 1. Revisão arquivo por arquivo

Revise, no mínimo:

- `index.html`;
- `vite.config.js`;
- `package.json`;
- `package-lock.json`;
- `public/robots.txt`;
- `public/sitemap.xml`;
- todos os arquivos relevantes em `src/`;
- `src/config/site.js`;
- `src/components/sections/Contact.jsx`;
- `src/components/layout/PrivacyNotice.jsx`;
- todos os arquivos em `public/`;
- o conteúdo efetivamente gerado em `dist/`;
- arquivos de configuração da hospedagem, headers e redirects, se existirem;
- `.gitignore`, exemplos de `.env` e arquivos de CI/CD, se existirem.

Para cada arquivo relevante, devolva:

- finalidade;
- dados e integrações envolvidos;
- risco identificado;
- severidade;
- evidência com linha;
- correção recomendada;
- impacto funcional da correção;
- teste de validação.

Não liste arquivos sem relevância apenas para aumentar o relatório.

## 2. Exposição pública e escopo de publicação

Informe:

- quais arquivos precisam ser públicos;
- quais arquivos nunca devem entrar no artefato publicado;
- se `src/`, `Regras/`, `.env`, `.git`, backups, documentos internos, sourcemaps ou arquivos de configuração podem ser servidos;
- se `dist/` contém somente o necessário;
- quais imagens e dados de contato são intencionalmente públicos;
- quais arquivos podem facilitar phishing, clonagem ou engenharia social;
- se existem dados pessoais ou sensíveis desnecessários no bundle;
- se há divergência entre o código-fonte e `dist/`.

Gere uma allowlist recomendada do que pode ser publicado, em vez de depender apenas de uma denylist.

## 3. Dados pessoais e campos sensíveis

Revise os campos:

- nome;
- telefone;
- e-mail;
- tipo de consulta;
- mensagem livre;
- endereço profissional;
- número de WhatsApp;
- depoimentos;
- imagens da médica, equipe ou consultório.

Para cada item, informe:

- se é dado pessoal, dado sensível, dado profissional público ou conteúdo editorial;
- onde é coletado, processado, inserido em URL, exibido ou enviado;
- necessidade e finalidade;
- terceiros envolvidos;
- risco de aparecer em histórico, logs, `Referer`, telemetria ou captura de tela;
- minimização recomendada;
- retenção conhecida ou pendente;
- controle técnico e ponto que exige validação jurídica.

Considere a mensagem livre capaz de receber informação de saúde mesmo que a interface peça para não enviar detalhes clínicos.

## 4. Fluxos e relacionamentos perigosos

Mapeie os relacionamentos entre:

- `Contact.jsx` e `site.js`;
- formulário, `window.open`, WhatsApp e `mailto`;
- `PrivacyNotice.jsx` e o comportamento real do formulário;
- componentes e URLs externas;
- `index.html`, canonical, Open Graph, robots, sitemap e domínio final;
- código-fonte e `dist/`;
- build local e ambiente de hospedagem;
- Google Fonts, Google Maps, Instagram, WhatsApp e avaliações externas.

Aponte relacionamentos perigosos, por exemplo:

- texto de privacidade divergente do fluxo real;
- dado pessoal inserido em query string;
- contato configurável cujo comprometimento redirecionaria pacientes;
- domínio pendente propagado para SEO e compartilhamento;
- recurso externo permitido por uma CSP ampla demais;
- cache que mantenha um número de contato antigo;
- artefato publicado desatualizado em relação ao código.

## 5. Controles e policies equivalentes

Informe quais controles devem ser criados ou fortalecidos:

- `Content-Security-Policy`;
- `Strict-Transport-Security`;
- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `frame-ancestors` e proteção contra clickjacking;
- CORS, somente se houver recurso que realmente precise dele;
- política de cache para `index.html` e assets com hash;
- redirects para HTTPS e domínio canônico;
- tratamento de páginas inexistentes em SPA;
- desativação de directory listing;
- bloqueio de arquivos sensíveis;
- configuração de sourcemaps;
- Subresource Integrity, self-hosting ou justificativa para recursos externos;
- `rel="noopener noreferrer"` em links externos;
- allowlist de destinos externos;
- validação e limites de tamanho dos campos;
- redução de dados colocados na URL do WhatsApp.

Para cada controle, forneça:

- estado atual;
- risco;
- valor/configuração recomendada;
- possíveis quebras funcionais;
- implementação em modo gradual quando aplicável;
- como testar.

Para CSP, entregue uma versão `Report-Only` primeiro e uma versão de enforcement depois. Não use `unsafe-inline` ou `unsafe-eval` sem demonstrar necessidade concreta.

## 6. Operações que podem ou não permanecer no frontend

Classifique cada operação como:

- segura no frontend;
- segura no frontend após correção;
- exige backend;
- não deveria existir.

Avalie:

- validação de campos;
- preparação de mensagem para WhatsApp;
- envio por `mailto`;
- armazenamento de contatos;
- envio de e-mail automático;
- analytics e pixels;
- upload de arquivos;
- agendamento online;
- tratamento de dados clínicos;
- área da paciente;
- alteração de conteúdo/contatos;
- logs e auditoria.

Se recomendar backend, explique:

- ameaça que ele resolve;
- novos dados que passariam a ser armazenados;
- autenticação/autorização necessária;
- retenção e exclusão;
- rate limiting e antiabuso;
- logs sem dados sensíveis;
- custo e complexidade operacional;
- alternativa sem backend.

## 7. Arquivos públicos e “buckets” equivalentes

Revise `public/` e `dist/` como os repositórios públicos de objetos do projeto.

Informe:

- arquivos desnecessários ou inadequados para publicação;
- nomes previsíveis que exponham versões ou backups;
- imagens com metadados EXIF ou geolocalização;
- documentos que revelem informações internas;
- MIME types e cache esperados;
- risco de hotlinking ou scraping;
- possibilidade de servir SVG/HTML controlável com MIME incorreto;
- necessidade de remover metadados de imagens;
- política de acesso adequada para futuros documentos privados.

Deixe claro que um site estático não pode proteger um arquivo secreto colocado em `public/`: se não deve ser público, não deve estar no bundle nem depender de URL obscura.

## 8. Dependências, build e desempenho das políticas

Execute, quando possível:

- instalação reprodutível pelo lockfile;
- lint;
- build de produção;
- auditoria de dependências;
- inspeção do bundle;
- busca por sourcemaps e secrets;
- comparação entre `dist/` e um build limpo.

Revise ainda:

- cache de assets com hash;
- cache curto ou revalidação de `index.html`;
- compressão Brotli/Gzip;
- tamanho de imagens;
- carregamento de fontes;
- iframe de mapa;
- scripts e CSS não utilizados;
- lazy loading;
- preconnects realmente necessários;
- impacto de CSP e recursos externos no carregamento.

Não chame esses itens de “índices de banco”. Explique que, neste projeto, o equivalente prático é evitar que controles de segurança e publicação prejudiquem cache, carregamento e atualização correta do site.

## 9. Configurações fracas ou ausentes

Procure explicitamente:

- ausência de configuração versionada de headers;
- CSP excessivamente ampla;
- uso de curingas em origens;
- `unsafe-inline` e `unsafe-eval`;
- ausência de HTTPS/HSTS;
- `Referrer-Policy` incompatível com dados em URL;
- cache que possa manter contato ou conteúdo antigo;
- links externos sem proteção;
- variáveis `VITE_*` tratadas incorretamente como segredo;
- sourcemaps públicos;
- arquivos internos publicados;
- domínio placeholder;
- aviso de privacidade que afirme mais do que o código comprova;
- ausência de limites nos campos;
- estado de sucesso exibido sem confirmação de envio;
- dependências vulneráveis ou não utilizadas.

## 10. Patch seguro de produção

Depois da análise, gere um patch versionado e seguro, não uma migração SQL.

O patch pode incluir, quando justificado:

- alterações mínimas em React/JavaScript;
- validação e limites dos campos;
- redução do conteúdo colocado na URL;
- correção do aviso de privacidade;
- configuração de CSP e headers para o provedor informado;
- redirects e domínio canônico;
- proteção de links externos;
- configuração de cache;
- exclusão de sourcemaps do artefato;
- allowlist de arquivos publicados;
- testes unitários e end-to-end;
- documentação de rollback.

Se o provedor de hospedagem não for conhecido, não escolha um arbitrariamente. Gere blocos separados e claramente identificados para opções comuns, como `_headers`/`_redirects`, `vercel.json`, configuração Nginx ou equivalente, explicando que somente um deles deve ser adotado após confirmar o ambiente.

O patch deve:

1. preservar o fluxo de negócio sempre que possível;
2. explicar qualquer mudança visível para a paciente;
3. não inserir valores fictícios para domínio, contato ou responsável LGPD;
4. usar placeholders explícitos quando faltar uma decisão do cliente;
5. incluir comandos de validação;
6. incluir rollback;
7. separar correções obrigatórias de melhorias opcionais;
8. não adicionar backend ou serviço terceiro sem aprovação.

## 11. Formato da resposta

Entregue nesta ordem:

1. Resumo executivo.
2. Escopo, limitações e informações ausentes.
3. Arquitetura e fluxo de dados observados.
4. Matriz arquivo por arquivo.
5. Dados pessoais e sensíveis.
6. Relacionamentos e fluxos perigosos.
7. Controles ausentes ou fracos.
8. Operações que podem permanecer no frontend e operações que exigiriam backend.
9. Revisão de `public/` e `dist/`.
10. Dependências, build, cache e desempenho.
11. Plano de correção priorizado: crítico, alto, médio, baixo e informativo.
12. Patch proposto, apresentado por arquivo.
13. Testes de regressão.
14. Procedimento de aplicação e rollback.
15. Pendências que exigem resposta do responsável pelo projeto.

Para cada achado, use:

```markdown
### ID — Título

- Status da evidência:
- Severidade:
- Arquivo/linha:
- Problema:
- Impacto:
- Correção:
- Alteração de regra de negócio:
- Teste:
- Risco residual:
```

## 12. Perguntas obrigatórias se os dados não estiverem no repositório

- Qual é o domínio definitivo?
- Qual é o provedor de hospedagem/CDN?
- Onde os headers e redirects são configurados?
- O deploy publica somente `dist/` ou o repositório inteiro?
- Sourcemaps são enviados para produção?
- Existem analytics, pixels, cookies ou scripts injetados fora do repositório?
- Existem logs que armazenam URLs completas ou query strings?
- Quem pode alterar o número de WhatsApp, domínio e conteúdo publicado?
- Qual é o processo de revisão, publicação e rollback?
- Quem é o controlador e qual é o canal para direitos LGPD?
- Qual é a retenção das conversas no WhatsApp e no e-mail?
- Existe intenção futura de armazenar formulários, aceitar uploads ou criar área da paciente?

## Critério de qualidade

Não quero recomendações genéricas nem uma falsa “migração Supabase”. Quero uma revisão ancorada neste repositório, com evidências, controles adequados a um site estático médico, patch mínimo, testes reproduzíveis e explicação clara de qualquer mudança que afete o fluxo de agendamento ou o tratamento de dados pessoais.
