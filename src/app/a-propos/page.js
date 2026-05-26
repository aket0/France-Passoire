// src/app/a-propos/page.js
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.disclaimer}>
            <strong className={styles.disclaimerTitle}>⚠ Avertissement</strong>
            <p className={styles.disclaimerText}>
              Ce site est une œuvre de satire et de parodie. Il n&apos;a aucune affiliation avec le gouvernement français,
              la République française, l&apos;ANSSI ou toute institution publique ou privée française.
            </p>
          </div>

          <h1 className={styles.h1}>À propos de France Passoire</h1>
          <p className={styles.lead}>Transparence sur la nature, les données et les intentions du site</p>
          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.sectionNum}>1</span>
              Nature du site
            </h2>
            <p>
              France Passoire est un <strong>site parodique et satirique</strong>. Le nom, le slogan,
              et le design inspiré de gouv.fr sont utilisés à des fins humoristiques pour commenter
              la cybersécurité en France.
            </p>
            <p>
              Cette œuvre est protégée par l&apos;exception de parodie prévue à
              l&apos;article L.122-5 du Code de la propriété intellectuelle.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.sectionNum}>2</span>
              Sources des données
            </h2>
            <p>Les données affichées proviennent exclusivement de sources publiques :</p>
            <div className={styles.sourceTable}>
              <div className={styles.sourceRow}>
                <span className={styles.apiBadge}>API</span>
                <div>
                  <strong>
                    <a href="https://www.abuseipdb.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                      AbuseIPDB
                    </a>
                  </strong>
                  {' '}— Base de données publique d&apos;adresses IP signalées comme malveillantes par la communauté.
                </div>
              </div>
              <div className={styles.sourceRow}>
                <span className={styles.apiBadge}>API</span>
                <div>
                  <strong>
                    <a href="https://ip-api.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                      ip-api.com
                    </a>
                  </strong>
                  {' '}— Service de géolocalisation d&apos;adresses IP.
                </div>
              </div>
            </div>
            <p>
              L&apos;association entre une adresse IP et une institution française est{' '}
              <strong>fictive et arbitraire</strong>. Elle ne reflète pas de vraies attaques ciblées.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>
              <span className={styles.sectionNum}>3</span>
              Données fictives
            </h2>
            <p>
              Les indicateurs <em>Données exposées</em>, <em>Taux de blocage</em> et{' '}
              <em>Passoire-o-mètre</em> sont entièrement inventés à des fins parodiques.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
