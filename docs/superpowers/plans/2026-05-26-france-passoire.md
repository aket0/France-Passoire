# France Passoire — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un site Next.js parodique de monitoring de cyber-attaques en temps réel ciblant les institutions françaises, déployé sur Vercel.

**Architecture:** Page principale avec header gouv.fr, barre KPIs, carte amCharts 5 avec arcs animés, et sidebar live. Un composant client `Dashboard` orchestre le polling toutes les 90s vers `/api/attacks` qui proxifie AbuseIPDB + géolocalise via ip-api.com avec un cache in-memory 90s.

**Tech Stack:** Next.js 14 (App Router), amCharts 5, AbuseIPDB API v2, ip-api.com, CSS Modules, Vercel

---

## Structure des fichiers

```
france_passoire/
├── .env.example
├── .env.local                          # gitignored — ABUSEIPDB_API_KEY
├── .gitignore
├── jest.config.js
├── jest.setup.js
├── next.config.js
├── package.json
├── src/
│   ├── app/
│   │   ├── globals.css                 # CSS reset + variables couleurs gouv.fr
│   │   ├── layout.js                   # root layout (metadata, font)
│   │   ├── page.js                     # server component — importe Dashboard
│   │   ├── a-propos/
│   │   │   └── page.js                 # page disclaimer
│   │   └── api/attacks/
│   │       └── route.js                # proxy AbuseIPDB + cache 90s
│   ├── components/
│   │   ├── Dashboard.js                # 'use client' — polling + state
│   │   ├── Dashboard.module.css
│   │   ├── Header.js
│   │   ├── Header.module.css
│   │   ├── Footer.js
│   │   ├── Footer.module.css
│   │   ├── KpiBar.js
│   │   ├── KpiBar.module.css
│   │   ├── Sidebar.js
│   │   ├── Sidebar.module.css
│   │   ├── AttackMap.js                # 'use client' — amCharts 5
│   │   └── AttackMap.module.css
│   ├── lib/
│   │   ├── institutions.js             # liste + coordonnées
│   │   ├── attackTypes.js              # mapping IP → type + couleur
│   │   ├── hashTarget.js               # hash(ip) → institution
│   │   └── cheese.js                   # passoire-o-mètre
│   └── __tests__/
│       ├── lib/hashTarget.test.js
│       ├── lib/cheese.test.js
│       ├── lib/attackTypes.test.js
│       └── api/attacks.test.js
└── docs/
```

---

## Task 1 : Scaffold Next.js + configuration

**Files:**
- Create: `package.json`, `next.config.js`, `jest.config.js`, `jest.setup.js`, `.gitignore`, `.env.example`

- [ ] **Step 1 : Initialiser le projet Next.js**

```bash
cd /home/aketo/project/france_passoire
npx create-next-app@14 . --app --no-src-dir --no-tailwind --eslint --no-typescript --import-alias "@/*"
```

Répondre `y` aux confirmations. Cela crée `src/app/`, `next.config.js`, `package.json`.

- [ ] **Step 2 : Installer les dépendances supplémentaires**

```bash
npm install @amcharts/amcharts5 @amcharts/amcharts5-geodata
npm install --save-dev jest jest-environment-node @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3 : Créer `jest.config.js`**

```js
// jest.config.js
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
module.exports = createJestConfig({
  testEnvironment: 'node',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testMatch: ['**/__tests__/**/*.test.js'],
})
```

- [ ] **Step 4 : Créer `jest.setup.js`**

```js
// jest.setup.js
// vide pour l'instant — point d'extension pour les mocks globaux
```

- [ ] **Step 5 : Mettre à jour `.gitignore`**

Ajouter à la fin du `.gitignore` généré par create-next-app :

```
.env.local
.superpowers/
```

- [ ] **Step 6 : Créer `.env.example`**

```env
# .env.example
ABUSEIPDB_API_KEY=your_key_here
```

- [ ] **Step 7 : Mettre à jour `package.json` — ajouter le script test**

Dans la section `"scripts"`, ajouter :

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 8 : Supprimer le contenu de démo créé par create-next-app**

```bash
rm -rf src/app/page.js src/app/globals.css src/app/layout.js public/
```

- [ ] **Step 9 : Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 + deps (amcharts5, jest)"
```

---

## Task 2 : CSS globaux + variables gouv.fr

**Files:**
- Create: `src/app/globals.css`, `src/app/layout.js`

- [ ] **Step 1 : Créer `src/app/globals.css`**

```css
/* src/app/globals.css */
:root {
  --bleu-france: #001489;
  --rouge-marianne: #E1000F;
  --gris-fond: #f5f5f0;
  --blanc: #ffffff;
  --texte-principal: #1e1e1e;
  --texte-secondaire: #666666;
  --bordure: #dddddd;
  --sidebar-fond: #f9f9f9;
  --carte-fond: #0d1b2e;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, 'Helvetica Neue', sans-serif;
  background: var(--gris-fond);
  color: var(--texte-principal);
  min-height: 100vh;
}

code { font-family: monospace; }
```

