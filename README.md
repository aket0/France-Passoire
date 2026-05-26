# France Passoire 🇫🇷

> Site parodique et satirique — aucune affiliation avec le gouvernement français, l'ANSSI ou toute institution publique.

**France Passoire** est un tableau de bord de surveillance en temps réel des cyber-attaques visant les institutions françaises, habillé aux couleurs du Design System de l'État (DSFR). Les données sont réelles : les IP proviennent de la blacklist [AbuseIPDB](https://www.abuseipdb.com/) et ne sont affichées que si elles ont été signalées par des entités françaises.

## Aperçu

- Carte mondiale des menaces en temps réel (arcs animés)
- KPIs nationaux : attaques actives, données exposées, passoire-o-mètre
- Flux en direct et classement par pays
- Mise à jour automatique toutes les 90 secondes
- Design calqué sur le DSFR (police Marianne, bleu France, rouge Marianne)

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [amCharts 5](https://www.amcharts.com/) — carte globe animée
- [AbuseIPDB API v2](https://docs.abuseipdb.com/) — source des IP malveillantes
- [ip-api.com](https://ip-api.com/) — géolocalisation des attaquants
- Déployé sur [Vercel](https://vercel.com/)

## Installation

```bash
git clone https://github.com/aket0/France-Passoire.git
cd France-Passoire
npm install
cp .env.example .env.local
# Renseigner ABUSEIPDB_API_KEY dans .env.local
npm run dev
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `ABUSEIPDB_API_KEY` | Clé API AbuseIPDB (gratuit, 1 000 req/jour) |

## Données

Les attaques affichées sont issues de la blacklist AbuseIPDB (confiance ≥ 85 %) et filtrées pour ne conserver que les IP signalées par des entités françaises (`reporterCountryCode: FR`). Le cache est de 4 heures (~186 requêtes/jour sur les 1 000 autorisées).

Les noms d'institutions cibles sont attribués par hachage de l'IP — ils sont satiriques et ne correspondent pas aux victimes réelles.

## Licence

Œuvre de satire politique au sens de l'art. L.122-5 du CPI.
