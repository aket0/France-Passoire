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