- [ ] **Step 2 : Créer `src/app/layout.js`**

```js
// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'France Passoire — Suivez en direct l\'état de la passoire',
  description: 'Site parodique de monitoring des cyber-attaques visant les institutions françaises.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3 : Vérifier que Next.js démarre**

```bash
npm run dev
```

Ouvrir http://localhost:3000 — page blanche sans erreur = OK. `Ctrl+C` pour stopper.

- [ ] **Step 4 : Commit**

```bash
git add src/app/globals.css src/app/layout.js
git commit -m "feat: add global CSS with gouv.fr color variables"
```

---

## Task 3 : Couche data — lib fonctions pures + tests

**Files:**
- Create: `src/lib/institutions.js`, `src/lib/attackTypes.js`, `src/lib/hashTarget.js`, `src/lib/cheese.js`
- Test: `src/__tests__/lib/hashTarget.test.js`, `src/__tests__/lib/cheese.test.js`, `src/__tests__/lib/attackTypes.test.js`

- [ ] **Step 1 : Écrire les tests `hashTarget.test.js`**

```js
// src/__tests__/lib/hashTarget.test.js
const { hashTarget } = require('@/lib/hashTarget')
const { INSTITUTIONS } = require('@/lib/institutions')

test('same IP always returns same institution', () => {
  expect(hashTarget('1.2.3.4')).toEqual(hashTarget('1.2.3.4'))
})

test('returns an institution from the list', () => {
  const result = hashTarget('192.168.1.1')
  expect(INSTITUTIONS).toContain(result)
})

test('returns an institution for any IP string', () => {
  const ips = ['8.8.8.8', '123.45.67.89', '255.255.255.255', '0.0.0.0']
  ips.forEach(ip => {
    const result = hashTarget(ip)
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('lat')
    expect(result).toHaveProperty('lng')
  })
})
```

- [ ] **Step 2 : Écrire les tests `cheese.test.js`**

```js
// src/__tests__/lib/cheese.test.js
const { getCheeseLevel } = require('@/lib/cheese')

test('0 attacks → camembert, 0%', () => {
  const r = getCheeseLevel(0)
  expect(r.label).toBe('Camembert')
  expect(r.pct).toBe(0)
})

test('500 attacks → emmental (25%)', () => {
  const r = getCheeseLevel(500)
  expect(r.pct).toBe(25)
  expect(r.label).toBe('Emmental')
})

test('1000 attacks → gruyère (50%)', () => {
  const r = getCheeseLevel(1000)
  expect(r.pct).toBe(50)
  expect(r.label).toBe('Gruyère')
})

test('2000+ attacks → plafonné à 99%', () => {
  const r = getCheeseLevel(9999)
  expect(r.pct).toBe(99)
})

test('1500 attacks → mimolette', () => {
  const r = getCheeseLevel(1500)
  expect(r.label).toBe('Mimolette')
})
```

- [ ] **Step 3 : Écrire les tests `attackTypes.test.js`**

```js
// src/__tests__/lib/attackTypes.test.js
const { getAttackTypeFromIp } = require('@/lib/attackTypes')
const ATTACK_COLORS = ['#E1000F', '#ff6600', '#9933ff', '#ffcc00']

test('returns an object with label and color', () => {
  const r = getAttackTypeFromIp('1.2.3.4')
  expect(r).toHaveProperty('label')
  expect(r).toHaveProperty('color')
})

test('color is one of the 4 defined colors', () => {
  const r = getAttackTypeFromIp('8.8.8.8')
  expect(ATTACK_COLORS).toContain(r.color)
})

test('same IP always returns same type', () => {
  expect(getAttackTypeFromIp('10.0.0.1')).toEqual(getAttackTypeFromIp('10.0.0.1'))
})
```

- [ ] **Step 4 : Lancer les tests — vérifier qu'ils échouent**

```bash
npm test
```

Résultat attendu : `Cannot find module '@/lib/hashTarget'` — les modules n'existent pas encore.

- [ ] **Step 5 : Créer `src/lib/institutions.js`**

```js
// src/lib/institutions.js
export const INSTITUTIONS = [
  { name: 'Élysée', lat: 48.8713, lng: 2.3161, sector: 'Gouvernement' },
  { name: 'Sénat', lat: 48.8491, lng: 2.3393, sector: 'Gouvernement' },
  { name: 'Assemblée nationale', lat: 48.8628, lng: 2.3176, sector: 'Gouvernement' },
  { name: 'SNCF', lat: 48.8752, lng: 2.3522, sector: 'Transports' },
  { name: 'RATP', lat: 48.8566, lng: 2.3602, sector: 'Transports' },
  { name: 'AP-HP', lat: 48.8440, lng: 2.3481, sector: 'Santé' },
  { name: 'Min. Santé', lat: 48.8516, lng: 2.3193, sector: 'Santé' },
  { name: 'Pôle Emploi', lat: 48.8931, lng: 2.3592, sector: 'Services publics' },
  { name: 'CAF', lat: 48.8512, lng: 2.3340, sector: 'Services publics' },
  { name: 'BNF', lat: 48.8327, lng: 2.3766, sector: 'Culture' },
  { name: 'Min. Éducation', lat: 48.8506, lng: 2.3105, sector: 'Éducation' },
  { name: 'Min. Défense', lat: 48.8567, lng: 2.3093, sector: 'Défense' },
  { name: 'Min. Intérieur', lat: 48.8504, lng: 2.3078, sector: 'Sécurité' },
  { name: 'EDF', lat: 48.8800, lng: 2.2944, sector: 'Énergie' },
  { name: 'La Poste', lat: 48.8703, lng: 2.3443, sector: 'Services publics' },
]

