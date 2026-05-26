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
