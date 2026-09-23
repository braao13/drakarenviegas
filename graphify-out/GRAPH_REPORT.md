# Graph Report - Dra. Karen Viegas  (2026-09-23)

## Corpus Check
- 59 files · ~217,439 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 6, (none) 1, .zip 1)

## Summary
- 307 nodes · 456 edges · 38 communities (30 shown, 8 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.84)
- Token cost: 17,832 input · 0 output

## Community Hubs (Navigation)
- App and Visual Assets
- UI Layout Components
- Toolchain Scripts
- UI Registry Configuration
- Runtime Dependencies
- Border Glow Animation
- Brand Color Meaning
- Brand Typography
- Medical Brand Assets
- Medical SEO Schema
- Lint Configuration
- Congress Portrait
- Branded Professional Portrait
- About Portrait
- Warm Professional Portrait
- Clinic Interior
- Production Domain Readiness
- Patient Testimonials
- Security Audit Controls
- Brand Icon Palette
- Care Area Photography
- Primary Brand Identity
- Light Logo Variant
- Logo Variant
- Care Areas Image
- Logo Asset
- Path Aliases
- WhatsApp Privacy Risk
- Production Review Scope
- React Vite Configuration
- Red Team Tests
- XSS Navigation Tests
- Publication Artifact Tests
- Google Fonts
- React Entrypoint
- Removed Insurance Content
- Contact Configuration
- Crawler Policy

## God Nodes (most connected - your core abstractions)
1. `cn()` - 19 edges
2. `react` - 13 edges
3. `lucide-react` - 12 edges
4. `Section()` - 9 edges
5. `doctor` - 8 edges
6. `BorderGlow()` - 7 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `Paleta de Cores da Marca` - 6 edges
10. `Open Graph Dra. Karen Viegas` - 6 edges

## Surprising Connections (you probably didn't know these)
- `WhatsApp URL Leakage Test` --semantically_similar_to--> `WhatsApp URL Data Flow`  [INFERRED] [semantically similar]
  PROMPT_RED_TEAM_SEGURANCA.md → PROMPT_AUDITORIA_SEGURANCA.md
- `Frontend Security Controls` --semantically_similar_to--> `Browser Security Headers`  [INFERRED] [semantically similar]
  PROMPT_REVISAO_CONFIGURACAO_PRODUCAO.md → PROMPT_AUDITORIA_SEGURANCA.md
- `Public Artifact Exposure Test` --semantically_similar_to--> `Publication Allowlist`  [INFERRED] [semantically similar]
  PROMPT_RED_TEAM_SEGURANCA.md → PROMPT_REVISAO_CONFIGURACAO_PRODUCAO.md
- `Clickjacking Test` --conceptually_related_to--> `Browser Security Headers`  [INFERRED]
  PROMPT_RED_TEAM_SEGURANCA.md → PROMPT_AUDITORIA_SEGURANCA.md
- `Pending Sitemap URL` --shares_data_with--> `Pending Canonical and Open Graph Metadata`  [INFERRED]
  public/robots.txt → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Medical Site Security Assessment** — prompt_auditoria_seguranca_repository_anchored_security_audit, prompt_auditoria_seguranca_static_medical_site_threat_model, prompt_auditoria_seguranca_health_data_privacy_risk, prompt_auditoria_seguranca_javascript_supply_chain_review [EXTRACTED 1.00]
