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
