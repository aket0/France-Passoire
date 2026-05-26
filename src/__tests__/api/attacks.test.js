// src/__tests__/api/attacks.test.js
const { GET } = require('@/app/api/attacks/route')

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

test('returns 500 if ABUSEIPDB_API_KEY absent', async () => {
  delete process.env.ABUSEIPDB_API_KEY
  const { GET: freshGET } = require('@/app/api/attacks/route')
  const res = await freshGET()
  expect(res.status).toBe(500)
  const body = await res.json()
  expect(body.error).toMatch(/API key/)
})

test('returns array JSON if fetch succeeds', async () => {
  process.env.ABUSEIPDB_API_KEY = 'test-key'
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ ipAddress: '1.2.3.4' }, { ipAddress: '5.6.7.8' }],
      }),
    })
    .mockResolvedValueOnce({
      json: async () => [
        { status: 'success', query: '1.2.3.4', lat: 55.7, lon: 37.6, country: 'Russie', countryCode: 'RU' },
        { status: 'success', query: '5.6.7.8', lat: 39.9, lon: 116.4, country: 'Chine', countryCode: 'CN' },
      ],
    })

  const { GET: freshGET } = require('@/app/api/attacks/route')
  const res = await freshGET()
  const body = await res.json()
  expect(Array.isArray(body)).toBe(true)
  expect(body[0]).toHaveProperty('ip')
  expect(body[0]).toHaveProperty('target')
  expect(body[0]).toHaveProperty('attackType')
  expect(body[0]).toHaveProperty('color')
})