- **Authorized Offensive Test Flow** — prompt_red_team_seguranca_authorized_local_red_team, prompt_red_team_seguranca_whatsapp_url_leakage_test, prompt_red_team_seguranca_dom_xss_testing, prompt_red_team_seguranca_clickjacking_test, prompt_red_team_seguranca_regression_security_suite [EXTRACTED 1.00]
- **Production Hardening Workflow** — prompt_revisao_configuracao_producao_file_by_file_review, prompt_revisao_configuracao_producao_frontend_security_controls, prompt_revisao_configuracao_producao_publication_allowlist, prompt_revisao_configuracao_producao_minimal_reversible_patch [EXTRACTED 1.00]
- **Sistema tipográfico das capas e conteúdos** — regras_fontes_losta_masta_thin, regras_fontes_sklow_bold, regras_fontes_cabin_italic [EXTRACTED 1.00]
- **Composição da Marca** — regras_logo_2_monograma_ka, regras_logo_2_dra_karen_viegas_albuquerque, regras_logo_2_ginecologia_e_obstetricia [EXTRACTED 1.00]
- **Composição da Marca** — regras_logo_3_monograma_ka, regras_logo_3_dra_karen_viegas_albuquerque, regras_logo_3_ginecologia_e_obstetricia [EXTRACTED 1.00]
- **Identidade profissional de Dra. Karen Viegas** — regras_logo_dra_karen_viegas, regras_logo_ginecologia, regras_logo_obstetricia [EXTRACTED 1.00]
- **Trio Cromático da Marca** — regras_paleta_de_cores_avela_c6a67f, regras_paleta_de_cores_beige_dccbaf, regras_paleta_de_cores_off_white_creme_f8f0e5 [EXTRACTED 1.00]
- **Dra. Karen Professional Brand Composition** — regras_whatsapp_image_2026_08_22_at_11_11_06_dra_karen_viegas_portrait, regras_whatsapp_image_2026_08_22_at_11_11_06_ka_monogram, regras_whatsapp_image_2026_08_22_at_11_11_06_gynecology_and_obstetrics_branding, regras_whatsapp_image_2026_08_22_at_11_11_06_clinical_office_backdrop [EXTRACTED 1.00]
- **About Section Professional Portrait Composition** — regras_foto_se__o_sobre_professional_portrait, regras_foto_se__o_sobre_medical_congress_attendance, regras_foto_se__o_sobre_formal_white_attire, regras_foto_se__o_sobre_green_foliage_backdrop [INFERRED 0.85]
- **Identidade profissional de Dra. Karen Viegas** — public_og_image_dra_karen_viegas, public_og_image_retrato_profissional, public_og_image_ginecologia, public_og_image_obstetricia [EXTRACTED 1.00]
- **About Asset Professional Portrait Composition** — src_assets_img_about_dra_karen_professional_portrait, src_assets_img_about_medical_congress_context, src_assets_img_about_formal_white_attire, src_assets_img_about_green_foliage_backdrop [INFERRED 0.85]
- **Composição do Retrato** — src_assets_img_dra_karen_dra_karen, src_assets_img_dra_karen_contato_visual_direto, src_assets_img_dra_karen_expressao_sorridente, src_assets_img_dra_karen_fundo_neutro_aquecido [EXTRACTED 1.00]
- **Integrated Clinic Environment** — src_assets_img_fundo_reception_and_waiting_area, src_assets_img_fundo_gynecological_exam_chair, src_assets_img_fundo_clinical_diagnostic_equipment, src_assets_img_fundo_warm_neutral_clinic_palette [EXTRACTED 1.00]
- **Identidade profissional de Dra. Karen Viegas** — src_assets_img_logo_nova_dra_karen_viegas, src_assets_img_logo_nova_ginecologia, src_assets_img_logo_nova_obstetricia [EXTRACTED 1.00]

## Communities (38 total, 8 thin omitted)

### Community 0 - "App and Visual Assets"
Cohesion: 0.07
Nodes (38): lucide-react, react, react-dom, App(), src_assets_img_about, src_assets_img_care_areas, src_assets_img_dra_karen, src_assets_img_fundo (+30 more)

### Community 1 - "UI Layout Components"
Cohesion: 0.13
Nodes (17): class-variance-authority, gsap, Footer(), Header(), WhatsAppFloat(), Badge(), Button(), buttonVariants (+9 more)

### Community 2 - "Toolchain Scripts"
Cohesion: 0.07
Nodes (27): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+19 more)

### Community 3 - "UI Registry Configuration"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 4 - "Runtime Dependencies"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, clsx, gsap, lucide-react, ogl, react, react-dom (+4 more)

### Community 5 - "Border Glow Animation"
Cohesion: 0.26
Nodes (10): animateValue(), BorderGlow(), buildGlowVars(), buildGradientVars(), COLOR_MAP, easeInCubic(), easeOutCubic(), GRADIENT_KEYS (+2 more)

### Community 6 - "Brand Color Meaning"
Cohesion: 0.27
Nodes (10): Acolhimento, Autoridade, Avelã #C6A67F, Beige #DCCBAF, Clareza, Higiene e Minimalismo, Essência da Saúde Feminina, Estabilidade, Firmeza e Elegância Natural, Off-White Creme #F8F0E5 (+2 more)

### Community 7 - "Brand Typography"
Cohesion: 0.32
Nodes (8): Cabin Italic, Fontes escolhidas, Hierarquia tipográfica, Losta Masta Thin, Sklow Bold, Subtítulos em capas, Textos maiores e informações, Títulos e capas

### Community 8 - "Medical Brand Assets"
Cohesion: 0.48
Nodes (7): Dra. Karen Viegas, Ginecologia, Monograma KA, Obstetrícia, Open Graph Dra. Karen Viegas, Paleta neutra bege, Retrato profissional

### Community 9 - "Medical SEO Schema"
Cohesion: 0.40
Nodes (6): Physician Structured Data, Wheelchair Accessibility Features, Dra. Karen Viegas, Ipatinga Practice Location, CRM MG 62187 and RQE 41596, Supported Payment Methods

