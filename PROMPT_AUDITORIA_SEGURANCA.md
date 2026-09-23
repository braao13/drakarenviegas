# Prompt adaptado — auditoria de segurança, privacidade e produção

Você é um especialista sênior em segurança de aplicações web, AppSec, privacidade, LGPD, segurança de frontend, cadeia de suprimentos JavaScript, OWASP Top 10, OWASP ASVS e segurança de sites da área da saúde.

Faça uma auditoria técnica completa deste repositório e gere um plano de hardening para publicação em produção. Trabalhe sobre o código existente; não trate este projeto como um sistema hipotético.

## Contexto confirmado do projeto

- Produto: site institucional de uma médica ginecologista e obstetra, voltado a pacientes e potenciais pacientes.
- Stack atual: React 19, Vite 8, JavaScript, Tailwind CSS 4 e aplicação de página única.
- Estado atual: frontend estático; não há backend, banco de dados, autenticação, área administrativa, Supabase ou API própria identificados no repositório.
- Contato: formulário client-side em `src/components/sections/Contact.jsx`.
- Fluxo do formulário: valida os campos no navegador, monta uma mensagem e abre o WhatsApp por `wa.me` com os dados codificados no parâmetro `text`; existe fallback por `mailto`.
- Dados envolvidos no formulário: nome, telefone, e-mail opcional, tipo de consulta e mensagem livre. A mensagem pode conter espontaneamente dados pessoais sensíveis ou informações de saúde.
- Integrações e terceiros observados: WhatsApp, Instagram, Google Maps, Google Fonts e links para avaliações no Google Maps.
- Conteúdo: informações profissionais, endereço, formas de pagamento, depoimentos públicos e imagens da médica/consultório.
- Privacidade: existe um aviso resumido em `src/components/layout/PrivacyNotice.jsx`.
- Configuração central: `src/config/site.js`.
- Metadados e SEO: `index.html`, `public/robots.txt` e `public/sitemap.xml`.
- Pendência conhecida: o domínio definitivo ainda está representado por `DOMINIO-PENDENTE.com.br`.
- Dependências e scripts: `package.json` e `package-lock.json`.
- Build gerado: pasta `dist/`.

## Objetivo

Avaliar se o site pode ser publicado com segurança e privacidade adequadas, identificar vulnerabilidades reais, reduzir a exposição de dados pessoais e sensíveis e produzir correções priorizadas e verificáveis.

Não proponha Supabase, banco de dados, autenticação, RLS, Edge Functions ou backend como se já existissem. Analise essas tecnologias apenas em uma seção condicional, caso sejam realmente necessárias para uma evolução futura do produto.

## Regras obrigatórias da auditoria

1. Inspecione primeiro o código, as configurações e o lockfile. Não dê uma resposta baseada apenas nesta descrição.
2. Para cada achado, forneça evidência com arquivo e linha, cenário de exploração ou falha, impacto, probabilidade, severidade e correção concreta.
3. Classifique cada afirmação como `CONFIRMADO`, `INFERIDO`, `NÃO VERIFICÁVEL NO REPOSITÓRIO` ou `NÃO APLICÁVEL`.
4. Não invente backend, cookies, analytics, pixels, hospedagem, CDN, WAF, provedor de DNS, consentimentos ou processos internos.
5. Diferencie vulnerabilidade explorável, melhoria de hardening, risco de privacidade, problema de conformidade e pendência operacional.
6. Não considere validação client-side uma barreira de segurança.
7. Não sugira coleta, persistência ou transmissão adicional de dados sem justificar necessidade, base legal, retenção e risco.
8. Considere a mensagem livre como potencialmente capaz de conter dados de saúde, mesmo que o texto da interface peça para não informar detalhes clínicos.
9. Considere que dados inseridos em uma URL do WhatsApp podem aparecer em histórico, sincronização do navegador, logs intermediários, capturas de tela, telemetria ou no próprio provedor terceiro. Verifique tecnicamente o fluxo e proponha alternativas proporcionais.
10. Não afirme conformidade legal como fato. Aponte controles técnicos, lacunas e temas que exigem validação jurídica ou do encarregado/controlador.
11. Ao citar normas, legislação ou recomendações que possam ter mudado, valide a versão vigente em fontes oficiais e informe a data da consulta.
12. Preserve o escopo: é um site institucional pequeno. Evite arquitetura excessiva e controles incompatíveis com o risco real.
13. Não altere o código durante a auditoria. Primeiro produza o relatório e um plano de correção. Se solicitado depois, implemente mudanças em etapas pequenas e testáveis.

