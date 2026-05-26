// src/components/Footer.js
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      Site parodique et satirique · Aucune affiliation avec le gouvernement français, l'ANSSI ou toute institution ·
      Données issues de <a href="https://www.abuseipdb.com" target="_blank" rel="noopener">AbuseIPDB</a> et{' '}
      <a href="https://ip-api.com" target="_blank" rel="noopener">ip-api.com</a> ·
      Mise à jour toutes les 90 secondes
    </footer>
  )
}
