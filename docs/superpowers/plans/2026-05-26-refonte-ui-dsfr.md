# Refonte UI DSFR — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre l'interface de France Passoire pour coller au DSFR (Design System de l'État) — police Marianne, structure officielle, carte dans grille blanche.

**Architecture:** Remplacement pur CSS/JSX composant par composant, sans modifier la logique métier ni les routes API. Le composant Header devient client pour gérer `usePathname`. Dashboard passe `lastUpdated` et `error` au Header.

**Tech Stack:** Next.js 14 App Router, CSS Modules, police Marianne via CDN DSFR

---

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/app/globals.css` | Import Marianne, ajout `--bleu-rf`, update `--gris-fond` et `font-family` |
| `src/components/Header.js` | Refonte complète : 4 couches DSFR, client component, props `lastUpdated` + `error` |
| `src/components/Header.module.css` | Refonte complète |
| `src/components/KpiBar.js` | Composant renommé `KpiGrid`, tuiles blanches DSFR, titre H1 inclus |
| `src/components/KpiBar.module.css` | Refonte complète |
| `src/components/AttackMap.js` | Ajout badge EN DIRECT + légende overlay |
| `src/components/AttackMap.module.css` | Ajout styles badge + légende |
| `src/components/Sidebar.js` | Panneaux blancs + barres de proportion + badges type |
| `src/components/Sidebar.module.css` | Refonte complète |
| `src/components/Footer.js` | Structure 3 colonnes + mention légale |
| `src/components/Footer.module.css` | Refonte complète |
| `src/components/Dashboard.js` | Passe `lastUpdated`+`error` au Header, supprime `status` div, import KpiGrid |
| `src/app/a-propos/page.js` | Disclaimer rouge, sections numérotées, tableau sources |
| `src/app/a-propos/page.module.css` | Refonte complète |

---

### Task 1 : Globals CSS — Marianne + variables

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Remplacer le contenu de `globals.css`**

```css
/* src/app/globals.css */
@import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.11.2/dist/fonts/fonts.css');

:root {
  --bleu-france: #001489;
  --bleu-rf: #003189;
  --rouge-marianne: #E1000F;
  --gris-fond: #f6f6f6;
  --blanc: #ffffff;
  --texte-principal: #1e1e1e;
  --texte-secondaire: #666666;
  --bordure: #dddddd;
  --sidebar-fond: #f9f9f9;
  --carte-fond: #0d1b2e;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Marianne', Arial, 'Helvetica Neue', sans-serif;
  background: var(--gris-fond);
  color: var(--texte-principal);
  min-height: 100vh;
}

code { font-family: monospace; }
```

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "style: add Marianne font and --bleu-rf CSS variable"
```

---

### Task 2 : Header — refonte 4 couches DSFR

**Files:**
- Modify: `src/components/Header.js`
- Modify: `src/components/Header.module.css`

- [ ] **Remplacer `Header.js`**