## 1. Inventário e superfície de ataque

Mapeie:

- pontos de entrada do usuário;
- campos e dados tratados;
- fluxos de dados entre navegador, WhatsApp, e-mail e serviços externos;
- scripts, fontes, iframes, imagens e links de terceiros;
- configuração de build e publicação;
- arquivos públicos e metadados;
- dependências de produção e desenvolvimento;
- possíveis secrets, chaves, tokens, credenciais, dados pessoais ou artefatos indevidos no Git e no bundle;
- limites de confiança e responsabilidades entre site, navegador, hospedagem e terceiros.

Produza um diagrama textual simples do fluxo de dados e uma tabela com: origem, dado, destino, finalidade, base legal provável, retenção conhecida, risco e controle recomendado.

## 2. Modelo de ameaças específico

Analise, no mínimo:

- XSS refletido, armazenado e DOM-based;
- injeção em URLs, atributos, links, iframes e conteúdo futuramente configurável;
- reverse tabnabbing e navegação externa insegura;
- vazamento de dados pessoais ou de saúde pelo link do WhatsApp, `mailto`, histórico, referrer ou logs;
- phishing, clonagem do site e troca maliciosa do número de WhatsApp;
- comprometimento do domínio, DNS e conta de hospedagem;
- ausência ou configuração inadequada de HTTPS, HSTS e redirecionamentos;
- ausência ou configuração inadequada de CSP e demais headers de segurança;
- riscos de conteúdo de terceiros, fontes remotas e iframe do Google Maps;
- supply-chain attack, dependências vulneráveis, typosquatting e scripts de build;
- exposição acidental de arquivos de origem, sourcemaps, `.env`, backups ou diretórios internos;
- coleta excessiva ou indução ao envio de dado sensível no campo de mensagem;
- spam, automação e abuso do formulário/CTA;
- uso de depoimentos, imagens e dados profissionais sem comprovação de autorização ou governança;
- clickjacking, MIME sniffing, permissões do navegador e políticas de referrer;
- riscos de disponibilidade, cache incorreto e publicação de versão desatualizada;
- riscos futuros se analytics, formulário com backend, CMS, área do paciente ou agendamento online forem adicionados.

Para cada ameaça, informe ativo afetado, agente, pré-condição, caminho de ataque, impacto, controles existentes e controles ausentes.

## 3. Revisão do código frontend

Revise todos os arquivos relevantes em `src/`, `public/`, `index.html`, `vite.config.js`, `package.json` e `package-lock.json`.

Verifique especialmente:

