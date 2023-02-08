import createFastify from 'fastify'

export const health = createFastify()

export async function start (): Promise<void> {
  await import ('../routes/index.js')

  await health.listen({
    host: '0.0.0.0',
    port: Number(process.env.HEALTH_PORT ?? 8000)
  })
}

export async function stop (): Promise<void> {
  await health.close()
}