```jsx
// src/components/Header.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

const BREADCRUMBS = {
  '/': 'Tableau de bord national',
  '/a-propos': 'À propos',
}

export default function Header({ lastUpdated = null, error = null }) {
  const pathname = usePathname()
  const timeStr = lastUpdated ? lastUpdated.toLocaleTimeString('fr-FR') : null

  return (
    <header>
      {/* Bandeau République Française */}
      <div className={styles.rfBand}>
        <div className={styles.rfInner}>
          <div className={styles.tricolor}>
            <span className={styles.tcBlue} />
            <span className={styles.tcWhite} />
            <span className={styles.tcRed} />
          </div>
          <span className={styles.rfTitle}>République Française</span>
          <div className={styles.rfLinks}>
            <a href="https://www.france.fr" target="_blank" rel="noopener noreferrer" className={styles.rfLink}>France.fr</a>
            <a href="https://data.gouv.fr" target="_blank" rel="noopener noreferrer" className={styles.rfLink}>data.gouv.fr</a>
          </div>
        </div>
      </div>

      {/* Header service */}
      <div className={styles.serviceHeader}>
        <div className={styles.serviceInner}>
          <div className={styles.brand}>
            <span className={styles.title}>France Passoire</span>
            <span className={styles.subtitle}>Ministère de la Passoire Numérique · Liberté · Égalité · Vulnérabilité</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>
              Tableau de bord
            </Link>
            <Link href="/a-propos" className={`${styles.navLink} ${pathname === '/a-propos' ? styles.navLinkActive : ''}`}>
              À propos
            </Link>
          </nav>
        </div>
      </div>

      {/* Fil d'ariane */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/" className={styles.breadcrumbLink}>Accueil</Link>
          <span className={styles.breadcrumbSep}>&rsaquo;</span>
          <span className={styles.breadcrumbCurrent}>{BREADCRUMBS[pathname] ?? 'Page'}</span>
        </div>
      </div>

      {/* Bandeau alerte */}
      <div className={styles.alertBand}>
        <div className={styles.alertInner}>
          <span className={styles.alertBadge}>ALERTE</span>
          <span className={styles.alertText}>
            Niveau de menace cybernétique nationale : <strong>ÉLEVÉ</strong>
            {' '}— Mise à jour automatique toutes les 90 secondes
          </span>
          <span className={styles.alertTime}>
            {error ? `⚠ ${error}` : timeStr ? `✓ màj ${timeStr}` : 'chargement…'}
          </span>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Remplacer `Header.module.css`**

```css
/* src/components/Header.module.css */

