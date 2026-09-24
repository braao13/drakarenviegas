# Resumo de migração - site Dra. Karen Viegas

Atualizado em 24/09/2026.

## 1. Novo local do projeto

O projeto foi copiado para:

`C:\Users\abraao\Documents\GitHub\drakarenviegas`

Esse diretório contém um repositório Git válido na branch `main`, ligado a
`origin/main`. Os arquivos principais foram comparados por SHA-256 com a pasta
anterior e estavam idênticos no momento da migração.

Há uma pasta interna não rastreada chamada `drakarenviegas/` no novo
repositório. Revisar o conteúdo antes de adicioná-la ao Git; ela pode ser uma
cópia antiga ou pasta criada por engano.

## 2. Visão geral

Site institucional estático da Dra. Karen Viegas Albuquerque, ginecologista e
obstetra em Ipatinga/MG.

Tecnologias principais:

- React 19;
- Vite 8;
- Tailwind CSS 4;
- JavaScript/JSX;
- lucide-react para ícones;
- GSAP para animações;
- testes locais de segurança com Node Test Runner.

Não existe backend, banco de dados, autenticação ou formulário que armazene
dados. Os botões de agendamento abrem o WhatsApp com uma mensagem fixa.

## 3. Comandos do projeto

Instalar dependências:

```powershell
npm install
```

Executar em desenvolvimento:

```powershell
npm run dev
```

Normalmente o endereço local será `http://127.0.0.1:5173/` ou o endereço
informado pelo Vite no terminal.

Lint:

```powershell
npm run lint
```

Build de produção:

```powershell
$env:SITE_URL="https://dominio-definitivo.com.br"
npm run build
```

O `SITE_URL` é obrigatório e precisa ser substituído pelo domínio HTTPS real.
O último build de validação usou `https://preview.invalid`; não publicar esse
valor como domínio definitivo.

Testes de segurança:

```powershell
npm run test:security
```

## 4. Estrutura principal

- `src/App.jsx`: ordem das seções da página.
- `src/config/site.js`: conteúdo factual, contatos, endereço, depoimentos e
  navegação.
- `src/components/sections/`: seções do site.
- `src/components/layout/`: cabeçalho, rodapé, aviso de privacidade e botão
  flutuante de WhatsApp.
- `src/components/ui/`: componentes visuais reutilizáveis.
- `src/assets/img/`: imagens usadas pela aplicação.
- `src/assets/img/originais/`: cópias preservadas das fotos que poderão ser
  substituídas.
- `Regras/`: fontes fornecidas pelo cliente para textos, identidade visual e
  avaliações.
- `security-tests/`: testes estáticos e de segurança.
- `public/`: favicon, imagem social, sitemap e robots.
- `dist/`: build gerado; pode ser recriado e não deve ser tratado como fonte.

## 5. Ordem atual das seções

1. Hero/início;
2. Áreas de cuidado;
3. Diferenciais;
4. Localização;
5. Sobre;
6. Depoimentos;
7. Perguntas frequentes;
8. Contato;
9. Rodapé.

A navegação do cabeçalho e do rodapé acompanha essa ordem.

## 6. Alterações implementadas a partir do PDF de instruções

### Hero

- Foi incluída uma descrição curta abaixo do título principal.
- O nome completo foi removido da linha de credenciais.
- CRM, RQE e cidade passaram a aparecer juntos.
- Conteúdo atual:
  - `CRM MG 62187`;
  - `RQE 41596`;
  - `Ipatinga/MG`.

### Seção Sobre

- Foi movida para depois de Localização e antes de Depoimentos.
- A foto continua vindo de `src/assets/img/about.jpg`.

### Depoimentos

- Foi incluído o resumo `5,0 de 5 - 42 avaliações na ficha da Dra. Karen`.
- O número 42 foi obtido do arquivo fornecido `Regras/Avaliações.txt`, que
  contém 42 blocos com cinco estrelas.
- O site continua exibindo 27 depoimentos selecionados e configurados em
  `src/config/site.js`; o resumo se refere ao conjunto da ficha fornecida, não
  ao número de cards publicados.
- Cada card publicado mantém seu link individual para a avaliação no Google.

### Localização

- Os blocos de Pagamentos e Planejamento foram removidos dessa seção.
- O bloco de Acessibilidade foi mantido.
- O endereço agora é clicável e abre a busca/ficha correspondente no Google
  Maps.
- O mapa incorporado e o link `Abrir no Google Maps` continuam disponíveis.

### Contato

- O formulário não existe mais.
- O bloco de Planejamento foi removido.
- A seção foi compactada para funcionar como um pré-rodapé.
- Permanecem WhatsApp, e-mail, Instagram, endereço e aviso de privacidade.
- O site não coleta nome, telefone, e-mail, sintomas ou mensagem.

