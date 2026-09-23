# Auditoria de segurança, privacidade e produção

**Projeto:** site institucional da Dra. Karen Viegas Albuquerque  
**Data da auditoria:** 23/09/2026  
**Escopo:** código e artefatos disponíveis no diretório do projeto, incluindo `src/`, `public/`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json`, `dist/` e o arquivo legado `_to_delete/reactbits-project.zip`.  
**Método:** revisão manual de código, busca de padrões perigosos e segredos, inspeção do lockfile e bundle, `npm ls`, `npm audit`, lint, build de produção, inspeção dirigida de metadados de imagens e modelo de ameaças. Nenhum código-fonte foi alterado.

## 1. Conclusão executiva

**Decisão: NÃO PUBLICAR ainda (`NO-GO` condicional).**

O frontend é pequeno e tem uma base tecnicamente razoável: não foi encontrado XSS explorável, uso de `dangerouslySetInnerHTML`, `eval`, `new Function`, armazenamento local, backend oculto, autenticação, banco, API própria, segredo no código, sourcemap público ou link externo com `target="_blank"` sem proteção. O build e o lint terminam; o único aviso do lint não é de segurança. A consulta ao registro oficial do npm retornou **0 vulnerabilidades conhecidas** em 113 dependências no momento da consulta.

Os bloqueadores são de privacidade, conformidade e preparação operacional:

1. o formulário incorpora nome, telefone, e-mail, tipo de consulta e mensagem livre na **query string de uma URL `wa.me`**;
2. a interface incentiva a descrever o motivo da consulta, embora a mensagem possa conter dado de saúde;
3. o aviso de privacidade não descreve adequadamente Google Maps, Google Fonts, WhatsApp, e-mail, retenção, direitos, base legal e papéis dos terceiros;
4. o domínio fictício ainda é publicado em canonical, Open Graph, robots e sitemap;
5. não há configuração de hospedagem no repositório, portanto HTTPS, HSTS, CSP, proteção contra clickjacking, cache e demais headers **não são verificáveis**;
6. a autorização e a governança dos depoimentos e imagens não são demonstráveis pelo repositório.

**Critério mínimo de liberação:** concluir P0-01 a P0-07 da seção 8 e executar a verificação pós-deploy da seção 9.

## 2. Legenda e limites

### Classificação das afirmações

- `CONFIRMADO`: observado diretamente no código, lockfile, bundle ou execução local.
- `INFERIDO`: conclusão razoável baseada no comportamento técnico, ainda dependente do ambiente real.
- `NÃO VERIFICÁVEL NO REPOSITÓRIO`: exige hospedagem, contas, contratos, processos ou evidência externa.
- `NÃO APLICÁVEL`: o controle pressupõe uma funcionalidade que não existe no projeto atual.

### Tipos de achado

- **VULNERABILIDADE EXPLORÁVEL:** há caminho de ataque demonstrável no sistema atual.
- **RISCO DE PRIVACIDADE:** pode haver exposição ou tratamento excessivo de dados pessoais.
- **PROBLEMA DE CONFORMIDADE:** lacuna de transparência, governança ou obrigação que exige validação jurídica/ética.
- **HARDENING:** defesa adicional; a ausência isolada não prova exploração.
- **PENDÊNCIA OPERACIONAL:** depende da implantação, de contas ou de decisões fora do código.

### Limitações

- O diretório fornecido **não contém `.git`**. Histórico, branches, commits removidos e segredos antigos são `NÃO VERIFICÁVEL NO REPOSITÓRIO`.
- Não há URL de produção nem configuração de provedor. DNS, TLS, headers, WAF/CDN, logs, retenção, backups, MFA e permissões de conta são `NÃO VERIFICÁVEL NO REPOSITÓRIO`.
- A auditoria não certifica conformidade com a LGPD, normas do CFM ou outras leis. Ela identifica controles técnicos e pontos para validação pelo controlador, encarregado/assessoria jurídica e, quando aplicável, CRM/Codame.

## 3. Inventário e superfície de ataque

### 3.1 Arquitetura confirmada

- SPA React 19 gerada por Vite 8 (`src/main.jsx:1-10`, `src/App.jsx:1-42`).
- Frontend estático, sem chamada `fetch`, XHR, WebSocket, banco, autenticação ou API própria encontrada.
- Formulário inteiramente client-side (`src/components/sections/Contact.jsx:34-108`).
- Conteúdo factual centralizado em `src/config/site.js`.
- Build estático em `dist/`, com nomes de assets contendo hash e sem arquivos `.map`.
- Terceiros carregados ou acessados: Google Fonts, Google Maps embed, Google Maps/reviews, WhatsApp e Instagram.

### 3.2 Pontos de entrada do usuário

| Entrada | Evidência | Dado/controlável | Destino imediato |
|---|---|---|---|
| Nome | `Contact.jsx:199`, `295-310` | texto livre | estado React; depois URL do WhatsApp ou `mailto` |
| Telefone | `Contact.jsx:200` | texto livre | estado React; depois URL do WhatsApp ou `mailto` |
| E-mail | `Contact.jsx:203` | texto livre opcional | estado React; depois URL do WhatsApp ou `mailto` |
| Tipo de consulta | `Contact.jsx:205-223` | lista fechada | estado React; depois URL do WhatsApp ou `mailto` |
| Mensagem | `Contact.jsx:225-245` | texto livre, potencial dado de saúde | estado React; depois URL do WhatsApp ou `mailto` |
| Filtros e paginação | `Testimonials.jsx:20-37`, `90-115` | estado de UI | somente memória do navegador |
| Navegação/modal/menu | vários componentes | cliques/teclas | somente UI local |

### 3.3 Fluxo textual de dados

```text
Visitante
  ├─ carrega HTML/JS/CSS/imagens ──> hospedagem (logs/retenção não verificáveis)
  ├─ carrega CSS/fontes ───────────> Google Fonts
  ├─ aproxima/visualiza o mapa ────> iframe Google Maps
  ├─ clica Instagram/reviews/mapa ─> serviços externos
  └─ preenche formulário ──────────> estado React em memória
       ├─ WhatsApp configurado
       │    └─ GET https://wa.me/<número>?text=<nome+telefone+email+tipo+mensagem>
       │         └─ WhatsApp Web/app mostra mensagem pré-preenchida; usuária finaliza envio
       └─ fallback sem WhatsApp
            └─ mailto:<email>?subject=<...>&body=<todos os campos>
                 └─ cliente de e-mail do dispositivo
