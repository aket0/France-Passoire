// src/__tests__/lib/hashTarget.test.js
const { hashTarget } = require('@/lib/hashTarget')
const { INSTITUTIONS } = require('@/lib/institutions')

test('same IP always returns same institution', () => {
  expect(hashTarget('1.2.3.4')).toEqual(hashTarget('1.2.3.4'))
})

test('returns an institution from the list', () => {
  const result = hashTarget('192.168.1.1')
  expect(INSTITUTIONS).toContain(result)
})

test('returns an institution for any IP string', () => {
  const ips = ['8.8.8.8', '123.45.67.89', '255.255.255.255', '0.0.0.0']
  ips.forEach(ip => {
    const result = hashTarget(ip)
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('lat')
    expect(result).toHaveProperty('lng')
  })
})
