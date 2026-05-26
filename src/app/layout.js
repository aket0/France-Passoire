// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'France Passoire — Suivez en direct l\'état de la passoire',
  description: 'Site parodique de monitoring des cyber-attaques visant les institutions françaises.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