export const PARIS = { lat: 48.8566, lng: 2.3522 }
```

- [ ] **Step 6 : Créer `src/lib/hashTarget.js`**

```js
// src/lib/hashTarget.js
import { INSTITUTIONS } from './institutions.js'

export function hashTarget(ip) {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash) + ip.charCodeAt(i)
    hash |= 0
  }
  return INSTITUTIONS[Math.abs(hash) % INSTITUTIONS.length]
}
```

- [ ] **Step 7 : Créer `src/lib/attackTypes.js`**

```js
// src/lib/attackTypes.js
const TYPES = [
  { label: 'DDoS',       color: '#E1000F' },
  { label: 'Bruteforce', color: '#ff6600' },
  { label: 'Scan',       color: '#9933ff' },
  { label: 'Intrusion',  color: '#ffcc00' },
]

export function getAttackTypeFromIp(ip) {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash) + ip.charCodeAt(ip.length - 1 - i)
    hash |= 0
  }
  return TYPES[Math.abs(hash) % TYPES.length]
}
```

- [ ] **Step 8 : Créer `src/lib/cheese.js`**

```js
// src/lib/cheese.js
const LEVELS = [
  { threshold: 75, label: 'Mimolette' },
  { threshold: 50, label: 'Gruyère' },
  { threshold: 25, label: 'Emmental' },
  { threshold: 0,  label: 'Camembert' },
]

export function getCheeseLevel(attackCount) {
  const pct = Math.min(99, Math.round((attackCount / 2000) * 100))
  const level = LEVELS.find(l => pct >= l.threshold)
  return { pct, label: level.label, emoji: '🧀' }
}
```

- [ ] **Step 9 : Lancer les tests — vérifier qu'ils passent**

```bash
npm test
```

Résultat attendu :
```
PASS src/__tests__/lib/hashTarget.test.js
PASS src/__tests__/lib/cheese.test.js
PASS src/__tests__/lib/attackTypes.test.js

Test Suites: 3 passed
Tests:       9 passed
```

- [ ] **Step 10 : Commit**

```bash
git add src/lib/ src/__tests__/lib/
git commit -m "feat: add data lib (institutions, hashTarget, attackTypes, cheese) with tests"
```

---

## Task 4 : API route `/api/attacks`

**Files:**
- Create: `src/app/api/attacks/route.js`
- Test: `src/__tests__/api/attacks.test.js`

- [ ] **Step 1 : Écrire le test `attacks.test.js`**

```js
// src/__tests__/api/attacks.test.js
const { GET } = require('@/app/api/attacks/route')

beforeEach(() => {
  jest.clearAllMocks()
  // reset module-level cache entre les tests
  jest.resetModules()
})

test('retourne 500 si ABUSEIPDB_API_KEY absent', async () => {
  delete process.env.ABUSEIPDB_API_KEY
  const { GET: freshGET } = require('@/app/api/attacks/route')
  const res = await freshGET()
  expect(res.status).toBe(500)
  const body = await res.json()
  expect(body.error).toMatch(/API key/)
})

test('retourne un tableau JSON si fetch réussit', async () => {
  process.env.ABUSEIPDB_API_KEY = 'test-key'
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ ipAddress: '1.2.3.4' }, { ipAddress: '5.6.7.8' }],
      }),
    })
    .mockResolvedValueOnce({
      json: async () => [
        { status: 'success', query: '1.2.3.4', lat: 55.7, lon: 37.6, country: 'Russie', countryCode: 'RU' },
        { status: 'success', query: '5.6.7.8', lat: 39.9, lon: 116.4, country: 'Chine', countryCode: 'CN' },
      ],
    })

  const { GET: freshGET } = require('@/app/api/attacks/route')
  const res = await freshGET()
  expect(res.status).toBeUndefined() // Response.json() retourne 200 implicitement
  const body = await res.json()
  expect(Array.isArray(body)).toBe(true)
  expect(body[0]).toHaveProperty('ip')
  expect(body[0]).toHaveProperty('target')
  expect(body[0]).toHaveProperty('attackType')
  expect(body[0]).toHaveProperty('color')
})
```

- [ ] **Step 2 : Lancer les tests — vérifier qu'ils échouent**

```bash
npm test src/__tests__/api/attacks.test.js
```

Résultat attendu : `Cannot find module '@/app/api/attacks/route'`

- [ ] **Step 3 : Créer `src/app/api/attacks/route.js`**

```js
// src/app/api/attacks/route.js
import { hashTarget } from '@/lib/hashTarget'
import { getAttackTypeFromIp } from '@/lib/attackTypes'