```

Não há evidência de persistência pelo próprio site. Isso não elimina persistência em histórico do navegador, sincronização, logs, telemetria, cliente de e-mail, WhatsApp, dispositivo da destinatária ou backups dos provedores.

### 3.4 Registro resumido de tratamento

As bases legais abaixo são **hipóteses prováveis**, não conclusões jurídicas.

| Origem | Dado | Destino | Finalidade | Base legal provável | Retenção conhecida | Risco | Controle recomendado |
|---|---|---|---|---|---|---|---|
| Navegação | IP, user-agent, horário, URL | hospedagem | entregar/proteger o site | legítimo interesse/segurança, a validar | desconhecida | logs excessivos | retenção curta, acesso restrito, contrato e transparência |
| Página | IP, user-agent, referrer e dados técnicos | Google Fonts | tipografia | necessidade/legítimo interesse é questionável; validar | desconhecida | terceiro desnecessário | auto-hospedar fontes |
| Página/mapa | IP, user-agent, referrer, possível conta/cookies | Google Maps | mostrar localização | legítimo interesse/consentimento, a validar | política do Google | carregamento antes de escolha | mapa “clique para carregar” ou apenas link |
| Formulário | nome e telefone | URL `wa.me`, WhatsApp e consultório | contato/agendamento | procedimentos preliminares a pedido do titular (LGPD art. 7º, V), a validar | desconhecida | dado na URL; duplicidade | CTA genérico, sem campos na URL |
| Formulário | e-mail opcional | mesmos destinos | contato alternativo | mesma hipótese, necessidade não demonstrada | desconhecida | coleta excessiva | remover se não necessário |
| Formulário | tipo/mensagem, possivelmente saúde | URL `wa.me`, WhatsApp e consultório | triagem/agendamento | LGPD art. 11 exige hipótese específica; tutela da saúde pode depender do contexto e do agente; validar juridicamente | desconhecida | dado sensível em canal/URL | não solicitar detalhe clínico; canal clínico apropriado |
| Fallback | todos os campos | URI `mailto` e cliente de e-mail | contato | mesmas hipóteses, a validar | provedor/cliente desconhecidos | URI, rascunho, logs locais | mensagem genérica e instrução para não incluir saúde |
| Google Reviews | nome abreviado, opinião e contexto de gestação/saúde | público do site | reputação/publicidade | legítimo interesse/autorização, a validar | indefinida | reidentificação e ética médica | prova de autorização/base, inventário e retirada |
| Imagens | imagem da médica/consultório | público do site | apresentação profissional | autorização/execução contratual, a validar | indefinida | uso sem governança | termo de uso, origem, prazo e processo de retirada |

### 3.5 Terceiros, conteúdo e artefatos públicos

- `index.html:31-36`: Google Fonts remoto.
- `Location.jsx:54-62`: iframe do Google Maps.
- `Contact.jsx:93-101`: WhatsApp/`mailto` com dados do formulário.
- `Contact.jsx:154-162`: Instagram.
- `Testimonials.jsx:72-83` e `site.js:122-283`: links e transcrições de avaliações do Google.
- `public/robots.txt` e `public/sitemap.xml`: indexação pública intencional.
- `_to_delete/reactbits-project.zip`: cópia antiga de código. Não entra no build Vite atual, mas aumenta a superfície caso o diretório inteiro seja publicado ou compartilhado.

### 3.6 Dependências e supply chain

- Lockfile v3 com 114 entradas (incluindo raiz); todas as entradas resolvidas usam `https://registry.npmjs.org/` e todas possuem `integrity`.
- `npm audit --json`, consultado em 23/09/2026: 0 vulnerabilidades info/low/moderate/high/critical; 113 dependências contabilizadas.
- `npm ls --all --omit=optional`: árvore resolvida sem dependência obrigatória ausente. Ausências exibidas são peers/artefatos opcionais de outras plataformas.
- Único pacote com `hasInstallScript` no lockfile: `fsevents`, opcional e específico de macOS.
- `ogl` consta como dependência direta (`package.json:18`) mas não há import encontrado em `src/`; confirmar e remover se realmente não usado.
- Os intervalos `^` em `package.json:13-30` não tornam o build não determinístico quando se usa `npm ci` com o lockfile, mas `npm install` pode atualizar o lockfile.

