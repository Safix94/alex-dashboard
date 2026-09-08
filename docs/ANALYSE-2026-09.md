# Analyse Alex Dashboard

*Datum: 8 september 2026. Bereik: repo `Safix94/alex-dashboard`, commit `b5001c2` (10 feb 2026). Geen code gewijzigd.*

---

## Conclusie

**Niet doorbouwen op deze codebase in zijn huidige vorm.** Het is een prototype van twee dagen (9-10 februari 2026) uit het OpenClaw/Asana-tijdperk en sindsdien onaangeraakt. Van de drie datastromen is er één nep (status roteert op de klok), één zonder producer (activity log) en één gekoppeld aan een tool die je officieel niet meer gebruikt (Asana).

Daarbovenop vier zaken die vandaag pijn doen:

1. **De dashboardpagina vuurt ~1.200 requests per seconde** op `/api/alex/log` (gemeten: 11.930 requests in 10 seconden). Op Vercel is dat kosten en throttling.
2. **Geen authenticatie** op schrijvende endpoints. Iedereen met de URL kan notities verwijderen, logs injecteren en (als `ASANA_PAT` gezet is) Asana-taken verplaatsen.
3. **Persistentie werkt niet op Vercel.** SQLite in `/tmp` plus een schema-bestand dat niet in de serverless-bundle zit. Notities verdwijnen, het log valt terug op mockdata.
4. **Een Vercel API-token staat in plaintext in git** (`DEPLOYMENT.md`, sinds commit `c1c14e8`).

