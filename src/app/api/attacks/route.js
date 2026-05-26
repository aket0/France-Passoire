// src/app/api/attacks/route.js
import { hashTarget } from '@/lib/hashTarget'

// AbuseIPDB category IDs → types d'attaque réels
const CATEGORY_TYPE = {
  4:  { label: 'DDoS',       color: '#E1000F' },
  18: { label: 'Bruteforce', color: '#ff6600' },
  14: { label: 'Scan',       color: '#9933ff' },
}
const DEFAULT_TYPE = { label: 'Intrusion', color: '#ffcc00' }

function typeFromCategories(categories = []) {
  for (const id of [4, 18, 14]) {
    if (categories.includes(id)) return CATEGORY_TYPE[id]
  }
  return DEFAULT_TYPE
}

async function checkVerbose(ip, apiKey) {
  try {
    const res = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&verbose=true&maxAgeInDays=30`,
      { headers: { Key: apiKey, Accept: 'application/json' } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Cache 4h — 30 IPs × verbose check = 31 req/refresh
// 6 refreshes/jour × 31 = 186 req/jour (limit free tier : 1 000/jour)
let cache = { data: null, timestamp: 0 }
const CACHE_TTL = 4 * 60 * 60 * 1000

export async function GET() {
  const now = Date.now()
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data)
  }

  const apiKey = process.env.ABUSEIPDB_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  // 1. Blacklist — 30 IPs haute confiance
  const blacklistRes = await fetch(
    'https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=85&limit=30',
    { headers: { Key: apiKey, Accept: 'application/json' } }
  )
  if (!blacklistRes.ok) {
    return Response.json({ error: 'AbuseIPDB error' }, { status: 502 })
  }
  const { data: ipList } = await blacklistRes.json()
  const ips = ipList.map(e => e.ipAddress)

  if (ips.length === 0) {
    cache = { data: [], timestamp: now }
    return Response.json([])
  }

  // 2. Verbose check par batch de 10 pour éviter le rate-limit concurrent
  const checks = []
  for (let i = 0; i < ips.length; i += 10) {
    const batch = await Promise.all(
      ips.slice(i, i + 10).map(ip => checkVerbose(ip, apiKey))
    )
    checks.push(...batch)
    if (i + 10 < ips.length) await new Promise(r => setTimeout(r, 250))
  }

  // 3. Filtrer : garder uniquement les IPs signalées par des entités françaises (FR)
  //    → preuve que l'IP a réellement ciblé la France
  const frenchTargeted = ips
    .map((ip, i) => ({ ip, check: checks[i] }))
    .filter(({ check }) =>
      check?.data?.reports?.some(r => r.reporterCountryCode === 'FR')
    )

  if (frenchTargeted.length === 0) {
    cache = { data: [], timestamp: now }
    return Response.json([])
  }

  // 4. Géolocalisation des IPs attaquantes confirmées
  const targetIps = frenchTargeted.map(({ ip }) => ip)
  let geoData = []
  try {
    const geoRes = await fetch(
      'http://ip-api.com/batch?fields=status,country,countryCode,lat,lon,query',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetIps.map(ip => ({ query: ip }))),
      }
    )
    geoData = await geoRes.json()
  } catch {
    cache = { data: [], timestamp: now }
    return Response.json([])
  }

  // 5. Construction des attaques — types réels depuis les catégories AbuseIPDB
  const attacks = frenchTargeted
    .map(({ ip, check }, i) => {
      const geo = geoData[i]
      if (geo?.status !== 'success' || geo.countryCode === 'FR') return null

      // Catégories du rapport FR le plus récent → type d'attaque réel
      const frReport = check.data.reports
        .filter(r => r.reporterCountryCode === 'FR')
        .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))[0]

      const type = typeFromCategories(frReport?.categories ?? [])
      const target = hashTarget(ip)

      return {
        ip,
        srcLat: geo.lat,
        srcLng: geo.lon,
        country: geo.country,
        countryCode: geo.countryCode,
        target: target.name,
        attackType: type.label,
        color: type.color,
      }
    })
    .filter(Boolean)

  cache = { data: attacks, timestamp: now }
  return Response.json(attacks)
}