### 3.7 Segredos, dados e bundle

- Busca por padrões de chaves privadas, tokens comuns, API keys e senhas: nenhum resultado em fontes, documentos e conteúdo textual do ZIP legado.
- Nenhum `.env`, `.pem`, `.key`, credential ou backup sensível identificado por nome.
- Telefone e e-mail aparecem no bundle, mas são contatos deliberadamente públicos; não devem ser tratados como segredos.
- Não há sourcemaps no `dist/`.
- O bundle contém os textos, depoimentos e contatos configurados, como esperado para um frontend estático.
- Inspeção dirigida de EXIF não encontrou GPS, fabricante/modelo, software ou autor nas imagens examinadas; outros metadados genéricos/perfis de cor podem existir.

## 4. Achados priorizados

### F-01 — Dados pessoais e potencialmente sensíveis são colocados na URL do WhatsApp

- **Classificação:** `CONFIRMADO`
- **Tipo:** risco de privacidade; desenho inseguro
- **Severidade:** **ALTA**
- **Probabilidade:** alta
- **Evidência:** `src/components/sections/Contact.jsx:76-101`; o texto reúne nome, telefone, e-mail, tipo de consulta e mensagem e usa `window.open(...?text=${encodeURIComponent(text)})`.
- **Cenário:** a paciente descreve gravidez, sintoma, diagnóstico ou vida sexual. Antes mesmo de pressionar “enviar” no WhatsApp, o texto integra a URL solicitada ao domínio `wa.me`. A URL pode ser observada pelo provedor, histórico/sincronização, logs, telemetria, captura de tela, software de segurança e dispositivo. Quais desses sistemas efetivamente retêm o conteúdo é `NÃO VERIFICÁVEL NO REPOSITÓRIO`.
- **Impacto:** exposição de dado pessoal e, possivelmente, dado sensível de saúde; quebra de minimização; incidente de privacidade.
- **Controle existente:** `encodeURIComponent` impede quebra sintática da URL, mas **não protege confidencialidade**.
- **Correção concreta:** remover todos os dados preenchidos do link. Usar CTA com mensagem fixa e não sensível, por exemplo “Olá, gostaria de informações para agendar uma consulta”. A paciente informa somente o mínimo dentro do aplicativo. Para evolução futura com formulário real, ver seção 11.
- **Teste:** submeter valores-canário e confirmar que nenhum deles aparece na barra de endereço, histórico, logs de navegação ou requisição a terceiros.

### F-02 — O formulário induz conteúdo clínico e coleta campos acima do mínimo necessário

- **Classificação:** `CONFIRMADO`
- **Tipo:** risco de privacidade; problema de conformidade
- **Severidade:** **ALTA** em conjunto com F-01
- **Probabilidade:** alta
- **Evidência:** `Contact.jsx:34`, `79`, `86-91`, `199-235`; o placeholder pede “motivo da consulta ou suas dúvidas”. `PrivacyNotice.jsx:29-31` afirma que informações de saúde não são solicitadas, mas a interface abre espaço e incentiva o motivo.
- **Cenário:** a pessoa descreve condição clínica porque isso parece necessário ao agendamento.
- **Impacto:** coleta espontânea previsível de dado sensível sem necessidade demonstrada; maior dano em caso de vazamento.
- **Correção concreta:** eliminar a mensagem livre e, preferencialmente, o formulário inteiro em favor de CTA genérico. Se mantido, tornar o assunto estritamente administrativo, limitar opções, exibir aviso junto ao campo e não transmitir conteúdo por URL. Questionar a necessidade de pedir telefone (o WhatsApp já identifica a conta) e e-mail.

### F-03 — Aviso de privacidade incompleto para o tratamento efetivo

- **Classificação:** `CONFIRMADO`
- **Tipo:** problema de conformidade; risco de transparência
- **Severidade:** **ALTA**
- **Probabilidade:** alta
- **Evidência:** `PrivacyNotice.jsx:13-37` descreve basicamente o formulário e afirma finalidade exclusiva; não informa bases legais, retenção, direitos/canal de exercício, hospedagem, Google Fonts, Google Maps, papéis de WhatsApp/e-mail, transferências ou critérios de descarte.
- **Cenário:** titular não consegue compreender quem trata quais dados, por quanto tempo, com quem, nem como exercer direitos.
- **Impacto:** expectativa enganosa/incompleta; dificuldade de governança e atendimento ao titular.
- **Correção concreta:** publicar aviso completo, claro e versionado, validado juridicamente. Identificar controlador e contato; categorias e fontes; finalidades e bases; terceiros; possível tratamento internacional; retenção; segurança; direitos; canal; atualização. Não prometer ausência de compartilhamento quando serviços externos participam do fluxo.