### Community 10 - "Lint Configuration"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 11 - "Congress Portrait"
Cohesion: 0.33
Nodes (6): About Section Professional Context, Congress Identity Badge, Formal White Attire, Green Foliage Backdrop, Medical Congress Attendance, Professional Portrait of Dra. Karen Viegas

### Community 12 - "Branded Professional Portrait"
Cohesion: 0.33
Nodes (6): Clinical Office Backdrop, Dra. Karen Viegas Portrait, Gynecology and Obstetrics Professional Branding, KA Monogram, Professional Trust Presentation, Warm Neutral Visual Identity

### Community 13 - "About Portrait"
Cohesion: 0.33
Nodes (6): Congress Identity Badge, Dra. Karen Professional Portrait, Formal White Attire, Green Foliage Backdrop, Medical Congress Context, Professional About Section Identity

### Community 14 - "Warm Professional Portrait"
Cohesion: 0.53
Nodes (6): Acolhimento e Confiança, Contato Visual Direto, Dra. Karen, Expressão Sorridente, Fundo Neutro Aquecido, Retrato Profissional de Dra. Karen

### Community 15 - "Clinic Interior"
Cohesion: 0.40
Nodes (6): Clinical Diagnostic Equipment, Gynecological Examination Chair, Medical Clinic Interior, Patient Comfort and Clinical Readiness, Reception and Waiting Area, Warm Neutral Clinic Palette

### Community 16 - "Production Domain Readiness"
Cohesion: 0.50
Nodes (5): Pending Canonical and Open Graph Metadata, Pending Production Domain, JavaScript Supply Chain Review, Production Readiness Decision, Pending Sitemap URL

### Community 17 - "Patient Testimonials"
Cohesion: 0.40
Nodes (5): Static Google Testimonials, Clinic Team Service, Google Patient Reviews, Humanized and Attentive Care, Prenatal and Obstetric Care

### Community 18 - "Security Audit Controls"
Cohesion: 0.40
Nodes (5): Browser Security Headers, Repository-Anchored Security Audit, Static Medical Site Threat Model, Clickjacking Test, Frontend Security Controls

### Community 19 - "Brand Icon Palette"
Cohesion: 0.50
Nodes (5): Avelã #C6A67F, Ícone da Marca, Monograma KA Estilizado, Off-White Creme #F8F0E5, Quadrado Arredondado

### Community 20 - "Care Area Photography"
Cohesion: 0.60
Nodes (5): Acolhimento e confiança, Ambiente clínico claro, Área de Cuidado, Foto da seção Área de Cuidado, Retrato profissional feminino

### Community 21 - "Primary Brand Identity"
Cohesion: 0.60
Nodes (5): Dra. Karen Viegas Albuquerque, Estética Minimalista Neutra, Ginecologia e Obstetrícia, Identidade Visual Dra. Karen Viegas Albuquerque, Monograma KA

### Community 22 - "Light Logo Variant"
Cohesion: 0.60
Nodes (5): Aplicação Monocromática Clara, Dra. Karen Viegas Albuquerque, Ginecologia e Obstetrícia, Identidade Visual Dra. Karen Viegas Albuquerque, Monograma KA

### Community 23 - "Logo Variant"
Cohesion: 0.70
Nodes (5): Dra. Karen Viegas, Ginecologia, Logo Dra. Karen Viegas, Monograma KA, Obstetrícia

### Community 24 - "Care Areas Image"
Cohesion: 0.60
Nodes (5): Acolhimento e confiança, Ambiente clínico claro, Áreas de cuidado, Imagem Care Areas, Retrato profissional feminino

### Community 25 - "Logo Asset"
Cohesion: 0.70
Nodes (5): Dra. Karen Viegas, Ginecologia, Logo Dra. Karen Viegas, Monograma KA, Obstetrícia

### Community 26 - "Path Aliases"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

### Community 27 - "WhatsApp Privacy Risk"
Cohesion: 0.67
Nodes (3): Health Data Privacy Risk, WhatsApp URL Data Flow, WhatsApp URL Leakage Test

### Community 28 - "Production Review Scope"
Cohesion: 0.67
Nodes (3): File-by-File Production Review, Frontend and Backend Boundary, Minimal Reversible Production Patch

### Community 29 - "React Vite Configuration"
Cohesion: 0.67
Nodes (3): React Compiler Disabled, React and Vite Template, TypeScript Type-Aware Linting

## Knowledge Gaps
- **103 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `$schema` (+98 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 128 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App and Visual Assets` to `UI Layout Components`, `Toolchain Scripts`, `Border Glow Animation`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App and Visual Assets` to `UI Layout Components`, `Toolchain Scripts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Toolchain Scripts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _103 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App and Visual Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.07175141242937853 - nodes in this community are weakly interconnected._
- **Should `UI Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Toolchain Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.07389162561576355 - nodes in this community are weakly interconnected._