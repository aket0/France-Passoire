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
