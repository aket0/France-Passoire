// src/components/AttackMap.js
'use client'

import { useEffect, useRef } from 'react'
import { PARIS } from '@/lib/institutions'
import styles from './AttackMap.module.css'

export default function AttackMap({ attacks }) {
  const chartDivRef = useRef(null)
  const rootRef = useRef(null)
  const lineSeriesRef = useRef(null)
  const queueRef = useRef([])
  const timerRef = useRef(null)

  // Initialise la carte une seule fois
  useEffect(() => {
    let root

    async function init() {
      const am5 = await import('@amcharts/amcharts5')
      const am5map = await import('@amcharts/amcharts5/map')
      const geodata = (await import('@amcharts/amcharts5-geodata/worldLow')).default
      const AnimatedTheme = (await import('@amcharts/amcharts5/themes/Animated')).default

      root = am5.Root.new(chartDivRef.current)
      root.setThemes([AnimatedTheme.new(root)])
      rootRef.current = root

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
          panX: 'rotateX',
          wheelY: 'zoom',
        })
      )

      // Fond pays
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: geodata,
          exclude: ['AQ'],
        })
      )
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color('#1a3a5c'),
        fillOpacity: 0.9,
        stroke: am5.color('#2a4a6c'),
        strokeWidth: 0.5,
        tooltipText: '{name}',
      })
      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color('#2a5080'),
      })
      // France en bleu france
      polygonSeries.events.on('datavalidated', () => {
        polygonSeries.mapPolygons.each(polygon => {
          if (polygon.dataItem?.get('id') === 'FR') {
            polygon.set('fill', am5.color('#001489'))
          }
        })
      })

      // Série de lignes d'attaque
      const lineSeries = chart.series.push(
        am5map.MapLineSeries.new(root, {})
      )
      lineSeries.mapLines.template.setAll({
        strokeOpacity: 0.5,
        strokeWidth: 1.5,
        stroke: am5.color('#E1000F'),
      })
      // Couleur par ligne depuis dataContext
      lineSeries.mapLines.template.adapters.add('stroke', (stroke, target) => {
        const ctx = target.dataItem?.dataContext
        return ctx?.color ? am5.color(ctx.color) : stroke
      })
      // Bullet animé sur chaque ligne
      lineSeries.bullets.push(() => {
        const circle = am5.Circle.new(root, {
          radius: 3,
          fill: am5.color('#ffffff'),
          strokeOpacity: 0,
        })
        circle.animate({
          key: 'locationX',
          from: 0,
          to: 1,
          duration: 1800,
          loops: Infinity,
          easing: am5.ease.linear,
        })
        return am5.Bullet.new(root, { sprite: circle })
      })

      lineSeriesRef.current = lineSeries
    }

    init()
    return () => { root?.dispose() }
  }, [])

  // Quand attacks change, recharge la queue et relance le défilement
  useEffect(() => {
    if (!attacks || attacks.length === 0) return

    queueRef.current = [...attacks]

    if (timerRef.current) clearInterval(timerRef.current)

    function drainQueue() {
      const lineSeries = lineSeriesRef.current
      if (!lineSeries) return

      const batch = queueRef.current.splice(0, 3)
      if (batch.length === 0) {
        // file vide → recharger depuis attacks pour boucler
        queueRef.current = [...attacks]
        return
      }

      const lines = batch.map(a => ({
        geometry: {
          type: 'LineString',
          coordinates: [
            [a.srcLng, a.srcLat],
            [PARIS.lng, PARIS.lat],
          ],
        },
        color: a.color,
        tooltipText: `${a.country} → ${a.target}\n${a.attackType}`,
      }))

      lineSeries.data.setAll(lines)
    }

    drainQueue()
    timerRef.current = setInterval(drainQueue, 2000)

    return () => clearInterval(timerRef.current)
  }, [attacks])

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapHeader}>
        <span className={styles.mapTitle}>Carte des menaces en temps réel</span>
      </div>
      <div className={styles.chartWrapper}>
        <div ref={chartDivRef} className={styles.chart} />
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          EN DIRECT · {attacks?.length ?? 0} arcs actifs
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#E1000F' }} />DDoS
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#ff6600' }} />Bruteforce
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#9933ff' }} />Scan
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#ffcc00' }} />Intrusion
          </div>
        </div>
      </div>
    </div>
  )
}
