# Graph Report - .  (2026-07-22)

## Corpus Check
- 102 files · ~233,012 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 413 nodes · 453 edges · 65 communities (44 shown, 21 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.83)
- Token cost: 45,200 input · 3,800 output

## Community Hubs (Navigation)
- Template Config & Detail Pages
- TypeScript Configuration
- NPM Dependencies
- Agent Documentation & Branding
- Template Editor System
- Dashboard Layout & Navigation
- Wedding Invitation Templates
- Template Engine Upgrade
- Dev Dependencies & Tooling
- Admin & Customer API Routes
- Auth Security & Rate Limiting
- Wishes Dashboard
- Orders Management Page
- Admin Dashboard Hub
- User Management Page
- Checkout Flow
- Order Detail Page
- Authentication Routes
- Template Build Pipeline
- Revenue Analytics Page
- Admin Templates Page
- Admin Layout Shell
- User Detail Page
- Homepage
- Portfolio & Gallery Templates
- Route Middleware
- OpenCode Plugin Config
- Template List Page
- Root Layout & Metadata
- Graphify Plugin
- Database Seed Script
- Admin Seed Script
- Next.js Config
- Next.js Env Types
- Cinematic Dark Theme
- Editor Form UI
- Hard Rules
- Icon Mapping
- Cover Image 1
- Cover Image 2
- Cover Image 3
- Cover Image 4
- Inline Styles Convention
- Wedding Invitation Editor Agent

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `TEMPLATE_CONFIGS` - 8 edges
3. `DEFAULT_TEMPLATE_CONFIG` - 8 edges
4. `verifyTurnstile()` - 7 edges
5. `scripts` - 7 edges
6. `Wedding Invitation Template` - 7 edges
7. `AI Agent: Wedding Invitation Editor (Original)` - 6 edges
8. `Theme & Animation Engine` - 6 edges
9. `3D Fogging Wedding Cinematic Template` - 6 edges
10. `Wedding Cover Video Template` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AI Agent: Wedding Invitation Editor & Preview` --semantically_similar_to--> `AI Agent: Wedding Invitation Editor (Original)`  [INFERRED] [semantically similar]
  AI_AGENT_TEMPLATE.md → TEMPLATE_AGENT_ORIGINAL.md
- `Cinematic Dark Theme` --semantically_similar_to--> `Editor UI Theme & Layout Rules`  [INFERRED] [semantically similar]
  AI_AGENT_TEMPLATE.md → TEMPLATE_AGENT_ORIGINAL.md
- `Dynamic CSS Variable Binding` --semantically_similar_to--> `Live Visual Binding JS`  [INFERRED] [semantically similar]
  promp_helper/CREATE_UNIQUE_TEMPLATE.txt → template_generator_agents/TEMPLATE_AGENT.md
- `Template Customization Query` --conceptually_related_to--> `Theme & Animation Engine`  [INFERRED]
  promp_helper/unique__template_prompt.txt → template_generator_agents/TEMPLATE_AGENT.md
- `POST()` --calls--> `verifyTurnstile()`  [EXTRACTED]
  app/api/auth/forgot-password/route.ts → lib/turnstile.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Editor-to-Iframe Live Binding Pattern** — shared_postmessage_pattern, agent_seed_template_key_map, background_binding_build_iframe_payload, agent_md_template_html_rules [INFERRED 0.85]
- **Cinematic Dark Brand Identity** — shared_brand_color_palette, shared_font_typography, agent_md_branding, ai_agent_template_cinematic_theme, template_agent_original_editor_ui_theme [EXTRACTED 1.00]
- **New Template Integration Workflow** — agent_seed_template_guide, agent_seed_template_escape_script, agent_seed_template_key_map, shared_template_configs_map [EXTRACTED 1.00]
- **Theme & Visual Customization System** — template_generator_agents_template_agent_md_theme_animation_engine, template_generator_agents_template_agent_md_global_theme_form_group, template_generator_agents_template_agent_md_live_visual_binding_js, template_generator_agents_template_agent_md_iframe_preview [INFERRED]
- **Editor & Preview Architecture** — template_generator_agents_template_agent_md_wedding_invitation_editor, template_generator_agents_template_agent_md_live_editor_preview, template_generator_agents_template_agent_md_iframe_preview, template_generator_agents_template_agent_md_live_binding, template_generator_agents_template_agent_md_device_switcher [INFERRED]
- **Agent Upgrade Workflow** — promp_helper_create_unique_template_txt_template_engine_upgrade_agent, promp_helper_create_unique_template_txt_trigger_condition, promp_helper_unique__template_prompt_txt_customization_query, promp_helper_new_template_seed_prompt_txt_seed_prompt [INFERRED]
- **Share standard wedding invitation sections: Cover, Countdown, Couple, Holy Verse (Ar-Rum:21), Events (Akad/Resepsi), Gallery, RSVP, Gifts, Live Streaming, Wishes, Closing** — templates_3d_fogging_wed_cinematic, templates_cover_video_wedding_cover_video, templates_forest_nature_cinematic, templates_honey_wdd_template, templates_traditional_java_batik_template, templates_traditional_west_sumatra_template [EXTRACTED 1.00]
- **Editor templates use identical architecture: form panel + iframe preview + postMessage for live data binding** — templates_honey_wdd_template, templates_rustic_template, concept_editor_with_live_preview, concept_postmessage_editor_iframe [EXTRACTED 1.00]
- **Parallax 3D tilt effect is used across both modern cinematic and traditional cultural templates with mouse-tracking transforms** — concept_parallax_3d_tilt, templates_3d_fogging_wed_cinematic, templates_honey_wdd_template, templates_traditional_java_batik_template, templates_traditional_west_sumatra_template [EXTRACTED 1.00]

## Communities (65 total, 21 thin omitted)

### Community 0 - "Template Config & Detail Pages"
Cohesion: 0.09
Nodes (20): BACKGROUND_DEFAULTS, editorSections, kebabToCamel(), KelolaTemplateContent(), TemplateData, StaticTemplate, CheckoutContent(), StaticTemplate (+12 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 2 - "NPM Dependencies"
Cohesion: 0.08
Nodes (25): bcryptjs, dotenv, next, dependencies, bcryptjs, dotenv, next, react (+17 more)

### Community 3 - "Agent Documentation & Branding"
Cohesion: 0.13
Nodes (20): Terima Undangan Branding, Template HTML Rules, build_template.js Escaping Script, Panduan Integrasi Template Baru, Key Map (kebab-case to camelCase), Cinematic Dark Theme, AI Agent: Wedding Invitation Editor & Preview, AI Agent: Generate Cover Thumbnails (+12 more)

### Community 4 - "Template Editor System"
Cohesion: 0.14
Nodes (14): EditTemplateContent(), TemplateRecord, BACKGROUND_DEFAULTS, EditorField, EditorSection, editorSections, getTemplateSections(), kebabToCamel() (+6 more)

### Community 5 - "Dashboard Layout & Navigation"
Cohesion: 0.14
Nodes (14): DashboardLayout(), getPageTitle(), pageTitles, calcCountdown(), Countdown, DashboardPage(), ZERO, SettingsPage() (+6 more)

### Community 6 - "Wedding Invitation Templates"
Cohesion: 0.17
Nodes (20): Batik SVG Pattern System, Countdown Timer Component, Editor with Live Preview (iframe), Film Grain CSS Overlay, Glassmorphism UI Pattern, IntersectionObserver Scroll Reveal, Parallax 3D Tilt Effect, postMessage Editor-to-iframe Communication (+12 more)

### Community 7 - "Template Engine Upgrade"
Cohesion: 0.11
Nodes (20): Animation Engine, Dynamic CSS Variable Binding, Global Theme & Visual Effects Form Group, Live Visual Binding JS, Overlay Effect Options, Overlay Particle System, Template Engine Upgrade Agent, Theme Presets (+12 more)

### Community 8 - "Dev Dependencies & Tooling"
Cohesion: 0.11
Nodes (18): devDependencies, playwright, prisma, @prisma/client, @types/bcryptjs, @types/node, @types/react, @types/react-dom (+10 more)

### Community 10 - "Auth Security & Rate Limiting"
Cohesion: 0.29
Nodes (6): POST(), checkRateLimit(), DEFAULT_CONFIG, getClientIp(), store, sendPasswordResetEmail()

### Community 11 - "Wishes Dashboard"
Cohesion: 0.20
Nodes (8): card, FetchResponse, inputStyle, pageBtn, pageBtnActive, td, th, Wish

### Community 12 - "Orders Management Page"
Cohesion: 0.32
Nodes (7): badge(), card, formatRupiah(), goldBtn, OrdersPage(), td, th

### Community 13 - "Admin Dashboard Hub"
Cohesion: 0.36
Nodes (7): AdminDashboard(), badge(), cardBase, formatRupiah(), labelStyle(), tdStyle, thStyle

### Community 14 - "User Management Page"
Cohesion: 0.29
Nodes (7): badge(), card, dangerBtn, goldBtn, td, th, UsersPage()

### Community 15 - "Checkout Flow"
Cohesion: 0.29
Nodes (6): CheckoutContent(), FEATURES, iconMap, PRICE_MAP, StaticTemplate, useIsMobile()

### Community 16 - "Order Detail Page"
Cohesion: 0.38
Nodes (6): badge(), card, formatRupiah(), goldBtn, OrderDetailPage(), selectStyle

### Community 17 - "Authentication Routes"
Cohesion: 0.67
Nodes (4): POST(), POST(), getClientIp(), verifyTurnstile()

### Community 18 - "Template Build Pipeline"
Cohesion: 0.29
Nodes (4): files, fs, lines, path

### Community 19 - "Revenue Analytics Page"
Cohesion: 0.40
Nodes (5): card, formatRupiah(), RevenuePage(), td, th

### Community 20 - "Admin Templates Page"
Cohesion: 0.33
Nodes (4): goldBtn, redBtn, tdStyle, thStyle

### Community 25 - "Homepage"
Cohesion: 0.67
Nodes (3): HomePage(), StaticTemplate, useMediaQuery()

### Community 26 - "Portfolio & Gallery Templates"
Cohesion: 0.67
Nodes (4): Portfolio Filter Gallery, Template Gallery Browser, Website Frontend Reference Template, Website Template Gallery

### Community 28 - "OpenCode Plugin Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **157 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `PageProps`, `NAV`, `AdminUser` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies & Tooling` to `NPM Dependencies`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `main()` connect `Dev Dependencies & Tooling` to `Template Config & Detail Pages`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `PageProps` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Template Config & Detail Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08870967741935484 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Agent Documentation & Branding` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._