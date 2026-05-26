// src/components/Dashboard.js
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from './Header'
import Footer from './Footer'
import KpiBar from './KpiBar'
import Sidebar from './Sidebar'
import styles from './Dashboard.module.css'

// Import dynamique pour éviter le SSR d'amCharts
const AttackMap = dynamic(() => import('./AttackMap'), { ssr: false })

const POLL_INTERVAL = 90_000

export default function Dashboard() {
  const [attacks, setAttacks] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  async function fetchAttacks() {
    try {
      const res = await fetch('/api/attacks')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setAttacks(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchAttacks()
    const id = setInterval(fetchAttacks, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('fr-FR')
    : 'chargement...'

  return (
    <div className={styles.page}>
      <Header />
      <KpiBar attackCount={attacks.length} />
      <div className={styles.main}>
        <AttackMap attacks={attacks} />
        <Sidebar attacks={attacks} />
      </div>
      <Footer />
      <div className={styles.status}>
        {error ? `⚠ ${error}` : `✓ màj ${timeStr}`}
      </div>
    </div>
  )
}
