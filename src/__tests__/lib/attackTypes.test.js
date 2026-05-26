// src/__tests__/lib/attackTypes.test.js
const { getAttackTypeFromIp } = require('@/lib/attackTypes')
const ATTACK_COLORS = ['#E1000F', '#ff6600', '#9933ff', '#ffcc00']

test('returns an object with label and color', () => {
  const r = getAttackTypeFromIp('1.2.3.4')
  expect(r).toHaveProperty('label')
  expect(r).toHaveProperty('color')
})

test('color is one of the 4 defined colors', () => {
  const r = getAttackTypeFromIp('8.8.8.8')
  expect(ATTACK_COLORS).toContain(r.color)
})

test('same IP always returns same type', () => {
  expect(getAttackTypeFromIp('10.0.0.1')).toEqual(getAttackTypeFromIp('10.0.0.1'))
})
