// src/app/a-propos/page.js
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>À propos de France Passoire</h1>

          <section className={styles.section}>
            <h2>Nature du site</h2>
            <p>
              France Passoire est un <strong>site parodique et satirique</strong>. Il n&apos;a aucune
              affiliation avec le gouvernement français, la République française, l&apos;ANSSI,
              ni aucune institution publique ou privée française.
            </p>
            <p>
              Le nom, le slogan, et le design inspiré de gouv.fr sont utilisés à des fins
              humoristiques pour commenter la cybersécurité en France.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Sources des données</h2>
            <p>Les données affichées proviennent exclusivement de sources publiques :</p>
            <ul>
              <li>
                <a href="https://www.abuseipdb.com" target="_blank" rel="noopener noreferrer">AbuseIPDB</a> —
                base de données publique d&apos;adresses IP signalées comme malveillantes par la communauté.
              </li>
              <li>
                <a href="https://ip-api.com" target="_blank" rel="noopener noreferrer">ip-api.com</a> —
                service de géolocalisation d&apos;adresses IP.
              </li>
            </ul>
            <p>
              L&apos;association entre une adresse IP et une institution française est <strong>fictive et arbitraire</strong>.
              Elle ne reflète pas de vraies attaques ciblées contre ces institutions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Données fictives</h2>
            <p>
              Les indicateurs &quot;Données exposées&quot;, &quot;Taux de blocage&quot; et &quot;Passoire-o-mètre&quot;
              sont entièrement inventés à des fins parodiques.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
