// src/components/Footer.js
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.col}>
          <div className={styles.colBrand}>
            <div className={styles.tricolor}>
              <span className={styles.tcBlue} />
              <span className={styles.tcWhite} />
              <span className={styles.tcRed} />
            </div>
            <span className={styles.brandName}>France Passoire</span>
          </div>
          <p className={styles.disclaimer}>
            Site parodique et satirique.<br />
            Aucune affiliation avec le gouvernement français, l&apos;ANSSI ou toute institution publique.
          </p>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Liens</div>
          <div className={styles.linkList}>
            <a href="/a-propos" className={styles.footerLink}>À propos</a>
            <a href="https://www.abuseipdb.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>AbuseIPDB</a>
            <a href="https://ip-api.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>ip-api.com</a>
          </div>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Statut</div>
          <div className={styles.statList}>
            <span>Mise à jour : toutes les 90s</span>
            <span>Source : AbuseIPDB API v2</span>
            <span>Hébergement : Vercel</span>
          </div>
        </div>
      </div>

      <div className={styles.footerLegal}>
        <span>© 2024 France Passoire — Œuvre de satire politique au sens de l&apos;art. L.122-5 du CPI</span>
        <span className={styles.version}>v1.0.0 · build stable</span>
      </div>
    </footer>
  )
}