### Mobile

- Foi corrigida uma rolagem horizontal de aproximadamente 4 px causada pelo
  brilho decorativo dos cards.
- O layout foi revisado em 390 x 844 e em desktop 1440 x 900.

## 7. Imagens atuais e backups

Imagens principais:

- Hero: `src/assets/img/dra-karen.png`;
- Fundo do hero: `src/assets/img/fundo.png`;
- Segunda foto/Áreas de cuidado: `src/assets/img/care-areas.jpg`;
- Terceira foto/Sobre: `src/assets/img/about.jpg`.

As duas fotos que poderão ser substituídas foram preservadas em:

- `src/assets/img/originais/care-areas-original.jpg`;
- `src/assets/img/originais/about-original.jpg`.

Os hashes SHA-256 das cópias foram conferidos e eram idênticos aos arquivos em
uso. Para restaurar, basta copiar o arquivo `*-original.jpg` sobre o arquivo
correspondente em `src/assets/img/` e manter o nome esperado pelo componente.

## 8. Configuração central

O arquivo `src/config/site.js` é a fonte central para:

- nome, CRM, RQE, especialidade e cidade;
- texto do hero e biografia;
- endereço e consulta do Google Maps;
- WhatsApp, e-mail e Instagram;
- áreas de cuidado e diferenciais;
- depoimentos e filtros;
- resumo da ficha do Google;
- perguntas frequentes;
- links de navegação.

Evitar duplicar esses dados diretamente nos componentes. Quando um dado mudar,
preferir atualizá-lo nesse arquivo.

## 9. Dados atuais importantes

- WhatsApp: `https://wa.me/5531996648080`;
- e-mail: `disporpartoipatinga@gmail.com`;
- Instagram: `https://www.instagram.com/drakarenviegas/`;
- endereço: Avenida Castelo Branco, 896, sala 506 - Horto, Ipatinga/MG,
  35160-294.

## 10. Segurança e privacidade

O projeto contém controles específicos para um site médico estático:

- nenhum formulário coleta dados pessoais;
- mensagem do WhatsApp é fixa e codificada com `encodeURIComponent`;
- links que abrem nova aba usam `noopener noreferrer`;
- hosts externos são validados nos testes;
- não são usados `dangerouslySetInnerHTML`, `eval` ou `new Function`;
- configuração de headers de produção está em `vite.config.js` e na
  documentação de produção;
- mapa, Google Fonts, Instagram, WhatsApp e avaliações são serviços externos e
  estão descritos nos documentos de auditoria.

Na última validação:

- lint passou sem erros; permaneceu somente um aviso preexistente de Fast
  Refresh em `src/components/ui/Button.jsx`;
- build de produção passou;
- 7 de 7 testes de segurança passaram;
- revisão visual desktop e mobile passou;
- não havia rolagem horizontal no mobile após a correção.

## 11. Pendências e cuidados

1. Definir o domínio HTTPS definitivo e atualizar o ambiente de build.
2. Recriar o build com `SITE_URL` real antes de publicar.
3. Decidir as novas fotos de Áreas de cuidado e Sobre; os originais estão
   preservados.
4. Atualizar manualmente `googleReviewSummary` quando a ficha mudar.
5. Manter os depoimentos estáticos; a integração ao vivo com Google Places foi
   descartada por decisão anterior.
6. Revisar a pasta interna não rastreada `drakarenviegas/` no novo repositório.
7. Antes de commitar, conferir `git status` para evitar incluir `node_modules`,
   builds temporários ou cópias acidentais.

## 12. Arquivos mais relevantes para futuras alterações

- `src/App.jsx`;
- `src/config/site.js`;
- `src/components/sections/Hero.jsx`;
- `src/components/sections/Hero.css`;
- `src/components/sections/CareAreas.jsx`;
- `src/components/sections/About.jsx`;
- `src/components/sections/Testimonials.jsx`;
- `src/components/sections/Location.jsx`;
- `src/components/sections/Contact.jsx`;
- `src/components/layout/Header.jsx`;
- `src/components/layout/Footer.jsx`;
- `src/index.css`;
- `vite.config.js`;
- `PENDENCIAS.md`;
- `security-tests/red-team-static.test.mjs`.

## 13. Continuação no Codex

A tarefa anterior estava associada à pasta:

`C:\Users\abraao\Documents\Dra. Karen Viegas`

Para continuar sem editar a cópia antiga, abrir como projeto no Codex:

`C:\Users\abraao\Documents\GitHub\drakarenviegas`

Depois de abrir o novo projeto, anexar este arquivo à primeira mensagem ou
pedir ao Codex para lê-lo antes de continuar.
