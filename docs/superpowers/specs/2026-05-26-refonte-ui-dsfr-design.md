# Refonte UI/UX — Design System DSFR · France Passoire

**Date :** 2026-05-26  
**Statut :** Validé  

---

## 1. Objectif

Refondre l'interface de France Passoire pour coller au maximum à la direction artistique des sites gouvernementaux français (DSFR — Design System de l'État). La parodie doit être crédible à première vue : forme officielle, contenu absurde.

**Principes retenus :**
- Fidélité maximale au DSFR (clone officiel)
- Carte encadrée dans une grille DSFR blanche (pas d'écran noir plein écran)
- Police Marianne chargée depuis CDN officiel
- Ton sobre — l'humour vient uniquement du contenu, pas de la forme

---

## 2. Typographie

Charger la police **Marianne** via le CDN DSFR officiel dans `globals.css` :

```css
@import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.11.2/dist/fonts/fonts.css');
```

Stack : `'Marianne', Arial, 'Helvetica Neue', sans-serif` — appliquer à `body`.

---

## 3. Couleurs (inchangées, déjà correctes)

```css
--bleu-france: #001489;
--bleu-rf: #003189;       /* nouveau — bandeau République Française */
--rouge-marianne: #E1000F;
--gris-fond: #f6f6f6;     /* légère harmonisation (était #f5f5f0) */
--blanc: #ffffff;
--texte-principal: #1e1e1e;
--texte-secondaire: #666666;
--bordure: #dddddd;
```

---

## 4. Composant : Header

**Structure en 4 couches :**

### 4.1 Bandeau "République Française"
- Fond `#003189`
- Drapeau tricolore SVG (3 bandes verticales #002395 / #fff / #ED2939, 22×22px)
- Texte "République Française" — Marianne 13px bold blanc
- Liens discrets à droite : France.fr, data.gouv.fr — 11px rgba(255,255,255,0.75)

### 4.2 Header service
- Fond `#001489`, bordure bas 3px `#E1000F`
- Titre : "France Passoire" — Marianne 20px bold blanc
- Sous-titre : "Ministère de la Passoire Numérique · Liberté · Égalité · Vulnérabilité" — 11.5px italic rgba(255,255,255,0.6)
- Navigation à droite : "Tableau de bord" (page active : underline blanc 2px) / "À propos"

### 4.3 Fil d'ariane
- Fond `#f6f6f6`, bordure bas `#e5e5e5`
- "Accueil › Tableau de bord national" — 12px, lien en `#003189` souligné

### 4.4 Bandeau d'alerte
- Fond `#fff3f3`, bordure bas 1px `#E1000F`
- Badge rouge "ALERTE" + texte niveau de menace + timestamp de mise à jour à droite

---

## 5. Composant : KpiBar → KpiGrid

Remplacer la barre horizontale compacte par une **grille 4 colonnes** de tuiles DSFR.

**Chaque tuile :**
- Fond blanc, bordure `#ddd`, bordure top 4px colorée
- Label : 11px uppercase letter-spacing 0.8px couleur `#666`
- Valeur : 32px bold (28px pour le Passoire-o-mètre avec emoji)
- Sous-texte : 11px `#888`

**Couleurs de bordure top :**
- Attaques actives → `#001489` (bleu)
- Données exposées → `#E1000F` (rouge)
- Taux de blocage → `#888` (gris — valeur censurée, sous-texte "⬛⬛⬛⬛⬛ confidentiel défense")
- Passoire-o-mètre → `#9933ff` (violet) + barre de progression sous la valeur

**Au-dessus de la grille :** titre H1 "Tableau de bord national" + sous-titre descriptif.

---

## 6. Composant : AttackMap

Pas de changements fonctionnels. Changements visuels :

- Titre de section "Carte des menaces en temps réel" au-dessus (13px bold)
- Badge position absolue haut-gauche : "🔴 EN DIRECT · N arcs actifs" — fond `rgba(0,0,0,0.6)`, bordure subtile, monospace
- Légende bas-gauche intégrée dans la carte (fond semi-transparent) : 4 points colorés + labels (DDoS / Bruteforce / Scan / Intrusion)
- La carte reste sur fond sombre `#0d1b2e`, border-radius 4px, bordure `#1e3a5f`

---

## 7. Composant : Sidebar

**Structure panneaux blancs DSFR :**
- Fond blanc, bordure `#ddd`
- Header de chaque panneau : fond `#001489`, texte blanc 12px bold, padding 8px 14px

**Flux en direct :**
- Chaque entrée : point coloré (6px) + pays bold + flèche gris → institution bleue + badge type (fond coloré, texte blanc, 10px)
- Bordure entre entrées `#f0f0f0`

**Top attaquants / Plus ciblées :**
- Chaque ligne : label + barre de proportion horizontale (fond `#f0f0f0`, remplissage coloré, 3px hauteur) + compteur bold bleu
- Barre de proportion = valeur relative au max du classement

---

## 8. Composant : Footer

**Structure 3 colonnes** dans fond `#001489`, séparateur `#E1000F` 3px en haut :

- **Colonne 1 (Identité) :** Drapeau tricolore + "France Passoire" + disclaimer une ligne
- **Colonne 2 (Liens) :** À propos, AbuseIPDB, ip-api.com
- **Colonne 3 (Statut) :** Fréquence mise à jour, source, hébergement

**Bande légale** en bas : "© 2024 France Passoire — Œuvre de satire politique au sens de l'art. L.122-5 du CPI" (10px, très discret) + version en monospace à droite.

---

## 9. Page `/a-propos`

**Alerte disclaimer** en haut : fond `#fff3f3`, bordure gauche 4px `#E1000F`, texte bold rouge + explication.

**Titre H1 DSFR** + sous-titre gris + séparateur.

**3 sections numérotées** avec puces circulaires bleues (`#001489`) :
1. Nature du site — référence à l'art. L.122-5 CPI
2. Sources des données — tableau bordé avec badges "API" pour AbuseIPDB et ip-api.com
3. Données fictives — explication des indicateurs parodiques

Fil d'ariane : Accueil › À propos.

---

## 10. Layout global

```
┌──────────────────────────────────────────────┐
│ Bandeau République Française (003189)        │
├──────────────────────────────────────────────┤
│ Header service (001489) + nav                │
├──────────────────────────────────────────────┤
│ Fil d'ariane (f6f6f6)                        │
├──────────────────────────────────────────────┤
│ Bandeau alerte (fff3f3)                      │
├──────────────────────────────────────────────┤
│ KPI Grid — 4 tuiles blanches (padding 24px)  │
├──────────────────────────────────────────┬───┤
│ Carte (flex 2/3, fond sombre, h: 420px)  │ S │
│                                          │ i │
│  [badge EN DIRECT]      [légende bas]    │ d │
│                                          │ e │
│                                          │ b │
│                                          │ a │
│                                          │ r │
├──────────────────────────────────────────┴───┤
│ Footer 3 colonnes (001489)                   │
└──────────────────────────────────────────────┘
```

Container max-width 1200px, padding horizontal 24px, gap grille 16px.

---

## 11. Fichiers à modifier

| Fichier | Nature du changement |
|---|---|
| `src/app/globals.css` | Import Marianne, ajout `--bleu-rf`, harmonisation `--gris-fond` |
| `src/components/Header.js` | 4 couches (bandeau RF, header service, fil d'ariane, alerte) |
| `src/components/Header.module.css` | Refonte complète |
| `src/components/KpiBar.js` | Composant renommé en `KpiGrid` (fichier garde son nom), tuiles individuelles, titre H1 au-dessus |
| `src/components/KpiBar.module.css` | Refonte complète |
| `src/components/AttackMap.js` | Badge EN DIRECT, légende intégrée |
| `src/components/AttackMap.module.css` | Badge + légende |
| `src/components/Sidebar.js` | Panneaux blancs + barres de proportion |
| `src/components/Sidebar.module.css` | Refonte complète |
| `src/components/Footer.js` | Structure 3 colonnes + mention légale |
| `src/components/Footer.module.css` | Refonte complète |
| `src/components/Dashboard.js` | Passer `lastUpdated` au Header pour le bandeau alerte ; mettre à jour l'import KpiBar → KpiGrid |
| `src/app/a-propos/page.js` | Disclaimer rouge, sections numérotées, tableau sources |
| `src/app/a-propos/page.module.css` | Refonte complète |
