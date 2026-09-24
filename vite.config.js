import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const SITE_URL_TOKEN = "__SITE_URL__";
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'sha256-gy2b6sh2LPt8K1cIivymNHONu1zK5tLqPlvQRfJu4VE='",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "frame-src https://www.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SENSITIVE_PREVIEW_PATH =
  /^\/(?:\.|src(?:\/|$)|Regras(?:\/|$)|package(?:-lock)?\.json$|vite\.config\.[cm]?js$|PENDENCIAS\.md$|.*(?:\.map|\.zip|\.bak|\.old|~)$)/i;

function resolveSiteUrl(rawValue, command) {
  if (command !== "build") return "http://localhost:5173";
  if (!rawValue) {
    throw new Error(
      "SITE_URL é obrigatória no build de produção. Informe a origem HTTPS definitiva.",
    );
  }

  let url;
  try {
    url = new URL(rawValue);
  } catch {
    throw new Error("SITE_URL precisa ser uma URL absoluta válida.");
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL deve conter somente a origem HTTPS, por exemplo https://dominio.com.br.",
    );
  }

  return url.origin;
}

function productionMetadata({ siteUrl }) {
  let outputDirectory;

  return {
    name: "production-metadata",
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return html.replaceAll(SITE_URL_TOKEN, siteUrl);
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://preview.local").pathname;
        if (SENSITIVE_PREVIEW_PATH.test(pathname)) {
          response.statusCode = 404;
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end("Not found");
          return;
        }
        next();
      });
    },
    async closeBundle() {
      for (const filename of ["robots.txt", "sitemap.xml"]) {
        const file = path.join(outputDirectory, filename);
        const source = await readFile(file, "utf8");
        const rendered = source.replaceAll(SITE_URL_TOKEN, siteUrl);
        if (rendered.includes(SITE_URL_TOKEN)) {
          throw new Error(`Token de domínio não substituído em ${filename}.`);
        }
        await writeFile(file, rendered, "utf8");
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  // Prefixo vazio carrega SITE_URL para a configuração do build, mas somente
  // variáveis VITE_* podem ser expostas ao código do navegador pelo Vite.
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = resolveSiteUrl(env.SITE_URL, command);

  return {
    plugins: [react(), tailwindcss(), productionMetadata({ siteUrl })],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    build: {
      sourcemap: false,
    },
    // Emula no preview os headers que ainda precisam ser configurados na
    // hospedagem real. Não substitui a configuração do CDN/servidor.
    preview: {
      headers: {
        "Content-Security-Policy": CSP,
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy":
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
        "X-Frame-Options": "DENY",
      },
    },
  };
});