### F-04 — Google Maps e Google Fonts recebem requisições antes de escolha específica

- **Classificação:** `CONFIRMADO` quanto às requisições; `INFERIDO` quanto a retenção e correlação pelo terceiro
- **Tipo:** risco de privacidade; dependência externa
- **Severidade:** **MÉDIA**
- **Probabilidade:** alta para transmissão técnica
- **Evidência:** `index.html:31-36`; `Location.jsx:12-17`, `54-62`. A política do iframe é `no-referrer-when-downgrade`, que permite referrer em HTTPS→HTTPS.
- **Cenário:** a visita carrega recursos Google, revelando pelo menos IP e características da requisição; conta/cookies e retenção dependem do navegador/provedor.
- **Impacto:** tratamento por terceiro não descrito; superfície de indisponibilidade e privacidade.
- **Correção concreta:** auto-hospedar as fontes; substituir o iframe por imagem/endereço e botão “Carregar mapa” ou somente link. Se o iframe permanecer, usar `referrerPolicy="no-referrer"`, política CSP restrita e aviso transparente; avaliar juridicamente se há necessidade de consentimento.

### F-05 — Domínio fictício permanece em metadados públicos

- **Classificação:** `CONFIRMADO`
- **Tipo:** pendência operacional; phishing/SEO
- **Severidade:** **ALTA antes da publicação**
- **Probabilidade:** certa se o build atual for publicado
- **Evidência:** `index.html:14`, `24-25`; `public/robots.txt:4-5`; `public/sitemap.xml:4-5`; mesmos valores no `dist/`.
- **Cenário:** buscadores e compartilhamentos apontam para domínio não controlado. Se esse domínio for registrado/assumido por terceiro, pode hospedar clone ou fraude associada à marca.
- **Impacto:** desvio de tráfego, dano reputacional e phishing.
- **Correção concreta:** adquirir/confirmar domínio, substituir todas as ocorrências, validar canonical/OG/sitemap após o deploy e impedir release em CI quando `DOMINIO-PENDENTE` existir.

### F-06 — Headers, HTTPS, DNS e segurança de hospedagem não estão definidos no repositório

