# France Passoire — Design Spec

**Slogan :** "Suivez en direct l'état de la passoire"  
**URL cible :** france-passoire.vercel.app  
**Nature :** Site parodique, aucune affiliation avec le gouvernement français

---

## 1. Objectif

Site de monitoring en temps réel des cyber-attaques visant les institutions et entreprises françaises. Parodie des sites officiels du gouvernement français (design system gouv.fr). Accessible sans authentification.

---

## 2. Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Carte | amCharts 5 (MapChart + ArcSeries) — licence non-commerciale |
| Source de données | AbuseIPDB API v2 (free tier, 1000 req/jour) |
| Géolocalisation IPs | ip-api.com (batch, gratuit) |
| Hébergement | Vercel (plan gratuit) |
| Styles | CSS Modules + variables couleurs gouv.fr |

---

## 3. Architecture

### Routes

```
/                   → page principale (carte + dashboard)
/a-propos           → page disclaimer parodique
/api/attacks        → proxy AbuseIPDB + cache 90s (serverless Vercel)
```

### Flux de données

```
AbuseIPDB API (blacklist récente, limit=100)
  → GET /api/attacks (Vercel serverless, cache in-memory 90s TTL)
    → géolocalise les IPs via ip-api.com (batch jusqu'à 100 IPs)
    → assigne une institution FR cible (hash déterministe de l'IP)
    → retourne JSON : [{ ip, srcLat, srcLng, country, countryCode, target, attackType }]
      → Frontend poll toutes les 90s
        → amCharts ArcSeries dessine les arcs animés
```

### Cache

- Cache in-memory dans la route `/api/attacks` (variable module Node.js persistée entre les invocations Vercel tant que le container est chaud).
- TTL 90 secondes. Si le cache est froid ou expiré, appel AbuseIPDB puis ip-api.com.
- Pas de base de données, pas de Redis — 100% stateless.

---

## 4. Données

### Institutions françaises cibles (hardcodées)

Chaque IP entrante reçoit une cible via `hash(ip) % institutions.length` pour que la même IP pointe toujours vers la même institution :

- Élysée, Sénat, Assemblée nationale
- SNCF, RATP
- AP-HP, Min. Santé
- Pôle Emploi, CAF
- BNF, Min. Éducation
- Min. Défense, Min. Intérieur
- EDF, La Poste

### Types d'attaque (déduits des catégories AbuseIPDB)

| Catégorie AbuseIPDB | Label affiché | Couleur arc |
|---|---|---|
| 4 (DDoS) | DDoS | Rouge `#E1000F` |
| 18 (Brute-Force) | Bruteforce | Orange `#ff6600` |
| 14 (Port Scan) | Scan | Violet `#9933ff` |
| Autres | Intrusion | Jaune `#ffcc00` |

---

## 5. Interface utilisateur

### Header

Fond bleu marine `#001489`, bordure basse rouge `#E1000F`. Logo drapeau français + "FRANCE PASSOIRE" + sous-titre "Liberté · Égalité · Vulnérabilité". Slogan affiché à droite.

### Barre KPIs (4 indicateurs)

Affichés en blanc avec accent rouge, mis à jour à chaque poll :

1. **Attaques actives** — count total des IPs dans la réponse API courante (valeur réelle)
2. **Données exposées** — valeur fixe fictive humoristique ("47M citoyens")
3. **Taux de blocage** — valeur fictive parodique fixe ("3%"), jamais mise à jour, commentaire interne "confidentiel défense"
4. **Passoire-o-mètre** — pourcentage fictif basé sur `(attaquesActives / 2000 * 100)` plafonné à 99%, avec niveau fromage (emmental < 50%, gruyère 50-75%, mimolette > 75%)

### Zone principale : Carte + Sidebar

**Carte (flex 2/3) :**
- Fond sombre `#0d1b2e`, carte mondiale amCharts 5
- France mise en évidence (couleur distincte, légèrement zoomée)
- Arcs animés depuis le pays source vers Paris, colorés par type d'attaque
- Tooltip au survol d'un arc : IP, pays, institution cible, type d'attaque
- Les arcs s'animent en boucle — nouveaux arcs toutes les ~2s pour fluidifier visuellement entre les polls de 90s

**Sidebar (flex 1/3) :**
- **Flux en direct** : liste scrollable des 10 dernières attaques (pays → institution, type)
- **Top attaquants** : top 5 pays par volume, avec drapeau emoji et compteur
- **Plus ciblées** : top 5 institutions françaises par volume reçu

### Footer

Fond bleu `#001489`, texte blanc discret : mention parodique + source AbuseIPDB + fréquence de mise à jour.

---

## 6. Page `/a-propos`

Courte page dans le même style gouv.fr avec :
- Explication que le site est parodique et satirique
- Source des données (AbuseIPDB, ip-api.com)
- Aucune affiliation avec le gouvernement français, l'ANSSI, ou toute institution

---

## 7. Variables d'environnement

```env
ABUSEIPDB_API_KEY=   # clé AbuseIPDB (compte gratuit à créer)
```

Stockée comme variable d'environnement Vercel. Aucune autre variable requise.

---

## 8. Déploiement Vercel

- Connecter le repo GitHub à Vercel (auto-deploy sur push `main`)
- Ajouter `ABUSEIPDB_API_KEY` dans les variables d'environnement Vercel
- Plan gratuit suffisant (serverless functions + static hosting)
- Ajouter `.superpowers/` au `.gitignore`