- uso de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` ou construção insegura de HTML;
- interpolação de dados em `href`, `src`, `mailto`, `wa.me`, iframe e redirecionamentos;
- todos os usos de `target="_blank"` e `rel="noopener noreferrer"`;
- validação, limites de tamanho, normalização e mensagens do formulário;
- comportamento real de `window.open` e `window.location.href`;
- exposição de PII em query strings;
- armazenamento em `localStorage`, `sessionStorage`, cookies ou IndexedDB;
- logs, telemetria e mensagens de erro;
- acessibilidade que possa afetar o uso seguro do formulário e do modal de privacidade;
- URLs e domínios hardcoded;
- conteúdo misto, recursos sem integridade e dependências externas;
- configurações de produção, sourcemaps e variáveis `VITE_*`;
- conteúdo que possa caracterizar promessa, informação enganosa ou divulgação indevida, separando esse tema da segurança técnica.

## 4. Privacidade e LGPD

Avalie de forma específica ao contexto de saúde:

- papéis prováveis de controlador, operador e terceiros;
- finalidade e necessidade de cada campo;
- minimização: se telefone e mensagem bastam e se nome completo/e-mail precisam ser solicitados;
- possibilidade de dado pessoal sensível na mensagem livre;
- transparência sobre o envio ao WhatsApp/Meta ou por e-mail;
- base legal provável, deixando explícita a necessidade de validação jurídica;
- necessidade ou não de consentimento e por que um checkbox genérico pode ser inadequado;
- aviso de privacidade resumido versus política completa;
- retenção, descarte, acesso, correção, exportação e exclusão;
- canal para exercício de direitos do titular;
- atendimento a menores e dados relacionados a gestação;
- transferência ou tratamento por terceiros e fora do Brasil, quando aplicável;
- plano de resposta a incidentes;
- inventário e registro das operações de tratamento;
- medidas para desencorajar o envio de detalhes clínicos antes da consulta.

Compare o texto de `PrivacyNotice.jsx` com o comportamento efetivo do formulário. Aponte divergências, omissões e frases que não possam ser comprovadas tecnicamente, como alegações absolutas de não compartilhamento quando o fluxo usa serviços de terceiros.

## 5. Headers, navegador e hospedagem

Proponha uma configuração de produção compatível com um SPA estático, contendo valores concretos e justificativa para:

- `Content-Security-Policy`, considerando React/Vite, Google Fonts, Google Maps, imagens locais, WhatsApp e Instagram;
- `Strict-Transport-Security`;
- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- proteção contra framing por `frame-ancestors` e, se necessário, `X-Frame-Options`;
- cache de `index.html` e de assets com hash;
- HTTPS obrigatório e redirects;
- remoção de headers informativos;
- compressão e limites de upload, se houver no futuro;
- sourcemaps e tratamento de erros;
- configuração equivalente para o provedor de hospedagem, se ele puder ser identificado. Caso não possa, forneça exemplos separados para as opções mais prováveis sem fingir que uma delas está em uso.

Para CSP, entregue primeiro uma política candidata em modo `Report-Only`, explique como observar violações e depois forneça a política de enforcement. Não use `unsafe-eval` ou `unsafe-inline` sem demonstrar necessidade concreta.

## 6. Dependências e cadeia de suprimentos

Execute, quando o ambiente permitir:

- instalação reprodutível com o lockfile;
- auditoria de dependências;
- lint;
- build de produção;
- inspeção do bundle e de sourcemaps;
- busca por secrets e dados sensíveis;
- verificação de versões sem assumir que “mais nova” significa “mais segura”.

Registre os comandos, resultados e limitações. Não atualize dependências automaticamente durante a auditoria. Para cada vulnerabilidade, verifique se o pacote afetado entra no bundle de produção, se o caminho vulnerável é alcançável e qual é o risco real.

## 7. Conteúdo, terceiros e segurança operacional

Analise:

- integridade e origem dos depoimentos e imagens;
- exposição do e-mail, telefone e endereço a scraping;
- risco de spam e engenharia social;
- governança para alteração do número de WhatsApp e demais contatos;
- proteção das contas de domínio, DNS, hospedagem, Git e redes sociais com MFA;
- processo de publicação, rollback e revisão;
- backups da configuração e recuperação do domínio;
- monitoramento de disponibilidade, expiração de domínio/certificado e mudanças de conteúdo;
- necessidade de `security.txt` e canal de reporte;
- correção obrigatória de `DOMINIO-PENDENTE.com.br` antes da publicação;
- consistência entre canonical, Open Graph, sitemap e domínio final.

## 8. Testes de segurança e privacidade

Crie casos de teste executáveis para:

- payloads de XSS nos campos do formulário;
- nomes, telefones, e-mails e mensagens com tamanhos extremos;
- caracteres Unicode, quebras de linha e conteúdo que altere a estrutura da mensagem;
- URLs do WhatsApp geradas e seus limites práticos;
- bloqueio de pop-up e falha ao abrir o WhatsApp;
- links externos e `noopener/noreferrer`;
- navegação por teclado, foco e fechamento do modal;
- CSP em modo Report-Only e enforcement;
- headers HTTP no ambiente publicado;
- tentativa de acesso a `.env`, sourcemaps, arquivos de regras, backups e fontes;
- exposição de PII no histórico, logs e cabeçalho `Referer`;
- build limpo e reprodutível;
- vulnerabilidades de dependências;
- conteúdo e URLs ainda apontando para o domínio pendente.

Separe testes locais de testes que só podem ser feitos após conhecer a URL e a hospedagem de produção.

## 9. Arquitetura futura — somente se necessária

Se o projeto futuramente passar a armazenar contatos, oferecer agendamento, analytics, CMS, área da paciente ou prontuário, descreva separadamente:

- quais requisitos mudam;
- quando um backend passa a ser obrigatório;
- validação server-side, autenticação, autorização, rate limiting, CSRF, logs e auditoria;
- criptografia, retenção e segregação de dados;
- por que dados clínicos e prontuários não devem ser tratados como um simples formulário de marketing;
- critérios para avaliar Supabase ou outro backend, sem presumir que seja a escolha atual;
- controles obrigatórios caso Supabase seja escolhido: RLS em todas as tabelas expostas, menor privilégio, Storage privado, URLs assinadas, `service_role` apenas no servidor e testes negativos de autorização.

Não gere SQL ou políticas RLS definitivas sem schema, papéis, fluxos e requisitos de retenção.

## 10. Resultado esperado

Entregue o relatório nesta ordem:

1. Resumo executivo e decisão preliminar: `APTO`, `APTO COM RESSALVAS` ou `NÃO APTO PARA PRODUÇÃO`.
2. Escopo, limitações e suposições.
3. Arquitetura observada e fluxo de dados.
4. Achados priorizados em tabela: ID, severidade, categoria, status da evidência, arquivo/linha, impacto, probabilidade e correção.
5. Detalhamento dos achados críticos e altos com prova técnica reproduzível.
6. Avaliação do formulário e do fluxo para WhatsApp/e-mail.
7. Avaliação LGPD e lacunas para validação jurídica.
8. Configuração recomendada de CSP e headers.
9. Dependências e cadeia de suprimentos.
10. Checklist de produção com três colunas: item, como validar e evidência esperada.
11. Plano de correção em fases: antes da publicação, até 30 dias e melhorias futuras.
12. Testes de regressão para cada correção.
13. Pendências e perguntas objetivas necessárias para fechar a auditoria.

Use severidade `CRÍTICA`, `ALTA`, `MÉDIA`, `BAIXA` ou `INFORMATIVA`. Não infle severidades. Relacione a prioridade ao contexto real de um site institucional médico sem backend próprio.

## Perguntas que devem ser respondidas ou marcadas como pendentes

- Qual será o domínio definitivo?
- Qual será o provedor de hospedagem/CDN e quem administra a conta?
- Existem analytics, pixels, cookies ou scripts injetados fora deste repositório?
- Existem logs do provedor que registram query strings ou outros identificadores?
- Quem é o controlador dos dados e qual é o canal oficial para direitos dos titulares?
- Há política de privacidade completa fora do modal atual?
- Por quanto tempo conversas e dados de contato permanecem no WhatsApp/e-mail e quem tem acesso?
- O WhatsApp utilizado é pessoal ou WhatsApp Business, e quais dispositivos/sessões têm acesso?
- Há autorização e governança documentadas para imagens e depoimentos publicados?
- Existe contrato ou orientação jurídica sobre tratamento de dados pessoais e sensíveis?
- O formulário deve continuar transmitindo todo o conteúdo pela URL ou pode ser reduzido a um CTA sem dados pré-preenchidos?

## Critério de qualidade

Não quero uma resposta genérica nem um checklist copiado. Quero uma auditoria ancorada no repositório, com evidências, comandos reproduzíveis, riscos contextualizados, correções proporcionais e distinção clara entre fatos, inferências e pontos que dependem do ambiente de produção ou de validação jurídica.
