// src/components/Header.js
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>🇫🇷</span>
      <div className={styles.brand}>
        <span className={styles.title}>FRANCE PASSOIRE</span>
        <span className={styles.subtitle}>Liberté · Égalité · Vulnérabilité</span>
      </div>
      <nav className={styles.nav}>
        <Link href="/a-propos" className={styles.navLink}>À propos</Link>
      </nav>
      <div className={styles.slogan}>
        <div className={styles.sloganLabel}>Slogan officiel</div>
        <div className={styles.sloganText}>&ldquo;Suivez en direct l&apos;état de la passoire&rdquo;</div>
      </div>
    </header>
  )
}
