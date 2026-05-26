import { getCheeseLevel } from '@/lib/cheese'
import styles from './KpiBar.module.css'

export default function KpiGrid({ attackCount = 0 }) {
  const cheese = getCheeseLevel(attackCount)

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.pageTitle}>Tableau de bord national</h1>
        <p className={styles.pageSubtitle}>Surveillance en temps réel des cyber-menaces visant les institutions françaises</p>
      </div>
      <div className={styles.grid}>
        <div className={styles.tile} style={{ '--accent': 'var(--bleu-france)' }}>
          <div className={styles.label}>Attaques actives</div>
          <div className={styles.value} style={{ color: 'var(--bleu-france)' }}>
            {attackCount.toLocaleString('fr-FR')}
          </div>
          <div className={styles.sub}>en ce moment</div>
        </div>

        <div className={styles.tile} style={{ '--accent': 'var(--rouge-marianne)' }}>
          <div className={styles.label}>Données exposées</div>
          <div className={styles.value} style={{ color: 'var(--rouge-marianne)' }}>47M</div>
          <div className={styles.sub}>citoyens concernés</div>
        </div>

        <div className={styles.tile} style={{ '--accent': '#888' }}>
          <div className={styles.label}>Taux de blocage</div>
          <div className={styles.value} style={{ color: '#555' }}>3%</div>
          <div className={styles.subCensored}>⬛⬛⬛⬛⬛ confidentiel défense</div>
        </div>

        <div className={styles.tile} style={{ '--accent': '#9933ff' }}>
          <div className={styles.label}>Passoire-o-mètre</div>
          <div className={styles.value} style={{ color: '#9933ff', fontSize: '28px' }}>
            {cheese.emoji} {cheese.pct}%
          </div>
          <div className={styles.sub}>niveau : <strong style={{ color: '#9933ff' }}>{cheese.label}</strong></div>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${cheese.pct}%`, background: '#9933ff' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
