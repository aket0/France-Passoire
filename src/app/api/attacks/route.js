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