- **Classificação:** `NÃO VERIFICÁVEL NO REPOSITÓRIO`
- **Tipo:** pendência operacional; hardening
- **Severidade:** **ALTA como gate de produção**, não uma vulnerabilidade confirmada
- **Probabilidade:** desconhecida
- **Evidência:** `vite.config.js:7-14` trata apenas plugins e alias; não há arquivo de Netlify, Vercel, Cloudflare, servidor ou IaC.
- **Cenário:** se o provedor servir sem redirecionar HTTP, HSTS, CSP ou proteção de framing, o site fica mais exposto a downgrade, injeção em caso de comprometimento de conteúdo e clickjacking.
- **Correção concreta:** configurar no host e verificar externamente: HTTPS + redirect, HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`, cache seguro e remoção de headers de tecnologia. Política proposta na seção 8.

### F-07 — Depoimentos públicos não demonstram autorização/governança e são republicados sistematicamente

- **Classificação:** `CONFIRMADO` quanto à republicação; `NÃO VERIFICÁVEL NO REPOSITÓRIO` quanto à autorização
- **Tipo:** problema de conformidade/ética; risco de privacidade
- **Severidade:** **MÉDIA**
- **Probabilidade:** média
- **Evidência:** `site.js:112-283` contém nomes abreviados, relatos e links; `Testimonials.jsx:58-83`, `120-123` republica o conteúdo. Alguns textos revelam gestação/atendimento, o que pode facilitar reidentificação pelo link original.
- **Cenário:** pessoa retira a avaliação, contesta republicação ou é reidentificada. A Resolução CFM nº 2.336/2023 considera compartilhamentos de terceiros/pacientes como publicação do médico e prevê atenção a elogios reiterados/sistemáticos.
- **Impacto:** reclamação de titular, dever de retirada, risco ético/reputacional.
- **Correção concreta:** inventário com fonte, data, base/autorização, versão e prazo; processo de retirada; validar a apresentação com jurídico e CRM/Codame. Não presumir que “público no Google” equivale a autorização irrestrita para republicação.

### F-08 — Sem limites de tamanho e normalização nos campos

- **Classificação:** `CONFIRMADO`
- **Tipo:** hardening; disponibilidade/privacidade
- **Severidade:** **BAIXA** isoladamente
- **Probabilidade:** média
- **Evidência:** `Contact.jsx:38-46`, `229-239`, `295-310`; só há presença e regex simples de e-mail, sem `maxLength`, normalização ou formato de telefone.
- **Cenário:** texto muito longo gera URL enorme, falha do navegador/WhatsApp, mais exposição em histórico e falso estado de sucesso.
- **Impacto:** quebra funcional, experiência ruim e ampliação de dados transmitidos.
- **Correção concreta:** a correção principal é remover dados da URL. Se campos administrativos permanecerem, impor limites explícitos e mensagens de erro; validação client-side é apenas UX, nunca barreira de segurança.

### F-09 — Estado de sucesso não confirma que o canal foi aberto

- **Classificação:** `CONFIRMADO`
- **Tipo:** confiabilidade; condição excepcional
- **Severidade:** **BAIXA**
- **Probabilidade:** média
- **Evidência:** `Contact.jsx:93-103` ignora o retorno de `window.open` e limpa o formulário mesmo se popup for bloqueado.
- **Cenário:** `window.open` retorna `null`; a tela exibe sucesso e apaga dados.
- **Impacto:** contato perdido; paciente pode acreditar que houve encaminhamento.
- **Correção concreta:** testar o retorno, manter dados até ação confirmada e exibir link manual. Ao adotar CTA direto sem formulário, o problema desaparece.

### F-10 — Arquivo ZIP legado amplia risco de publicação acidental

- **Classificação:** `CONFIRMADO`
- **Tipo:** pendência operacional
- **Severidade:** **BAIXA**
- **Probabilidade:** baixa no fluxo Vite; maior se a raiz for publicada
- **Evidência:** `_to_delete/reactbits-project.zip`; o build Vite não o copia para `dist/`.
- **Cenário:** upload da pasta inteira ou compartilhamento do repositório expõe código antigo e arquivos obsoletos.
- **Impacto:** confusão de versão e exposição desnecessária.
- **Correção concreta:** excluir de forma controlada após confirmar que não é necessário e garantir que somente `dist/` seja publicado.

### F-11 — Dependência direta aparentemente não utilizada

- **Classificação:** `INFERIDO`
- **Tipo:** hardening de supply chain
- **Severidade:** **BAIXA**
- **Probabilidade:** alta de estar sem uso; risco de comprometimento é baixo e não específico
- **Evidência:** `package.json:18` declara `ogl`; nenhuma importação foi encontrada em `src/`.
- **Impacto:** superfície de atualização e revisão desnecessária.
- **Correção concreta:** confirmar com build/testes e remover em mudança separada. Manter `package-lock.json`, usar `npm ci`, auditoria contínua e atualização revisada.

### F-12 — Forma de identificação profissional deve ser validada contra a norma do CFM

- **Classificação:** `CONFIRMADO` quanto ao texto exibido; `NÃO VERIFICÁVEL NO REPOSITÓRIO` quanto à suficiência ética no caso concreto
- **Tipo:** problema de conformidade/ética
- **Severidade:** **MÉDIA antes da publicação**
- **Probabilidade:** média
- **Evidência:** o site mostra nome, `CRM MG 62187` e `RQE 41596` (`site.js:8-16`; `Hero.jsx:34-46`; `Footer.jsx:14-19`), mas a apresentação junto ao registro não usa de modo claro a palavra “MÉDICO”, exigida pelo art. 4º da Resolução CFM nº 2.336/2023. O projeto também precisa confirmar se “Ginecologia e Obstetrícia” e o RQE estão grafados exatamente como registrados.
- **Impacto:** questionamento ético/regulatório da peça publicitária.
- **Correção concreta:** submeter a identificação principal e o rodapé à revisão da médica e, se necessário, CRM/Codame; ajustar para a forma literal aprovada, sem esconder as informações em modal ou página secundária.

## 5. Controles positivos confirmados

- **XSS:** React renderiza os textos por interpolação e faz escaping; não há `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` ou HTML construído pela aplicação.
- **URLs atuais:** destinos vêm de configuração estática, não de entrada do visitante; parâmetros dinâmicos são codificados com `encodeURIComponent`.
- **Reverse tabnabbing:** todos os links encontrados com `target="_blank"` usam `rel="noopener noreferrer"` (`Contact.jsx:129-132`, `155-158`; `Location.jsx:64-67`; `Testimonials.jsx:73-76`; `WhatsAppCTA.jsx:42-46`). `window.open` usa features `noopener,noreferrer` (`Contact.jsx:93-97`).
- **Sem persistência local:** não há cookies próprios, `localStorage` ou `sessionStorage` no código.
- **Sem envio silencioso:** o formulário apenas abre WhatsApp/e-mail; o usuário ainda finaliza o envio.
- **Supply chain:** lockfile com integridade e `npm audit` limpo na data consultada.
- **Build:** produção gerada com sucesso; assets com hash; nenhum sourcemap.
- **Segredos:** nenhuma credencial detectada no material disponível.

Esses controles reduzem risco, mas não compensam F-01/F-02: codificação de URL não é criptografia nem minimização.

## 6. Modelo de ameaças específico

| Ameaça | Ativo/agente | Pré-condição e caminho | Impacto | Controles existentes | Controles ausentes / decisão |
|---|---|---|---|---|---|
| XSS refletido | visitante; atacante por link | fonte de URL teria de chegar ao DOM como HTML | sessão/conteúdo | não há leitura de query/hash; React escapa | CSP de produção não verificada; risco atual baixo |
| XSS armazenado | conteúdo/visitante | exigiria backend/CMS ou config comprometida | execução no navegador | `NÃO APLICÁVEL` no frontend atual; sem backend | sanitização/validação será necessária se CMS surgir |
| DOM XSS | visitante | entrada DOM em sink perigoso | execução | nenhum sink da aplicação encontrado | CSP como defesa em profundidade |
| Injeção em URL/atributo | visitante ou editor futuro | controlar `site.js`/CMS | phishing, `javascript:` | hoje config é estática; parâmetros codificados | allowlist `https:`/hosts se conteúdo se tornar editável |
| Reverse tabnabbing | site externo | abrir nova aba com `opener` | troca da aba original | `noopener noreferrer` em todos os casos | manter teste automatizado |
| Dados na URL do WhatsApp | paciente, extensões, provedores | preencher mensagem e submeter | vazamento de PII/saúde | encoding apenas | remover PII da URL; F-01 |
| Dados no `mailto` | paciente, cliente/provedor de e-mail | fallback acionado | rascunho/log/sincronização | encoding apenas | corpo genérico e sem saúde |
| Referrer | Google/terceiro | carregar iframe/link | divulgação de URL origem | links externos usam `noreferrer`; padrão moderno limita parte | iframe usa política permissiva; header global não verificado |
| Phishing/clone | fraudador | copiar site/domínio parecido | fraude e dano reputacional | CRM/RQE, links oficiais | domínio pendente; monitoramento e comunicação oficial |
| Troca do número WhatsApp | invasor/insider | comprometer repo/deploy/conta | desvio de pacientes | configuração central única | revisão de release, MFA, proteção de branch e integridade não verificáveis |
| Domínio/DNS/host comprometido | atacante de conta | credencial ou recuperação fraca | controle total do site | não verificável | MFA/passkeys, registrar lock, menor privilégio, logs, DNSSEC/CAA avaliados |
| HTTP/TLS/HSTS incorreto | rede/host | produção sem HTTPS estrito | interceptação/downgrade | URLs externas usam HTTPS | host e headers não verificáveis |
| CSP ausente/incorreta | atacante após injeção/compromisso | conteúdo injetável | amplia XSS/exfiltração | React reduz sinks | definir CSP; lidar com JSON-LD e estilos inline |
| Clickjacking | site malicioso | site permite framing | indução a clicar em contato | nenhum controle no código | `frame-ancestors 'none'` e `X-Frame-Options: DENY` no host |
| MIME sniffing | navegador/host | MIME errado e sem header | interpretação perigosa | Vite gera tipos usuais | `nosniff` e Content-Type corretos no host |
| Permissões do navegador | script injetado | política permissiva | câmera/mic/geolocalização | site não usa APIs | `Permissions-Policy` negando recursos |
| Google Maps/Fonts | terceiro/conta Google | carregamento da página/mapa | metadados, disponibilidade | mapa lazy; fontes sem JS terceiro | auto-hospedar fontes, click-to-load map, transparência |
| Supply-chain | pacote/registry/maintainer | update malicioso ou CI insegura | código no build/visitante | lock + integrity + audit limpo | `npm ci`, atualização revisada, CI, SBOM; remover dependência sem uso |
| Typosquatting | desenvolvedor | adicionar pacote errado | compromisso de build | nomes atuais conhecidos e lockados | revisão obrigatória de novas deps |
| Fonte/sourcemap/backup exposto | host | publicar raiz em vez de `dist` | código/artefatos antigos | `dist` sem maps; Vite exclui ZIP | publicar só `dist`, negar dotfiles/backups, remover ZIP |
| Coleta excessiva | própria interface | campo livre + múltiplos contatos | PII/saúde desnecessária | aviso resumido | reduzir ao CTA administrativo genérico |
| Spam/automação | bot | colher número público/abrir CTA | mensagens indesejadas | não há endpoint que envie automaticamente | controles no WhatsApp; CAPTCHA/WAF desproporcionais agora |
| Depoimentos/imagens sem autorização | titular/reclamante | ausência de prova/processo | privacidade/ética | nomes abreviados e links de origem | inventário, base/autorização, retirada e validação CFM |
| Cache incorreto/versão antiga | CDN/browser | cachear `index.html` por longo prazo | conteúdo/contato desatualizado | assets têm hash | `index.html` revalidado; assets imutáveis; purge controlado |
| Indisponibilidade | provedor/terceiro | falha host/Google/WhatsApp | site/contato indisponível | site estático e fallback e-mail | uptime, status, recuperação e contatos alternativos não verificáveis |

## 7. OWASP Top 10 / ASVS — aplicabilidade

Referência consultada em 23/09/2026: OWASP Top 10:2025 e OWASP ASVS 5.0.0.

| Área | Situação |
|---|---|
| A01 Broken Access Control | `NÃO APLICÁVEL` agora: não há área restrita, API ou autenticação. Reavaliar ao adicionar qualquer recurso privado. |
| A02 Security Misconfiguration | `NÃO VERIFICÁVEL` no host; domínio pendente e headers são os principais gates. |
| A03 Software Supply Chain Failures | controle parcial bom: lock/integrity/audit; faltam CI e governança verificáveis. |
| A04 Cryptographic Failures | TLS/contas não verificáveis; o site não cifra PII porque a coloca em URL de terceiro. |
| A05 Injection | nenhum caminho explorável confirmado no código atual. |
| A06 Insecure Design | F-01/F-02 são o principal problema: dado potencialmente sensível em URL. |
| A07 Authentication Failures | `NÃO APLICÁVEL` ao produto; aplicável às contas de domínio/host/WhatsApp fora do repo. |
| A08 Software/Data Integrity Failures | lockfile ajuda; pipeline e proteção de branch não verificáveis. |
| A09 Logging & Alerting Failures | não há backend; logs de host e alertas operacionais não verificáveis. |
| A10 Mishandling of Exceptional Conditions | `window.open` bloqueado gera falso sucesso; baixo impacto. |

Para este site, o subconjunto proporcional do ASVS 5.0.0 é: V1 (encoding/sanitização), V2 (validação e anti-automação), V3 (frontend/headers/origens/recursos externos), V12 (TLS), V13 (configuração e vazamento), V14 (proteção de dados) e V15.2 (dependências). Autenticação, sessão, API, upload e criptografia de aplicação são `NÃO APLICÁVEL` no estado atual.

## 8. Plano de hardening

### P0 — obrigatório antes de publicar

| ID | Ação | Dono sugerido | Evidência de conclusão |
|---|---|---|---|
| P0-01 | Substituir o formulário por CTA WhatsApp com texto fixo e não sensível; não incluir campos do usuário na URL | frontend/produto | teste-canário sem PII em URL/requisições |
| P0-02 | Reescrever o aviso de privacidade e validar bases, papéis, retenção e canal de direitos | controlador + jurídico/DPO | versão aprovada, publicada e datada |
| P0-03 | Definir domínio real e substituir canonical, OG, robots e sitemap | operação/SEO | busca por `DOMINIO-PENDENTE` retorna zero; URLs 200 |
| P0-04 | Auto-hospedar fontes e transformar o mapa em click-to-load ou link | frontend/privacidade | carga inicial sem requests Google, salvo decisão documentada |
| P0-05 | Configurar HTTPS, redirect e headers no provedor | operação | `curl -I`/scanner externo aprovado |
| P0-06 | Validar depoimentos/imagens com jurídico e CRM/Codame; registrar autorização/base e retirada | médica/controlador | inventário e aprovações documentadas |
| P0-07 | Proteger registrador, DNS, hospedagem, repositório e WhatsApp com MFA/passkeys e menor privilégio | operação | checklist assinado e recuperação testada |

### Política de headers inicial

Aplicar como **header HTTP**, primeiro em `Content-Security-Policy-Report-Only`, ajustar e depois impor. A política final depende de auto-hospedar fontes, remover estilos inline ou permitir `style-src-attr` de forma consciente, e aplicar hash/nonce ao JSON-LD inline de `index.html:38-58`.

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Content-Security-Policy: default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'none'; script-src 'self' 'sha256-<HASH-DO-JSON-LD>'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src https://www.google.com; connect-src 'self'; upgrade-insecure-requests
```

