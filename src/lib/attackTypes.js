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
