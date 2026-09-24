import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.SECURITY_PREVIEW_URL?.replace(/\/$/, "");
const enabled = Boolean(base);

async function request(path = "/") {
  return fetch(`${base}${path}`, { redirect: "manual" });
}

test("preview/produção envia headers defensivos", { skip: !enabled }, async () => {
  const response = await request();
  assert.equal(response.status, 200);

  const mode = process.env.SECURITY_EXPECT_CSP_MODE ?? "enforce";
  const cspHeader = mode === "report-only"
    ? "content-security-policy-report-only"
    : "content-security-policy";
  const csp = response.headers.get(cspHeader) ?? "";
  assert.match(csp, /\bdefault-src\b/);
  assert.match(csp, /\bobject-src\s+'none'/);
  assert.match(csp, /\bframe-ancestors\s+'none'/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("referrer-policy") ?? "", /no-referrer|strict-origin/);
  assert.ok(response.headers.get("permissions-policy"));
  if (base.startsWith("https://")) {
    assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=/);
  }
});

test("framing é bloqueado por CSP ou X-Frame-Options", { skip: !enabled }, async () => {
  const response = await request();
  const csp = response.headers.get("content-security-policy") ?? "";
  const xfo = response.headers.get("x-frame-options") ?? "";
  assert.ok(
    /frame-ancestors\s+'none'/.test(csp) || /^(DENY|SAMEORIGIN)$/i.test(xfo),
    "faltam frame-ancestors 'none' e X-Frame-Options",
  );
});

test("caminhos sensíveis retornam 404/410 e nunca o fallback da SPA", {
  skip: !enabled,
}, async () => {
  const paths = [
    "/.env",
    "/.env.local",
    "/.git/config",
    "/package.json",
    "/package-lock.json",
    "/vite.config.js",
    "/src/",
    "/Regras/",
    "/PENDENCIAS.md",
    "/backup.zip",
    "/index.html~",
    "/assets/app.js.map",
  ];
  for (const path of paths) {
    const response = await request(path);
    const body = await response.text();
    assert.ok([404, 410].includes(response.status), `${path} retornou ${response.status}`);
    assert.doesNotMatch(body, /<div id=["']root["']><\/div>/);
  }
});