Notas:

- Só usar `includeSubDomains` após confirmar HTTPS em todos os subdomínios. Avaliar `preload` depois, pois a reversão é lenta.
- Se o mapa for removido, eliminar `frame-src`.
- O objetivo posterior deve ser remover estilos inline e então retirar `style-src-attr 'unsafe-inline'`.
- Não habilitar COEP/COOP/CORP às cegas; testar compatibilidade com WhatsApp, mapa e assets.

### Cache recomendado

```text
/index.html            Cache-Control: no-cache
/assets/* com hash     Cache-Control: public, max-age=31536000, immutable
/robots.txt, sitemap   Cache-Control: public, max-age curto + revalidação
```

### P1 — primeira iteração após o gate

1. CI com `npm ci`, `npm run lint`, `npm run build`, `npm audit --audit-level=high`, busca de segredos e bloqueio de sourcemaps/placeholder.
2. Remover `ogl` se confirmado sem uso e revisar qualquer nova dependência direta.
3. Adicionar testes de todas as URLs externas: somente `https:`, hosts esperados e `noopener noreferrer`.
4. Publicar apenas `dist/`; remover o ZIP legado após confirmação.
5. Definir política de atualização mensal e resposta emergencial a advisories.
6. Monitorar expiração de domínio/certificado, alteração de DNS e disponibilidade.
7. Manter `index.html` revalidável e purge atômico para evitar versão mista.

