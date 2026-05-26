// src/components/KpiBar.js
import { getCheeseLevel } from '@/lib/cheese'
import styles from './KpiBar.module.css'

export default function KpiBar({ attackCount = 0 }) {
  const cheese = getCheeseLevel(attackCount)

  return (
    <div className={styles.bar}>
      <div className={styles.kpi}>
        <div className={styles.label}>Attaques actives</div>
        <div className={styles.value}>{attackCount.toLocaleString('fr-FR')}</div>
        <div className={styles.sub}>en ce moment</div>
      </div>
      <div className={styles.kpi}>
        <div className={styles.label}>Données exposées</div>
        <div className={styles.value}>47M</div>
        <div className={styles.sub}>citoyens concernés</div>
      </div>
      <div className={styles.kpi}>
        <div className={styles.label}>Taux de blocage</div>
        <div className={styles.value}>3%</div>
        {/* confidentiel défense */}
        <div className={styles.sub}>record historique bas</div>
      </div>
      <div className={styles.kpi}>
        <div className={styles.label}>Passoire-o-mètre</div>
        <div className={styles.value}>{cheese.emoji} {cheese.pct}%</div>
        <div className={styles.sub}>niveau : {cheese.label}</div>
      </div>
    </div>
  )
}
