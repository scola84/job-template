import { type Queue, type Worker } from 'bullmq'
import micromatch from 'micromatch'

interface Message {
  data?: unknown
  host?: string
  name?: string
}

type Workers = Record<string, {
  queue: Queue
  start?: () => Promise<void>
  stop?: () => Promise<void>
  worker: Worker
} | undefined>

const queueNames = process.env.QUEUES?.split(':') ?? '!*'
const workers = await import('../workers/index.js') as Workers

export function handleMessage (channel: string, message: string): void {
  try {
    if (channel === 'queue') {
      const {
        data = null,
        host,
        name = ''
      } = JSON.parse(message) as Message

      if (micromatch.isMatch(name, queueNames) && (
        host === undefined ||
        host === process.env.HOSTNAME
      )) {
        workers[name]?.queue
          .add(name, data)
          .catch((error) => {
            console.error(error)
          })
      }
    }
  } catch (error) {
    console.error(error)
  }
}