### P2 — governança contínua

1. Registro simplificado das operações de tratamento, fornecedores, retenções e responsáveis.
2. Procedimento de atendimento ao titular e retirada de depoimento/imagem.
3. Plano de incidente proporcional, incluindo contatos e avaliação de comunicação à ANPD/titulares.
4. Revisão trimestral de conteúdo, número do WhatsApp, e-mail, CRM/RQE, links e terceiros.
5. Inventário/SBOM e revisão anual do modelo de ameaças.

## 9. Verificação antes e depois do deploy

### Gate local reproduzível

```powershell
npm ci
npm run lint
npm run build
npm audit --audit-level=high
rg -n "DOMINIO-PENDENTE|dangerouslySetInnerHTML|eval\\s*\\(|new Function" src public index.html dist
Get-ChildItem -Recurse -File dist -Filter "*.map"
```

Resultados desta auditoria:

- lint: concluído com 1 aviso de Fast Refresh em `Button.jsx:4`, sem relação com segurança;
- build Vite 8.2.2: concluído;
- audit: zero vulnerabilidades;
- sourcemaps: zero;
- placeholder: presente, falha esperada até P0-03.

### Pós-deploy obrigatório

1. `curl -I http://dominio` deve redirecionar permanentemente para HTTPS.
2. `curl -I https://dominio` deve exibir os headers aprovados.
3. Testar CSP em modo report-only e depois enforcing sem erros funcionais inesperados.
4. Abrir DevTools > Network em sessão limpa: confirmar terceiros esperados e ausência de PII nas URLs.
5. Submeter canários exclusivos nos campos (se ainda existirem) e pesquisar em histórico, logs e requests.
6. Testar popup bloqueado, ausência do WhatsApp, navegador móvel, cliente de e-mail e modo privado.
7. Confirmar canonical/OG/sitemap/robots apontando apenas ao domínio controlado.
8. Verificar que arquivos `.env`, `.git`, ZIPs, backups, fontes e sourcemaps não retornam 200.
9. Executar scanner de headers e TLS; guardar evidência datada.
10. Testar restauração/rollback de uma versão conhecida do `dist/`.