/* ── Bandeau RF ─────────────────────── */
.rfBand {
  background: var(--bleu-rf);
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.rfInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 7px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.tricolor {
  display: flex;
  width: 22px;
  height: 22px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 1px;
  overflow: hidden;
  flex-shrink: 0;
}
.tcBlue  { background: #002395; flex: 1; }
.tcWhite { background: #ffffff; flex: 1; }
.tcRed   { background: #ED2939; flex: 1; }

.rfTitle {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.rfLinks {
  margin-left: auto;
  display: flex;
  gap: 16px;
}
.rfLink {
  color: rgba(255,255,255,0.7);
  font-size: 11px;
  text-decoration: none;
}
.rfLink:hover { color: #fff; text-decoration: underline; }

/* ── Header service ─────────────────── */
.serviceHeader {
  background: var(--bleu-france);
  border-bottom: 3px solid var(--rouge-marianne);
}
.serviceInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand { display: flex; flex-direction: column; gap: 3px; }
.title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.subtitle {
  color: rgba(255,255,255,0.6);
  font-size: 11.5px;
  font-style: italic;
}
.nav { display: flex; gap: 0; }
.navLink {
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 16px;
  border-bottom: 3px solid transparent;
  transition: color 0.15s;
}
.navLink:hover { color: #fff; }
.navLinkActive {
  color: #fff;
  font-weight: 700;
  border-bottom-color: #fff;
}

/* ── Fil d'ariane ───────────────────── */
.breadcrumb {
  background: var(--gris-fond);
  border-bottom: 1px solid var(--bordure);
}
.breadcrumbInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6px 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--texte-secondaire);
}
.breadcrumbLink {
  color: var(--bleu-rf);
  text-decoration: underline;
}
.breadcrumbSep { color: #bbb; }
.breadcrumbCurrent { color: var(--texte-principal); font-weight: 600; }

/* ── Bandeau alerte ─────────────────── */
.alertBand {
  background: #fff3f3;
  border-bottom: 1px solid #f5c6c6;
}
.alertInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.alertBadge {
  background: var(--rouge-marianne);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 2px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}
.alertText {
  font-size: 12.5px;
  color: #333;
  flex: 1;
}
.alertTime {
  font-size: 11px;
  color: #888;
  font-family: monospace;
  margin-left: auto;
}
```

- [ ] **Commit**

```bash
git add src/components/Header.js src/components/Header.module.css
git commit -m "feat: refonte Header — 4 couches DSFR (RF, service, breadcrumb, alerte)"
```

---

### Task 3 : KpiBar → KpiGrid + mise à jour Dashboard

**Files:**
- Modify: `src/components/KpiBar.js`
- Modify: `src/components/KpiBar.module.css`
- Modify: `src/components/Dashboard.js`

- [ ] **Remplacer `KpiBar.js`**

```jsx
// src/components/KpiBar.js
import { getCheeseLevel } from '@/lib/cheese'
import styles from './KpiBar.module.css'

export default function KpiGrid({ attackCount = 0 }) {
  const cheese = getCheeseLevel(attackCount)

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Tableau de bord national</h1>
        <p className={styles.pageSubtitle}>Surveillance en temps réel des cyber-menaces visant les institutions françaises</p>
      </div>
      <div className={styles.grid}>
        <div className={styles.tile} style={{ '--accent': 'var(--bleu-france)' }}>
          <div className={styles.label}>Attaques actives</div>
          <div className={styles.value} style={{ color: 'var(--bleu-france)' }}>
            {attackCount.toLocaleString('fr-FR')}
          </div>
          <div className={styles.sub}>en ce moment</div>
        </div>

        <div className={styles.tile} style={{ '--accent': 'var(--rouge-marianne)' }}>
          <div className={styles.label}>Données exposées</div>
          <div className={styles.value} style={{ color: 'var(--rouge-marianne)' }}>47M</div>
          <div className={styles.sub}>citoyens concernés</div>
        </div>

        <div className={styles.tile} style={{ '--accent': '#888' }}>
          <div className={styles.label}>Taux de blocage</div>
          <div className={styles.value} style={{ color: '#555' }}>3%</div>
          <div className={styles.subCensored}>⬛⬛⬛⬛⬛ confidentiel défense</div>
        </div>

        <div className={styles.tile} style={{ '--accent': '#9933ff' }}>
          <div className={styles.label}>Passoire-o-mètre</div>
          <div className={styles.value} style={{ color: '#9933ff', fontSize: '28px' }}>
            {cheese.emoji} {cheese.pct}%
          </div>
          <div className={styles.sub}>niveau : <strong style={{ color: '#9933ff' }}>{cheese.label}</strong></div>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${cheese.pct}%`, background: '#9933ff' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Remplacer `KpiBar.module.css`**

```css
/* src/components/KpiBar.module.css */
.section {
  background: var(--gris-fond);
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.sectionHeader {
  margin-bottom: 16px;
}

.pageTitle {
  font-size: 22px;
  font-weight: 700;
  color: var(--texte-principal);
  margin: 0 0 4px;
}

.pageSubtitle {
  font-size: 13px;
  color: var(--texte-secondaire);
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tile {
  background: var(--blanc);
  border: 1px solid var(--bordure);
  border-top: 4px solid var(--accent);
  padding: 16px 18px;
}

.label {
  font-size: 11px;
  color: var(--texte-secondaire);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.sub {
  font-size: 11px;
  color: #888;
  margin-top: 6px;
}

.subCensored {
  font-size: 10px;
  color: #aaa;
  margin-top: 6px;
  font-style: italic;
}

.progressTrack {
  margin-top: 10px;
  background: #eee;
  height: 4px;
  border-radius: 2px;
}

.progressBar {
  height: 4px;
  border-radius: 2px;
  transition: width 0.5s ease;
}
```

- [ ] **Mettre à jour `Dashboard.js`**

```jsx
// src/components/Dashboard.js
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from './Header'
import Footer from './Footer'
import KpiGrid from './KpiBar'
import Sidebar from './Sidebar'
import styles from './Dashboard.module.css'

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

  return (
    <div className={styles.page}>
      <Header lastUpdated={lastUpdated} error={error} />
      <div className={styles.content}>
        <KpiGrid attackCount={attacks.length} />
        <div className={styles.main}>
          <AttackMap attacks={attacks} />
          <Sidebar attacks={attacks} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
```

- [ ] **Mettre à jour `Dashboard.module.css`** — ajouter `.content` et supprimer `.status`

```css
/* src/components/Dashboard.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--gris-fond);
}

.main {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px 24px;
  gap: 16px;
  box-sizing: border-box;
}
```

- [ ] **Commit**

```bash
git add src/components/KpiBar.js src/components/KpiBar.module.css src/components/Dashboard.js src/components/Dashboard.module.css
git commit -m "feat: refonte KpiBar → KpiGrid tuiles DSFR + màj Dashboard"
```

---

### Task 4 : AttackMap — badge EN DIRECT + légende

**Files:**
- Modify: `src/components/AttackMap.js`
- Modify: `src/components/AttackMap.module.css`

- [ ] **Modifier `AttackMap.js`** — ajouter le badge et la légende dans le return

Remplacer le `return` (lignes 142-148) par :

```jsx
  return (
    <div className={styles.wrapper}>
      <div className={styles.mapHeader}>
        <span className={styles.mapTitle}>Carte des menaces en temps réel</span>
      </div>
      <div className={styles.chartWrapper}>
        <div ref={chartDivRef} className={styles.chart} />
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          EN DIRECT · {attacks?.length ?? 0} arcs actifs
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#E1000F' }} />DDoS
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#ff6600' }} />Bruteforce
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#9933ff' }} />Scan
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#ffcc00' }} />Intrusion
          </div>
        </div>
      </div>
    </div>
  )
```

- [ ] **Remplacer `AttackMap.module.css`**

```css
/* src/components/AttackMap.module.css */
.wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mapHeader {
  margin-bottom: 8px;
}

.mapTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--texte-principal);
}

.chartWrapper {
  flex: 1;
  background: var(--carte-fond);
  border: 1px solid #1e3a5f;
  border-radius: 4px;
  position: relative;
  min-height: 420px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 420px;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.65);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.75);
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badgeDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--rouge-marianne);
  animation: pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0,20,50,0.82);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 7px 12px;
  border-radius: 3px;
  display: flex;
  gap: 14px;
}

.legendItem {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: rgba(255,255,255,0.7);
  font-family: 'Marianne', Arial, sans-serif;
}

.legendDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
```

- [ ] **Commit**

```bash
git add src/components/AttackMap.js src/components/AttackMap.module.css
git commit -m "feat: AttackMap — badge EN DIRECT animé + légende types d'attaque"
```

---

### Task 5 : Sidebar — panneaux DSFR + barres de proportion

**Files:**
- Modify: `src/components/Sidebar.js`
- Modify: `src/components/Sidebar.module.css`

- [ ] **Remplacer `Sidebar.js`**

```jsx
// src/components/Sidebar.js
import styles from './Sidebar.module.css'

const FLAG_MAP = {
  RU: '🇷🇺', CN: '🇨🇳', US: '🇺🇸', KP: '🇰🇵', IR: '🇮🇷',
  BR: '🇧🇷', IN: '🇮🇳', DE: '🇩🇪', NL: '🇳🇱', UA: '🇺🇦',
}

const TYPE_COLORS = {
  DDoS: '#E1000F',
  Bruteforce: '#ff6600',
  Scan: '#9933ff',
  Intrusion: '#ffcc00',
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

export default function Sidebar({ attacks = [] }) {
  const recent = [...attacks].reverse().slice(0, 10)
  const topCountries = topBy(attacks, 'countryCode')
  const topTargets = topBy(attacks, 'target')
  const countryNames = Object.fromEntries(attacks.map(a => [a.countryCode, a.country]))

  const maxCountry = topCountries[0]?.[1] || 1
  const maxTarget = topTargets[0]?.[1] || 1

  return (
    <aside className={styles.sidebar}>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>⚡ Flux en direct</div>
        <div className={styles.feedList}>
          {recent.length === 0 && (
            <div className={styles.empty}>Chargement…</div>
          )}
          {recent.map((a, i) => (
            <div key={`${a.ip}-${i}`} className={styles.feedItem}>
              <span className={styles.feedDot} style={{ background: a.color }} />
              <span className={styles.feedCountry}>{getFlag(a.countryCode)} {a.country}</span>
              <span className={styles.feedArrow}>→</span>
              <span className={styles.feedTarget}>{a.target}</span>
              <span
                className={styles.feedBadge}
                style={{
                  background: TYPE_COLORS[a.attackType] ?? '#666',
                  color: a.attackType === 'Intrusion' ? '#333' : '#fff',
                }}
              >
                {a.attackType}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>🏆 Top attaquants</div>
        <div className={styles.rankList}>
          {topCountries.map(([code, count]) => (
            <div key={code} className={styles.rankItem}>
              <span className={styles.rankLabel}>{getFlag(code)} {countryNames[code] || code}</span>
              <div className={styles.rankBarTrack}>
                <div
                  className={styles.rankBar}
                  style={{ width: `${(count / maxCountry) * 100}%` }}
                />
              </div>
              <span className={styles.rankCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>🎯 Institutions les plus ciblées</div>
        <div className={styles.rankList}>
          {topTargets.map(([name, count]) => (
            <div key={name} className={styles.rankItem}>
              <span className={styles.rankLabel}>{name}</span>
              <div className={styles.rankBarTrack}>
                <div
                  className={styles.rankBar}
                  style={{ width: `${(count / maxTarget) * 100}%` }}
                />
              </div>
              <span className={styles.rankCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}
```

- [ ] **Remplacer `Sidebar.module.css`**

```css
/* src/components/Sidebar.module.css */
.sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel {
  background: var(--blanc);
  border: 1px solid var(--bordure);
  overflow: hidden;
}

.panelHeader {
  background: var(--bleu-france);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 14px;
  letter-spacing: 0.3px;
}

/* ── Flux en direct ─── */
.feedList {
  display: flex;
  flex-direction: column;
}

.empty {
  padding: 8px 14px;
  font-size: 11px;
  color: var(--texte-secondaire);
}

.feedItem {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}
.feedItem:last-child { border-bottom: none; }

.feedDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.feedCountry { color: #333; font-weight: 600; }
.feedArrow { color: #bbb; font-size: 10px; }
.feedTarget { color: var(--bleu-france); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.feedBadge {
  font-size: 9px;
  padding: 2px 5px;
  border-radius: 2px;
  flex-shrink: 0;
  font-weight: 600;
}

/* ── Classements ─── */
.rankList {
  display: flex;
  flex-direction: column;
}

.rankItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}
.rankItem:last-child { border-bottom: none; }

.rankLabel {
  width: 110px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--texte-principal);
}

.rankBarTrack {
  flex: 1;
  background: #f0f0f0;
  height: 3px;
  border-radius: 2px;
}

.rankBar {
  height: 3px;
  border-radius: 2px;
  background: var(--bleu-france);
  transition: width 0.4s ease;
}

.rankCount {
  font-size: 11px;
  font-weight: 700;
  color: var(--bleu-france);
  min-width: 28px;
  text-align: right;
}
```

- [ ] **Commit**

```bash
git add src/components/Sidebar.js src/components/Sidebar.module.css
git commit -m "feat: refonte Sidebar — panneaux DSFR + barres de proportion + badges type"
```

---

### Task 6 : Footer — structure 3 colonnes

**Files:**
- Modify: `src/components/Footer.js`
- Modify: `src/components/Footer.module.css`

- [ ] **Remplacer `Footer.js`**

```jsx
// src/components/Footer.js
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.col}>
          <div className={styles.colBrand}>
            <div className={styles.tricolor}>
              <span className={styles.tcBlue} />
              <span className={styles.tcWhite} />
              <span className={styles.tcRed} />
            </div>
            <span className={styles.brandName}>France Passoire</span>
          </div>
          <p className={styles.disclaimer}>
            Site parodique et satirique.<br />
            Aucune affiliation avec le gouvernement français, l&apos;ANSSI ou toute institution publique.
          </p>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Liens</div>
          <div className={styles.linkList}>
            <a href="/a-propos" className={styles.footerLink}>À propos</a>
            <a href="https://www.abuseipdb.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>AbuseIPDB</a>
            <a href="https://ip-api.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>ip-api.com</a>
          </div>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Statut</div>
          <div className={styles.statList}>
            <span>Mise à jour : toutes les 90s</span>
            <span>Source : AbuseIPDB API v2</span>
            <span>Hébergement : Vercel</span>
          </div>
        </div>
      </div>

      <div className={styles.footerLegal}>
        <span>© 2024 France Passoire — Œuvre de satire politique au sens de l&apos;art. L.122-5 du CPI</span>
        <span className={styles.version}>v1.0.0 · build stable</span>
      </div>
    </footer>
  )
}
```

- [ ] **Remplacer `Footer.module.css`**

```css
/* src/components/Footer.module.css */
.footer {
  background: var(--bleu-france);
  color: #fff;
  border-top: 3px solid var(--rouge-marianne);
}

.footerMain {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 20px;
  display: flex;
  gap: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}

/* ── Colonnes ─── */
.col { flex: 1; }

.colBrand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.tricolor {
  display: flex;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255,255,255,0.3);
  overflow: hidden;
  flex-shrink: 0;
}
.tcBlue  { background: #002395; flex: 1; }
.tcWhite { background: #ffffff; flex: 1; }
.tcRed   { background: #ED2939; flex: 1; }

.brandName {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.disclaimer {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
  margin: 0;
}

.colTitle {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 10px;
}

.linkList {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footerLink {
  color: rgba(255,255,255,0.75);
  font-size: 12px;
  text-decoration: none;
}
.footerLink:hover { color: #fff; text-decoration: underline; }

.statList {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: rgba(255,255,255,0.65);
  line-height: 1.8;
}

/* ── Bande légale ─── */
.footerLegal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: rgba(255,255,255,0.3);
}

.version {
  font-family: monospace;
  color: rgba(255,255,255,0.2);
}
```

- [ ] **Commit**

```bash
git add src/components/Footer.js src/components/Footer.module.css
git commit -m "feat: refonte Footer — 3 colonnes DSFR + mention légale art. L.122-5 CPI"
```

---

### Task 7 : Page À propos — redesign DSFR

**Files:**
- Modify: `src/app/a-propos/page.js`
- Modify: `src/app/a-propos/page.module.css`

- [ ] **Remplacer `src/app/a-propos/page.js`**

```jsx
// src/app/a-propos/page.js
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.disclaimer}>
            <strong className={styles.disclaimerTitle}>⚠ Avertissement</strong>
            <p className={styles.disclaimerText}>
              Ce site est une œuvre de satire et de parodie. Il n&apos;a aucune affiliation avec le gouvernement français,
              la République française, l&apos;ANSSI ou toute institution publique ou privée française.
            </p>
          </div>

          <h1 className={styles.h1}>À propos de France Passoire</h1>
          <p className={styles.lead}>Transparence sur la nature, les données et les intentions du site</p>
          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.sectionNum}>1</span>
              Nature du site
            </h2>
            <p>
              France Passoire est un <strong>site parodique et satirique</strong>. Le nom, le slogan,
              et le design inspiré de gouv.fr sont utilisés à des fins humoristiques pour commenter
              la cybersécurité en France.
            </p>
            <p>
              Cette œuvre est protégée par l&apos;exception de parodie prévue à
              l&apos;article L.122-5 du Code de la propriété intellectuelle.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.sectionNum}>2</span>
              Sources des données
            </h2>
            <p>Les données affichées proviennent exclusivement de sources publiques :</p>
            <div className={styles.sourceTable}>
              <div className={styles.sourceRow}>
                <span className={styles.apiBadge}>API</span>
                <div>
                  <strong>
                    <a href="https://www.abuseipdb.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                      AbuseIPDB
                    </a>
                  </strong>
                  {' '}— Base de données publique d&apos;adresses IP signalées comme malveillantes par la communauté.
                </div>
              </div>
              <div className={styles.sourceRow}>
                <span className={styles.apiBadge}>API</span>
                <div>
                  <strong>
                    <a href="https://ip-api.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                      ip-api.com
                    </a>
                  </strong>
                  {' '}— Service de géolocalisation d&apos;adresses IP.
                </div>
              </div>
            </div>
            <p>
              L&apos;association entre une adresse IP et une institution française est{' '}
              <strong>fictive et arbitraire</strong>. Elle ne reflète pas de vraies attaques ciblées.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.sectionNum}>3</span>
              Données fictives
            </h2>
            <p>
              Les indicateurs <em>Données exposées</em>, <em>Taux de blocage</em> et{' '}
              <em>Passoire-o-mètre</em> sont entièrement inventés à des fins parodiques.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Remplacer `src/app/a-propos/page.module.css`**

```css
/* src/app/a-propos/page.module.css */
.main {
  background: var(--gris-fond);
  padding: 32px 24px 48px;
  min-height: 60vh;
}

.container {
  max-width: 860px;
  margin: 0 auto;
}

/* ── Disclaimer ─── */
.disclaimer {
  background: #fff3f3;
  border-left: 4px solid var(--rouge-marianne);
  padding: 12px 16px;
  margin-bottom: 28px;
}

.disclaimerTitle {
  display: block;
  color: var(--rouge-marianne);
  font-size: 13px;
  margin-bottom: 4px;
}

.disclaimerText {
  color: #444;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}

/* ── Titre page ─── */
.h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--texte-principal);
  margin: 0 0 6px;
}

.lead {
  font-size: 13px;
  color: var(--texte-secondaire);
  margin: 0 0 20px;
}

.divider {
  border: none;
  border-top: 1px solid var(--bordure);
  margin-bottom: 28px;
}

/* ── Sections ─── */
.section {
  margin-bottom: 28px;
}

.section p {
  font-size: 13px;
  color: var(--texte-principal);
  line-height: 1.7;
  margin: 0 0 10px;
}

.h2 {
  font-size: 17px;
  font-weight: 700;
  color: var(--bleu-france);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sectionNum {
  background: var(--bleu-france);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

/* ── Tableau sources ─── */
.sourceTable {
  border: 1px solid var(--bordure);
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;
}

.sourceRow {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  font-size: 12px;
  border-bottom: 1px solid #f0f0f0;
  line-height: 1.5;
}

.sourceRow:last-child { border-bottom: none; }

.apiBadge {
  background: var(--bleu-france);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 1px;
}

.link {
  color: var(--bleu-france);
  text-decoration: underline;
}
```

- [ ] **Commit**

```bash
git add src/app/a-propos/page.js src/app/a-propos/page.module.css
git commit -m "feat: refonte page À propos — disclaimer, sections DSFR, tableau sources"
```

---

### Task 8 : Vérification finale

- [ ] **Lancer le serveur de dev**

```bash
npm run dev
```

- [ ] **Vérifier visuellement dans le navigateur**

Ouvrir `http://localhost:3000` et contrôler :
- ✓ Police Marianne chargée (textes moins "ronds" qu'Arial)
- ✓ Bandeau "République Française" visible en haut
- ✓ 4 couches header (RF / service / breadcrumb / alerte)
- ✓ Tuiles KPI blanches avec bordure top colorée
- ✓ Titre H1 "Tableau de bord national" au-dessus des KPIs
- ✓ Badge EN DIRECT animé sur la carte
- ✓ Légende 4 couleurs en bas-gauche de la carte
- ✓ Sidebar : panneaux blancs avec header bleu
- ✓ Footer 3 colonnes avec mention légale

Ouvrir `http://localhost:3000/a-propos` et contrôler :
- ✓ Bandeau alerte rouge en haut du contenu
- ✓ Sections numérotées avec puces bleues circulaires
- ✓ Tableau sources avec badges API

- [ ] **Confirmer que les tests existants passent**

```bash
npm test
```

Expected: toutes les suites `lib/` passent (attackTypes, cheese, hashTarget, attacks API).

- [ ] **Commit final si tout est OK**

```bash
git add -A
git commit -m "chore: vérification finale refonte UI DSFR"
```
