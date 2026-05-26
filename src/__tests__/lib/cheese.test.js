// src/__tests__/lib/cheese.test.js
const { getCheeseLevel } = require('@/lib/cheese')

test('0 attacks → camembert, 0%', () => {
  const r = getCheeseLevel(0)
  expect(r.label).toBe('Camembert')
  expect(r.pct).toBe(0)
})

test('500 attacks → emmental (25%)', () => {
  const r = getCheeseLevel(500)
  expect(r.pct).toBe(25)
  expect(r.label).toBe('Emmental')
})

test('1000 attacks → gruyère (50%)', () => {
  const r = getCheeseLevel(1000)
  expect(r.pct).toBe(50)
  expect(r.label).toBe('Gruyère')
})

test('2000+ attacks → plafonné à 99%', () => {
  const r = getCheeseLevel(9999)
  expect(r.pct).toBe(99)
})

test('1500 attacks → mimolette', () => {
  const r = getCheeseLevel(1500)
  expect(r.label).toBe('Mimolette')
})