## 10. Itens explicitamente não aplicáveis hoje

- Supabase, RLS, Edge Functions, banco de dados, migrations e secrets de backend.
- Autenticação, autorização, sessão, recuperação de senha e MFA de usuários do site.
- CSRF contra API própria, SSRF, SQL injection, upload, desserialização e segurança de API.
- Rate limiting/WAF para endpoint de formulário, pois esse endpoint não existe.
- Criptografia de dados em repouso no site, pois o site não persiste os dados.

As contas administrativas externas (host, DNS, WhatsApp, e-mail e repositório) continuam exigindo MFA e governança, embora não façam parte do código.

## 11. Evoluções futuras — análise condicional

### Analytics/pixels

Antes de adicionar: definir finalidade e base legal, minimizar eventos, bloquear texto livre/identificadores, avaliar consentimento, contrato/transferência, retenção e opt-out. Nunca enviar assunto, mensagem, telefone, e-mail ou termos que revelem saúde. Atualizar CSP e aviso.

### Formulário com backend/agendamento

Só é justificável se houver necessidade operacional que o CTA não atende. Nesse caso:

- coletar o mínimo; separar agendamento administrativo de informação clínica;
- definir base legal por categoria, controlador/operadores e retenção antes de codificar;
- TLS, validação server-side, limites de tamanho, rate limiting e anti-automação proporcional;
- criptografia em repouso, acesso por função, MFA administrativo, trilha de auditoria sem conteúdo sensível;
- filas/e-mail sem dados clínicos em assunto/URL; segredos em cofre; backups testados;
- exclusão automática e atendimento de direitos;
- DPIA/RIPD conforme risco e orientação jurídica;
- testes ASVS aplicáveis antes da liberação.

### CMS

Tratar todo conteúdo como não confiável: esquema fechado, sanitização, allowlist de URLs/hosts, preview, aprovação, histórico, MFA, menor privilégio e atualização contínua. Não permitir HTML arbitrário.

### Área do paciente

É outro produto e outro nível de risco: autenticação forte, autorização objeto a objeto, sessão segura, segregação, logs protegidos, criptografia, testes de acesso e requisitos regulatórios. Não deve ser acrescentada como extensão casual desta SPA.

## 12. Referências vigentes consultadas em 23/09/2026

- [Lei nº 13.709/2018 — LGPD, texto compilado](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm): dado de saúde é dado pessoal sensível; princípios, bases, direitos e segurança devem ser validados no contexto real.
- [ANPD — Guia de segurança para agentes de tratamento de pequeno porte](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte): medidas proporcionais e checklist.
- [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/): versão vigente identificada na consulta.
- [OWASP ASVS 5.0.0](https://owasp.org/projects/asvs?tab=main): versão estável vigente indicada pelo projeto.
- [OWASP HTTP Security Response Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).
- [WhatsApp — Click to Chat](https://faq.whatsapp.com/5913398998672934): confirma que `?text=` contém a mensagem pré-preenchida codificada na URL.
- [Google Privacy Policy](https://policies.google.com/privacy/embedded?hl=en-GB): inclui produtos integrados em terceiros, como Google Maps, e descreve IP, referrer e dados de interação; versão indicada como efetiva em 26/05/2026.
- [Google Fonts — funcionamento técnico](https://developers.google.com/fonts/docs/technical_considerations): confirma requisição de CSS e fontes pelo navegador a serviços Google.
- [Resolução CFM nº 2.336/2023](https://sistemas.cfm.org.br/normas/visualizar/resolucoes/BR/2023/2336): publicidade médica, identificação e tratamento de publicações/depoimentos de terceiros; situação deve ser confirmada com CRM/Codame no caso concreto.

## 13. Parecer final

O site tem **baixo risco clássico de exploração de aplicação** no estado atual porque é estático, não autentica, não persiste e não processa dados no servidor. Porém, isso não o torna pronto para produção: o desenho atual transfere dados potencialmente sensíveis por URL e não oferece transparência suficiente sobre terceiros. Corrigir o fluxo para um CTA genérico, completar a governança de privacidade, resolver o domínio e provar os controles do host transforma o projeto em uma publicação proporcionalmente segura sem introduzir backend ou arquitetura excessiva.
