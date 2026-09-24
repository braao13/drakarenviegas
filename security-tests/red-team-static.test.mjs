import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function read(relative) {
  return readFileSync(path.join(root, relative), "utf8");
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function referencedAsset(indexHtml, extension) {
  const match = indexHtml.match(new RegExp(`["']/?([^"']+\\.${extension})["']`));
  assert.ok(match, `index.html precisa referenciar um asset .${extension}`);
  return match[1];
}

test("o build não contém o marcador de domínio pendente", () => {
  const matches = walk(dist)
    .filter((file) => /\.(?:html|xml|txt|js|css|json)$/i.test(file))
    .filter((file) => readFileSync(file, "utf8").includes("DOMINIO-PENDENTE"));
  assert.deepEqual(matches, [], `marcador encontrado em: ${matches.join(", ")}`);
});

test("dist não contém sourcemaps, backups ou arquivos operacionais", () => {
  const forbidden = walk(dist).filter((file) =>
    /(?:\.map|\.zip|\.bak|\.old|~|\.env(?:\..*)?|package(?:-lock)?\.json|vite\.config\.[cm]?js)$/i.test(
      path.basename(file),
    ),
  );
  assert.deepEqual(forbidden, [], `artefatos proibidos: ${forbidden.join(", ")}`);
});

test("fonte não introduz sinks executáveis perigosos", () => {
  const source = walk(path.join(root, "src"))
    .filter((file) => /\.[jt]sx?$/.test(file))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  assert.doesNotMatch(
    source,
    /dangerouslySetInnerHTML|\.innerHTML\s*=|\beval\s*\(|new\s+Function\s*\(/,
  );
});

test("contato não contém formulário nem interpola dados pessoais na URL", () => {
  const contact = read("src/components/sections/Contact.jsx");
  assert.doesNotMatch(contact, /<form\b|<input\b|<textarea\b|window\.open\s*\(/);
  assert.doesNotMatch(contact, /form\.(?:name|phone|email|message|subject)/);
  assert.match(contact, /encodeURIComponent\(contact\.whatsappMessage\)/);
});

test("todo link target=_blank tem noopener e noreferrer", () => {
  const files = walk(path.join(root, "src")).filter((file) => /\.jsx$/.test(file));
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const tags = source.match(/<(?:a|Button)\b[^>]*target=["']_blank["'][^>]*>/gs) ?? [];
    for (const tag of tags) {
      assert.match(tag, /rel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/);
    }
  }

});

test("canais configurados usam HTTPS e hosts em allowlist", () => {
  const config = read("src/config/site.js");
  const urls = [...config.matchAll(/https:\/\/[^"'\s`]+/g)].map((match) => match[0]);
  const allowed = new Set([
    "wa.me",
    "www.instagram.com",
    "www.google.com",
    "maps.app.goo.gl",
  ]);
  assert.ok(urls.length > 0, "nenhuma URL de canal encontrada");
  for (const raw of urls) {
    const url = new URL(raw);
    assert.equal(url.protocol, "https:");
    assert.ok(allowed.has(url.hostname), `host não aprovado: ${url.hostname}`);
  }

  const whatsapp = new URL(config.match(/https:\/\/wa\.me\/\d+/)?.[0] ?? "");
  assert.equal(whatsapp.hostname, "wa.me");
  assert.equal(whatsapp.pathname, "/5531996648080");
});

test("um build limpo corresponde ao JS e CSS referenciados por dist", {
  skip: process.env.SKIP_SECURITY_BUILD === "1",
}, () => {
  const temp = mkdtempSync(path.join(tmpdir(), "dra-karen-security-build-"));
  try {
    const vite = path.join(root, "node_modules", "vite", "bin", "vite.js");
    assert.ok(existsSync(vite), "Vite local não encontrado; execute a instalação pelo lockfile");
    const result = spawnSync(process.execPath, [vite, "build", "--outDir", temp], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, SITE_URL: "https://security-test.invalid" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

    for (const relative of ["index.html", "robots.txt", "sitemap.xml"]) {
      const rendered = readFileSync(path.join(temp, relative), "utf8");
      assert.doesNotMatch(rendered, /DOMINIO-PENDENTE|__SITE_URL__/);
      assert.match(rendered, /https:\/\/security-test\.invalid/);
    }

    const currentIndex = readFileSync(path.join(dist, "index.html"), "utf8");
    const freshIndex = readFileSync(path.join(temp, "index.html"), "utf8");
    for (const extension of ["js", "css"]) {
      const currentAsset = path.join(dist, referencedAsset(currentIndex, extension));
      const freshAsset = path.join(temp, referencedAsset(freshIndex, extension));
      assert.equal(
        sha256(currentAsset),
        sha256(freshAsset),
        `conteúdo .${extension} de dist diverge do build limpo`,
      );
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