let cache = { data: null, timestamp: 0 }
const CACHE_TTL = 90_000

export async function GET() {
  const now = Date.now()
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data)
  }

  const apiKey = process.env.ABUSEIPDB_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  const blacklistRes = await fetch(
    'https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=90&limit=100',
    { headers: { Key: apiKey, Accept: 'application/json' } }
  )
  if (!blacklistRes.ok) {
    return Response.json({ error: 'AbuseIPDB error' }, { status: 502 })
  }
  const { data: ipList } = await blacklistRes.json()
  const ips = ipList.slice(0, 100).map(e => e.ipAddress)

  const geoRes = await fetch(
    'http://ip-api.com/batch?fields=status,country,countryCode,lat,lon,query',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ips.map(ip => ({ query: ip }))),
    }
  )
  const geoData = await geoRes.json()

  const attacks = geoData
    .filter(g => g.status === 'success' && g.countryCode !== 'FR')
    .map(g => {
      const target = hashTarget(g.query)
      const type = getAttackTypeFromIp(g.query)
      return {
        ip: g.query,
        srcLat: g.lat,
        srcLng: g.lon,
        country: g.country,
        countryCode: g.countryCode,
        target: target.name,
        attackType: type.label,
        color: type.color,
      }
    })

  cache = { data: attacks, timestamp: now }
  return Response.json(attacks)
}
```

- [ ] **Step 4 : Lancer les tests — vérifier qu'ils passent**

```bash
npm test src/__tests__/api/attacks.test.js
```

Résultat attendu :
```
PASS src/__tests__/api/attacks.test.js
Tests: 2 passed
```

- [ ] **Step 5 : Commit**

```bash
git add src/app/api/ src/__tests__/api/
git commit -m "feat: add /api/attacks route with AbuseIPDB proxy and 90s cache"
```

---

## Task 5 : Composant Header

**Files:**
- Create: `src/components/Header.js`, `src/components/Header.module.css`

- [ ] **Step 1 : Créer `src/components/Header.module.css`**

```css
/* src/components/Header.module.css */
.header {
  background: var(--bleu-france);
  border-bottom: 3px solid var(--rouge-marianne);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  font-size: 22px;
  flex-shrink: 0;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: var(--blanc);
}

.subtitle {
  font-size: 10px;
  color: rgba(255,255,255,0.6);
  font-style: italic;
}

.slogan {
  margin-left: auto;
  text-align: right;
}

.sloganLabel {
  font-size: 9px;
  color: rgba(255,255,255,0.5);
}

.sloganText {
  font-size: 11px;
  color: #ffcc00;
  font-style: italic;
}

.nav {
  margin-left: 24px;
}

.navLink {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 12px;
}

.navLink:hover {
  color: var(--blanc);
  text-decoration: underline;
}
```

- [ ] **Step 2 : Créer `src/components/Header.js`**

```js
// src/components/Header.js
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>🇫🇷</span>
      <div className={styles.brand}>
        <span className={styles.title}>FRANCE PASSOIRE</span>
        <span className={styles.subtitle}>Liberté · Égalité · Vulnérabilité</span>
      </div>
      <nav className={styles.nav}>
        <Link href="/a-propos" className={styles.navLink}>À propos</Link>
      </nav>
      <div className={styles.slogan}>
        <div className={styles.sloganLabel}>Slogan officiel</div>
        <div className={styles.sloganText}>"Suivez en direct l'état de la passoire"</div>
      </div>
    </header>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/Header.js src/components/Header.module.css
git commit -m "feat: add Header component (gouv.fr parody style)"
```

---

## Task 6 : Composant Footer

**Files:**
- Create: `src/components/Footer.js`, `src/components/Footer.module.css`

- [ ] **Step 1 : Créer `src/components/Footer.module.css`**

```css
/* src/components/Footer.module.css */
.footer {
  background: var(--bleu-france);
  color: rgba(255,255,255,0.6);
  font-size: 10px;
  text-align: center;
  padding: 8px 20px;
  line-height: 1.6;
}

.footer a {
  color: rgba(255,255,255,0.7);
}
```

- [ ] **Step 2 : Créer `src/components/Footer.js`**

```js
// src/components/Footer.js
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      Site parodique et satirique · Aucune affiliation avec le gouvernement français, l'ANSSI ou toute institution ·
      Données issues de <a href="https://www.abuseipdb.com" target="_blank" rel="noopener">AbuseIPDB</a> et{' '}
      <a href="https://ip-api.com" target="_blank" rel="noopener">ip-api.com</a> ·
      Mise à jour toutes les 90 secondes
    </footer>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/Footer.js src/components/Footer.module.css