**Aanbeveling:** archiveren, en de echte behoefte ("zien wat Alex doet") als tab in het Stinis Dashboard bouwen. Zie [Strategische keuze](#strategische-keuze). Wil je dit toch als aparte app houden, dan is het plan onderaan een herbouw van 3-4 dagen, geen fix.

---

## Wat er staat

| Onderdeel | Feit |
|---|---|
| Stack | Next.js 16.1.6 (App Router, Turbopack), React 19.2, Tailwind 4, shadcn/ui, dnd-kit, better-sqlite3, next-themes |
| Omvang | 43 bronbestanden, ~4.100 regels; 9 "phase"-documenten (40 KB) in de root |
| Pagina's | `/` (dashboard), `/log`, `/docs` + 3 subpagina's |
| API | `/api/alex/status` (nep), `/tasks` (Asana), `/log` (SQLite), `/notes` (SQLite), `/usage` (stub) |
| Build | `tsc --noEmit` en `next build` slagen zonder fouten |
| Kwaliteit | Geen ESLint-config, geen lint-script, 0 tests, geen CI |
| Dependencies | 11 kwetsbaarheden (9 high) via `npm audit`; 5 ongebruikte packages |
| Live | `alex-dashboard-psi.vercel.app` volgens docs |

**Onderzoeksmethode:** volledige code gelezen, build en typecheck uitgevoerd, `npm audit`, productieserver gestart en met headless Chromium het netwerkverkeer per pagina gemeten, API-endpoints geprobed met randgevallen, schermafbeeldingen desktop en mobiel.

---

## Wat goed is

- **Moderne, gangbare stack** die past bij de rest van je projecten (Next, Tailwind 4, shadcn). Build en typecheck zijn schoon.
- **Duidelijke mappenstructuur**: `hooks/`, `components/`, `lib/`, `api/` netjes gescheiden. Types worden gedeeld tussen hook en component.
- **De Asana-laag is goed gebouwd** (`src/lib/asana.ts`): sectienamen worden genormaliseerd (emoji's, NL/EN-varianten), de sectiemap wordt 5 minuten gecachet, de vier secties worden parallel opgehaald, en de foutmelding zegt precies welke secties ontbreken en welke er wél zijn.
- **Optimistic UI bij drag-and-drop** met rollback via refetch als de PATCH faalt.
- **SQL is geparametriseerd** (geen injectie), het schema heeft CHECK-constraints en indexes.
- **Notes API is compleet**: CRUD, pin, archiveren, categorieën, zoeken, paginering, en enum-validatie op input.
- **Dark mode is correct opgezet**: class-strategie via next-themes, OKLCH-tokens, `color-scheme` meegezet.
- **Presence-component** is een leuk idee met verzorgde animaties en aria-labels.
- **Basis security headers** in `vercel.json`.

---

## Bevindingen

Ernst: **Kritiek** (nu oplossen), **Hoog** (blokkeert echt gebruik), **Middel** (bugs en schuld), **Laag** (afwerking).

### Kritiek

**K1. Oneindige fetch-loop op de dashboardpagina**
`src/hooks/useActivityLogPolling.ts:29` geeft `filters` een default `{}`. Dat is elke render een nieuw object, dus `fetchLogs` wordt elke render opnieuw aangemaakt, het effect op regel 90 draait opnieuw, doet een fetch, de response zet state, nieuwe render, en zo verder. Op `/log` gebeurt dit niet omdat `filters` daar state is.
Gemeten met headless Chromium op een productie-build: **11.930 requests in 10 seconden** op `/`, tegenover 3 in 15 seconden op `/log`. De browser geeft `ERR_INSUFFICIENT_RESOURCES`.
*Fix:* `filters` stabiliseren (caller geeft een gememoïseerd object, of hook gebruikt een JSON-key als dependency). Beter: de drie eigen polling-hooks vervangen door SWR of TanStack Query met `refreshInterval`, dan verdwijnt deze klasse bugs helemaal.

**K2. Geen authenticatie**
Alle routes zijn publiek: `POST /api/alex/log`, `POST/PATCH/DELETE /api/alex/notes`, `PATCH /api/alex/tasks`. De docs-pagina zegt het zelf ("implement OAuth2 or API key authentication in production").
*Fix:* nu Vercel Deployment Protection aanzetten. Structureel: Clerk (zit al in je stack) met middleware voor de UI, en een bearer-token met scopes voor machine-writes, zoals je bij de `stinis-dashboard` MCP al doet.

**K3. Secret in git**
`DEPLOYMENT.md:107` bevat een Vercel API-token in plaintext, gecommit op 9 februari (`c1c14e8`). Het bestand zegt dat hij op 11 maart 2026 verlopen is.
*Fix:* in Vercel controleren dat het token echt ingetrokken is, regel verwijderen. History herschrijven is optioneel omdat de repo privé is en het token verlopen.

### Hoog

**H1. Persistentie is niet compatibel met Vercel**
`src/lib/db.ts` opent SQLite in `/tmp` (per instance, weg bij elke cold start) en leest `src/lib/schema.sql` via `process.cwd()`. Dat bestand zit niet in de serverless-bundle, dus de schema-init faalt. Gevolg: `/api/alex/log` valt terug op mockdata (commit `20f3e06` bevestigt dat dit gebeurt), `/api/alex/notes` geeft 500. Het notitiepaneel werkt in productie niet, en wat wél lukt is bij de volgende cold start weg.
*Fix:* externe database. Convex ligt voor de hand omdat het Stinis Dashboard erop draait. Supabase Postgres of Turso kan ook. Schema via migrations, niet via `readFileSync`.

**H2. Nepdata die eruitziet als echt**
`/api/alex/status` kiest elke 15 seconden een andere demo-status op basis van de klok (`status/route.ts:64-68`). De brein-animatie in de sidebar zegt "Bezig: github" terwijl er niets gebeurt. `/api/alex/tasks` geeft bij élke fout waarvan de boodschap "Asana" bevat mockdata terug met `mock: true`, maar de UI toont dat niet: je ziet "Synced with Asana" boven verzonnen taken.
*Fix:* mock alleen achter een expliciete env-flag en met een zichtbare badge. Nooit mock in productie. Het status-endpoint verwijderen tot er een echte bron is.

**H3. Geen enkele producer voor het activity log**
Niets schrijft naar `/api/alex/log` behalve een handmatige POST. De OpenClaw-koppeling waar de env-vars naar verwijzen (`OPENCLAW_*`) komt nergens in de code voor. Zonder producer heeft het log, en daarmee het halve dashboard, geen inhoud.
*Fix:* eerst bepalen wie de bron is. Meest logisch: Claude Code hooks (`PostToolUse`, `Stop`, `SessionStart`) die met een token naar het endpoint posten. Dan kan de status ook echt afgeleid worden uit het laatste event.

**H4. Het takenbord hangt aan Asana, en Asana is afgeschaft**
`CLAUDE.md` van Alex: "Asana wordt NIET meer gebruikt, stel het ook nooit meer voor." Het hele takenbord, de PATCH-route en een hard-coded `PROJECT_GID` (`tasks/route.ts:8`) zijn Asana-specifiek.
*Fix:* takenbord voeden vanuit het Stinis Dashboard (dezelfde Convex-API die de MCP gebruikt), of het takenbord schrappen.

**H5. Kwetsbare dependencies**
`npm audit`: 9 high (postcss, sharp en picomatch via `next@16.1.6`; `qs`), 1 moderate, 1 low.
*Fix:* `next` naar 16.3.x, `npm audit fix`, Dependabot of Renovate aanzetten.

**H6. Kolommen zijn geen drop-target**
`TaskBoard.tsx`: `Column` gebruikt geen `useDroppable`, dus `over.id` is altijd een taak. Een kaart op een lege kolom (bv. Archive) droppen doet niets.
*Fix:* `useDroppable` per kolom en `onDragOver` voor verplaatsingen tussen containers.

### Middel

**M1. Datumfilter kapot**
De `datetime-local` input levert `2026-09-08T00:00`; SQLite slaat `2026-09-08 00:32:19` op. De query vergelijkt strings, en `T` sorteert na de spatie. Getest: `dateFrom=2026-09-08T00:00` geeft 0 resultaten terwijl er een entry van vandaag staat. Tijdzone wordt ook nergens meegenomen.
*Fix:* timestamps opslaan als ISO-8601 UTC met `Z`, invoer met date-fns naar ISO omzetten voor de query.

**M2. Ongeldige `details_json` crasht de pagina**
`POST /api/alex/log` accepteert elke string in `details_json` (getest: `"not json"` wordt aanvaard). `ActivityLog.tsx:160` doet `JSON.parse` in de render zonder try/catch: de entry uitklappen geeft een wit scherm.
*Fix:* zod-validatie in de route, safe-parse in de UI.

**M3. Geen validatie op `limit` en `offset`**
`?limit=abc` geeft `NaN`, SQLite gooit een fout, en de log-route serveert dan stilzwijgend mockdata. De notes-route geeft 500. Geen bovengrens, dus `limit=1000000` kan.
*Fix:* zod, clamp op 1..100.

**M4. Layout: drie keer `fixed` in elkaar**
`layout.tsx:26` (wrapper, fixed), `Sidebar.tsx:13` (aside, fixed), `PresenceComponent.tsx:55` (fixed, `h-screen`). De presence bedekt de "Notes panel coming in Phase 7"-placeholder in de sidebar, die sowieso achterhaald is want het notitiepaneel bestaat. `PresenceContainer.tsx` wordt nergens gebruikt.
*Fix:* één fixed container, presence als gewoon blok, placeholder en `PresenceContainer` weg.

**M5. Dode code en dubbele CSS**
`src/styles/globals.css` (Tailwind v3-syntax, ander kleurenpalet) wordt nergens geïmporteerd. De custom `.animate-pulse` en `.animate-bounce` in `app/globals.css` overschrijven de Tailwind-utilities met andere keyframes. `* { transition: ... }` staat op elk element. Ongebruikte packages: `asana`, `rehype`, `remark`, `classnames`, en `@radix-ui/react-scroll-area` + `@radix-ui/react-slot` naast het umbrella-package `radix-ui`. `clearActivityLogs` en `formatDistanceToNow` worden geïmporteerd maar niet gebruikt.
*Fix:* verwijderen. ESLint met `no-unused-vars` vangt dit voortaan.

**M6. Documentatie klopt niet met de code**
De docs-pagina's noemen `ASANA_API_KEY`, `ASANA_PROJECT_GID`, `DATABASE_URL`, `OPENAI_API_KEY`; de code gebruikt `ASANA_PAT` en `DB_PATH`. `README.md` is nog de create-next-app default. Negen phase-bestanden in de root. `vercel.json` zet `NEXT_PUBLIC_OPENCLAW_API_URL=http://localhost:8000` als productie-env.
*Fix:* één README (doel, setup, env-vars, architectuur), phase-docs naar `docs/archive/` of weg, `env`-blok uit `vercel.json`.

**M7. Geen lint, tests of CI**
Geen `eslint.config`, geen `lint`-script, nul tests, geen GitHub Action. Bug K1 zou door een `react-hooks/exhaustive-deps`-achtige review of één integratietest gevangen zijn.
*Fix:* `eslint-config-next`, Vitest voor `lib/` (statusMapper, db-queries, sectie-mapping), één Playwright-smoke, workflow op PR.

**M8. Polling-druk, ook zonder de bug**
Vijf onafhankelijke pollers op de dashboardpagina (status 15 s, log 15 s, tasks 30 s, notes 30 s, usage 60 s), de log-pagina elke 5 s, en alles loopt door in een achtergrondtab.
*Fix:* één data-layer (SWR, `refreshWhenHidden: false`) of push via Convex-subscriptions.

### Laag

- **L1. Taal gemengd.** "Klaar voor taken", "Meer laden", "Geen activity logs gevonden" naast "Refresh", "Quick Notes", "Add a note...". `<html lang="en">`. Kies Nederlands.
- **L2. Mobiele navigatie** knipt labels op drie tekens: "Das", "Doc", "Log". Iconen of volledige woorden.
- **L3. Notitie verwijderen** zonder bevestiging. Fouten gaan alleen naar `console.error`, de gebruiker ziet niets.
- **L4. ThemeSwitcher** gebruikt `theme` in plaats van `resolvedTheme`; bij "system" kan de eerste klik de verkeerde kant op.
- **L5. Seed negeert timestamps** (`addActivityLog` schrijft ze niet weg), dus alle seed-entries staan op "nu". Circulaire import `db.ts` ↔ `seed.ts` via `require`.
- **L6. LIKE-zoekopdracht** escapet `%` en `_` niet; de index op `description` doet niets voor `LIKE '%x%'`.
- **L7. Usage-widget** toont prominent "0 tokens, €0.000" uit een stub.
- **L8. Vier kanban-kolommen in twee derde breedte** op md-schermen geeft kaarten van ~150 px; "Due 08 Sep" breekt over drie regels (zie screenshot).
- **L9. `X-XSS-Protection`** is verouderd; geen CSP.

---

## Strategische keuze

De vraag vóór elke fix: **wat moet dit dashboard doen dat het Stinis Dashboard niet doet?**

| Optie | Wat | Inspanning | Oordeel |
|---|---|---|---|
| **A. Archiveren + Alex-tab in Stinis Dashboard** | Activity-feed en presence als tab in het bestaande dashboard. Producer: Claude Code hooks via de bestaande assistant-token (nieuwe scope `activity:write`). Taken zijn er al. | 1-2 dagen | **Aanbevolen.** Hergebruikt Convex, Clerk-auth, MCP-token en scopes. Eén dashboard in plaats van twee. |
| **B. Herbouwen als losse "Alex-monitor"** | Kleine app: presence + activity feed, geen takenbord. Convex-backend, Clerk-auth, echte producer. | 3-4 dagen | Alleen als je een aparte, deelbare pagina wil (bv. voor Stinis AI-content: "kijk mee wat mijn agent doet"). |
| **C. Repareren zoals het is** | K1-K3, H5, H6, M1-M3 fixen; Asana laten staan. | 1 dag | **Afgeraden.** Je repareert een koppeling met een tool die je niet meer gebruikt, en de kern blijft nepdata. |

Log de keuze in `decisions/log.md` van Alex.

---

## Plan

### Fase 0: vandaag (1 uur), stop de bloeding

- [ ] Vercel API-token uit `DEPLOYMENT.md` controleren op intrekking in Vercel, regel verwijderen (K3)
- [ ] Vercel Deployment Protection aanzetten op het project, of het project pauzeren (K2)
- [ ] Zolang het live staat: Vercel Analytics/usage bekijken op de request-storm van K1
- [ ] Keuze A/B/C maken en loggen

### Fase 1: opruimen (halve dag), ongeacht de keuze

- [ ] Phase-docs naar `docs/archive/`, README herschrijven (M6)
- [ ] Dode code en ongebruikte packages weg (M5)
- [ ] `npm audit fix`, `next` naar 16.3.x (H5)
- [ ] ESLint + lint-script (M7)

*Bij optie A stopt het hier voor deze repo; de rest van het plan verhuist naar de dashboard-repo als "Alex-tab". Fase 2-4 hieronder gelden voor B (en C waar aangegeven).*

### Fase 2: fundament (1 dag)

- [ ] Polling-loop weg: SWR of TanStack Query als enige data-layer, `refreshWhenHidden: false` (K1, M8). Bij C: minimaal `filters` stabiliseren.
- [ ] Auth: Clerk + middleware voor de UI, bearer-token met scopes voor machine-writes (K2)
- [ ] Persistentie: Convex in plaats van SQLite (H1). Bij C: Turso of Vercel Postgres.
- [ ] Zod-validatie op elke route: body, `limit`/`offset`, `details_json` (M2, M3)
- [ ] Timestamps ISO-UTC, datumfilter fixen (M1)
- [ ] Mock alleen achter env-flag, met badge in de UI (H2)
- [ ] Vitest voor `lib/`, één Playwright-smoke, GitHub Action (M7)

### Fase 3: echte data (1-2 dagen)

- [ ] Producer: Claude Code hooks (`SessionStart`, `PostToolUse`, `Stop`) posten events met token naar `/api/alex/log` (H3)
- [ ] Status afleiden uit het laatste event (working als < 2 min, idle daarna) in plaats van klokrotatie (H2)
- [ ] Takenbord: bron omzetten naar Stinis Dashboard-API, of component verwijderen; Asana-code eruit (H4)
- [ ] Usage: echte telemetrie uit de hook-events (tokens per sessie) of widget verwijderen (L7)

### Fase 4: afwerking (halve dag)

- [ ] Layout: één fixed container, presence als gewoon blok, placeholder weg (M4)
- [ ] Drop-targets per kolom (H6), kolombreedte op md (L8)
- [ ] Nederlands als enige taal, `lang="nl"` (L1), mobiele nav (L2)
- [ ] Bevestiging bij verwijderen en zichtbare foutmeldingen (L3), `resolvedTheme` (L4)
- [ ] CSP-header, `X-XSS-Protection` weg (L9)

---

## Meetgegevens

| Meting | Resultaat |
|---|---|
| `/` requests naar `/api/alex/log` in 10 s | 11.930 |
| `/log` requests naar `/api/alex/log` in 15 s | 3 |
| Console op `/` | `ERR_INSUFFICIENT_RESOURCES`, herhaald `Failed to fetch activity logs` |
| `GET /api/alex/log?dateFrom=2026-09-08T00:00` met entry van vandaag | 0 resultaten |
| `POST /api/alex/log` met `details_json: "not json"` | 201, aanvaard |
| `GET /api/alex/log?limit=abc` | 200, mockdata |
| `GET /api/alex/notes?limit=abc` | 500 |
| `GET /api/alex/tasks` zonder `ASANA_PAT` | 200, mockdata, UI toont "Synced with Asana" |
| `npm audit --omit=dev` | 9 high, 1 moderate, 1 low |
| `tsc --noEmit`, `next build` | geslaagd |
