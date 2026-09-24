# Testes de regressão de segurança

Todos os testes são locais. Nenhum deles deve chamar WhatsApp, Meta, Instagram, Google Maps, Google Fonts ou outro terceiro.

## Executáveis sem dependência nova

```powershell
node --test security-tests/red-team-static.test.mjs
```

Falhas esperadas enquanto o domínio e o artefato final não forem definidos:

- `DOMINIO-PENDENTE` ainda existe no build;
- o CSS de `dist/` diverge do build limpo.

Para pular apenas a comparação de build durante uma triagem rápida:

```powershell
$env:SKIP_SECURITY_BUILD='1'
node --test security-tests/red-team-static.test.mjs
Remove-Item Env:SKIP_SECURITY_BUILD
```

## Testes de componente propostos

O projeto ainda não possui framework de testes. Dependências mínimas, a instalar deliberadamente em uma etapa de correção:

```powershell
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom
npx vitest run security-tests/Contact.security.test.jsx --environment jsdom
```

Esses testes verificam que o site não contém formulário, que a URL usa apenas a mensagem fixa e que o CTA explica não haver envio automático.

O build exige o domínio definitivo:

```powershell
$env:SITE_URL='https://DOMINIO-DEFINITIVO'
npm run build
Remove-Item Env:SITE_URL
```

O valor deve ser substituído pelo domínio HTTPS real; o exemplo acima não é um valor de produção.

## Headers, CSP, framing e arquivos públicos

Inicie somente um preview/local ou informe uma homologação expressamente autorizada:

```powershell
$env:SECURITY_PREVIEW_URL='http://127.0.0.1:4180'
$env:SECURITY_EXPECT_CSP_MODE='report-only' # primeira etapa
node --test security-tests/preview-security.test.mjs

$env:SECURITY_EXPECT_CSP_MODE='enforce' # etapa final
node --test security-tests/preview-security.test.mjs
```

O preview padrão do Vite falha hoje nos headers, framing e 404 reais. A produção deve passar após a configuração da hospedagem.

## Política de dependências

No CI/release, com acesso aprovado ao registry:

```powershell
npm ci
npm audit --audit-level=high
```

Política proposta: bloquear release em vulnerabilidade `high` ou `critical`; registrar e revisar `moderate`; não atualizar dependências automaticamente durante a auditoria.