git commit -m "feat: add Footer component with disclaimer and data sources"
```

---

## Task 7 : Composant KpiBar

**Files:**
- Create: `src/components/KpiBar.js`, `src/components/KpiBar.module.css`

- [ ] **Step 1 : Créer `src/components/KpiBar.module.css`**

```css
/* src/components/KpiBar.module.css */
.bar {
  display: flex;
  border-bottom: 1px solid var(--bordure);
  background: var(--blanc);
}

.kpi {
  flex: 1;
  padding: 10px 14px;
  border-right: 1px solid var(--bordure);
  text-align: center;
}

.kpi:last-child {
  border-right: none;
}

.label {
  font-size: 9px;
  font-weight: bold;
  color: var(--bleu-france);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.value {
  font-size: 22px;
  font-weight: bold;
  color: var(--rouge-marianne);
  line-height: 1;
}

.sub {
  font-size: 9px;
  color: var(--texte-secondaire);
  margin-top: 3px;
}
```

- [ ] **Step 2 : Créer `src/components/KpiBar.js`**

```js
// src/components/KpiBar.js
import { getCheeseLevel } from '@/lib/cheese'
import styles from './KpiBar.module.css'

export default function KpiBar({ attackCount }) {
  const cheese = getCheeseLevel(attackCount)

  return (
    <div className={styles.bar}>
      <div className={styles.kpi}>
        <div className={styles.label}>Attaques actives</div>
        <div className={styles.value}>{attackCount.toLocaleString('fr-FR')}</div>
        <div className={styles.sub}>en ce moment</div>
      </div>
      <div className={styles.kpi}>
        <div className={styles.label}>Données exposées</div>
        <div className={styles.value}>47M</div>
        <div className={styles.sub}>citoyens concernés</div>
      </div>
      <div className={styles.kpi}>
        <div className={styles.label}>Taux de blocage</div>
        <div className={styles.value}>3%</div>
        {/* confidentiel défense */}
        <div className={styles.sub}>record historique bas</div>
      </div>
      <div className={styles.kpi}>
        <div className={styles.label}>Passoire-o-mètre</div>
        <div className={styles.value}>{cheese.emoji} {cheese.pct}%</div>
        <div className={styles.sub}>niveau : {cheese.label}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/KpiBar.js src/components/KpiBar.module.css
git commit -m "feat: add KpiBar component with passoire-o-metre"
```

---

## Task 8 : Composant Sidebar

**Files:**
- Create: `src/components/Sidebar.js`, `src/components/Sidebar.module.css`

La Sidebar reçoit `attacks` (tableau complet) et calcule elle-même les top pays et top institutions.

- [ ] **Step 1 : Créer `src/components/Sidebar.module.css`**

```css
/* src/components/Sidebar.module.css */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--sidebar-fond);
  border-left: 1px solid var(--bordure);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel {
  padding: 10px 12px;
  border-bottom: 1px solid var(--bordure);
}

.panel:last-child {
  border-bottom: none;
}

.panelTitle {
  font-size: 9px;
  font-weight: bold;
  color: var(--bleu-france);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.feedList {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 160px;
  overflow-y: auto;
}

.feedItem {
  background: var(--blanc);
  border-left: 2px solid;
  padding: 4px 8px;
  font-size: 10px;
  line-height: 1.4;
}

.feedCountry { color: var(--texte-secondaire); }
.feedTarget { font-weight: bold; }
.feedType { font-size: 9px; }

.rankList {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rankItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.rankCount {
  font-weight: bold;
  color: var(--rouge-marianne);
  font-size: 12px;
}
```

- [ ] **Step 2 : Créer `src/components/Sidebar.js`**

```js
// src/components/Sidebar.js
import styles from './Sidebar.module.css'

const FLAG_MAP = {
  RU: '🇷🇺', CN: '🇨🇳', US: '🇺🇸', KP: '🇰🇵', IR: '🇮🇷',
  BR: '🇧🇷', IN: '🇮🇳', DE: '🇩🇪', NL: '🇳🇱', UA: '🇺🇦',
}

function getFlag(code) {
  return FLAG_MAP[code] || '🌐'
}

function topBy(attacks, key, n = 5) {
  const counts = {}
  attacks.forEach(a => {
    const k = a[key]
    counts[k] = (counts[k] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
}

export default function Sidebar({ attacks }) {
  const recent = [...attacks].reverse().slice(0, 10)
  const topCountries = topBy(attacks, 'countryCode')
  const topTargets = topBy(attacks, 'target')

  return (
    <aside className={styles.sidebar}>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>⚡ Flux en direct</div>
        <div className={styles.feedList}>
          {recent.length === 0 && <span style={{ fontSize: 10, color: 'var(--texte-secondaire)' }}>Chargement...</span>}
          {recent.map((a, i) => (
            <div key={i} className={styles.feedItem} style={{ borderColor: a.color }}>
              <span className={styles.feedCountry}>{getFlag(a.countryCode)} {a.country}</span>
              {' → '}
              <span className={styles.feedTarget}>{a.target}</span>
              {' '}
              <span className={styles.feedType} style={{ color: a.color }}>{a.attackType}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTitle}>🏆 Top attaquants</div>
        <div className={styles.rankList}>
          {topCountries.map(([code, count], i) => {
            const attack = attacks.find(a => a.countryCode === code)
            return (
              <div key={code} className={styles.rankItem}>
                <span>{getFlag(code)} {attack?.country || code}</span>
                <span className={styles.rankCount}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTitle}>🎯 Plus ciblées</div>
        <div className={styles.rankList}>
          {topTargets.map(([name, count]) => (
            <div key={name} className={styles.rankItem}>
              <span>{name}</span>
              <span className={styles.rankCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/Sidebar.js src/components/Sidebar.module.css
git commit -m "feat: add Sidebar component (live feed, top countries, top targets)"
```

---

## Task 9 : Composant AttackMap (amCharts 5)

**Files:**
- Create: `src/components/AttackMap.js`, `src/components/AttackMap.module.css`

Ce composant est 100% client-side (`'use client'`). Il importe amCharts dynamiquement pour éviter les erreurs SSR. La carte est initialisée une fois, et les arcs sont mis à jour impérativement via une ref quand `attacks` change. Pour l'effet "live", les arcs entrent par vagues de 3 toutes les 2s.

- [ ] **Step 1 : Créer `src/components/AttackMap.module.css`**

```css
/* src/components/AttackMap.module.css */
.wrapper {
  flex: 1;
  background: var(--carte-fond);
  position: relative;
  min-height: 450px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 450px;
}

.badge {
  position: absolute;
  top: 10px;
  right: 12px;
  background: rgba(0,0,0,0.5);
  color: #4488ff;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 3px;
  border: 1px solid #2244aa;
}
```

- [ ] **Step 2 : Créer `src/components/AttackMap.js`**

```js
// src/components/AttackMap.js
'use client'

import { useEffect, useRef } from 'react'
import { PARIS } from '@/lib/institutions'
import styles from './AttackMap.module.css'

export default function AttackMap({ attacks }) {
  const chartDivRef = useRef(null)
  const rootRef = useRef(null)
  const lineSeriesRef = useRef(null)
  const queueRef = useRef([])
  const timerRef = useRef(null)

  // Initialise la carte une seule fois
  useEffect(() => {
    let root

    async function init() {
      const am5 = (await import('@amcharts/amcharts5')).default
      const am5map = (await import('@amcharts/amcharts5/map')).default
      const geodata = (await import('@amcharts/amcharts5-geodata/worldLow')).default
      const AnimatedTheme = (await import('@amcharts/amcharts5/themes/Animated')).default

      root = am5.Root.new(chartDivRef.current)
      root.setThemes([AnimatedTheme.new(root)])
      rootRef.current = root

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
          panX: 'rotateX',
          wheelY: 'zoom',
        })
      )

      // Fond pays
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: geodata,
          exclude: ['AQ'],
        })
      )
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color('#1a3a5c'),
        fillOpacity: 0.9,
        stroke: am5.color('#2a4a6c'),
        strokeWidth: 0.5,
        tooltipText: '{name}',
      })
      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color('#2a5080'),
      })
      // France en bleu france
      polygonSeries.events.on('datavalidated', () => {
        polygonSeries.mapPolygons.each(polygon => {
          if (polygon.dataItem?.get('id') === 'FR') {
            polygon.set('fill', am5.color('#001489'))
          }
        })
      })

      // Série de lignes d'attaque
      const lineSeries = chart.series.push(
        am5map.MapLineSeries.new(root, {})
      )
      lineSeries.mapLines.template.setAll({
        strokeOpacity: 0.5,
        strokeWidth: 1.5,
        stroke: am5.color('#E1000F'),
      })
      // Couleur par ligne depuis dataContext
      lineSeries.mapLines.template.adapters.add('stroke', (stroke, target) => {
        const ctx = target.dataItem?.dataContext
        return ctx?.color ? am5.color(ctx.color) : stroke
      })
      // Bullet animé sur chaque ligne
      lineSeries.bullets.push(() => {
        const circle = am5.Circle.new(root, {
          radius: 3,
          fill: am5.color('#ffffff'),
          strokeOpacity: 0,
        })
        circle.animate({
          key: 'locationX',
          from: 0,
          to: 1,
          duration: 1800,
          loops: Infinity,
          easing: am5.ease.linear,
        })
        return am5.Bullet.new(root, { sprite: circle })
      })

      lineSeriesRef.current = lineSeries
    }

    init()
    return () => { root?.dispose() }
  }, [])

  // Quand attacks change, recharge la queue et relance le défilement
  useEffect(() => {
    if (!attacks || attacks.length === 0) return

    queueRef.current = [...attacks]

    if (timerRef.current) clearInterval(timerRef.current)

    function drainQueue() {
      const lineSeries = lineSeriesRef.current
      if (!lineSeries) return

      const batch = queueRef.current.splice(0, 3)
      if (batch.length === 0) {
        // file vide → recharger depuis attacks pour boucler
        queueRef.current = [...attacks]
        return
      }

      const lines = batch.map(a => ({
        geometry: {
          type: 'LineString',
          coordinates: [
            [a.srcLng, a.srcLat],
            [PARIS.lng, PARIS.lat],
          ],
        },
        color: a.color,
        tooltipText: `${a.country} → ${a.target}\n${a.attackType}`,
      }))

      lineSeries.data.setAll(lines)
    }

    drainQueue()
    timerRef.current = setInterval(drainQueue, 2000)

    return () => clearInterval(timerRef.current)
  }, [attacks])

  return (
    <div className={styles.wrapper}>
      <div ref={chartDivRef} className={styles.chart} />
      <div className={styles.badge}>amCharts 5 · données réelles</div>
    </div>
  )
}
```

- [ ] **Step 3 : Vérifier que l'import amCharts ne casse pas le build**

```bash
npm run build
```

Résultat attendu : build réussi sans erreur. Si erreur `window is not defined`, vérifier que `'use client'` est bien en première ligne.

- [ ] **Step 4 : Commit**

```bash
git add src/components/AttackMap.js src/components/AttackMap.module.css
git commit -m "feat: add AttackMap component with amCharts 5 animated arcs"
```

---

## Task 10 : Composant Dashboard (client — polling + orchestration)

**Files:**
- Create: `src/components/Dashboard.js`, `src/components/Dashboard.module.css`

Dashboard orchestre le polling et distribue les données à KpiBar, AttackMap et Sidebar.

- [ ] **Step 1 : Créer `src/components/Dashboard.module.css`**

```css
/* src/components/Dashboard.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.status {
  position: fixed;
  bottom: 40px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: #88ff88;
  font-size: 9px;
  padding: 3px 7px;
  border-radius: 3px;
  font-family: monospace;
  z-index: 10;
}
```

- [ ] **Step 2 : Créer `src/components/Dashboard.js`**

```js
// src/components/Dashboard.js
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from './Header'
import Footer from './Footer'
import KpiBar from './KpiBar'
import Sidebar from './Sidebar'
import styles from './Dashboard.module.css'

// Import dynamique pour éviter le SSR d'amCharts
const AttackMap = dynamic(() => import('./AttackMap'), { ssr: false })

const POLL_INTERVAL = 90_000

export default function Dashboard() {
  const [attacks, setAttacks] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  async function fetchAttacks() {
    try {
      const res = await fetch('/api/attacks')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setAttacks(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchAttacks()
    const id = setInterval(fetchAttacks, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('fr-FR')
    : 'chargement...'

  return (
    <div className={styles.page}>
      <Header />
      <KpiBar attackCount={attacks.length} />
      <div className={styles.main}>
        <AttackMap attacks={attacks} />
        <Sidebar attacks={attacks} />
      </div>
      <Footer />
      <div className={styles.status}>
        {error ? `⚠ ${error}` : `✓ màj ${timeStr}`}
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/Dashboard.js src/components/Dashboard.module.css
git commit -m "feat: add Dashboard client component with 90s polling"
```

---

## Task 11 : Page principale

**Files:**
- Create: `src/app/page.js`

- [ ] **Step 1 : Créer `src/app/page.js`**

```js
// src/app/page.js
import Dashboard from '@/components/Dashboard'

export default function HomePage() {
  return <Dashboard />
}
```

- [ ] **Step 2 : Lancer le serveur dev et vérifier visuellement**

```bash
npm run dev
```

Ouvrir http://localhost:3000. Checklist :
- [ ] Header bleu avec drapeau et slogan
- [ ] Barre 4 KPIs en rouge
- [ ] Carte sombre (fond `#0d1b2e`) qui s'affiche
- [ ] Sidebar à droite avec panneaux
- [ ] Footer bleu en bas
- [ ] Indicateur de statut en bas à droite (`chargement...` puis `✓ màj HH:MM:SS`)

Si la carte ne s'affiche pas, ouvrir la console browser et vérifier les erreurs amCharts.

- [ ] **Step 3 : Créer `.env.local` pour tester avec une vraie clé API**

```bash
echo "ABUSEIPDB_API_KEY=your_real_key_here" > .env.local
```

Créer un compte sur https://www.abuseipdb.com, section API → copier la clé. Redémarrer le serveur dev. Vérifier que des arcs apparaissent sur la carte.

- [ ] **Step 4 : Commit**

```bash
git add src/app/page.js
git commit -m "feat: wire up home page with Dashboard component"
```

---

## Task 12 : Page `/a-propos`

**Files:**
- Create: `src/app/a-propos/page.js`

- [ ] **Step 1 : Créer `src/app/a-propos/page.js`**

```js
// src/app/a-propos/page.js
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>À propos de France Passoire</h1>

          <section className={styles.section}>
            <h2>Nature du site</h2>
            <p>
              France Passoire est un <strong>site parodique et satirique</strong>. Il n'a aucune
              affiliation avec le gouvernement français, la République française, l'ANSSI,
              ni aucune institution publique ou privée française.
            </p>
            <p>
              Le nom, le slogan, et le design inspiré de gouv.fr sont utilisés à des fins
              humoristiques pour commenter la cybersécurité en France.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Sources des données</h2>
            <p>Les données affichées proviennent exclusivement de sources publiques :</p>
            <ul>
              <li>
                <a href="https://www.abuseipdb.com" target="_blank" rel="noopener">AbuseIPDB</a> —
                base de données publique d'adresses IP signalées comme malveillantes par la communauté.
              </li>
              <li>
                <a href="https://ip-api.com" target="_blank" rel="noopener">ip-api.com</a> —
                service de géolocalisation d'adresses IP.
              </li>
            </ul>
            <p>
              L'association entre une adresse IP et une institution française est <strong>fictive et arbitraire</strong>.
              Elle ne reflète pas de vraies attaques ciblées contre ces institutions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Données fictives</h2>
            <p>
              Les indicateurs "Données exposées", "Taux de blocage" et "Passoire-o-mètre"
              sont entièrement inventés à des fins parodiques.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2 : Créer `src/app/a-propos/page.module.css`**

```css
/* src/app/a-propos/page.module.css */
.main {
  padding: 32px 20px;
  max-width: 720px;
  margin: 0 auto;
}

.card {
  background: var(--blanc);
  border-top: 3px solid var(--rouge-marianne);
  padding: 32px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.title {
  font-size: 22px;
  color: var(--bleu-france);
  margin-bottom: 24px;
  font-weight: 700;
}

.section {
  margin-bottom: 24px;
}

.section h2 {
  font-size: 14px;
  color: var(--bleu-france);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--bordure);
}

.section p, .section li {
  font-size: 13px;
  line-height: 1.7;
  color: var(--texte-principal);
  margin-bottom: 8px;
}

.section ul {
  padding-left: 18px;
}

.section a {
  color: var(--bleu-france);
}
```

- [ ] **Step 3 : Vérifier la page**

Aller sur http://localhost:3000/a-propos et vérifier le rendu (header, contenu, footer).

- [ ] **Step 4 : Commit**

```bash
git add src/app/a-propos/
git commit -m "feat: add /a-propos disclaimer page"
```

---

## Task 13 : Préparation déploiement Vercel

**Files:**
- Modify: `.gitignore`, `next.config.js`

- [ ] **Step 1 : Vérifier `next.config.js`**

Le fichier généré par create-next-app suffit. Vérifier qu'il ne bloque pas les requêtes `http://` vers ip-api.com (Vercel autorise les requêtes sortantes HTTP depuis les serverless functions) :

```js
// next.config.js — contenu minimal attendu
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
```

- [ ] **Step 2 : Build final + vérification**

```bash
npm run build
```

Résultat attendu : `✓ Compiled successfully`. Si erreurs, corriger avant de continuer.

- [ ] **Step 3 : Lancer tous les tests une dernière fois**

```bash
npm test
```

Résultat attendu :
```
Test Suites: 4 passed
Tests:       11 passed
```

- [ ] **Step 4 : Créer le repo GitHub et pousser**

```bash
git remote add origin https://github.com/<ton-username>/france-passoire.git
git push -u origin main
```

- [ ] **Step 5 : Déployer sur Vercel**

1. Aller sur https://vercel.com/new
2. Importer le repo GitHub `france-passoire`
3. Framework : **Next.js** (détecté automatiquement)
4. Dans **Environment Variables**, ajouter :
   - `ABUSEIPDB_API_KEY` = ta clé AbuseIPDB
5. Cliquer **Deploy**

- [ ] **Step 6 : Vérifier le déploiement**

Ouvrir l'URL Vercel générée. Vérifier :
- [ ] La page se charge
- [ ] `/api/attacks` répond (ouvrir l'URL directement dans le browser)
- [ ] Les arcs apparaissent sur la carte après quelques secondes
- [ ] Le statut en bas à droite passe de "chargement..." à "✓ màj HH:MM:SS"

- [ ] **Step 7 : Commit final**

```bash
git add .
git commit -m "chore: finalize deploy config and verify build"
git push
```

---

## Résumé des commandes utiles

```bash
npm run dev      # serveur local http://localhost:3000
npm run build    # build production
npm test         # lancer les tests Jest
npm test -- --watch  # mode watch
```
