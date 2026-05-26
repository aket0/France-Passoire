// src/components/Header.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

const BREADCRUMBS = {
  '/': 'Tableau de bord national',
  '/a-propos': 'À propos',
}

export default function Header({ lastUpdated = null, error = null }) {
  const pathname = usePathname()
  const timeStr = lastUpdated ? lastUpdated.toLocaleTimeString('fr-FR') : null

  return (
    <header>
      {/* Bandeau République Française */}
      <div className={styles.rfBand}>
        <div className={styles.rfInner}>
          <div className={styles.tricolor}>
            <span className={styles.tcBlue} />
            <span className={styles.tcWhite} />
            <span className={styles.tcRed} />
          </div>
          <span className={styles.rfTitle}>République Française</span>
          <div className={styles.rfLinks}>
            <a href="https://www.france.fr" target="_blank" rel="noopener noreferrer" className={styles.rfLink}>France.fr</a>
            <a href="https://data.gouv.fr" target="_blank" rel="noopener noreferrer" className={styles.rfLink}>data.gouv.fr</a>
          </div>
        </div>
      </div>

      {/* Header service */}
      <div className={styles.serviceHeader}>
        <div className={styles.serviceInner}>
          <div className={styles.brand}>
            <span className={styles.title}>France Passoire</span>
            <span className={styles.subtitle}>Ministère de la Passoire Numérique · Liberté · Égalité · Vulnérabilité</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>
              Tableau de bord
            </Link>
            <Link href="/a-propos" className={`${styles.navLink} ${pathname === '/a-propos' ? styles.navLinkActive : ''}`}>
              À propos
            </Link>
          </nav>
        </div>
      </div>

      {/* Fil d'ariane */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/" className={styles.breadcrumbLink}>Accueil</Link>
          <span className={styles.breadcrumbSep}>&rsaquo;</span>
          <span className={styles.breadcrumbCurrent}>{BREADCRUMBS[pathname] ?? 'Page'}</span>
        </div>
      </div>

      {/* Bandeau alerte */}
      <div className={styles.alertBand}>
        <div className={styles.alertInner}>
          <span className={styles.alertBadge}>ALERTE</span>
          <span className={styles.alertText}>
            Niveau de menace cybernétique nationale : <strong>ÉLEVÉ</strong>
            {' '}— Mise à jour automatique toutes les 90 secondes
          </span>
          <span className={styles.alertTime}>
            {error ? `⚠ ${error}` : timeStr ? `✓ màj ${timeStr}` : 'chargement…'}
          </span>
        </div>
      </div>
    </header>
  )
}
